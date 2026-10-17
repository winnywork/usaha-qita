import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getFirestoreDb } from "@/lib/firebaseAdmin";
import { MarketIntelligence } from "@/types/business";

const DEFAULT_MARKET_INTELLIGENCE: MarketIntelligence = {
  socialMediaTrend: {
    platform: "TikTok & Instagram Reels",
    trendScore: 85,
    summary: "Minat tinggi di kalangan audiens dan konsumen lokal.",
    hashtag: "#usahaqita",
  },
  googlePlaces: {
    densityLevel: "Sedang",
    competitorRadiusKm: 1.5,
    footTrafficScore: "Tinggi",
    summary: "Kawasan strategis dengan tingkat lalu lintas calon konsumen memadai.",
  },
  localNews: {
    headline: "Pengembangan Sentra Usaha Mandiri Terus Bertumbuh",
    source: "Ekonomi Mikro Jawa Timur",
    summary: "Dukungan pembiayaan mikro dan pendampingan usaha memacu pertumbuhan unit usaha.",
  },
  googleTrends: {
    searchVolumeIndex: 82,
    growthRatePercentage: 20,
    momentum: "Tumbuh Konsisten",
    summary: "Tren pencarian kategori usaha stabil dan positif.",
  },
  bpsStats: {
    metricName: "Indeks Daya Beli Konsumen",
    metricValue: "Menengah ke Atas",
    relevance: "Potensi belanja konsumen stabil pada kategori kebutuhan harian.",
  },
};

const DEFAULT_FINANCIAL_METRICS = {
  dailyVolume: 35,
  sellingPrice: 15000,
  monthlyNetProfit: 4500000,
  bepUnitsPerDay: 14,
  bepRupiahPerMonth: 6300000,
  paybackMonths: 2.5,
};

interface RawLeadInput {
  submittedAt?: Date | string;
  lastUpdated?: Date | string;
  marketIntelligenceJson?: string | Record<string, unknown>;
  financialMetricsJson?: string | Record<string, unknown>;
  creditAssessmentJson?: string | Record<string, unknown> | null;
  [key: string]: unknown;
}

function normalizeLead(l: RawLeadInput) {
  let rawIntel: Record<string, unknown> = {};
  try {
    rawIntel = typeof l.marketIntelligenceJson === "string" 
      ? JSON.parse(l.marketIntelligenceJson) 
      : (l.marketIntelligenceJson as Record<string, unknown>) || {};
  } catch {
    rawIntel = {};
  }

  let rawMetrics: Record<string, unknown> = {};
  try {
    rawMetrics = typeof l.financialMetricsJson === "string" 
      ? JSON.parse(l.financialMetricsJson) 
      : (l.financialMetricsJson as Record<string, unknown>) || {};
  } catch {
    rawMetrics = {};
  }

  let creditAssessment: unknown = undefined;
  if (l.creditAssessmentJson) {
    try {
      creditAssessment = typeof l.creditAssessmentJson === "string" 
        ? JSON.parse(l.creditAssessmentJson) 
        : l.creditAssessmentJson;
    } catch {
      creditAssessment = undefined;
    }
  }

  const intelSub = (rawIntel || {}) as Record<string, Record<string, unknown>>;

  const marketIntelligence: MarketIntelligence = {
    socialMediaTrend: {
      ...DEFAULT_MARKET_INTELLIGENCE.socialMediaTrend,
      ...(intelSub.socialMediaTrend || {}),
    },
    googlePlaces: {
      ...DEFAULT_MARKET_INTELLIGENCE.googlePlaces,
      ...(intelSub.googlePlaces || {}),
    },
    localNews: {
      ...DEFAULT_MARKET_INTELLIGENCE.localNews,
      ...(intelSub.localNews || {}),
    },
    googleTrends: {
      ...DEFAULT_MARKET_INTELLIGENCE.googleTrends,
      ...(intelSub.googleTrends || {}),
    },
    bpsStats: {
      ...DEFAULT_MARKET_INTELLIGENCE.bpsStats,
      ...(intelSub.bpsStats || {}),
    },
  };

  const financialMetrics = {
    ...DEFAULT_FINANCIAL_METRICS,
    ...(rawMetrics || {}),
  };

  return {
    ...l,
    submittedAt: l.submittedAt instanceof Date ? l.submittedAt.toISOString() : l.submittedAt,
    lastUpdated: l.lastUpdated instanceof Date ? l.lastUpdated.toISOString() : l.lastUpdated,
    marketIntelligence,
    financialMetrics,
    creditAssessment,
  };
}

// GET /api/leads - Ambil semua prospek dari MySQL (fallback graceful jika DB belum online)
export async function GET() {
  try {
    const firestore = getFirestoreDb();
    if (firestore) {
      const snap = await firestore.collection("leads").orderBy("submittedAt", "desc").get();
      if (!snap.empty) {
        const list: unknown[] = [];
        snap.forEach((doc) => { list.push(normalizeLead(doc.data() as RawLeadInput)); });
        return NextResponse.json({ success: true, source: "firebase_firestore", data: list });
      }
    }
  } catch (fErr) {
    console.warn("Firestore leads query failed, trying MySQL:", fErr);
  }
  try {
    const leads = await prisma.lead.findMany({
      orderBy: { submittedAt: "desc" },
    });

    const formatted = leads.map((item) => normalizeLead(item as unknown as RawLeadInput));

    return NextResponse.json({ success: true, source: "database", data: formatted });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Database connection unavailable";
    console.warn("MySQL Database connection unavailable, falling back to local dataset:", message);
    return NextResponse.json(
      { success: false, source: "offline", error: "Database offline or not yet configured", data: [] },
      { status: 200 }
    );
  }
}

// POST /api/leads - Simpan prospek baru ke database (Firestore -> MySQL)
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

    // 1. Coba simpan ke Firebase Cloud Firestore
    const firestore = getFirestoreDb();
    if (firestore) {
      try {
        const snap = await firestore.collection("leads").get();
        const firestoreId = "UQ-2026-" + String(snap.size + 1).padStart(3, "0");
        const newLeadRecord = {
          id: firestoreId,
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
          marketIntelligence: fullIntel,
          financialMetrics: fullMetrics,
          status: "BARU_MASUK",
          surveyNotes: body.surveyNotes || "Pengajuan mandiri dari platform UsahaQita",
          submittedAt: new Date().toISOString(),
          lastUpdated: new Date().toISOString(),
        };
        await firestore.collection("leads").doc(firestoreId).set(newLeadRecord);
        return NextResponse.json({ success: true, source: "firebase_firestore", data: newLeadRecord });
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
    console.error("Failed to insert lead into MySQL:", error);
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
