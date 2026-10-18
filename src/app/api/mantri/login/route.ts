import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getFirestoreDb } from "@/lib/firebaseAdmin";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { personalNumber, pin } = body;

    if (!personalNumber || !pin) {
      return NextResponse.json(
        { success: false, error: "Nomor personal (NIP) dan PIN wajib diisi" },
        { status: 400 }
      );
    }

    const rawInput = String(personalNumber).trim();
    const cleanPN = rawInput.toUpperCase();
    const cleanPin = String(pin).trim();

    // Normalisasi variasi input (misal: "00263626", "263626", "BRI-00263626", "BRI-882042", "882042")
    const strippedPN = cleanPN.replace(/^BRI-?/i, "").trim();
    const numericOnly = rawInput.replace(/[^0-9]/g, "");
    const paddedPN = numericOnly ? numericOnly.padStart(8, "0") : "";
    const prefixedPN = `BRI-${strippedPN}`;

    const candidates = Array.from(
      new Set([cleanPN, strippedPN, numericOnly, paddedPN, prefixedPN, rawInput.toLowerCase()].filter(Boolean))
    );

    // 1. Coba Autentikasi via Firebase Cloud Firestore
    try {
      const firestore = getFirestoreDb();
      if (firestore) {
        const snap = await firestore.collection("mantri_users").get();

        for (const doc of snap.docs) {
          const mData = doc.data();
          const docPN = (mData.personalNumber || "").toUpperCase();
          const docId = doc.id.toLowerCase();

          const matches =
            candidates.includes(docPN) ||
            candidates.includes(docId) ||
            (docPN === "00263626" && cleanPN === "BRI-882041"); // Kompatibilitas NIP awal

          if (matches) {
            if (mData.pin === cleanPin) {
              let assignedAreas: string[] = [];
              if (Array.isArray(mData.assignedAreas)) {
                assignedAreas = mData.assignedAreas;
              } else if (typeof mData.assignedAreas === "string") {
                try {
                  assignedAreas = JSON.parse(mData.assignedAreas);
                } catch {
                  assignedAreas = [mData.unitName || "Unit Kerja"];
                }
              }

              return NextResponse.json({
                success: true,
                source: "firebase_firestore",
                mantri: {
                  id: doc.id,
                  name: mData.name || "",
                  personalNumber: mData.personalNumber || cleanPN,
                  phoneNumber: mData.phoneNumber || "",
                  unitName: mData.unitName || "",
                  branchOffice: mData.branchOffice || "",
                  role: mData.role || "MANTRI",
                  assignedAreas,
                },
              });
            } else {
              return NextResponse.json(
                { success: false, error: "PIN / Sandi Mantri yang Anda masukkan salah." },
                { status: 401 }
              );
            }
          }
        }
      }
    } catch (fErr) {
      console.warn("Firestore Mantri login check failed, trying MySQL:", fErr);
    }

    // 2. Coba Autentikasi via MySQL (Prisma)
    try {
      const mantriList = await prisma.mantri.findMany();
      for (const mantri of mantriList) {
        const dbPN = (mantri.personalNumber || "").toUpperCase();
        if (candidates.includes(dbPN) || candidates.includes(mantri.id.toLowerCase())) {
          if (mantri.pin === cleanPin) {
            let assignedAreas: string[] = [];
            try {
              assignedAreas = JSON.parse(mantri.assignedAreas);
            } catch {
              assignedAreas = [mantri.unitName];
            }

            return NextResponse.json({
              success: true,
              source: "database",
              mantri: {
                id: mantri.id,
                name: mantri.name,
                personalNumber: mantri.personalNumber,
                unitName: mantri.unitName,
                branchOffice: mantri.branchOffice,
                role: mantri.role,
                assignedAreas,
              },
            });
          } else {
            return NextResponse.json(
              { success: false, error: "PIN / Sandi Mantri yang Anda masukkan salah." },
              { status: 401 }
            );
          }
        }
      }
    } catch (dbErr) {
      console.warn("MySQL Mantri check failed:", dbErr);
    }

    return NextResponse.json(
      { success: false, error: "Nomor Personal Mantri (NIP) tidak terdaftar di sistem." },
      { status: 401 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal Server Error";
    console.error("Mantri login database error:", error);
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
