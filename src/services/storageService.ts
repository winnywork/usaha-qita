import { UserProfile } from "@/types/user";
import { BusinessOpportunity } from "@/types/business";
import { FinancialAssumptions } from "@/types/finance";

const STORAGE_KEYS = {
  USER_PROFILE: "usaha_qita_user_profile",
  SELECTED_OPPORTUNITY: "usaha_qita_selected_opportunity",
  CUSTOM_ASSUMPTIONS: "usaha_qita_custom_assumptions",
  ROADMAP_PROGRESS: "usaha_qita_roadmap_progress",
} as const;

/**
 * Memeriksa apakah kode sedang berjalan di browser (Client-side)
 */
function isClient(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

// 1. Profil Pengguna
export function saveUserProfile(profile: UserProfile): void {
  if (!isClient()) return;
  try {
    const payload = {
      ...profile,
      updatedAt: new Date().toISOString(),
    };
    window.localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(payload));
  } catch (err) {
    console.error("Gagal menyimpan profil pengguna ke localStorage:", err);
  }
}

export function getUserProfile(): UserProfile | null {
  if (!isClient()) return null;
  try {
    const data = window.localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
    return data ? (JSON.parse(data) as UserProfile) : null;
  } catch (err) {
    console.error("Gagal membaca profil pengguna dari localStorage:", err);
    return null;
  }
}

export function clearUserProfile(): void {
  if (!isClient()) return;
  try {
    window.localStorage.removeItem(STORAGE_KEYS.USER_PROFILE);
  } catch (err) {
    console.error("Gagal menghapus profil pengguna dari localStorage:", err);
  }
}

// 2. Peluang Usaha Terpilih
export function saveSelectedOpportunity(opportunity: BusinessOpportunity): void {
  if (!isClient()) return;
  try {
    window.localStorage.setItem(STORAGE_KEYS.SELECTED_OPPORTUNITY, JSON.stringify(opportunity));
  } catch (err) {
    console.error("Gagal menyimpan peluang usaha terpilih:", err);
  }
}

export function getSelectedOpportunity(): BusinessOpportunity | null {
  if (!isClient()) return null;
  try {
    const data = window.localStorage.getItem(STORAGE_KEYS.SELECTED_OPPORTUNITY);
    return data ? (JSON.parse(data) as BusinessOpportunity) : null;
  } catch (err) {
    console.error("Gagal membaca peluang usaha terpilih:", err);
    return null;
  }
}

// 3. Asumsi Finansial Kustom Per Usaha
export function saveCustomAssumptions(opportunityId: string, assumptions: FinancialAssumptions): void {
  if (!isClient()) return;
  try {
    const existing = getAllCustomAssumptions();
    existing[opportunityId] = assumptions;
    window.localStorage.setItem(STORAGE_KEYS.CUSTOM_ASSUMPTIONS, JSON.stringify(existing));
  } catch (err) {
    console.error("Gagal menyimpan asumsi finansial:", err);
  }
}

export function getCustomAssumptions(opportunityId: string): FinancialAssumptions | null {
  const all = getAllCustomAssumptions();
  return all[opportunityId] || null;
}

function getAllCustomAssumptions(): Record<string, FinancialAssumptions> {
  if (!isClient()) return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEYS.CUSTOM_ASSUMPTIONS);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

// 4. Progres Checklist Roadmap
export function saveRoadmapStepStatus(stepId: string, isCompleted: boolean): void {
  if (!isClient()) return;
  try {
    const progress = getAllRoadmapProgress();
    progress[stepId] = isCompleted;
    window.localStorage.setItem(STORAGE_KEYS.ROADMAP_PROGRESS, JSON.stringify(progress));
  } catch (err) {
    console.error("Gagal menyimpan progres checklist roadmap:", err);
  }
}

export function getAllRoadmapProgress(): Record<string, boolean> {
  if (!isClient()) return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEYS.ROADMAP_PROGRESS);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}