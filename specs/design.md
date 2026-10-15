# Dokumen Desain Arsitektur & Teknis (Design Specification)
## Proyek: Usaha Qita — powered by BRI
**Status**: DRAFT (Menunggu Persetujuan Mentor/Pengguna)  
**Versi**: 1.0.0  
**Tanggal**: 15 Oktober 2026  

---

## 1. Ringkasan Arsitektur & Keputusan Teknologi

Sebagai mentor coding untuk pemula, berikut penjelasan arsitektur dalam bahasa yang ramah dan mudah dimengerti:

```
+-------------------------------------------------------------------+
|                        BROWSER PENGGUNA                           |
|  (Tampilan Web Responsif: HP 360px, 390px, Tablet 768px, PC 1440px) |
|                                                                   |
|  [Halaman Landing] -> [Onboarding] -> [Katalog Rekomendasi]       |
|                                       v                           |
|                       [Kalkulator Finansial & Asumsi]             |
|                                       v                           |
|                       [Roadmap Usaha] & [Konsultasi Mantri]       |
|                                                                   |
|  +-------------------------------------------------------------+  |
|  | State Management & Local Storage (Penyimpanan Data di HP/PC)|  |
|  +-------------------------------------------------------------+  |
+----------------------------------+--------------------------------+
                                   | (Permintaan AI / Masa Depan)
                                   v
+-------------------------------------------------------------------+
|                  SERVER BOUNDARY (Next.js App Router)             |
|  - API Route: /api/ai/analyze (Server-side Only)                  |
|  - Environment Variables (.env.local - API Key Disembunyikan)     |
|  - Boundary Guard: Mencegah Kunci Rahasia Bocor ke Browser        |
+----------------------------------+--------------------------------+
                                   | (Fase Lanjutan)
                                   v
+-------------------------------------------------------------------+
|                  LAYANAN EKSTERNAL (Fase Lanjutan)                |
|  - Google Gemini API (LLM untuk ringkasan analisis cerdas)        |
+-------------------------------------------------------------------+
```

### 1.1 Palet Warna & Identitas Visual
Aplikasi mengusung tema putih bersih, segar, dan profesional dengan palet warna terstandarisasi:
1. **Warna Utama**: Putih Bersih (`#FFFFFF` & kanvas halus `slate-50` / `#F8FAFC`).
2. **Warna Kedua (Primary Brand Blue)**: `#0857C3` (Biru elegan untuk tombol utama, navbar brand, dan heading kunci).
3. **Warna Ketiga (Secondary Blue)**: `#307FE3` (Biru terang dinamis untuk aksen interaktif, hover effect, dan status aktif).
4. **Warna Keempat (Accent Sky Blue)**: `#71C5E8` (Biru muda lembut untuk badge, latar belakang sorotan, dan elemen grafis halus).

### Mengapa Teknologi Ini Dipilih?
1. **Next.js App Router**:
   - *Penjelasan Pemula*: Next.js membagi aplikasi menjadi dua bagian: apa yang diproses di komputer server (lebih aman dan cepat) dan apa yang berjalan di browser pengguna (interaktif).
   - *Alasan*: Memungkinkan kita memisahkan logika rahasia (seperti kunci AI masa depan) dari kode visual pengguna.
2. **React + TypeScript (Strict Mode)**:
   - *Penjelasan Pemula*: TypeScript memberi tahu kita jika ada salah ketik atau data yang tidak cocok sebelum kode dijalankan.
   - *Alasan*: Menghindari kesalahan perhitungan finansial dan membuat kode mudah dibaca oleh pemula saat belajar.
3. **Tailwind CSS**:
   - *Penjelasan Pemula*: Cara menata tampilan (warna, jarak, ukuran) langsung di kode komponen menggunakan nama-nama kelas yang rapi dan konsisten.
   - *Alasan*: Memudahkan pembuatan tampilan responsif untuk layar HP kecil (360px) hingga layar laptop (1440px) tanpa menulis ratusan baris CSS terpisah.
4. **Local Storage Browser**:
   - *Penjelasan Pemula*: Tempat penyimpanan kecil di dalam browser pengguna (seperti buku catatan pribadi di HP pengguna).
   - *Alasan*: Rencana usaha pengguna tersimpan aman di komputernya sendiri tanpa perlu membuat akun, kata sandi, atau database server di tahap awal (MVP).

---

## 2. Struktur Modul & Folder Proyek

Struktur folder dirancang teratur agar setiap bagian memiliki satu tanggung jawab yang jelas (*Separation of Concerns*):

```
usaha-qita/
├── AGENTS.md                  # Aturan AI dan pedoman kolaborasi
├── specs/                     # Spesifikasi teknis (Single Source of Truth)
│   ├── requirements.md        # Kebutuhan sistem (REQ-xxx)
│   ├── design.md              # Arsitektur & model teknis
│   ├── tasks.md               # Rencana kerja & status tugas (TASK-xxx)
│   └── acceptance-criteria.md # Kriteria penerimaan teruji (AC-xxx)
├── src/
│   ├── app/                   # Rute & Halaman Next.js (App Router)
│   │   ├── layout.tsx         # Template dasar, font, navbar, footer & disclaimer
│   │   ├── page.tsx           # Halaman utama (Landing & Gambaran Umum)
│   │   ├── onboarding/        # Rute formulir profil usaha
│   │   │   └── page.tsx
│   │   ├── rekomendasi/       # Rute daftar peluang usaha yang cocok
│   │   │   └── page.tsx
│   │   ├── analisis/          # Rute kalkulator finansial & asumsi
│   │   │   └── page.tsx
│   │   ├── roadmap/           # Rute rencana langkah-langkah usaha
│   │   │   └── page.tsx
│   │   ├── mantri/            # Rute edukasi & alur konsultasi Mantri BRI
│   │   │   └── page.tsx
│   │   └── api/               # Server Boundary (Hanya berjalan di Server)
│   │       └── ai/
│   │           └── route.ts   # Endpoint proxy AI (fase lanjutan)
│   ├── components/            # Komponen Tampilan yang Dapat Digunakan Ulang
│   │   ├── ui/                # Elemen dasar (Button, Card, Badge, Modal, Input)
│   │   ├── layout/            # Navbar, Footer, MobileNav, DisclaimerBanner
│   │   ├── onboarding/        # FormWizard, RangeSlider, CategoryPicker
│   │   ├── rekomendasi/       # OpportunityCard, FilterBar, SimulationTag
│   │   ├── analisis/          # MetricCard, FinancialSliders, BEPChart, ScenarioPills
│   │   ├── roadmap/           # TimelineItem, ChecklistItem, ProgressTracker
│   │   └── feedback/          # LoadingSkeleton, EmptyState, ErrorAlert
│   ├── core/                  # Logika Bisnis Murni (Bebas dari Kode UI)
│   │   ├── finance/           # Mesin kalkulasi finansial deterministik
│   │   │   ├── calculator.ts  # Rumus omzet, biaya, laba, margin, BEP, balik modal
│   │   │   └── calculator.test.ts # Unit test rumus matematika
│   │   └── matching/          # Mesin penyocok profil dengan peluang usaha
│   │       ├── matcher.ts
│   │       └── matcher.test.ts
│   ├── data/                  # Data Mock Terstruktur
│   │   ├── opportunities.ts   # Koleksi data simulasi peluang usaha Indonesia
│   │   └── defaultRoadmap.ts  # Template langkah memulai usaha standar
│   ├── services/              # Lapisan Komunikasi Data
│   │   ├── storageService.ts  # Pembaca dan penyimpan data di Local Storage
│   │   └── aiService.ts       # Klien pemanggil endpoint server AI
│   └── types/                 # Definisi Tipe TypeScript
│       ├── business.ts
│       ├── finance.ts
│       └── user.ts
├── public/                    # File statis (logo, ikon, gambar edukasi)
├── .env.example               # Contoh konfigurasi rahasia server
├── tailwind.config.ts         # Konfigurasi token desain dan warna
├── tsconfig.json              # Konfigurasi TypeScript strict mode
└── package.json               # Dependensi proyek
```

---

## 3. Alur Data (Data Flow)

1. **Input Profil Pengguna**:
   - Pengguna memilih kategori, modal, lokasi, dan preferensi di halaman Onboarding.
   - Data divalidasi dan disimpan sementara di React state serta dicadangkan ke `localStorage`.
2. **Penyaringan Peluang Usaha**:
   - `matcher.ts` mengambil data simulasi dari `data/opportunities.ts`.
   - Peluang disaring berdasarkan rentang modal (misal: modal pengguna Rp 5 juta akan mencocokkan usaha dengan modal Rp 2 - 6 juta) dan minat kategori.
   - Hasil diberi peringkat dan label simulasi.
3. **Kustomisasi & Kalkulasi Finansial**:
   - Saat pengguna memilih satu usaha, parameter default (harga, volume, biaya sewa, bahan baku) dimuat ke halaman analisis.
   - Setiap kali pengguna menggeser slider atau mengubah angka input, fungsi murni `calculateFinancials()` di `calculator.ts` langsung dieksekusi seketika (*synchronous, 0 latency*).
   - Hasil kalkulasi (Omzet, Biaya, Laba, BEP Unit, BEP Rupiah, Waktu Balik Modal) diperbarui di layar.
4. **Perjalanan Roadmap & Status Checklist**:
   - Pengguna melihat tugas-tugas dalam 4 fase. Progres centang disimpan di `localStorage` agar tidak hilang saat pengguna kembali di lain hari.

---

## 4. Model Data TypeScript (Core Interfaces)

```typescript
// 1. Profil Pengguna
export type BusinessCategory = 'kuliner' | 'jasa' | 'ritel' | 'agribisnis' | 'kreatif';
export type ExperienceLevel = 'pemula' | 'pernah_usaha' | 'berpengalaman';
export type TimeCommitment = 'penuh_waktu' | 'sampingan';

export interface UserProfile {
  targetGoal: 'mulai_baru' | 'ekspansi_usaha';
  cityLocation: string;
  categoryInterest: BusinessCategory[];
  availableCapital: number; // Dalam Rupiah, misal: 5000000
  experience: ExperienceLevel;
  timeCommitment: TimeCommitment;
  hasPhysicalLocation: boolean;
}

// 2. Data Peluang Usaha
export interface BusinessOpportunity {
  id: string;
  title: string;
  category: BusinessCategory;
  shortDescription: string;
  isSimulatedData: true; // Wajib true sebagai label transparansi
  estimatedMinCapital: number;
  estimatedMaxCapital: number;
  defaultAssumptions: FinancialAssumptions;
  suitabilityReason: string;
  keyRisks: string[];
  keySuccessFactors: string[];
}

// 3. Parameter Asumsi Finansial
export interface FinancialAssumptions {
  sellingPricePerUnit: number;       // Harga jual per porsi/barang (Rp)
  costOfGoodsPerUnit: number;        // HPP / Modal bahan per unit (Rp)
  dailySalesVolume: number;          // Target unit terjual per hari
  operatingDaysPerMonth: number;     // Jumlah hari buka per bulan (misal: 26 atau 30)
  monthlyFixedCosts: {
    rent: number;                    // Sewa tempat bulanan
    salaries: number;                // Total gaji karyawan
    utilities: number;               // Listrik, air, internet
    otherMarketing: number;          // Pemasaran & biaya lain-lain
  };
  initialEquipmentCost: number;      // Biaya beli alat di awal (Rp)
}

// 4. Hasil Kalkulasi Finansial Deterministik
export interface FinancialResult {
  monthlyGrossRevenue: number;       // Omzet kotor bulanan
  monthlyVariableCosts: number;      // Total biaya variabel bulanan
  monthlyFixedCosts: number;         // Total biaya tetap bulanan
  monthlyTotalCosts: number;         // Total seluruh pengeluaran
  monthlyNetProfit: number;          // Laba bersih bulanan
  netProfitMarginPercentage: number; // Margin laba bersih (%)
  contributionMarginPerUnit: number; // Margin kontribusi per unit (Rp)
  contributionMarginRatio: number;   // Rasio margin kontribusi (0 - 1)
  bepMonthlyRevenue: number;         // Titik impas omzet bulanan (Rp)
  bepUnitsPerMonth: number;          // Titik impas jumlah unit per bulan
  bepUnitsPerDay: number;            // Titik impas jumlah unit per hari
  estimatedPaybackMonths: number;    // Estimasi waktu balik modal (bulan)
  isProfitable: boolean;             // True jika Laba Bersih > 0
}

// 5. Konsultasi Mantri BRI Edukatif
export interface MantriConsultationInterest {
  fullName: string;
  phoneNumber: string;
  city: string;
  selectedBusinessTitle: string;
  hasAgreedToConsent: boolean;       // Wajib dicentang eksplisit
  submittedAt: string;
}
```

---

## 5. Formula Matematika Finansial Deterministik

Semua fungsi kalkulasi di `core/finance/calculator.ts` wajib bebas dari pembulatan pecahan tidak terkontrol dan harus dapat diuji secara mandiri:

1. **Omzet Kotor Bulanan ($R$)**:
   $$R = \text{dailySalesVolume} \times \text{sellingPricePerUnit} \times \text{operatingDaysPerMonth}$$
2. **Total Biaya Variabel Bulanan ($VC$)**:
   $$VC = \text{dailySalesVolume} \times \text{costOfGoodsPerUnit} \times \text{operatingDaysPerMonth}$$
3. **Total Biaya Tetap Bulanan ($FC$)**:
   $$FC = \text{rent} + \text{salaries} + \text{utilities} + \text{otherMarketing}$$
4. **Total Pengeluaran Bulanan ($TC$)**:
   $$TC = FC + VC$$
5. **Laba Bersih Bulanan ($NP$)**:
   $$NP = R - TC$$
6. **Margin Laba Bersih ($M$)**:
   $$M = \begin{cases} \left(\frac{NP}{R}\right) \times 100\%, & \text{jika } R > 0 \\ 0\%, & \text{jika } R \le 0 \end{cases}$$
7. **Margin Kontribusi per Unit ($CM$)**:
   $$CM = \text{sellingPricePerUnit} - \text{costOfGoodsPerUnit}$$
8. **Titik Impas / Break-Even Point Unit Bulanan ($BEP_{\text{unit}}$)**:
   $$BEP_{\text{unit}} = \begin{cases} \left\lceil \frac{FC}{CM} \right\rceil, & \text{jika } CM > 0 \\ \infty, & \text{jika } CM \le 0 \end{cases}$$
9. **Titik Impas / BEP Rupiah Bulanan ($BEP_{\text{Rp}}$)**:
   $$BEP_{\text{Rp}} = BEP_{\text{unit}} \times \text{sellingPricePerUnit}$$
10. **BEP Unit Harian ($BEP_{\text{harian}}$)**:
    $$BEP_{\text{harian}} = \left\lceil \frac{BEP_{\text{unit}}}{\text{operatingDaysPerMonth}} \right\rceil$$
11. **Estimasi Waktu Balik Modal ($PB$)**:
    $$PB = \begin{cases} \frac{\text{initialEquipmentCost}}{NP}, & \text{jika } NP > 0 \\ 0 \text{ (Tidak tercapai)}, & \text{jika } NP \le 0 \end{cases}$$

---

## 6. Desain Responsif & Breakpoint Pengujian

Antarmuka ditata menggunakan pendekatan *Mobile-First* dengan token Tailwind:
1. **Layar 360px (Ponsel Sangat Kecil / Entry-level)**:
   - Satu kolom penuh (*single column*).
   - Padding kontainer 16px (`px-4`).
   - Ukuran font tombol dan form minimal 16px agar tidak memicu auto-zoom browser iOS/Android.
2. **Layar 390px (Ponsel Standar Modern, misal iPhone 12/13/14)**:
   - Satu kolom dengan kartu yang proporsional.
   - Navigasi bawah (*bottom bar*) atau menu drawer yang mudah dijangkau satu jempol.
3. **Layar 768px (Tablet / iPad Portrait)**:
   - Grid 2 kolom untuk kartu peluang usaha.
   - Tata letak kalkulator: form asumsi di sebelah kiri, metrik ringkasan di sebelah kanan.
4. **Layar 1440px (Laptop & Desktop Lebar)**:
   - Grid 3 kolom dengan batas kontainer maksimal (`max-w-7xl mx-auto`).
   - Visualisasi BEP dan simulasi skenario tampil berdampingan tanpa bertumpuk.

---

## 7. Batas Keamanan & Arsitektur AI (Security Boundary)

Meskipun Gemini API akan diaktifkan pada fase berikutnya, arsitekturnya disiapkan sejak awal:
- **Aturan Mutlak**: Kunci API `GEMINI_API_KEY` tidak boleh memiliki awalan `NEXT_PUBLIC_`.
- Klien browser hanya memanggil API internal Next.js: `POST /api/ai/analyze`.
- Server Next.js membaca `process.env.GEMINI_API_KEY`, memvalidasi payload request, dan memanggil layanan AI.
- Jika API key tidak ada, endpoint server mengembalikan respons *graceful fallback* berbasis template analisis lokal tanpa menimbulkan error aplikasi (*crash*).
