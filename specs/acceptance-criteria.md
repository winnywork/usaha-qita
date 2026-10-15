# Kriteria Penerimaan (Acceptance Criteria)
## Proyek: Usaha Qita — powered by BRI
**Status**: DRAFT (Menunggu Persetujuan Mentor/Pengguna)  
**Versi**: 1.0.0  
**Tanggal**: 15 Oktober 2026  

---

## 1. Pendahuluan

Dokumen ini mendefinisikan kriteria kelayakan pengujian untuk setiap kebutuhan sistem yang tercantum di `specs/requirements.md`. Setiap kriteria menggunakan format **Given (Kondisi Awal) - When (Tindakan Pengguna) - Then (Hasil yang Diharapkan)** agar mudah diverifikasi secara manual maupun otomatis oleh pengembang pemula.

---

## 2. Kriteria Penerimaan Berdasarkan Kebutuhan

### AC-001: Landing Page & Disclaimer Kepatuhan
- **Terkait**: REQ-001, NFR-005
- **Skenario 1 (Pesan Nilai & Alur Perencanaan)**:
  - **Given**: Pengguna membuka halaman utama `/`.
  - **When**: Halaman selesai dimuat.
  - **Then**: Tampil judul produk "Usaha Qita — powered by BRI", penjelasan nilai manfaat, 3 langkah alur perencanaan (Profil -> Analisis -> Eksekusi), dan tombol CTA "Mulai Rencanakan Usaha".
- **Skenario 2 (Transparansi & Disclaimer Hukum)**:
  - **Given**: Pengguna melihat bagian bawah (footer) dan banner informasi.
  - **When**: Pengguna memeriksa teks catatan resmi.
  - **Then**: Tertera secara eksplisit bahwa aplikasi adalah konsep purwarupa literasi usaha, bukan representasi resmi Bank BRI, dan tidak memberikan jaminan persetujuan pinjaman.

---

### AC-002: Formulir Profil & Validasi Onboarding
- **Terkait**: REQ-002, REQ-009
- **Skenario 1 (Input Lengkap & Sukses)**:
  - **Given**: Pengguna berada di `/onboarding`.
  - **When**: Pengguna memilih kota "Bandung", kategori "Kuliner", modal "Rp 10.000.000", pengalaman "Pemula", waktu "Penuh Waktu", lalu menekan "Lihat Peluang Usaha".
  - **Then**: Sistem memvalidasi input tanpa error, menyimpan profil ke `localStorage`, dan mengarahkan pengguna ke halaman `/rekomendasi`.
- **Skenario 2 (Validasi Form Kosong / Modal Nol)**:
  - **Given**: Pengguna berada di `/onboarding`.
  - **When**: Pengguna belum memilih kategori dan memasukkan modal Rp 0, lalu menekan tombol submit.
  - **Then**: Tampil pesan peringatan yang ramah dan mendidik bahwa kategori dan modal minimal wajib ditentukan, dan form tidak berpindah halaman.

---

### AC-003: Rekomendasi Peluang Usaha & Label Simulasi
- **Terkait**: REQ-003, REQ-014
- **Skenario 1 (Pencocokan Sesuai Modal)**:
  - **Given**: Pengguna memiliki modal Rp 5.000.000 dan minat kategori "Kuliner".
  - **When**: Pengguna masuk ke `/rekomendasi`.
  - **Then**: Sistem menampilkan kartu peluang usaha yang rentang modalnya sesuai (misal: gerobak kuliner / camilan modal 3 - 6 juta) dan tidak menampilkan usaha dengan kebutuhan modal Rp 50 juta.
- **Skenario 2 (Label Transparansi Data Simulasi)**:
  - **Given**: Setiap kartu peluang usaha ditampilkan di layar.
  - **When**: Pengguna melihat rincian kartu.
  - **Then**: Terdapat label atau badge visual yang jelas bertuliskan "Data Simulasi Edukasi", beserta penjelasan alasan kecocokan dan risiko utama.

---

### AC-004: Penyesuaian Parameter Asumsi Finansial
- **Terkait**: REQ-004, REQ-005
- **Skenario 1 (Interaktivitas Slider / Input Nilai)**:
  - **Given**: Pengguna membuka halaman `/analisis` untuk salah satu usaha terpilih.
  - **When**: Pengguna menggeser slider harga jual produk dari Rp 15.000 menjadi Rp 18.000.
  - **Then**: Nilai proyeksi omzet bulanan, laba bersih, dan titik impas BEP langsung diperbarui seketika tanpa perlu memuat ulang halaman (*zero page reload*).
- **Skenario 2 (Penyimpanan Asumsi Pengguna)**:
  - **Given**: Pengguna telah mengubah angka biaya sewa dan target penjualan harian.
  - **When**: Pengguna menyegarkan halaman browser (*refresh*).
  - **Then**: Nilai-nilai asumsi yang baru diubah tetap tersimpan dan tidak kembali ke nilai awal bawaan.

---

### AC-005: Akurasi Perhitungan Finansial Deterministik
- **Terkait**: REQ-005, NFR-004
- **Skenario 1 (Perhitungan Kasus Baku)**:
  - **Given**: Data asumsi sebagai berikut:
    - Harga Jual = Rp 15.000
    - HPP per Unit = Rp 9.000 (Margin Kontribusi = Rp 6.000)
    - Target Penjualan = 40 unit/hari
    - Hari Kerja = 25 hari/bulan
    - Biaya Tetap = Rp 3.000.000/bulan (Sewa 1.5jt + Listrik 500rb + Lainnya 1jt)
    - Modal Awal Alat = Rp 6.000.000
  - **When**: Fungsi kalkulator dijalankan.
  - **Then**:
    - Omzet Bulanan = 40 * 15.000 * 25 = **Rp 15.000.000**
    - Biaya Variabel = 40 * 9.000 * 25 = **Rp 9.000.000**
    - Total Biaya = 3.000.000 + 9.000.000 = **Rp 12.000.000**
    - Laba Bersih = 15.000.000 - 12.000.000 = **Rp 3.000.000**
    - Margin Laba = (3.000.000 / 15.000.000) * 100 = **20%**
    - BEP Unit Bulanan = 3.000.000 / 6.000 = **500 unit**
    - BEP Unit Harian = ceil(500 / 25) = **20 unit/hari**
    - BEP Rupiah Bulanan = 500 * 15.000 = **Rp 7.500.000**
    - Estimasi Balik Modal = 6.000.000 / 3.000.000 = **2 bulan**
- **Skenario 2 (Penanganan Kondisi Rugi / Margin Negatif)**:
  - **Given**: HPP per Unit lebih besar dari Harga Jual (misal HPP 20.000, Harga 15.000).
  - **When**: Kalkulator dijalankan.
  - **Then**: Sistem menampilkan status rugi secara jelas, BEP dinyatakan tidak dapat tercapai pada struktur harga tersebut, dan memberikan tips edukasi untuk menaikkan harga atau menekan biaya bahan.

---

### AC-006: Komparasi Tiga Skenario Pasar
- **Terkait**: REQ-006
- **Skenario 1 (Peralihan Skenario Pasar)**:
  - **Given**: Pengguna berada di tab Analisis Skenario.
  - **When**: Pengguna menekan tombol "Skenario Konservatif (Lesu)".
  - **Then**: Tampilan metrik mengkalkulasi volume penjualan -30% dan menunjukkan apakah usaha masih menghasilkan laba di atas BEP atau mulai merugi.

---

### AC-007: Interaktivitas & Ketahanan Progres Roadmap
- **Terkait**: REQ-007, REQ-009
- **Skenario 1 (Mencoret Tugas yang Selesai)**:
  - **Given**: Pengguna membuka halaman `/roadmap`.
  - **When**: Pengguna mencentang tugas "Membuat daftar peralatan utama".
  - **Then**: Persentase progres bertambah, status tugas tercoret, dan status tetap tersimpan saat pengguna kembali membuka halaman tersebut beberapa jam kemudian.

---

### AC-008: Edukasi & Alur Persetujuan Konsultasi Mantri BRI
- **Terkait**: REQ-008, NFR-005
- **Skenario 1 (Persetujuan Eksplisit / Consent Form)**:
  - **Given**: Pengguna berada di halaman `/mantri`.
  - **When**: Pengguna mengisi nama dan nomor kontak tanpa mencentang persetujuan konsultasi sukarela, lalu menekan "Kirim Minat".
  - **Then**: Tombol tetap nonaktif atau memunculkan pesan validasi bahwa persetujuan wajib dicentang secara sadar.
- **Skenario 2 (Penegasan Bukan Pinjaman)**:
  - **Given**: Pengguna mencentang persetujuan dan berhasil mengirim formulir.
  - **When**: Konfirmasi muncul di layar.
  - **Then**: Muncul pesan terima kasih yang menegaskan bahwa data ini hanya pengantar literasi konsultasi ke unit kerja BRI terdekat dan bukan persetujuan kredit perbankan.

---

### AC-009: Tata Letak Responsif di 4 Titik Uji Layar
- **Terkait**: REQ-010
- **Skenario 1 (Layar 360px & 390px - Mobile)**:
  - **Given**: Ukuran viewport diatur pada lebar 360px dan 390px.
  - **When**: Pengguna menjelajahi seluruh halaman aplikasi.
  - **Then**: Tidak ada elemen yang terpotong, tidak terjadi scroll horizontal yang tidak disengaja (*no accidental horizontal overflow*), dan ukuran tombol nyaman ditekan jari (minimal tinggi 44px).
- **Skenario 2 (Layar 768px & 1440px - Tablet & Desktop)**:
  - **Given**: Ukuran viewport diatur pada lebar 768px dan 1440px.
  - **When**: Pengguna membuka kalkulator analisis.
  - **Then**: Form asumsi dan kartu ringkasan metrik tampil berdampingan secara proporsional.

---

### AC-010: Penanganan Status UI (Loading, Empty, Error)
- **Terkait**: REQ-011
- **Skenario 1 (Empty State Rekomendasi)**:
  - **Given**: Pengguna memasukkan filter yang terlalu ketat (misal modal Rp 100.000).
  - **When**: Tidak ada data peluang usaha yang cocok.
  - **Then**: Tampil komponen *Empty State* yang ramah dengan tombol "Atur Ulang Filter Modal".
- **Skenario 2 (Loading State)**:
  - **Given**: Data sedang dimuat atau diproses.
  - **When**: Halaman sedang menyiapkan state.
  - **Then**: Tampil kerangka pemuatan (*skeleton loader*) yang elegan tanpa lompatan tata letak (*layout shift*).

---

### AC-011: Keamanan Rahasia & Batas Server AI
- **Terkait**: REQ-012, NFR-002
- **Skenario 1 (Inspeksi Kode Klien)**:
  - **Given**: Aplikasi dijalankan di browser.
  - **When**: Pengembang atau penguji memeriksa bundle JavaScript klien dan Network tab.
  - **Then**: Tidak ditemukan string API key atau variabel rahasia. Semua panggilan AI (pada fase lanjutan) melalui API Route server Next.js.

---

### AC-012: Aksesibilitas & Bantuan Istilah Finansial
- **Terkait**: REQ-013
- **Skenario 1 (Glosarium Sederhana)**:
  - **Given**: Pengguna melihat istilah "BEP (Break-Even Point)" atau "HPP".
  - **When**: Pengguna mengarahkan kursor atau mengetuk ikon informasi di samping istilah tersebut.
  - **Then**: Muncul penjelasan singkat dalam bahasa sehari-hari (contoh: *"BEP adalah titik impas, yaitu jumlah jualan yang harus dicapai agar usahamu tidak tekor dan mulai untung"*).

### AC-013: Pemilihan Bahasa (Bilingual Switcher ID/EN)
- **Terkait**: REQ-015
- **Skenario 1 (Peralihan ke Bahasa Inggris)**:
  - **Given**: Pengguna berada di halaman mana pun dengan bahasa bawaan Bahasa Indonesia.
  - **When**: Pengguna mengklik tombol pilihan bahasa dan memilih "English (US)".
  - **Then**: Teks menu navigasi, tombol CTA, formulir onboarding, dan kalkulator langsung berganti ke bahasa Inggris tanpa perlu reload halaman penuh, dan pilihan bahasa tersimpan di `localStorage`.
- **Skenario 2 (Ketahanan Bahasa Saat Refresh)**:
  - **Given**: Pengguna telah memilih bahasa Inggris.
  - **When**: Pengguna memuat ulang browser (*refresh*).
  - **Then**: Aplikasi tetap tampil dalam bahasa Inggris.

### AC-014: Penerapan Palet Warna Baru
- **Terkait**: REQ-010
- **Skenario 1 (Verifikasi Identitas Visual)**:
  - **Given**: Pengguna membuka halaman aplikasi.
  - **When**: Antarmuka ditampilkan.
  - **Then**: Tema visual berlatar belakang putih bersih/slate-50, tombol dan elemen utama menggunakan warna `#0857C3`, elemen interaktif/hover menggunakan `#307FE3`, dan aksen sorotan lembut menggunakan `#71C5E8`.