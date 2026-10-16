import { BusinessCategory, ExperienceLevel } from "./user";
import { FinancialAssumptions } from "./finance";

export interface RoadmapStep {
  id: string;
  phase: number; // 1: Riset & Legalitas, 2: Persiapan, 3: Peluncuran, 4: Evaluasi
  phaseTitle: string;
  title: string;
  description: string;
  isCompleted?: boolean;
}

export interface MarketIntelligence {
  socialMediaTrend: {
    platform: string; // misal: "TikTok & Instagram Reels"
    trendScore: number; // 0 - 100
    summary: string;
    hashtag: string;
  };
  googlePlaces: {
    densityLevel: "Rendah" | "Sedang" | "Tinggi";
    competitorRadiusKm: number;
    footTrafficScore: "Tinggi" | "Sangat Tinggi" | "Menengah";
    summary: string;
  };
  localNews: {
    headline: string;
    source: string;
    summary: string;
  };
  googleTrends: {
    searchVolumeIndex: number; // 0 - 100
    growthRatePercentage: number; // misal: +54%
    momentum: "Melesat Naik" | "Stabil Tinggi" | "Tumbuh Konsisten";
    summary: string;
  };
  bpsStats: {
    metricName: string;
    metricValue: string;
    relevance: string;
  };
}

export interface BusinessOpportunity {
  id: string;
  title: string;
  slug: string;
  category: BusinessCategory;
  shortDescription: string;
  fullDescription: string;
  isSimulatedData: true; // Wajib bernilai true sebagai komitmen transparansi etika produk
  estimatedMinCapital: number;
  estimatedMaxCapital: number;
  minExperienceLevel: ExperienceLevel;
  difficultyLevel: "Mudah" | "Menengah" | "Cukup Menantang";
  suitabilityReason: string;
  keyRisks: string[];
  keySuccessFactors: string[];
  defaultAssumptions: FinancialAssumptions;
  roadmapTemplates: RoadmapStep[];
  tags: string[];
  marketIntelligence?: MarketIntelligence;
}

export interface OpportunityFilter {
  category?: BusinessCategory | "semua";
  maxCapital?: number;
  searchQuery?: string;
  experience?: ExperienceLevel;
}
