# Dokumen Spesifikasi Kebutuhan (Requirements Specification)
## Proyek: Usaha Qita — by MAXI Team
**Status**: DRAFT (Menunggu Persetujuan Mentor/Pengguna)  
**Versi**: 1.0.0  
**Tanggal**: 15 Oktober 2026  

---

## 1. Pendahuluan & Latar Belakang

Banyak calon wirausahawan pemula dan pelaku UMKM di Indonesia memiliki semangat memulai usaha, namun terbentur pada:
1. Bingung memilih ide usaha yang realistis sesuai modal dan keterampilan.
2. Kesulitan menghitung kelayakan finansial (sering kali mencampuradukkan omzet kotor dengan laba bersih atau tidak memahami titik impas / BEP).
3. Tidak memiliki peta jalan (roadmap) langkah konkret dari hari pertama hingga pembukaan usaha.
4. Kurangnya pemahaman mengenai peran pendampingan perbankan formal seperti Mantri BRI.

**Usaha Qita — by MAXI Team** hadir sebagai konsep asisten perencanaan usaha digital yang mendidik, mudah digunakan, dan objektif.

---

## 2. Aktor & Persona Pengguna

### Aktor 1: Wirausahawan Pemula (Budi, 24 Tahun)
- **Karakteristik**: Baru lulus atau sedang mencari penghasilan tambahan, modal terbatas (Rp 2 juta - Rp 10 juta), belum pernah berbisnis.
- **Kebutuhan**: Rekomendasi usaha berisiko rendah, bimbingan langkah demi langkah, dan perhitungan finansial yang sederhana tanpa rumus rumit.

### Aktor 2: Pelaku Usaha Naik Kelas (Siti, 35 Tahun)
- **Karakteristik**: Sudah memiliki warung kelontong atau usaha kuliner rumahan, ingin memperluas cabang atau mencoba produk baru, modal Rp 10 juta - Rp 50 juta.
- **Kebutuhan**: Analisis simulasi biaya tetap vs variabel, perhitungan BEP saat menambah sewa tempat, dan informasi edukasi konsultasi pembiayaan mikro.

### Aktor 3: Penilai / Mentor / Penguji Aplikasi
- **Karakteristik**: Ingin melihat kelayakan purwarupa, integritas arsitektur, kepatuhan etika produk, dan kemudahan penggunaan aplikasi.

---

## 3. Batasan Produk & Disclaimer Resmi (Scope Boundaries)

1. **Bukan Layanan Resmi Bank BRI**:
   - Produk ini adalah **konsep purwarupa asisten perencanaan usaha digital**.
   - Aplikasi tidak mengklaim sebagai platform resmi PT Bank Rakyat Indonesia (Persero) Tbk.
2. **Tidak Ada Akses Data Rahasia**:
   - Tidak terhubung ke core banking, sistem SLIK/OJK, atau database internal BRI.
3. **Bukan Persetujuan Pinjaman**:
   - Tidak menjanjikan atau memberikan persetujuan pinjaman KUR, Kupedes, atau kredit perbankan lainnya.
4. **Data Simulasi Bertanda Jelas**:
   - Semua data peluang pasar, margin rata-rata, dan proyeksi omzet adalah **simulasi edukasi**. Dilarang menampilkan data simulasi seolah-olah sebagai data riset BPS aktual tanpa label simulasi.
5. **Konsultasi Mantri Transparan**:
   - Rujukan ke Mantri BRI hanya bersifat pengantar informasi edukatif dan berbasis persetujuan eksplisit (*opt-in*).

---

## 4. Kebutuhan Fungsional (Functional Requirements)

| ID | Modul / Fitur | Deskripsi Kebutuhan | Prioritas MVP |
| :--- | :--- | :--- | :--- |
| **REQ-001** | Landing Page & Edukasi | Menampilkan halaman pembuka yang menarik, ringkasan manfaat aplikasi, alur 3 langkah perencanaan (Profil -> Analisis -> Eksekusi), dan disclaimer produk yang jelas. | P0 (Wajib) |
| **REQ-002** | Form Profil & Onboarding | Menyediakan formulir interaktif untuk menginput: (1) Tujuan usaha (baru/ekspansi), (2) Lokasi (Kota/Kabupaten), (3) Kategori minat (Kuliner, Jasa, Ritel/Toko, Agribisnis/Kreatif), (4) Rentang modal yang dimiliki, (5) Pengalaman usaha, dan (6) Preferensi waktu kerja (penuh waktu / sampingan). | P0 (Wajib) |
| **REQ-003** | Rekomendasi Peluang Usaha | Menyajikan daftar kartu peluang usaha yang cocok berdasarkan input profil pengguna. Setiap kartu menampilkan nama usaha, kategori, kebutuhan modal minimum, estimasi margin keuntungan, alasan rekomendasi, serta risiko utama. | P0 (Wajib) |
| **REQ-004** | Detail Usaha & Asumsi Kustom | Menampilkan halaman atau modal rincian usaha terpilih di mana pengguna dapat menyesuaikan asumsi: harga jual produk, estimasi jumlah transaksi per hari, hari kerja sebulan, biaya sewa tempat, biaya bahan baku, gaji pegawai, dan biaya utilitas. | P0 (Wajib) |
| **REQ-005** | Kalkulator Finansial Deterministik | Menghitung secara seketika (*real-time*) dan murni (*pure mathematical functions*): (a) Proyeksi Omzet Bulanan, (b) Total Biaya Tetap, (c) Total Biaya Variabel, (d) Estimasi Laba Bersih, (e) Margin Laba (%), (f) Titik Impas (BEP) dalam Rupiah, (g) BEP dalam unit produk, dan (h) Estimasi Waktu Balik Modal (Payback Period). | P0 (Wajib) |
| **REQ-006** | Analisis Skenario Finansial | Menyediakan perbandingan cepat tiga skenario keuangan: Konservatif (penjualan -30%), Moderat (target normal), dan Agresif (penjualan +30%) agar pengguna siap menghadapi fluktuasi pasar. | P0 (Wajib) |
| **REQ-007** | Roadmap Memulai Usaha | Menyajikan alur waktu terstruktur dalam 4 fase: (1) Riset & Legalitas Dasar, (2) Persiapan Modal & Alat, (3) Operasional & Promosi Peluncuran, (4) Evaluasi 30 Hari Pertama. Dilengkapi fitur centang (*checklist*) interaktif. | P0 (Wajib) |
| **REQ-008** | Alur Konsultasi Mantri BRI Edukatif | Menyediakan kartu informasi mengenai peran Mantri BRI sebagai pendamping wirausaha di unit kerja fisik. Menyediakan formulir minat konsultasi dengan persetujuan eksplisit (*checkbox consent*) dan penegasan bahwa ini bukan permohonan pinjaman kredit. | P0 (Wajib) |
| **REQ-009** | Penyimpanan Rencana Lokal | Menyimpan preferensi profil, pilihan usaha, kustomisasi angka asumsi, dan progres checklist di penyimpanan browser (*browser LocalStorage*) sehingga tidak hilang saat halaman disegarkan (*refresh*). | P0 (Wajib) |
| **REQ-010** | UI Responsif Multi-Perangkat | Tata letak antarmuka harus tampil proporsional, nyaman dibaca, dan tanpa kesalahan horizontal scroll pada 4 ukuran layar uji: Ponsel kecil (360px), Ponsel modern (390px), Tablet (768px), dan Desktop (1440px). | P0 (Wajib) |
| **REQ-011** | Manajemen Status UI Komprehensif | Menyediakan tampilan visual yang jelas untuk: (a) Status memuat data (*loading spinner/skeleton*), (b) Status data kosong (*empty state*), (c) Status kesalahan (*error banner*), dan (d) Pesan validasi form yang edukatif. | P0 (Wajib) |
| **REQ-012** | Arsitektur Fondasi AI (Gemini Ready) | Merancang antarmuka layanan (service interface) dan API Route di sisi server untuk integrasi Gemini API pada fase lanjutan tanpa membocorkan kunci rahasia (*zero client-side secrets*). | P1 (Desain Arsitektur) |
| **REQ-013** | Aksesibilitas Dasar & Panduan Istilah | Memastikan rasio kontras teks memenuhi WCAG AA, tombol dapat diakses via keyboard (Tab/Enter), dan setiap istilah finansial (seperti BEP, HPP, Biaya Tetap) memiliki *tooltip* atau penjelasan bahasa awam. | P1 (Penting) |
| **REQ-014** | Pemisahan Mock Data Terstruktur | Penyusunan dataset mock peluang usaha lokal Indonesia yang kaya dan terstruktur, dengan arsitektur service yang siap diganti API nyata di masa depan. | P0 (Wajib) |
| **REQ-015** | Dukungan Multi-Bahasa (ID & EN) | Menyediakan fitur peralihan bahasa antara Bahasa Indonesia dan English (US) pada seluruh navigasi, formulir, kalkulator, dan konten edukasi dengan status bahasa yang persisten di browser. | P0 (Wajib) |
| **REQ-016** | Integrasi Asisten Cerdas Gemini API & Analisis Prediktif | Mengintegrasikan Google Gemini API di server Next.js (/api/ai) untuk menghasilkan ringkasan eksekutif, potensi pertumbuhan, mitigasi risiko usaha, dan rekomendasi langkah aksi secara dwibahasa (ID/EN) dengan mekanisme graceful fallback offline tanpa membocorkan API key. | P0 (Fitur AI) |
| **REQ-017** | Input Lokasi Spesifik & Karakteristik Area | Memperluas formulir onboarding untuk mengumpulkan area/kecamatan spesifik serta karakteristik lingkungan usaha (Kampus, Perkantoran, Perumahan, Pasar, Pinggir Jalan Utama) untuk analisis lokalitas yang presisi. | P0 (Wajib) |
| **REQ-018** | Basis Data Riset Pasar Multidimensi 5 Sumber | Menyediakan dataset analisis tren yang terstruktur pada setiap peluang usaha dari 5 pilar riset: (1) Tren Media Sosial viral, (2) Kepadatan kompetitor Google Places, (3) Berita ekonomi lokal, (4) Google Trends search momentum, dan (5) Data konsumsi Badan Pusat Statistik (BPS). | P0 (Wajib) |
| **REQ-019** | Visualisasi Sumber Riset pada Kartu Rekomendasi | Menampilkan panel interaktif "Dasar Analisis & Sumber Pasar" pada setiap kartu peluang usaha di halaman rekomendasi, sehingga pengguna mengetahui dasar data rekomendasi secara transparan dan berdasar. | P0 (Wajib) |
| **REQ-020** | Sintesis Riset Kontekstual AI Gemini | Menghubungkan Google Gemini AI untuk mensintesis sinyal pasar lokal yang kontekstual secara live sesuai kota dan area spesifik yang diinputkan pengguna. | P1 (Fitur AI) |
| **REQ-021** | Portal Login & Autentikasi Mantri BRI | Menyediakan antarmuka login resmi bagi Mantri BRI dengan kredensial Personal Number/NIP, Unit Kerja BRI, dan PIN Keamanan, lengkap dengan Quick Demo Login shortcut dan pelindung sesi (session guard). | P0 (Wajib Mantri) |
| **REQ-022** | Dashboard Monitoring Pipeline Prospek Mantri | Menyediakan dashboard monitoring terpusat untuk memantau calon debitur mikro yang masuk, metrik KPI (Total Masuk, Layak, Butuh Survei, Potensi KUR), filter pipeline status, dan pencarian wilayah. | P0 (Wajib Mantri) |
| **REQ-023** | Dossier Evaluasi Prospek & Asesmen Kredit Mikro | Menampilkan dossier lengkap profil calon pengusaha, lokasi spesifik, 5 sumber riset pasar, kalkulator kemampuan angsuran KUR (DSCR/Debt Service Coverage Ratio), catatan survei lapangan, dan tombol aksi direct WhatsApp. | P0 (Wajib Mantri) |
| **REQ-024** | Progressive Auth & Sinkronisasi Dua Arah Antar Sisi | Mengimplementasikan progressive auth pada sisi calon pengusaha (verifikasi nama & WhatsApp saat pengiriman pengajuan) yang langsung tersinkronisasi secara real-time ke antrean dashboard Mantri di browser. | P0 (Wajib Integrasi) |

---

## 5. Kebutuhan Non-Fungsional (Non-Functional Requirements)

- **NFR-001 (Performa)**: Halaman aplikasi harus memuat secara interaktif dalam waktu < 2 detik pada koneksi internet rata-rata, dengan *bundle size* yang efisien.
- **NFR-002 (Keamanan & Privasi)**: Tidak ada rahasia atau API key yang dimasukkan ke dalam kode frontend atau repository Git. Data pengguna di MVP tersimpan secara privat di browser masing-masing pengguna.
- **NFR-003 (Kualitas Kode)**: Ditulis menggunakan TypeScript dengan `strict: true`. Tidak boleh ada `any` tanpa alasan kuat, serta struktur komponen modular.
- **NFR-004 (Akurasi Matematika)**: Fungsi perhitungan keuangan wajib deterministik, bebas bug pembulatan desimal, dan memiliki unit test mandiri.
- **NFR-005 (Etika & Kepatuhan)**: Setiap layar yang menampilkan proyeksi finansial atau rujukan konsultasi wajib memuat catatan kaki (*disclaimer*) edukasi.

---

## 6. Skenario Pengguna (User Journeys)

### Skenario A: Perjalanan Pemula Menemukan Usaha
1. Pengguna membuka Landing Page Usaha Qita, membaca penjelasan, dan menekan tombol **"Mulai Rencanakan Usaha"**.
2. Pengguna mengisi formulir profil: Modal Rp 5.000.000, Lokasi Bandung, Minat Kuliner, Pengalaman Pemula, Waktu Penuh Waktu.
3. Sistem menampilkan 3 rekomendasi peluang usaha yang cocok (misalnya: *Kedai Kopi Susu Gerobak*, *Booth Camilan Tahu Crispy*, *Frozen Food Rumahan*) dengan label data simulasi yang jelas.
4. Pengguna memilih *Booth Camilan Tahu Crispy* dan menekan tombol **"Analisis Usaha Ini"**.
5. Sistem membuka layar kalkulator keuangan dengan nilai awal yang realistis.
6. Pengguna mengubah target porsi terjual dari 40 porsi menjadi 60 porsi per hari.
7. Sistem langsung memperbarui estimasi laba bersih bulanan dan menampilkan bahwa BEP tercapai pada penjualan 22 porsi per hari.
8. Pengguna berpindah ke tab **"Roadmap Usaha"** dan mencentang tugas-tugas persiapan minggu pertama.
9. Pengguna membaca bagian edukasi Mantri BRI dan memahami dokumen apa yang lazim disiapkan jika kelak usahanya memerlukan bimbingan perbankan fisik.
