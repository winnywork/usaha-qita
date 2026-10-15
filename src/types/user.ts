export type BusinessCategory = "kuliner" | "jasa" | "ritel" | "agribisnis" | "kreatif";

export type TargetGoal = "mulai_baru" | "ekspansi_usaha";

export type ExperienceLevel = "pemula" | "pernah_usaha" | "berpengalaman";

export type TimeCommitment = "penuh_waktu" | "sampingan";

export interface UserProfile {
  targetGoal: TargetGoal;
  cityLocation: string;
  categoryInterest: BusinessCategory[];
  availableCapital: number; // Dalam Rupiah, misal: 5000000
  experience: ExperienceLevel;
  timeCommitment: TimeCommitment;
  hasPhysicalLocation?: boolean;
  notes?: string;
  updatedAt?: string;
}

export const CATEGORY_LABELS: Record<BusinessCategory, { title: string; description: string; icon: string }> = {
  kuliner: {
    title: "Kuliner & F&B",
    description: "Makanan siap saji, minuman kekinian, camilan, dan katering rumahan",
    icon: "Utensils",
  },
  jasa: {
    title: "Jasa & Layanan",
    description: "Laundry, cuci kendaraan, perbaikan, pangkas rambut, dan layanan harian",
    icon: "Wrench",
  },
  ritel: {
    title: "Ritel & Toko",
    description: "Warung sembako modern, toko kelontong, aksesoris, dan minimarket lokal",
    icon: "Store",
  },
  agribisnis: {
    title: "Agribisnis & Peternakan",
    description: "Hidroponik, bibit tanaman, budidaya ikan lele, dan peternakan ayam",
    icon: "Sprout",
  },
  kreatif: {
    title: "Industri Kreatif",
    description: "Percetakan, konveksi sablon, souvenir kustom, dan fotografi/desain",
    icon: "Palette",
  },
};
