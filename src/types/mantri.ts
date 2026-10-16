import { MarketIntelligence } from "@/types/business";

export type PipelineStatus =
  | "BARU_MASUK"
  | "KONTAK_PERTAMA"
  | "SURVEI_LAPANGAN"
  | "REKOMENDASI_KUR"
  | "BINA_MANDIRI";

export interface MantriUser {
  id: string;
  name: string;
  personalNumber: string; // e.g. "BRI-882041"
  unitName: string; // e.g. "BRI Unit Dinoyo - KC Malang Soekarno Hatta"
  branchOffice: string; // e.g. "KC Malang Soekarno Hatta"
  role: "MANTRI" | "SUPERVISOR";
  assignedAreas: string[];
}

export interface CreditSimulation {
  requestedLoanAmount: number;
  recommendedLoanAmount: number;
  interestRatePerYear: number; // e.g. 6 (%)
  tenorMonths: 12 | 24 | 36;
  monthlyInstallment: number;
  estimatedMonthlyProfit: number;
  dscrRatio: number; // monthlyNetProfit / monthlyInstallment
  eligibilityGrade: "SANGAT_LAYAK" | "LAYAK" | "BERISIKO";
}

export interface ConsultationLead {
  id: string; // format: "UQ-2026-001"
  submittedAt: string;
  applicantName: string;
  applicantPhone: string;
  preferredContactTime: string;
  city: string;
  specificLocation: string;
  locationEnvironment: string;
  businessTitle: string;
  businessCategory: string;
  availableCapital: number;
  estimatedTotalCapital: number;
  capitalDeficit: number;
  matchScore: number;
  marketIntelligence: MarketIntelligence;
  financialMetrics: {
    dailyVolume: number;
    sellingPrice: number;
    monthlyNetProfit: number;
    bepUnitsPerDay: number;
    bepRupiahPerMonth: number;
    paybackMonths: number;
  };
  status: PipelineStatus;
  assignedMantriId?: string;
  creditAssessment?: CreditSimulation;
  surveyNotes?: string;
  lastUpdated: string;
}
