export interface RegionalProfile {
  city: string;
  province: string;
  minimumWageRupiah: number; // UMK / UMR
  purchasingPowerIndex: "Menengah" | "Tinggi" | "Sangat Tinggi";
  targetDemographicDensity: string;
  bpsKeyMetric: {
    name: string;
    value: string;
    relevance: string;
  };
  commercialHubs: string[];
  localNewsHighlight: {
    headline: string;
    source: string;
    summary: string;
  };
}

export const REGIONAL_PROFILES: Record<string, RegionalProfile> = {
  malang: {
    city: "Kota Malang",
    province: "Jawa Timur",
    minimumWageRupiah: 3309144,
    purchasingPowerIndex: "Tinggi",
    targetDemographicDensity: "Tinggi (Populasi Mahasiswa >300.000)",
    bpsKeyMetric: {
      name: "Indeks Konsumsi Rumah Tangga & Pelajar",
      value: "Tinggi (62% Pengeluaran untuk F&B & Jasa)",
      relevance: "Perputaran uang harian sangat cepat di sekitar kampus (UB, UM, UIN, Polinema).",
    },
    commercialHubs: ["Soekarno Hatta", "Dinoyo", "Tlogomas", "Sigura-gura", "Ijen"],
    localNewsHighlight: {
      headline: "Pemkot Malang Akselerasi Digitalisasi UMKM dan Relaksasi Izin Usaha Mikro",
      source: "Radar Malang Ekonomi",
      summary: "Pemerintah Kota Malang memfasilitasi legalitas NIB gratis dan perluasan titik gerai UMKM di koridor pendidikan.",
    },
  },
  surabaya: {
    city: "Kota Surabaya",
    province: "Jawa Timur",
    minimumWageRupiah: 4725479,
    purchasingPowerIndex: "Sangat Tinggi",
    targetDemographicDensity: "Sangat Tinggi (Pusat Megapolitan Jatim)",
    bpsKeyMetric: {
      name: "Indeks Daya Beli Konsumen Perkotaan",
      value: "Sangat Tinggi (UMK Tertinggi Jawa Timur)",
      relevance: "Konsumen loyal terhadap layanan cepat saji higienis dan jasa berorientasi efisiensi waktu.",
    },
    commercialHubs: ["Rungkut", "Gubeng", "Kertajaya", "Tegalsari", "Mayjen Sungkono"],
    localNewsHighlight: {
      headline: "Surabaya Catat Pertumbuhan Transaksi Non-Tunai QRIS Tercepat di Jatim",
      source: "Harian Disway Bisnis",
      summary: "Dinas Koperasi dan UMKM Surabaya mencatat kenaikan omzet 35% pada sentra kuliner modern berfasilitas pembayaran digital.",
    },
  },
  jakarta: {
    city: "DKI Jakarta",
    province: "DKI Jakarta",
    minimumWageRupiah: 5067381,
    purchasingPowerIndex: "Sangat Tinggi",
    targetDemographicDensity: "Padat Eksekutif & Residensial",
    bpsKeyMetric: {
      name: "Indeks Belanja Gaya Hidup & Layanan Harian",
      value: "Sangat Tinggi",
      relevance: "Sensitivitas harga lebih rendah; mengutamakan konsistensi rasa, kecepatan, dan kemudahan pesan bawa pulang.",
    },
    commercialHubs: ["Tebet", "Senopati", "Kelapa Gading", "Tanjung Duren", "Bendungan Hilir"],
    localNewsHighlight: {
      headline: "Pemprov DKI Perluas Sentra Kuliner Binaan dan Akses Bantuan Alat Produksi",
      source: "Bisnis Jakarta",
      summary: "Program pembinaan kewirausahaan terpadu mendongkrak kelayakan usaha mikro di kawasan penyangga perkantoran.",
    },
  },
  bandung: {
    city: "Kota Bandung",
    province: "Jawa Barat",
    minimumWageRupiah: 4209309,
    purchasingPowerIndex: "Tinggi",
    targetDemographicDensity: "Tinggi (Kreatif, Wisatawan & Pelajar)",
    bpsKeyMetric: {
      name: "Indeks Konsumsi Produk Kreatif & Camilan",
      value: "Sangat Tinggi",
      relevance: "Penerimaan pasar terhadap varian rasa baru dan tren viral kuliner sangat cepat berkembang.",
    },
    commercialHubs: ["Dipati Ukur", "Dago", "Buahbatu", "Cihampelas", "Lengkong Kecil"],
    localNewsHighlight: {
      headline: "Sentra Kuliner Kreatif Bandung Raup Kenaikan Omzet Signifikan Pasca Pandemi",
      source: "Pikiran Rakyat Ekonomi",
      summary: "Wisata kuliner akhir pekan dan komunitas kreatif menjadi motor penggerak stabilitas penjualan gerai mikro.",
    },
  },
  yogyakarta: {
    city: "Kota Yogyakarta / Sleman",
    province: "DI Yogyakarta",
    minimumWageRupiah: 2492997,
    purchasingPowerIndex: "Menengah",
    targetDemographicDensity: "Sangat Tinggi Pelajar & Rantau",
    bpsKeyMetric: {
      name: "Indeks Rasio Pengeluaran Makanan Pokok Mahasiswa",
      value: "Tinggi (Porsi & Harga Bersaing)",
      relevance: "Model bisnis paket hemat porsi mengenyangkan memiliki retensi pelanggan sangat tinggi.",
    },
    commercialHubs: ["Gejayan", "Kaliurang", "Seturan", "Babarsari", "Jakal"],
    localNewsHighlight: {
      headline: "Dukungan Pembiayaan Mikro DIY Dorong Transformasi Warung Tradisional ke Modern",
      source: "Kedaulatan Rakyat",
      summary: "Akses permodalan berbunga rendah KUR mempercepat modernisasi inventori dan sistem kasir digital pedagang lokal.",
    },
  },
  semarang: {
    city: "Kota Semarang",
    province: "Jawa Tengah",
    minimumWageRupiah: 3243969,
    purchasingPowerIndex: "Tinggi",
    targetDemographicDensity: "Padat Kawasan Industri & Kampus",
    bpsKeyMetric: {
      name: "Indeks Pertumbuhan Ritel & Jasa Perawatan",
      value: "Tinggi",
      relevance: "Kebutuhan jasa laundry dan cuci kendaraan meningkat pesat seiring industrialisasi kawasan.",
    },
    commercialHubs: ["Tembalang", "Pleburan", "Simpang Lima", "Banyumanik"],
    localNewsHighlight: {
      headline: "Kawasan Tembalang dan Banyumanik Jadi Magnet Baru Pertumbuhan Waralaba Mikro",
      source: "Suara Merdeka",
      summary: "Ekspansi kawasan perumahan baru membuka peluang pasar jasa rumah tangga dan makanan siap santap.",
    },
  },
};

export const DEFAULT_NATIONAL_PROFILE: RegionalProfile = {
  city: "Nasional (Rata-rata Perkotaan)",
  province: "Indonesia",
  minimumWageRupiah: 3200000,
  purchasingPowerIndex: "Menengah",
  targetDemographicDensity: "Kawasan Pemukiman & Komersial Campuran",
  bpsKeyMetric: {
    name: "Indeks Daya Beli Konsumsi Rumah Tangga",
    value: "Stabil Bertumbuh",
    relevance: "Kategori kebutuhan konsumsi harian dan jasa esensial memiliki ketahanan pasar teruji.",
  },
  commercialHubs: ["Jalan Utama Kota", "Dekat Pasar", "Kawasan Ruko"],
  localNewsHighlight: {
    headline: "Pemerintah Perkuat Ekosistem Pembiayaan Usaha Rakyat (KUR) dan Digitalisasi Pasar",
    source: "Warta Ekonomi Nasional",
    summary: "Dukungan literasi perbankan dan ekosistem QRIS mendorong daya saing wirausaha pemula di seluruh nusantara.",
  },
};

export function getRegionalProfile(cityInput?: string): RegionalProfile {
  if (!cityInput) return DEFAULT_NATIONAL_PROFILE;
  const clean = cityInput.trim().toLowerCase();

  for (const [key, profile] of Object.entries(REGIONAL_PROFILES)) {
    if (clean.includes(key) || key.includes(clean)) {
      return profile;
    }
  }

  return {
    ...DEFAULT_NATIONAL_PROFILE,
    city: cityInput.trim(),
  };
}