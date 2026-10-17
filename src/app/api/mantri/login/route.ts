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

    // Cari Mantri di database MySQL
    const mantri = await prisma.mantri.findUnique({
      where: { personalNumber: cleanPN },
    });

    if (!mantri || mantri.pin !== cleanPin) {
      return NextResponse.json(
        { success: false, error: "Nomor Personal Mantri atau PIN salah" },
        { status: 401 }
      );
    }

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
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal Server Error";
    console.error("Mantri login database error:", error);
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}