# Usaha Qita — by MAXI Team

> **Asisten Perencanaan Usaha Digital bagi Calon Wirausaha dan UMKM Indonesia**

---

## 📌 Pernyataan Etika & Transparansi Produk

* **Konsep Purwarupa Literasi**: Aplikasi ini adalah konsep purwarupa perencanaan usaha dan literasi finansial wirausaha, **bukan sistem atau layanan perbankan resmi dari PT Bank Rakyat Indonesia (Persero) Tbk**.
* **Tidak Ada Akses Data Rahasia**: Aplikasi tidak memiliki akses ke database internal BRI, sistem scoring perbankan, CIF nasabah, atau core banking.
* **Bukan Persetujuan Pinjaman**: Aplikasi tidak memberikan jaminan, janji, atau persetujuan pinjaman kredit perbankan dalam bentuk apa pun.
* **Data Simulasi Bertanda Jelas**: Seluruh data rekomendasi pasar, estimasi pendapatan, dan simulasi biaya adalah **model simulasi edukasi** dan wajib diberi label secara transparan kepada pengguna.

---

## 🚀 Fitur Fondasi yang Telah Tersedia (MVP)

1. **Beranda & Dashboard Interaktif**: Pengenalan nilai produk, 3 langkah perencanaan usaha, dan kartu progres aktif bagi pengguna yang telah menyimpan preferensi.
2. **Formulir Profiling & Onboarding**: Menginput tujuan (rintis baru vs ekspansi), lokasi kota, pemilihan kategori minat (kuliner, jasa, ritel, agribisnis, kreatif), kesiapan modal, tingkat pengalaman, dan alokasi waktu.
3. **Katalog Rekomendasi Peluang Usaha**: Pencocokan otomatis (*matching engine*) dengan skor kesesuaian profil, rentang modal, alasan rekomendasi, potensi risiko, dan label **Data Simulasi Edukasi**.
4. **Mesin Finansial Deterministik**: Modul matematika murni untuk perhitungan omzet kotor, biaya tetap, biaya variabel, laba bersih, margin persentase, Break-Even Point (BEP Unit & BEP Rupiah), dan estimasi balik modal (*payback period*).
5. **Penyimpanan Lokal Privat**: Preferensi tersimpan di `localStorage` browser tanpa memerlukan registrasi akun atau database server di fase awal.
6. **Desain Responsif**: Tampilan adaptif pada layar 360px (ponsel entry-level), 390px (smartphone modern), 768px (tablet), dan 1440px (desktop).
7. **Batas Keamanan Server AI**: Route handler `/api/ai` siap di sisi server untuk integrasi Gemini API pada fase lanjutan tanpa membocorkan rahasia ke browser klien.

---

## 💻 Panduan Menjalankan Aplikasi di Ubuntu WSL 2

Bagi pemula, berikut langkah-langkah menjalankan aplikasi di komputer Anda:

### 1. Buka Terminal WSL
Buka terminal Ubuntu WSL Anda dan masuk ke direktori proyek:
```bash
cd /home/winnyardhian/usaha-qita
```

### 2. Pastikan Node.js Aktif
Pastikan Node.js v24 aktif di lingkungan terminal:
```bash
export PATH="/home/winnyardhian/.nvm/versions/node/v24.21.0/bin:$PATH"
node -v
# Output diharapkan: v24.21.0
```

### 3. Menjalankan Server Pengembangan Lokal
Jalankan perintah berikut:
```bash
npm run dev
```
Setelah server menyala, buka browser Anda dan kunjungi:
👉 **`http://localhost:3000`**

---

## 🧪 Perintah Pengujian & Verifikasi Kualitas Kode

Di dalam folder proyek, Anda dapat menjalankan perintah verifikasi berikut kapan saja:

| Perintah | Deskripsi |
| :--- | :--- |
| `npm run test` | Menjalankan seluruh pengujian unit otomatis (*unit test*) menggunakan Vitest. |
| `npm run typecheck` | Memeriksa ketepatan tipe data TypeScript dengan mode ketat (*strict mode*). |
| `npm run lint` | Memeriksa kepatuhan kode dan memastikan tidak ada variabel yang terlantar. |
| `npm run build` | Melakukan kompilasi produksi dan optimasi bundle web. |

---

## 📂 Struktur Modul Proyek

```
usaha-qita/
├── AGENTS.md                  # Pedoman kerja AI & arsitektur proyek
├── specs/                     # Spesifikasi teknis (Single Source of Truth)
│   ├── requirements.md        # Kebutuhan sistem (REQ-xxx)
│   ├── design.md              # Arsitektur & model teknis
│   ├── tasks.md               # Pelacakan status pengerjaan (TASK-xxx)
│   └── acceptance-criteria.md # Kriteria penerimaan teruji (AC-xxx)
├── src/
│   ├── app/                   # Rute & Halaman Next.js (App Router)
│   │   ├── layout.tsx         # Layout dasar, navbar, footer & banner
│   │   ├── page.tsx           # Halaman utama (Landing & Dashboard awal)
│   │   ├── onboarding/        # Formulir profil usaha 3 langkah
│   │   ├── rekomendasi/       # Daftar kartu peluang usaha hasil pencocokan
│   │   └── api/ai/            # Boundary server route untuk integrasi AI aman
│   ├── components/            # Komponen antarmuka yang dapat digunakan ulang
│   │   ├── ui/                # Button, Card, Badge, CurrencyInput, SimulationBadge
│   │   ├── layout/            # Navbar, Footer, DisclaimerBanner
│   │   ├── feedback/          # LoadingSkeleton, EmptyState, ErrorAlert
│   │   └── rekomendasi/       # OpportunityCard
│   ├── core/                  # Logika Bisnis Murni (Bebas dari UI)
│   │   ├── finance/           # Mesin kalkulator finansial & BEP (deterministik)
│   │   └── matching/          # Mesin penyaring kecocokan profil peluang
│   ├── data/                  # Dataset mock peluang usaha lokal Indonesia
│   ├── services/              # Layanan penyimpanan lokal (localStorage) & AI
│   └── types/                 # Definisi tipe data TypeScript
└── README.md                  # Dokumentasi panduan setup dan proyek
```