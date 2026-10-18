import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getFirestoreDb } from "@/lib/firebaseAdmin";
import { MarketIntelligence } from "@/types/business";
import {
  normalizeLead,
  DEFAULT_MARKET_INTELLIGENCE,
  DEFAULT_FINANCIAL_METRICS,
  RawLeadInput,
} from "@/lib/leadUtils";

// GET /api/leads - Ambil semua prospek dari Cloud Firestore (dengan fallback ke MySQL)
export async function GET() {
  try {
    const firestore = getFirestoreDb();
    if (firestore) {
      const snap = await firestore.collection("leads").orderBy("submittedAt", "desc").get();
      const list: unknown[] = [];
      snap.forEach((doc) => {
        list.push(normalizeLead(doc.data() as RawLeadInput));
      });
      return NextResponse.json({
        success: true,
        source: "firebase_firestore",
        count: list.length,
        data: list,
      });
    }
  } catch (fErr) {
    console.warn("Firestore leads query failed, trying MySQL:", fErr);
  }

  try {
    const leads = await prisma.lead.findMany({
      orderBy: { submittedAt: "desc" },
    });

    const formatted = leads.map((item) => normalizeLead(item as unknown as RawLeadInput));

    return NextResponse.json({
      success: true,
      source: "database",
      count: formatted.length,
      data: formatted,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Database connection unavailable";
    console.warn("MySQL Database connection unavailable, returning empty list:", message);
    return NextResponse.json(
      { success: true, source: "offline", count: 0, data: [] },
      { status: 200 }
    );
  }
}

// POST /api/leads - Simpan prospek baru & auto-mapping ke Mantri pemegang wilayah
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const rawIntel = (body.marketIntelligence || {}) as Record<string, Record<string, unknown>>;
    const fullIntel: MarketIntelligence = {
      socialMediaTrend: {
        ...DEFAULT_MARKET_INTELLIGENCE.socialMediaTrend,
        ...(rawIntel.socialMediaTrend || {}),
      },
      googlePlaces: {
        ...DEFAULT_MARKET_INTELLIGENCE.googlePlaces,
        ...(rawIntel.googlePlaces || {}),
      },
      localNews: {
        ...DEFAULT_MARKET_INTELLIGENCE.localNews,
        ...(rawIntel.localNews || {}),
      },
      googleTrends: {
        ...DEFAULT_MARKET_INTELLIGENCE.googleTrends,
        ...(rawIntel.googleTrends || {}),
      },
      bpsStats: {
        ...DEFAULT_MARKET_INTELLIGENCE.bpsStats,
        ...(rawIntel.bpsStats || {}),
      },
    };

    const fullMetrics = {
      ...DEFAULT_FINANCIAL_METRICS,
      ...(body.financialMetrics || {}),
    };

    const targetLoc = (body.specificLocation || body.city || "").toLowerCase().trim();
    const targetCity = (body.city || "").toLowerCase().trim();

    // 1. Coba simpan ke Firebase Cloud Firestore
    const firestore = getFirestoreDb();
    if (firestore) {
      try {
        // Auto-assign ke Mantri yang bertugas di wilayah ini
        let assignedMantriId = "";
        let assignedMantriName = "";
        let assignedBranch = "";
        let assignedUnit = "";

        const mantriSnap = await firestore.collection("mantri_users").get();
        if (!mantriSnap.empty) {
          for (const mDoc of mantriSnap.docs) {
            const m = mDoc.data();
            const areas: string[] = Array.isArray(m.assignedAreas) ? m.assignedAreas : [];
            const branch: string = (m.branchOffice || "").toLowerCase();
            const unit: string = (m.unitName || "").toLowerCase();

            const areaMatch = areas.some((a) => {
              const lowerA = a.toLowerCase();
              return targetLoc.includes(lowerA) || lowerA.includes(targetLoc);
            });
            const branchOrUnitMatch =
              (targetCity && branch.includes(targetCity)) ||
              (targetLoc && unit.includes(targetLoc));

            if (areaMatch || branchOrUnitMatch) {
              assignedMantriId = mDoc.id;
              assignedMantriName = m.name || "";
              assignedBranch = m.branchOffice || "";
              assignedUnit = m.unitName || "";
              break;
            }
          }
        }

        const snap = await firestore.collection("leads").get();
        const firestoreId = "UQ-2026-" + String(snap.size + 1).padStart(3, "0");

        const newLeadRecord = {
          id: firestoreId,
          applicantName: body.applicantName,
          applicantPhone: body.applicantPhone,
          preferredContactTime: body.preferredContactTime || "Pagi",
          city: body.city || "Malang",
          specificLocation: body.specificLocation || body.city || "Pusat Kota",
          locationEnvironment: body.locationEnvironment || "Area Komersial",
          businessTitle: body.businessTitle,
          businessCategory: body.businessCategory || "kuliner",
          availableCapital: Number(body.availableCapital || 0),
          estimatedTotalCapital: Number(body.estimatedTotalCapital || 0),
          capitalDeficit: Number(body.capitalDeficit || 0),
          matchScore: Number(body.matchScore || 85),
          marketIntelligence: fullIntel,
          financialMetrics: fullMetrics,
          status: "BARU_MASUK",
          assignedMantriId: assignedMantriId || undefined,
          assignedMantriName: assignedMantriName || undefined,
          assignedBranch: assignedBranch || undefined,
          assignedUnit: assignedUnit || undefined,
          surveyNotes: body.surveyNotes || "Pengajuan mandiri dari platform UsahaQita",
          submittedAt: new Date().toISOString(),
          lastUpdated: new Date().toISOString(),
        };

        await firestore.collection("leads").doc(firestoreId).set(newLeadRecord);
        return NextResponse.json({
          success: true,
          source: "firebase_firestore",
          data: newLeadRecord,
        });
      } catch (fErr) {
        console.warn("Firestore lead insert failed, fallback to MySQL:", fErr);
      }
    }

    // 2. Fallback simpan ke MySQL via Prisma
    const count = await prisma.lead.count();
    const newId = "UQ-2026-" + String(count + 1).padStart(3, "0");

    const newLead = await prisma.lead.create({
      data: {
        id: newId,
        applicantName: body.applicantName,
        applicantPhone: body.applicantPhone,
        preferredContactTime: body.preferredContactTime || "Pagi",
        city: body.city || "Malang",
        specificLocation: body.specificLocation || "Pusat Kota",
        locationEnvironment: body.locationEnvironment || "Area Komersial",
        businessTitle: body.businessTitle,
        businessCategory: body.businessCategory || "kuliner",
        availableCapital: Number(body.availableCapital || 0),
        estimatedTotalCapital: Number(body.estimatedTotalCapital || 0),
        capitalDeficit: Number(body.capitalDeficit || 0),
        matchScore: Number(body.matchScore || 85),
        marketIntelligenceJson: JSON.stringify(fullIntel),
        financialMetricsJson: JSON.stringify(fullMetrics),
        status: "BARU_MASUK",
        surveyNotes: body.surveyNotes || "Pengajuan mandiri dari platform UsahaQita",
      },
    });

    return NextResponse.json({ success: true, data: normalizeLead(newLead as unknown as RawLeadInput) });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to save lead";
    console.error("Failed to insert lead into database:", error);
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}