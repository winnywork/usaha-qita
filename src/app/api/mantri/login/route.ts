import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getFirestoreDb } from "@/lib/firebaseAdmin";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { personalNumber, pin } = body;

    if (!personalNumber || !pin) {
      return NextResponse.json(
        { success: false, error: "Nomor personal dan PIN wajib diisi" },
        { status: 400 }
      );
    }

    const cleanPN = String(personalNumber).trim().toUpperCase();
    const cleanPin = String(pin).trim();

    // 1. Coba Autentikasi via Firebase Cloud Firestore
    try {
      const firestore = getFirestoreDb();
      if (firestore) {
        const snap = await firestore
          .collection("mantri_users")
          .where("personalNumber", "==", cleanPN)
          .limit(1)
          .get();

        if (!snap.empty) {
          const doc = snap.docs[0];
          const mData = doc.data();

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
                unitName: mData.unitName || "",
                branchOffice: mData.branchOffice || "",
                role: mData.role || "MANTRI",
                assignedAreas,
              },
            });
          }
        }
      }
    } catch (fErr) {
      console.warn("Firestore Mantri login check failed, trying MySQL:", fErr);
    }

    // 2. Coba Autentikasi via MySQL (Prisma)
    try {
      const mantri = await prisma.mantri.findUnique({
        where: { personalNumber: cleanPN },
      });

      if (mantri && mantri.pin === cleanPin) {
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
      }
    } catch (dbErr) {
      console.warn("MySQL Mantri check failed:", dbErr);
    }

    return NextResponse.json(
      { success: false, error: "Nomor Personal Mantri atau PIN salah" },
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