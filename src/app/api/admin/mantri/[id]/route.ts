import { NextRequest, NextResponse } from "next/server";
import { getFirestoreDb } from "@/lib/firebaseAdmin";
import { prisma } from "@/lib/prisma";
import { invalidateMemoryCache } from "@/lib/cacheUtils";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// PUT /api/admin/mantri/[id] - Update Mantri Data & Password
export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await req.json();

    const { name, personalNumber, pin, phoneNumber, unitName, branchOffice, role, assignedAreas } = body;

    const cleanAreas = Array.isArray(assignedAreas)
      ? assignedAreas
      : typeof assignedAreas === "string"
      ? assignedAreas.split(",").map((s) => s.trim()).filter(Boolean)
      : [];

    const updatedData: Record<string, unknown> = {
      updatedAt: new Date().toISOString(),
    };

    if (name) updatedData.name = String(name).trim();
    if (personalNumber) updatedData.personalNumber = String(personalNumber).trim();
    if (pin) updatedData.pin = String(pin).trim();
    if (phoneNumber !== undefined) updatedData.phoneNumber = String(phoneNumber).trim();
    if (unitName) updatedData.unitName = String(unitName).trim();
    if (branchOffice) updatedData.branchOffice = String(branchOffice).trim();
    if (role) updatedData.role = String(role).trim().toUpperCase();
    if (assignedAreas !== undefined) updatedData.assignedAreas = cleanAreas;

    // 1. Update di Firestore
    let firestoreSuccess = false;
    try {
      const firestore = getFirestoreDb();
      if (firestore) {
        const docRef = firestore.collection("mantri_users").doc(id);
        const docSnap = await docRef.get();
        if (docSnap.exists) {
          await docRef.set(updatedData, { merge: true });
          firestoreSuccess = true;
        }
      }
    } catch (fErr) {
      console.warn("Firestore update failed:", fErr);
    }

    // 2. Update di MySQL via Prisma
    let mysqlSuccess = false;
    try {
      const prismaUpdate: Record<string, unknown> = {};
      if (name) prismaUpdate.name = String(name).trim();
      if (personalNumber) prismaUpdate.personalNumber = String(personalNumber).trim();
      if (pin) prismaUpdate.pin = String(pin).trim();
      if (unitName) prismaUpdate.unitName = String(unitName).trim();
      if (branchOffice) prismaUpdate.branchOffice = String(branchOffice).trim();
      if (role) prismaUpdate.role = String(role).trim().toUpperCase();
      if (assignedAreas !== undefined) prismaUpdate.assignedAreas = JSON.stringify(cleanAreas);

      await prisma.mantri.update({
        where: { id },
        data: prismaUpdate,
      });
      mysqlSuccess = true;
    } catch (dbErr) {
      console.warn("MySQL update failed:", dbErr);
    }

    invalidateMemoryCache("admin_mantri_list");
    if (firestoreSuccess || mysqlSuccess) {
      return NextResponse.json({
        success: true,
        message: "Data petugas Mantri berhasil diperbarui.",
        id,
        updated: updatedData,
      });
    }

    return NextResponse.json(
      { success: false, error: "Petugas Mantri tidak ditemukan untuk diperbarui." },
      { status: 404 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Gagal memperbarui Mantri";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

// DELETE /api/admin/mantri/[id] - Hapus Petugas Mantri
export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    let deleted = false;

    // 1. Delete di Firestore
    try {
      const firestore = getFirestoreDb();
      if (firestore) {
        await firestore.collection("mantri_users").doc(id).delete();
        deleted = true;
      }
    } catch (fErr) {
      console.warn("Firestore delete failed:", fErr);
    }

    // 2. Delete di MySQL
    try {
      await prisma.mantri.delete({
        where: { id },
      });
      deleted = true;
    } catch (dbErr) {
      console.warn("MySQL delete failed:", dbErr);
    }

    invalidateMemoryCache("admin_mantri_list");
    if (deleted) {
      return NextResponse.json({
        success: true,
        message: "Petugas Mantri berhasil dihapus dari sistem.",
      });
    }

    return NextResponse.json(
      { success: false, error: "Gagal menghapus petugas Mantri." },
      { status: 400 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Terjadi kesalahan";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}