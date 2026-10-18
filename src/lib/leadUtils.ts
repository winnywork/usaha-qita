import { MarketIntelligence } from "@/types/business";

export const DEFAULT_MARKET_INTELLIGENCE: MarketIntelligence = {
  socialMediaTrend: {
    platform: "TikTok & Instagram",
    trendScore: 82,
    summary: "Konten video ulasan kuliner dan rekomendasi produk lokal bertumbuh pesat.",
    hashtag: "#UsahaMandiri #PeluangUsaha",
  },
  googlePlaces: {
    densityLevel: "Sedang",
    competitorRadiusKm: 1.5,
    footTrafficScore: "Tinggi",
    summary: "Aktivitas komersial ramai pada jam makan siang dan sore hari.",
  },
  localNews: {
    headline: "Pemerintah Tingkatkan Akses Permodalan & Pelatihan UMKM Daerah",
    source: "Kabar Ekonomi Daerah",
    summary: "Dukungan regulasi dan kemudahan izin usaha mikro membuka peluang ekspansi cepat.",
  },
  googleTrends: {
    searchVolumeIndex: 78,
    growthRatePercentage: 15,
    momentum: "Tumbuh Konsisten",
    summary: "Pencarian ide usaha mikro modal terjangkau konsisten naik dalam 12 bulan terakhir.",
  },
  bpsStats: {
    metricName: "Kepadatan Penduduk & Usia Produktif",
    metricValue: "45.000 jiwa / Menengah ke Atas",
    relevance: "Potensi belanja konsumen stabil pada kategori kebutuhan harian.",
  },
};

export const DEFAULT_FINANCIAL_METRICS = {
  dailyVolume: 35,
  sellingPrice: 15000,
  monthlyNetProfit: 4500000,
  bepUnitsPerDay: 14,
  bepRupiahPerMonth: 6300000,
  paybackMonths: 2.5,
};

export interface RawLeadInput {
  submittedAt?: Date | string;
  lastUpdated?: Date | string;
  marketIntelligenceJson?: string | Record<string, unknown>;
  financialMetricsJson?: string | Record<string, unknown>;
  creditAssessmentJson?: string | Record<string, unknown> | null;
  [key: string]: unknown;
}

export function normalizeLead(l: RawLeadInput) {
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
  } else if (l.creditAssessment) {
    creditAssessment = l.creditAssessment;
  }

  const intelSub = (l.marketIntelligence || rawIntel || {}) as Record<string, Record<string, unknown>>;

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
    ...((l.financialMetrics as Record<string, unknown>) || rawMetrics || {}),
  };

  return {
    ...l,
    submittedAt: l.submittedAt instanceof Date ? l.submittedAt.toISOString() : (l.submittedAt || new Date().toISOString()),
    lastUpdated: l.lastUpdated instanceof Date ? l.lastUpdated.toISOString() : (l.lastUpdated || new Date().toISOString()),
    marketIntelligence,
    financialMetrics,
    creditAssessment,
  };
}