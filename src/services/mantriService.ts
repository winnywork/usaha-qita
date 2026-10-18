import { MarketIntelligence } from "@/types/business";
import { ConsultationLead, CreditSimulation, MantriUser, PipelineStatus } from "@/types/mantri";
import { businessOpportunities } from "@/data/opportunities";

const MANTRI_SESSION_KEY = "usahaqita_mantri_session";
const MANTRI_LEADS_KEY = "usahaqita_consultation_leads";

// Kredensial Mantri dikelola secara dinamis di basis data cloud.

// Seed initial realistic leads using opportunities dataset
function getInitialMockLeads(): ConsultationLead[] {
  const kopiOpp = businessOpportunities.find((o) => o.id === "opp-kopi-susu") || businessOpportunities[0];
  const laundryOpp = businessOpportunities.find((o) => o.id === "opp-laundry") || businessOpportunities[1];
  const kateringOpp = businessOpportunities.find((o) => o.id === "opp-tahu-crispy") || businessOpportunities[2];
  const cuciOpp = businessOpportunities.find((o) => o.id === "opp-cuci-motor") || businessOpportunities[3];

  return [
    {
      id: "UQ-2026-001",
      submittedAt: new Date(Date.now() - 3600000 * 3).toISOString(), // 3 hours ago
      applicantName: "Ahmad Fauzi",
      applicantPhone: "081234567890",
      preferredContactTime: "Pagi (08:30 - 11:00 WIB)",
      city: "Malang",
      specificLocation: "Jl. MT Haryono (Dekat Kampus UB/UIN)",
      locationEnvironment: "Kawasan Kampus & Kos Mahasiswa",
      businessTitle: kopiOpp.title,
      businessCategory: kopiOpp.category,
      availableCapital: 5000000,
      estimatedTotalCapital: kopiOpp.estimatedMinCapital,
      capitalDeficit: Math.max(0, kopiOpp.estimatedMinCapital - 5000000),
      matchScore: 92,
      marketIntelligence: kopiOpp.marketIntelligence!,
      financialMetrics: {
        dailyVolume: 65,
        sellingPrice: 15000,
        monthlyNetProfit: 4850000,
        bepUnitsPerDay: 24,
        bepRupiahPerMonth: 10800000,
        paybackMonths: 2.1,
      },
      status: "BARU_MASUK",
      assignedMantriId: "mantri-01",
      surveyNotes: "Calon debitur sangat siap dengan resep kopi susu gula aren. Lokasi sewa teras ruko dekat gerbang kampus sudah di-booking.",
      creditAssessment: {
        requestedLoanAmount: 10000000,
        recommendedLoanAmount: 10000000,
        interestRatePerYear: 6,
        tenorMonths: 12,
        monthlyInstallment: 883333,
        estimatedMonthlyProfit: 4850000,
        dscrRatio: 5.49,
        eligibilityGrade: "SANGAT_LAYAK",
      },
      lastUpdated: new Date(Date.now() - 3600000 * 2).toISOString(),
    },
    {
      id: "UQ-2026-002",
      submittedAt: new Date(Date.now() - 3600000 * 24).toISOString(), // 1 day ago
      applicantName: "Dewi Lestari",
      applicantPhone: "085712349988",
      preferredContactTime: "Siang (13:00 - 15:00 WIB)",
      city: "Malang",
      specificLocation: "Jl. Soekarno Hatta No. 45",
      locationEnvironment: "Pusat Perkantoran & Kuliner",
      businessTitle: laundryOpp.title,
      businessCategory: laundryOpp.category,
      availableCapital: 12000000,
      estimatedTotalCapital: laundryOpp.estimatedMinCapital,
      capitalDeficit: Math.max(0, laundryOpp.estimatedMinCapital - 12000000),
      matchScore: 88,
      marketIntelligence: laundryOpp.marketIntelligence!,
      financialMetrics: {
        dailyVolume: 40,
        sellingPrice: 8000,
        monthlyNetProfit: 5200000,
        bepUnitsPerDay: 18,
        bepRupiahPerMonth: 4320000,
        paybackMonths: 3.8,
      },
      status: "SURVEI_LAPANGAN",
      assignedMantriId: "mantri-01",
      surveyNotes: "Survei lapangan dilakukan kemarin. Akses air PDAM lancar, tempat parkir luas, dan deterjen ramah lingkungan sudah memiliki supplier.",
      creditAssessment: {
        requestedLoanAmount: 15000000,
        recommendedLoanAmount: 15000000,
        interestRatePerYear: 6,
        tenorMonths: 24,
        monthlyInstallment: 700000,
        estimatedMonthlyProfit: 5200000,
        dscrRatio: 7.42,
        eligibilityGrade: "SANGAT_LAYAK",
      },
      lastUpdated: new Date(Date.now() - 3600000 * 8).toISOString(),
    },
    {
      id: "UQ-2026-003",
      submittedAt: new Date(Date.now() - 3600000 * 48).toISOString(), // 2 days ago
      applicantName: "Bambang Wijaya",
      applicantPhone: "081399887766",
      preferredContactTime: "Sore (15:30 - 17:00 WIB)",
      city: "Malang",
      specificLocation: "Jl. Raya Tlogomas (Area Kos)",
      locationEnvironment: "Kawasan Pemukiman & Kos",
      businessTitle: kateringOpp.title,
      businessCategory: kateringOpp.category,
      availableCapital: 3000000,
      estimatedTotalCapital: kateringOpp.estimatedMinCapital,
      capitalDeficit: Math.max(0, kateringOpp.estimatedMinCapital - 3000000),
      matchScore: 85,
      marketIntelligence: kateringOpp.marketIntelligence!,
      financialMetrics: {
        dailyVolume: 35,
        sellingPrice: 18000,
        monthlyNetProfit: 4500000,
        bepUnitsPerDay: 14,
        bepRupiahPerMonth: 7560000,
        paybackMonths: 1.8,
      },
      status: "REKOMENDASI_KUR",
      assignedMantriId: "mantri-01",
      surveyNotes: "Dapur higienis, sudah punya 20 pelanggan langganan awal dari grup WhatsApp mahasiswa rantau.",
      creditAssessment: {
        requestedLoanAmount: 5000000,
        recommendedLoanAmount: 5000000,
        interestRatePerYear: 6,
        tenorMonths: 12,
        monthlyInstallment: 441666,
        estimatedMonthlyProfit: 4500000,
        dscrRatio: 10.18,
        eligibilityGrade: "SANGAT_LAYAK",
      },
      lastUpdated: new Date(Date.now() - 3600000 * 12).toISOString(),
    },
    {
      id: "UQ-2026-004",
      submittedAt: new Date(Date.now() - 3600000 * 72).toISOString(), // 3 days ago
      applicantName: "Rian Pratama",
      applicantPhone: "087811223344",
      preferredContactTime: "Pagi (09:00 - 11:30 WIB)",
      city: "Malang",
      specificLocation: "Jl. Candi Mendut / Candi Panggung",
      locationEnvironment: "Jalan Protokol / Sentra Usaha",
      businessTitle: cuciOpp.title,
      businessCategory: cuciOpp.category,
      availableCapital: 7000000,
      estimatedTotalCapital: cuciOpp.estimatedMinCapital,
      capitalDeficit: Math.max(0, cuciOpp.estimatedMinCapital - 7000000),
      matchScore: 80,
      marketIntelligence: cuciOpp.marketIntelligence!,
      financialMetrics: {
        dailyVolume: 25,
        sellingPrice: 15000,
        monthlyNetProfit: 3800000,
        bepUnitsPerDay: 11,
        bepRupiahPerMonth: 4950000,
        paybackMonths: 3.2,
      },
      status: "KONTAK_PERTAMA",
      assignedMantriId: "mantri-02",
      surveyNotes: "Sudah dihubungi via WhatsApp. Jadwal survei lokasi air dan izin drainase hari Kamis.",
      lastUpdated: new Date(Date.now() - 3600000 * 20).toISOString(),
    },
  ];
}

// 1. Session Management
export function getCurrentMantri(): MantriUser | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(MANTRI_SESSION_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as MantriUser;
  } catch {
    return null;
  }
}

export function loginMantri(
  personalNumber: string,
  pin: string
): { success: boolean; user?: MantriUser; error?: string } {
  if (typeof window === "undefined") {
    return { success: false, error: "Window undefined" };
  }

  const cleanNip = personalNumber.trim().toUpperCase();
  const rawSession = localStorage.getItem(MANTRI_SESSION_KEY);
  if (rawSession) {
    try {
      const active = JSON.parse(rawSession) as MantriUser;
      if (active.personalNumber.toUpperCase() === cleanNip) {
        return { success: true, user: active };
      }
    } catch {
      // ignore
    }
  }

  return {
    success: false,
    error: "Autentikasi memerlukan panggilan verifikasi langsung ke server basis data.",
  };
}

export async function loginMantriAsync(
  personalNumber: string,
  pin: string
): Promise<{ success: boolean; user?: MantriUser; error?: string }> {
  if (typeof window === "undefined") {
    return { success: false, error: "Window undefined" };
  }

  const cleanPN = personalNumber.trim().toUpperCase();
  const cleanPin = pin.trim();

  try {
    const res = await fetch("/api/mantri/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ personalNumber: cleanPN, pin: cleanPin }),
    });

    const data = await res.json();

    if (res.ok && data.success && data.mantri) {
      localStorage.setItem(MANTRI_SESSION_KEY, JSON.stringify(data.mantri));
      return { success: true, user: data.mantri };
    }

    return {
      success: false,
      error: data.error || "Personal Number (NIP) atau PIN Mantri salah. Akses ditolak.",
    };
  } catch (err) {
    console.error("Gagal menghubungkan ke server autentikasi Mantri:", err);
    return {
      success: false,
      error: "Gagal menghubungi server verifikasi autentikasi. Pastikan koneksi internet stabil.",
    };
  }
}

export function logoutMantri(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(MANTRI_SESSION_KEY);
}


export const DEFAULT_MARKET_INTELLIGENCE: MarketIntelligence = {
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

export const DEFAULT_FINANCIAL_METRICS = {
  dailyVolume: 35,
  sellingPrice: 15000,
  monthlyNetProfit: 4500000,
  bepUnitsPerDay: 14,
  bepRupiahPerMonth: 6300000,
  paybackMonths: 2.5,
};

export function normalizeLead(lead: Record<string, unknown>): ConsultationLead {
  const rawIntel = (lead?.marketIntelligence || {}) as Record<string, Record<string, unknown>>;
  const rawMetrics = (lead?.financialMetrics || {}) as Record<string, unknown>;

  const normalized = {
    ...lead,
    availableCapital: Number(lead?.availableCapital || 0),
    estimatedTotalCapital: Number(lead?.estimatedTotalCapital || 0),
    capitalDeficit: Number(lead?.capitalDeficit || 0),
    matchScore: Number(lead?.matchScore || 85),
    marketIntelligence: {
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
    },
    financialMetrics: {
      ...DEFAULT_FINANCIAL_METRICS,
      ...rawMetrics,
    },
  };

  return normalized as unknown as ConsultationLead;
}

// 2. Leads Management (Synchronized with MySQL Database & Local Storage Fallback)

export async function fetchLeadsFromDatabase(): Promise<ConsultationLead[]> {
  if (typeof window === "undefined") return [];
  try {
    const res = await fetch("/api/leads", { cache: "no-store" });
    if (res.ok) {
      const json = await res.json();
      if (json.success && Array.isArray(json.data) && json.data.length > 0) {
        localStorage.setItem(MANTRI_LEADS_KEY, JSON.stringify(json.data));
        const normalized = (json.data as Record<string, unknown>[]).map(normalizeLead); localStorage.setItem(MANTRI_LEADS_KEY, JSON.stringify(normalized)); return normalized;
      }
    }
  } catch (err) {
    console.warn("Could not fetch leads from MySQL API, falling back to local storage:", err);
  }
  return getConsultationLeads();
}

export function getConsultationLeads(): ConsultationLead[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(MANTRI_LEADS_KEY);
  if (!raw) {
    const initial = getInitialMockLeads();
    localStorage.setItem(MANTRI_LEADS_KEY, JSON.stringify(initial));
    return initial;
  }
  try {
    return (JSON.parse(raw) as Record<string, unknown>[]).map(normalizeLead);
  } catch {
    const initial = getInitialMockLeads();
    localStorage.setItem(MANTRI_LEADS_KEY, JSON.stringify(initial));
    return initial;
  }
}

export function getLeadById(id: string): ConsultationLead | undefined {
  const leads = getConsultationLeads();
  return leads.find((l) => l.id.toLowerCase() === id.toLowerCase());
}

export async function getLeadByIdAsync(id: string): Promise<ConsultationLead | undefined> {
  const local = getLeadById(id);
  if (typeof window === "undefined") return local;
  try {
    const leads = await fetchLeadsFromDatabase();
    return leads.find((l) => l.id.toLowerCase() === id.toLowerCase()) || local;
  } catch {
    return local;
  }
}


export async function submitNewLeadAsync(
  leadInput: Omit<ConsultationLead, "id" | "submittedAt" | "lastUpdated" | "status">
): Promise<ConsultationLead> {
  const leads = getConsultationLeads();
  const fallbackId = `UQ-2026-${String(leads.length + 1).padStart(3, "0")}`;
  const now = new Date().toISOString();

  let finalLead: ConsultationLead = {
    ...leadInput,
    id: fallbackId,
    submittedAt: now,
    lastUpdated: now,
    status: "BARU_MASUK",
  };

  if (typeof window !== "undefined") {
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalLead),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          finalLead = normalizeLead(json.data);
        }
      }
    } catch (err) {
      console.warn("Could not sync new lead to MySQL, fallback to local storage:", err);
    }

    const currentLeads = getConsultationLeads();
    const updated = [finalLead, ...currentLeads.filter((l) => l.id !== finalLead.id)];
    localStorage.setItem(MANTRI_LEADS_KEY, JSON.stringify(updated));
  }

  return finalLead;
}

export function submitNewLead(
  leadInput: Omit<ConsultationLead, "id" | "submittedAt" | "lastUpdated" | "status">
): ConsultationLead {
  const leads = getConsultationLeads();
  const newId = `UQ-2026-${String(leads.length + 1).padStart(3, "0")}`;
  const now = new Date().toISOString();

  const newLead: ConsultationLead = {
    ...leadInput,
    id: newId,
    submittedAt: now,
    lastUpdated: now,
    status: "BARU_MASUK",
  };

  const updatedLeads = [newLead, ...leads];
  if (typeof window !== "undefined") {
    localStorage.setItem(MANTRI_LEADS_KEY, JSON.stringify(updatedLeads));
    // Asynchronous synchronization to MySQL database via API
    fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newLead),
    }).catch((err) => console.warn("Failed to sync new lead to MySQL:", err));
  }
  return newLead;
}

export function updateLeadStatus(
  id: string,
  status: PipelineStatus,
  surveyNotes?: string,
  creditAssessment?: CreditSimulation
): ConsultationLead | null {
  const leads = getConsultationLeads();
  const index = leads.findIndex((l) => l.id.toLowerCase() === id.toLowerCase());
  if (index === -1) return null;

  const current = leads[index];
  const updated: ConsultationLead = {
    ...current,
    status,
    surveyNotes: surveyNotes !== undefined ? surveyNotes : current.surveyNotes,
    creditAssessment: creditAssessment !== undefined ? creditAssessment : current.creditAssessment,
    lastUpdated: new Date().toISOString(),
  };

  leads[index] = updated;
  if (typeof window !== "undefined") {
    localStorage.setItem(MANTRI_LEADS_KEY, JSON.stringify(leads));
    // Asynchronous synchronization to MySQL database via API
    fetch(`/api/leads/${encodeURIComponent(id)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status,
        surveyNotes,
        creditAssessment,
      }),
    }).catch((err) => console.warn("Failed to sync status update to MySQL:", err));
  }
  return updated;
}

// 3. Kalkulator Asesmen KUR Mikro BRI (DSCR)
export function calculateKurAssessment(
  loanAmount: number,
  tenorMonths: 12 | 24 | 36,
  monthlyNetProfit: number
): CreditSimulation {
  const interestRateAnnual = 6; // 6% p.a. Subsidi KUR

  // Formula Angsuran Flat / Anuitas Standar
  // Pokok per bulan + Bunga flat bulanan
  const monthlyPrincipal = loanAmount / tenorMonths;
  const monthlyInterest = (loanAmount * 0.06) / 12;
  const monthlyInstallment = Math.round(monthlyPrincipal + monthlyInterest);

  const dscrRatio =
    monthlyInstallment > 0
      ? Number((monthlyNetProfit / monthlyInstallment).toFixed(2))
      : 99;

  let eligibilityGrade: "SANGAT_LAYAK" | "LAYAK" | "BERISIKO" = "SANGAT_LAYAK";
  if (dscrRatio >= 2.0) {
    eligibilityGrade = "SANGAT_LAYAK";
  } else if (dscrRatio >= 1.25) {
    eligibilityGrade = "LAYAK";
  } else {
    eligibilityGrade = "BERISIKO";
  }

  return {
    requestedLoanAmount: loanAmount,
    recommendedLoanAmount: loanAmount,
    interestRatePerYear: interestRateAnnual,
    tenorMonths,
    monthlyInstallment,
    estimatedMonthlyProfit: monthlyNetProfit,
    dscrRatio,
    eligibilityGrade,
  };
}

// 4. WhatsApp Direct Link Generator
export function generateWhatsAppUrl(
  phone: string,
  applicantName: string,
  businessTitle: string,
  mantriName: string,
  unitName: string
): string {
  // Format nomor HP ke 62xxxxxxxxx
  let cleanPhone = phone.replace(/[^0-9]/g, "");
  if (cleanPhone.startsWith("0")) {
    cleanPhone = "62" + cleanPhone.slice(1);
  } else if (cleanPhone.startsWith("8")) {
    cleanPhone = "62" + cleanPhone;
  }

  const message = `Halo Bapak/Ibu ${applicantName}, perkenalkan saya ${mantriName} dari ${unitName}. 

Kami telah menerima rencana usaha Anda untuk "${businessTitle}" melalui platform UsahaQita. Kami sangat mengapresiasi kesiapan rencana usaha dan kalkulasi kelayakan yang telah Anda susun.

Apakah kami boleh mendiskusikan jadwal singkat untuk perkenalan atau survei lokasi usaha Anda? Terima kasih.`;

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}
