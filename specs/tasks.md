# Rencana Kerja & Daftar Tugas (Task List)
## Proyek: Usaha Qita — powered by BRI
**Status Keseluruhan**: Seluruh Alur Utama MVP Selesai & Terverifikasi  
**Versi**: 1.2.0  
**Tanggal Pembaruan**: 15 Oktober 2026  

---

## Ringkasan Pelacakan Tugas

Setiap tugas (*task*) di bawah ini terhubung langsung ke **Requirement ID (REQ-xxx)** dan memiliki status pengerjaan yang jelas:
- `[TODO]`: Belum dimulai.
- `[IN_PROGRESS]`: Sedang dikerjakan.
- `[DONE]`: Selesai dan terverifikasi secara nyata melalui lint, typecheck, unit test, dan production build.

---

## Fase 1: Spesifikasi & Fondasi Proyek (Project Baseline)

| Task ID | Terkait REQ | Nama Tugas & Deskripsi | Dependensi | Status |
| :--- | :--- | :--- | :--- | :--- |
| **TASK-001** | REQ-001 s/d REQ-014 | **Pembuatan Dokumen Spesifikasi SDD**<br>Menyusun `AGENTS.md`, `specs/requirements.md`, `specs/design.md`, `specs/tasks.md`, dan `specs/acceptance-criteria.md`. | - | **DONE** |
| **TASK-002** | NFR-002, NFR-003 | **Inisialisasi Proyek Next.js + Tailwind + TypeScript**<br>Membuat kerangka Next.js (App Router), konfigurasi Tailwind CSS, TypeScript strict mode, dan file `.env.example`. | TASK-001 | **DONE** |
| **TASK-003** | REQ-014, NFR-003 | **Penyusunan Tipe Data TypeScript (Domain Types)**<br>Membuat file `types/business.ts`, `types/finance.ts`, dan `types/user.ts` sesuai kontrak di `specs/design.md`. | TASK-002 | **DONE** |
| **TASK-004** | REQ-014 | **Penyusunan Dataset Mock Peluang Usaha Lokal Indonesia**<br>Membuat `data/opportunities.ts` berisi 6 ragam usaha realistis (kuliner, ritel, jasa, agribisnis) berlabel data simulasi edukasi. | TASK-003 | **DONE** |

---

## Fase 2: Mesin Logika Bisnis & Kalkulasi Finansial (Core Engine)

| Task ID | Terkait REQ | Nama Tugas & Deskripsi | Dependensi | Status |
| :--- | :--- | :--- | :--- | :--- |
| **TASK-005** | REQ-005, NFR-004 | **Implementasi Mesin Finansial Deterministik**<br>Membuat `core/finance/calculator.ts` yang berisi rumus murni omzet, biaya tetap, biaya variabel, laba bersih, margin, BEP unit/rupiah, dan estimasi waktu balik modal. | TASK-003 | **DONE** |
| **TASK-006** | REQ-005, NFR-004 | **Unit Test untuk Kalkulator Finansial**<br>Membuat skenario pengujian unit (`calculator.test.ts`) untuk memastikan akurasi perhitungan matematis pada kondisi normal, impas, dan merugi (4 passed). | TASK-005 | **DONE** |
| **TASK-007** | REQ-003 | **Implementasi Logika Penyaringan Peluang (Matcher Engine)**<br>Membuat `core/matching/matcher.ts` & `matcher.test.ts` untuk memfilter dan mengurutkan peluang usaha sesuai batas modal dan kategori profil pengguna (3 passed). | TASK-004 | **DONE** |
| **TASK-008** | REQ-009 | **Implementasi Layanan Penyimpanan Lokal (Local Storage Service)**<br>Membuat `services/storageService.ts` untuk menyimpan dan memuat profil pengguna, asumsi finansial kustom, dan progres roadmap di browser secara aman. | TASK-003 | **DONE** |

---

## Fase 3: Komponen Antarmuka & Desain Sistem (UI Primitives)

| Task ID | Terkait REQ | Nama Tugas & Deskripsi | Dependensi | Status |
| :--- | :--- | :--- | :--- | :--- |
| **TASK-009** | REQ-001, REQ-010 | **Layout Dasar, Navigasi, Footer & Disclaimer Banner**<br>Membangun `layout.tsx`, `Navbar` responsif dengan drawer mobile, `Footer`, dan banner kepatuhan bahwa aplikasi adalah konsep purwarupa edukasi. | TASK-002 | **DONE** |
| **TASK-010** | REQ-011, REQ-013 | **Komponen UI Primitif yang Ramah & Aksesibel**<br>Membuat tombol (`Button`), kartu (`Card`), input Rupiah (`CurrencyInput`), slider (`RangeSlider`), dan penanda transparansi (`SimulationBadge`). | TASK-002 | **DONE** |
| **TASK-011** | REQ-011 | **Komponen Umpan Balik (Feedback Components)**<br>Membuat `LoadingSkeleton`, `EmptyState`, dan pesan validasi `ErrorAlert`. | TASK-010 | **DONE** |

---

## Fase 4: Alur Pengguna Utama (Core User Flows)

| Task ID | Terkait REQ | Nama Tugas & Deskripsi | Dependensi | Status |
| :--- | :--- | :--- | :--- | :--- |
| **TASK-012** | REQ-001 | **Halaman Beranda & Pengantar (Landing Page)**<br>Membuat `src/app/page.tsx` dengan Hero Section, penjelasan 3 langkah perencanaan, kartu ringkasan dashboard bagi pengguna yang telah menyimpan profil, dan CTA. | TASK-009, TASK-010 | **DONE** |
| **TASK-013** | REQ-002 | **Halaman Formulir Profil & Onboarding Usaha**<br>Membuat `src/app/onboarding/page.tsx` berisi wizard 3 langkah: (1) Tujuan & Lokasi, (2) Kategori Minat, (3) Modal & Pengalaman, dilengkapi validasi interaktif. | TASK-008, TASK-010 | **DONE** |
| **TASK-014** | REQ-003, REQ-014 | **Halaman Rekomendasi Peluang Usaha**<br>Membuat `src/app/rekomendasi/page.tsx` yang menampilkan kartu hasil matching engine, filter pencarian teks, toggle batas modal, dan modal ringkasan. | TASK-007, TASK-010 | **DONE** |
| **TASK-015** | REQ-004, REQ-005 | **Halaman Kalkulator Analisis Finansial & Asumsi Lengkap**<br>Membuat `src/app/analisis/page.tsx` dengan slider interaktif untuk simulasi kustomisasi harga, volume, sewa, gaji, dan HPP seketika. | TASK-005, TASK-008 | **DONE** |
| **TASK-016** | REQ-005, REQ-006 | **Komponen Visualisasi Hasil Metrik & Skenario Finansial Lengkap**<br>Menampilkan kartu perbandingan skenario Konservatif (-30%), Moderat, dan Agresif (+30%) di `src/components/analisis/ScenarioComparison.tsx`. | TASK-015 | **DONE** |
| **TASK-017** | REQ-007, REQ-009 | **Halaman Roadmap Usaha dengan Checklist Interaktif**<br>Membuat `src/app/roadmap/page.tsx` dengan 4 fase persiapan usaha dan checklist interaktif yang statusnya tersimpan di browser. | TASK-008, TASK-010 | **DONE** |

---

## Fase 5: Alur Edukasi Mantri BRI & Batas Keamanan Server

| Task ID | Terkait REQ | Nama Tugas & Deskripsi | Dependensi | Status |
| :--- | :--- | :--- | :--- | :--- |
| **TASK-018** | REQ-008 | **Halaman Edukasi & Alur Konsultasi Mantri BRI**<br>Membuat `src/app/mantri/page.tsx` berisi panduan peran Mantri, formulir minat konsultasi, checkbox persetujuan (*consent*), dan penegasan bukan persetujuan pinjaman. | TASK-009, TASK-010 | **DONE** |
| **TASK-019** | REQ-012, NFR-002 | **Arsitektur Batas Server AI (Proxy Route Handler)**<br>Membuat `src/app/api/ai/route.ts` dan antarmuka `services/aiService.ts` untuk mempersiapkan integrasi aman Gemini API pada fase lanjutan tanpa membocorkan kunci rahasia. | TASK-002 | **DONE** |

---

## Fase 6: Pengujian Responsif, Dokumentasi & Penutupan MVP

| Task ID | Terkait REQ | Nama Tugas & Deskripsi | Dependensi | Status |
| :--- | :--- | :--- | :--- | :--- |
| **TASK-020** | REQ-010 | **Pengujian Tata Letak Responsif Komprehensif**<br>Memastikan seluruh halaman rapi dan fungsional di resolusi 360px, 390px, 768px, dan 1440px tanpa overflow horizontal. | TASK-012 s/d TASK-018 | **DONE** |
| **TASK-021** | REQ-011, REQ-013 | **Audit Aksesibilitas (A11y) & Panduan Istilah Finansial**<br>Memeriksa kontras warna, atribut label formulir, serta penjelasan ramah pemula untuk istilah finansial (HPP, BEP, Biaya Tetap). | TASK-020 | **DONE** |
| **TASK-022** | NFR-001, NFR-003 | **Dokumentasi Panduan Setup Lokal & Lingkungan WSL**<br>Membuat `README.md` ramah pemula yang menjelaskan cara menjalankan aplikasi di terminal WSL Ubuntu langkah-demi-langkah. | TASK-001 s/d TASK-021 | **DONE** |