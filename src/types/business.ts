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
}

export interface OpportunityFilter {
  category?: BusinessCategory | "semua";
  maxCapital?: number;
  searchQuery?: string;
  experience?: ExperienceLevel;
}
