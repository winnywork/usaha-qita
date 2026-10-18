import { NextRequest, NextResponse } from "next/server";
import { getFirestoreDb } from "@/lib/firebaseAdmin";
import { prisma } from "@/lib/prisma";

export interface MantriUserDto {
  id: string;
  name: string;
  personalNumber: string;
  pin: string;
  phoneNumber?: string;
  unitName: string;
  branchOffice: string;
  role: string;
  assignedAreas: string[];
  createdAt?: string;
  updatedAt?: string;
}

// GET /api/admin/mantri - List all Mantri users
export async function GET() {
  // 1. Coba ambil dari Firestore
  try {
    const firestore = getFirestoreDb();
    if (firestore) {
      const snap = await firestore.collection("mantri_users").get();
      if (!snap.empty) {
        const list: MantriUserDto[] = [];
        snap.forEach((doc) => {
          const data = doc.data();
          list.push({
            id: doc.id,
            name: data.name || "",
            personalNumber: data.personalNumber || "",
            pin: data.pin || "",
            phoneNumber: data.phoneNumber || "",
            unitName: data.unitName || "",
            branchOffice: data.branchOffice || "",
            role: data.role || "MANTRI",
            assignedAreas: Array.isArray(data.assignedAreas)
              ? data.assignedAreas
              : typeof data.assignedAreas === "string"
              ? JSON.parse(data.assignedAreas || "[]")
              : [],
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
          });
        });

        // Urutkan berdasarkan Nama
        list.sort((a, b) => a.name.localeCompare(b.name));

        return NextResponse.json({
          success: true,
          source: "firebase_firestore",
          count: list.length,
          users: list,
          data: list,
        });
      }
    }
  } catch (fErr) {
    console.warn("Firestore Mantri fetch failed, trying MySQL:", fErr);
  }

  // 2. Coba ambil dari MySQL via Prisma
  try {
    const rows = await prisma.mantri.findMany({
      orderBy: { name: "asc" },
    });

    const list: MantriUserDto[] = rows.map((r) => {
      let areas: string[] = [];
      try {
        areas = JSON.parse(r.assignedAreas);
      } catch {
        areas = [];
      }

      return {
        id: r.id,
        name: r.name,
        personalNumber: r.personalNumber,
        pin: r.pin,
        phoneNumber: "",
        unitName: r.unitName,
        branchOffice: r.branchOffice,
        role: r.role,
        assignedAreas: areas,
        createdAt: r.createdAt.toISOString(),
        updatedAt: r.updatedAt.toISOString(),
      };
    });

    return NextResponse.json({
      success: true,
      source: "database",
      count: list.length,
      users: list,
      data: list,
    });
  } catch (dbErr) {
    console.warn("MySQL Mantri fetch failed:", dbErr);
  }

  // 3. Jika basis data belum terisi, kembalikan daftar kosong
  return NextResponse.json({
    success: true,
    source: "database",
    count: 0,
    users: [],
    data: [],
  });
}

// POST /api/admin/mantri - Tambah Mantri baru
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, personalNumber, pin, phoneNumber, unitName, branchOffice, role, assignedAreas } = body;

    if (!name || !personalNumber || !pin || !unitName || !branchOffice) {
      return NextResponse.json(
        { success: false, error: "Mohon lengkapi Nama, PN/NIP, PIN/Password, Unit Kerja, dan Kantor Cabang." },
        { status: 400 }
      );
    }

    const cleanPN = String(personalNumber).trim();
    const newId = `mantri-${cleanPN.replace(/[^a-zA-Z0-9]/g, "").toLowerCase() || Date.now()}`;
    const cleanAreas = Array.isArray(assignedAreas)
      ? assignedAreas
      : typeof assignedAreas === "string"
      ? assignedAreas.split(",").map((s) => s.trim()).filter(Boolean)
      : [];

    const newMantri: MantriUserDto = {
      id: newId,
      name: String(name).trim(),
      personalNumber: cleanPN,
      pin: String(pin).trim(),
      phoneNumber: String(phoneNumber || "").trim(),
      unitName: String(unitName).trim(),
      branchOffice: String(branchOffice).trim(),
      role: role ? String(role).trim().toUpperCase() : "MANTRI",
      assignedAreas: cleanAreas,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // 1. Simpan ke Firestore
    try {
      const firestore = getFirestoreDb();
      if (firestore) {
        await firestore.collection("mantri_users").doc(newId).set(newMantri);
        return NextResponse.json({
          success: true,
          source: "firebase_firestore",
          user: newMantri,
          data: newMantri,
        });
      }
    } catch (fErr) {
      console.warn("Firestore save failed, trying MySQL:", fErr);
    }

    // 2. Simpan ke MySQL via Prisma
    try {
      const created = await prisma.mantri.create({
        data: {
          id: newId,
          name: newMantri.name,
          personalNumber: newMantri.personalNumber,
          pin: newMantri.pin,
          unitName: newMantri.unitName,
          branchOffice: newMantri.branchOffice,
          role: newMantri.role,
          assignedAreas: JSON.stringify(newMantri.assignedAreas),
        },
      });

      return NextResponse.json({
        success: true,
        source: "database",
        user: {
          ...newMantri,
          id: created.id,
        },
        data: {
          ...newMantri,
          id: created.id,
        },
      });
    } catch (dbErr: unknown) {
      const msg = dbErr instanceof Error ? dbErr.message : "Gagal menyimpan ke database";
      return NextResponse.json({ success: false, error: msg }, { status: 500 });
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Terjadi kesalahan internal";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}