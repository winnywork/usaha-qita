import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getFirestoreDb } from "@/lib/firebaseAdmin";
import { normalizeLead, RawLeadInput } from "@/lib/leadUtils";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/leads/[id] - Ambil detail dossier prospek
export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const cleanId = id.trim();

    // 1. Coba ambil dari Cloud Firestore
    try {
      const firestore = getFirestoreDb();
      if (firestore) {
        const docRef = firestore.collection("leads").doc(cleanId);
        const docSnap = await docRef.get();
        if (docSnap.exists) {
          const normalized = normalizeLead(docSnap.data() as RawLeadInput);
          return NextResponse.json({
            success: true,
            source: "firebase_firestore",
            data: normalized,
          });
        }
      }
    } catch (fErr) {
      console.warn("Firestore lead by ID failed, trying MySQL:", fErr);
    }

    // 2. Fallback ke MySQL
    try {
      const lead = await prisma.lead.findUnique({
        where: { id: cleanId },
      });
      if (lead) {
        const normalized = normalizeLead(lead as unknown as RawLeadInput);
        return NextResponse.json({
          success: true,
          source: "database",
          data: normalized,
        });
      }
    } catch (dbErr) {
      console.warn("MySQL lead by ID failed:", dbErr);
    }

    return NextResponse.json(
      { success: false, error: "Dossier prospek tidak ditemukan." },
      { status: 404 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Terjadi kesalahan internal";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

// PATCH /api/leads/[id] - Update status pipeline, catatan survei lapangan, dan asesmen KUR
export async function PATCH(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const cleanId = id.trim();
    const body = await req.json();

    const nowIso = new Date().toISOString();
    const updatePayload: Record<string, unknown> = {
      lastUpdated: nowIso,
    };

    if (body.status !== undefined) updatePayload.status = body.status;
    if (body.surveyNotes !== undefined) updatePayload.surveyNotes = body.surveyNotes;
    if (body.creditAssessment !== undefined) updatePayload.creditAssessment = body.creditAssessment;
    if (body.assignedMantriId !== undefined) updatePayload.assignedMantriId = body.assignedMantriId;
    if (body.assignedMantriName !== undefined) updatePayload.assignedMantriName = body.assignedMantriName;

    let firestoreSuccess = false;
    let updatedData: Record<string, unknown> | null = null;

    // 1. Update di Firebase Cloud Firestore
    try {
      const firestore = getFirestoreDb();
      if (firestore) {
        const docRef = firestore.collection("leads").doc(cleanId);
        const docSnap = await docRef.get();
        if (docSnap.exists) {
          await docRef.set(updatePayload, { merge: true });
          const freshSnap = await docRef.get();
          updatedData = normalizeLead(freshSnap.data() as RawLeadInput);
          firestoreSuccess = true;
        }
      }
    } catch (fErr) {
      console.warn("Firestore lead update failed, trying MySQL:", fErr);
    }

    // 2. Update di MySQL via Prisma
    let mysqlSuccess = false;
    try {
      const dataToUpdate: Record<string, unknown> = {};
      if (body.status !== undefined) dataToUpdate.status = body.status;
      if (body.surveyNotes !== undefined) dataToUpdate.surveyNotes = body.surveyNotes;
      if (body.creditAssessment !== undefined) {
        dataToUpdate.creditAssessmentJson = JSON.stringify(body.creditAssessment);
      }
      dataToUpdate.lastUpdated = new Date();

      const updated = await prisma.lead.update({
        where: { id: cleanId },
        data: dataToUpdate,
      });

      if (!updatedData) {
        updatedData = normalizeLead(updated as unknown as RawLeadInput);
      }
      mysqlSuccess = true;
    } catch (dbErr) {
      console.warn("MySQL lead update failed:", dbErr);
    }

    if (firestoreSuccess || mysqlSuccess) {
      return NextResponse.json({
        success: true,
        source: firestoreSuccess ? "firebase_firestore" : "database",
        data: updatedData,
      });
    }

    return NextResponse.json(
      { success: false, error: "Gagal memperbarui status prospek nasabah." },
      { status: 404 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to update lead";
    console.error("Failed to update lead in database:", error);
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}