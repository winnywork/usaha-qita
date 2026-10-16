import { BusinessOpportunity } from "@/types/business";

export const MOCK_OPPORTUNITIES: BusinessOpportunity[] = [
  {
    id: "opp-tahu-crispy",
    title: "Booth Camilan Tahu Crispy & Gorengan Modern",
    slug: "booth-tahu-crispy",
    category: "kuliner",
    shortDescription: "Jajanan gurih renyah favorit segala usia dengan perputaran modal harian yang sangat cepat.",
    fullDescription: "Usaha kuliner cemilan tahu krispi aneka bumbu tabur (balado, BBQ, keju, pedas manis). Model bisnis gerobak atau sewa teras minimarket dengan biaya sewa terjangkau dan margin bahan baku tinggi.",
    isSimulatedData: true,
    estimatedMinCapital: 4500000,
    estimatedMaxCapital: 7500000,
    minExperienceLevel: "pemula",
    difficultyLevel: "Mudah",
    suitabilityReason: "Sangat cocok untuk pemula dengan modal di bawah Rp 10 juta karena resep mudah dipelajari dan perputaran kas terjadi seketika setiap hari.",
    keyRisks: [
      "Kualitas kerenyahan menurun jika minyak goreng tidak dijaga suhunya.",
      "Fluktuasi harga bahan baku tahu mentah dan minyak goreng di pasar.",
      "Persaingan camilan sejenis di titik lokasi yang berdekatan.",
    ],
    keySuccessFactors: [
      "Lokasi strategis di dekat sekolah, kampus, atau minimarket yang ramai pejalan kaki.",
      "Minyak selalu bersih dan bumbu tabur memiliki rasa khas yang medok.",
      "Pelayanan cepat, kemasan higienis, dan promo bundling porsi hemat.",
    ],
    defaultAssumptions: {
      sellingPricePerUnit: 12000, // Harga 1 porsi kotak
      costOfGoodsPerUnit: 6000,  // Bahan tahu, minyak, tepung, bumbu, bungkusan
      dailySalesVolume: 45,      // Target 45 porsi per hari
      operatingDaysPerMonth: 26, // Buka Senin - Sabtu
      monthlyFixedCosts: {
        rent: 800000,            // Sewa teras minimarket
        salaries: 0,             // Dikelola mandiri di awal
        utilities: 250000,       // Gas LPG & listrik lampu
        otherMarketing: 150000,  // Banner & stiker kemasan
      },
      initialEquipmentCost: 5000000, // Gerobak booth, wajan deep fry, kompor mawar, tabung gas
    },
    marketIntelligence: {
      socialMediaTrend: {
        platform: "TikTok & Reels (Kuliner Viral)",
        trendScore: 88,
        hashtag: "#KulinerKriuk #JajananViral",
        summary: "Konten video 'ASMR kriuk' dan jajanan jalanan gurih mencatat kenaikan interaksi +55% views bulan ini di kalangan remaja dan keluarga muda.",
      },
      googlePlaces: {
        densityLevel: "Sedang",
        competitorRadiusKm: 0.8,
        footTrafficScore: "Sangat Tinggi",
        summary: "Data Google Maps menunjukkan permintaan tinggi di area teras minimarket dan gerbang perumahan, dengan jarak kompetitor sejenis rata-rata 800 meter.",
      },
      localNews: {
        headline: "Pemda Fasilitasi Sentra Kuliner Teras Usaha Mikro Berizin NIB",
        source: "Radar Bisnis Daerah",
        summary: "Pemerintah daerah memperluas izin pemanfaatan selasar strategis untuk UMKM camilan higienis guna menggerakkan ekonomi akar rumput.",
      },
      googleTrends: {
        searchVolumeIndex: 82,
        growthRatePercentage: 42,
        momentum: "Melesat Naik",
        summary: "Pencarian kata kunci 'camilan krispi terdekat' dan 'tahu crispy kekinian' stabil di kuadran atas pencarian kuliner cepat saji lokal.",
      },
      bpsStats: {
        metricName: "Porsi Belanja Makanan Jadi Rumah Tangga",
        metricValue: "44.7% dari total pengeluaran",
        relevance: "BPS mencatat porsi pengeluaran konsumsi makanan jadi/camilan masyarakat perkotaan terus mendominasi keranjang belanja harian.",
      },
    },
    roadmapTemplates: [
      {
        id: "step-1-1",
        phase: 1,
        phaseTitle: "Riset & Legalitas Dasar",
        title: "Survei titik sewa teras toko",
        description: "Datangi 2-3 minimarket terdekat untuk menanyakan ketersediaan dan biaya sewa teras (biasanya Rp 600.000 - Rp 1.000.000/bulan).",
      },
      {
        id: "step-1-2",
        phase: 1,
        phaseTitle: "Riset & Legalitas Dasar",
        title: "Daftar NIB usaha mikro via OSS",
        description: "Buat Nomor Induk Berusaha (NIB) gratis secara online melalui oss.go.id sebagai legalitas resmi usaha Anda.",
      },
      {
        id: "step-2-1",
        phase: 2,
        phaseTitle: "Persiapan Modal & Alat",
        title: "Beli kompor bertekanan & gerobak portable",
        description: "Beli peralatan inti: wajan cekung, kompor mawar gas, saringan stainless, peniris minyak, dan wadah bumbu tabur.",
      },
      {
        id: "step-3-1",
        phase: 3,
        phaseTitle: "Operasional & Promosi Peluncuran",
        title: "Promo 'Beli 2 Gratis 1' selama 3 hari pertama",
        description: "Gunakan promosi pembukaan untuk menarik perhatian orang yang lalu-lalang dan minta testimoni langsung dari pembeli pertama.",
      },
    ],
    tags: ["Kuliner", "Camilan", "Modal Terjangkau", "Cepat Balik Modal", "Pemula"],
  },
  {
    id: "opp-kopi-susu",
    title: "Kedai Minuman Kopi Susu & Teh Nusantara",
    slug: "kedai-kopi-susu",
    category: "kuliner",
    shortDescription: "Konsep grab-and-go minuman kopi susu gula aren dan teh racik segar dengan margin unit tinggi.",
    fullDescription: "Menjual minuman kopi susu kekinian, teh tarik, dan matcha latte dalam cup segel. Cocok dibuka di garasi rumah, kios kecil, atau gerobak estetik di kawasan perkantoran/kampus.",
    isSimulatedData: true,
    estimatedMinCapital: 7000000,
    estimatedMaxCapital: 12000000,
    minExperienceLevel: "pemula",
    difficultyLevel: "Menengah",
    suitabilityReason: "Tingginya permintaan konsumsi kopi harian pekerja dan mahasiswa dengan margin kotor mencapai 50-60% per gelas.",
    keyRisks: [
      "Persaingan merek kopi waralaba besar di sekitar lokasi.",
      "Kualitas rasa berubah jika takaran espresso atau sirup tidak konsisten.",
      "Es batu cepat mencair yang dapat menurunkan kenikmatan minuman jika dibawa pulang.",
    ],
    keySuccessFactors: [
      "Resep khas gula aren asli yang legit dan aroma kopi yang kuat.",
      "Packaging rapi dengan mesin cup sealer dan branding stiker yang menarik.",
      "Pilihan opsi harga ekonomis (Rp 10.000 - Rp 15.000 per cup).",
    ],
    defaultAssumptions: {
      sellingPricePerUnit: 14000,
      costOfGoodsPerUnit: 6000,
      dailySalesVolume: 50,
      operatingDaysPerMonth: 26,
      monthlyFixedCosts: {
        rent: 1200000,
        salaries: 0,
        utilities: 350000,
        otherMarketing: 200000,
      },
      initialEquipmentCost: 7500000,
    },
    marketIntelligence: {
      socialMediaTrend: {
        platform: "Instagram & TikTok Reels",
        trendScore: 92,
        hashtag: "#KopiSusuGulaAren #NongkrongHemat",
        summary: "Tren 'kopi nikmat ramah kantong' (Rp 10k-14k) viral di kalangan mahasiswa & Gen-Z dengan tagar #KopiLokal menembus jutaan impresi.",
      },
      googlePlaces: {
        densityLevel: "Tinggi",
        competitorRadiusKm: 0.5,
        footTrafficScore: "Sangat Tinggi",
        summary: "Analisis Google Places mencatat konsentrasi gerai kopi di jalan utama, namun ceruk besar terbuka di jalan penghubung pemukiman dan kawasan kos.",
      },
      localNews: {
        headline: "Pertumbuhan Kedai Kopi Lokal Topang 28% Sektor Kreatif Wilayah",
        source: "Koran Bisnis Regional",
        summary: "Asosiasi F&B mencatat kopi susu gula aren tetap menjadi minuman paling konsisten penjualannya di semua segmen demografi.",
      },
      googleTrends: {
        searchVolumeIndex: 94,
        growthRatePercentage: 68,
        momentum: "Stabil Tinggi",
        summary: "Volume pencarian 'kopi susu terdekat' menempati peringkat teratas kategori minuman dengan volume konversi pesan-antar konsisten.",
      },
      bpsStats: {
        metricName: "Rata-rata Konsumsi Kopi Nasional",
        metricValue: "Tumbuh 8.2% per tahun",
        relevance: "Data BPS menunjukkan lonjakan konsumsi kopi per kapita perkotaan yang bertransformasi dari sekadar tren menjadi gaya hidup rutin.",
      },
    },
    roadmapTemplates: [
      {
        id: "step-2-1-a",
        phase: 1,
        phaseTitle: "Riset & Legalitas Dasar",
        title: "Uji coba resep & blind taste test",
        description: "Lakukan tes rasa kepada 10 orang teman untuk menentukan takaran kopi, krimer, dan gula aren yang paling disukai.",
      },
      {
        id: "step-2-2-a",
        phase: 2,
        phaseTitle: "Persiapan Modal & Alat",
        title: "Beli cup sealer & grinder elektrik",
        description: "Investasikan pada mesin press cup manual/otomatis dan grinder agar kualitas biji kopi tetap terjaga segar.",
      },
      {
        id: "step-2-3-a",
        phase: 3,
        phaseTitle: "Operasional & Promosi Peluncuran",
        title: "Daftar merchant QRIS BRI & pembayaran digital",
        description: "Aktifkan QRIS untuk mempermudah transaksi cepat tanpa uang kembalian bagi pelanggan muda.",
      },
    ],
    tags: ["Minuman", "Kopi", "Gaya Hidup", "Margin Tinggi", "Tren"],
  },
  {
    id: "opp-laundry",
    title: "Laundry Kiloan Rumahan 'Bersih Wangi'",
    slug: "laundry-kiloan-rumahan",
    category: "jasa",
    shortDescription: "Jasa pencucian dan setrika pakaian harian untuk mahasiswa, pekerja sibuk, dan keluarga muda.",
    fullDescription: "Membuka layanan laundry kiloan dan satuan berbasis rumah dengan mesin cuci bukaan depan (*front loading*). Memberikan layanan antar-jemput lokal untuk meningkatkan loyalitas pelanggan.",
    isSimulatedData: true,
    estimatedMinCapital: 8500000,
    estimatedMaxCapital: 15000000,
    minExperienceLevel: "pemula",
    difficultyLevel: "Menengah",
    suitabilityReason: "Kebutuhan pokok berulang (langganan mingguan) dari kalangan pekerja komuter dan mahasiswa kos.",
    keyRisks: [
      "Risiko pakaian luntur, rusak, atau tertukar jika pencatatan tidak rapi.",
      "Ketergantungan pada cuaca saat musim hujan jika belum memiliki mesin pengering (*dryer*).",
      "Kenaikan tarif air bersih dan detergen ramah serat pakaian.",
    ],
    keySuccessFactors: [
      "Ketepatan waktu selesai (janji 1-2 hari selesai tanpa molor).",
      "Pewangi berkualitas tahan lama dan pakaian disetrika rapi tanpa lipatan kusut.",
      "Sistem nota digital atau WhatsApp untuk pemberitahuan cucian telah siap diambil.",
    ],
    defaultAssumptions: {
      sellingPricePerUnit: 8000, // Harga per Kg
      costOfGoodsPerUnit: 2500, // Detergen, softener, plastik, parfum
      dailySalesVolume: 40,     // 40 Kg cucian per hari
      operatingDaysPerMonth: 28,
      monthlyFixedCosts: {
        rent: 500000,           // Alokasi ruang rumah atau garasi
        salaries: 0,
        utilities: 600000,      // Air PDAM & listrik mesin
        otherMarketing: 100000,
      },
      initialEquipmentCost: 9000000, // 2 mesin cuci, 1 dryer gas, timbangan digital, setrika uap
    },
    marketIntelligence: {
      socialMediaTrend: {
        platform: "TikTok & Threads Warga Kos",
        trendScore: 75,
        hashtag: "#LifehackKos #LaundryKiloanBersih",
        summary: "Diskusi kebutuhan laundry kilat 1 hari dan wangi tahan lama ramai dibahas penghuni kos & keluarga muda pekerja komuter.",
      },
      googlePlaces: {
        densityLevel: "Rendah",
        competitorRadiusKm: 1.2,
        footTrafficScore: "Tinggi",
        summary: "Data Google Maps mendeteksi kekurangan jasa laundry express bersertifikat higienis di radius 1.2 km pada perumahan klaster baru.",
      },
      localNews: {
        headline: "Kebutuhan Jasa Rumah Tangga Melonjak Akibat Tingginya Jam Kerja Komuter",
        source: "Warta Kota Harian",
        summary: "Survei gaya hidup perkotaan mencatat 63% keluarga muda mengalokasikan anggaran rutin bulanan untuk jasa pencucian pakaian.",
      },
      googleTrends: {
        searchVolumeIndex: 78,
        growthRatePercentage: 35,
        momentum: "Tumbuh Konsisten",
        summary: "Pencarian 'laundry kiloan express terdekat' meningkat stabil setiap awal pekan dan saat musim hujan.",
      },
      bpsStats: {
        metricName: "Pertumbuhan Sektor Jasa Perorangan",
        metricValue: "Tumbuh 6.4% YoY",
        relevance: "BPS melaporkan sektor jasa perorangan dan rumah tangga menjadi salah satu kontributor ekonomi penyerap tenaga lokal paling stabil.",
      },
    },
    roadmapTemplates: [
      {
        id: "step-3-1-b",
        phase: 1,
        phaseTitle: "Riset & Legalitas Dasar",
        title: "Pemetaan area kos mahasiswa/karyawan",
        description: "Sebarkan brosur ke 5 titik indekos dalam radius 500 meter dengan penawaran gratis antar-jemput.",
      },
      {
        id: "step-3-2-b",
        phase: 2,
        phaseTitle: "Persiapan Modal & Alat",
        title: "Pasang filter air bersih dan tandon cadangan",
        description: "Pastikan kualitas air tidak keruh atau berkarat agar tidak merusak pakaian putih pelanggan.",
      },
    ],
    tags: ["Jasa", "Langganan Berulang", "Rumahan", "Kebutuhan Pokok"],
  },
  {
    id: "opp-cuci-motor",
    title: "Jasa Cuci Motor Salju & Semir Ban Kilap",
    slug: "jasa-cuci-motor-salju",
    category: "jasa",
    shortDescription: "Layanan cuci motor cepat dengan busa salju tebal dan semir ban di jalur lalu lintas padat.",
    fullDescription: "Usaha jasa pencucian sepeda motor menggunakan mesin steam bensin/listrik dan tabung salju. Menargetkan pengendara harian komuter yang mengutamakan kebersihan kendaraan tanpa repot mencuci sendiri.",
    isSimulatedData: true,
    estimatedMinCapital: 6000000,
    estimatedMaxCapital: 10000000,
    minExperienceLevel: "pemula",
    difficultyLevel: "Mudah",
    suitabilityReason: "Populasi sepeda motor yang sangat besar di Indonesia menjamin pasar pelanggan yang tidak pernah habis setiap hari.",
    keyRisks: [
      "Penurunan drastis omzet saat musim kemarau panjang tanpa hujan.",
      "Keluhan lecet bodi motor jika kain microfiber tidak dibersihkan dari pasir.",
      "Kelangkaan pasokan air tanah di musim kemarau.",
    ],
    keySuccessFactors: [
      "Pengerjaan bersih hingga ke celah velg dan kolong mesin.",
      "Waktu cuci efisien (maksimal 15-20 menit per motor).",
      "Ruang tunggu yang nyaman, teduh, dengan air mineral gratis atau TV kecil.",
    ],
    defaultAssumptions: {
      sellingPricePerUnit: 18000, // Tarif per motor standar
      costOfGoodsPerUnit: 4000,  // Shampoo salju, semir ban, air bersih
      dailySalesVolume: 25,      // 25 motor per hari
      operatingDaysPerMonth: 28,
      monthlyFixedCosts: {
        rent: 1000000,           // Sewa lahan pinggir jalan
        salaries: 0,
        utilities: 300000,       // Listrik pompa & bensin mesin steam
        otherMarketing: 100000,
      },
      initialEquipmentCost: 6500000, // Mesin steam air, tabung snow wash, kompresor angin, selang
    },
    marketIntelligence: {
      socialMediaTrend: {
        platform: "YouTube & Reels Otomotif",
        trendScore: 79,
        hashtag: "#CuciSaljuKilap #PerawatanMotor",
        summary: "Video cuci motor salju detailing dan bodi kilap mencuri perhatian jutaan penonton segmen pengendara motor harian.",
      },
      googlePlaces: {
        densityLevel: "Sedang",
        competitorRadiusKm: 1.0,
        footTrafficScore: "Tinggi",
        summary: "Data Google Places menunjukkan titik usaha cuci motor di jalur pulang kerja (sisi kiri jalan) memiliki antrean 3x lebih tinggi.",
      },
      localNews: {
        headline: "Populasi Kendaraan Roda Dua Terus Tumbuh Signifikan di Wilayah Aglomerasi",
        source: "Info Otomotif Regional",
        summary: "Kepadatan kendaraan bermotor roda dua menciptakan captive market yang tidak pernah sepi untuk jasa kebersihan kendaraan.",
      },
      googleTrends: {
        searchVolumeIndex: 76,
        growthRatePercentage: 29,
        momentum: "Stabil Tinggi",
        summary: "Lonjakan pencarian terjadi signifikan saat musim hujan dan menjelang akhir pekan ('cuci motor terdekat').",
      },
      bpsStats: {
        metricName: "Rasio Kendaraan Bermotor per Rumah Tangga",
        metricValue: "1.8 motor per kepala keluarga",
        relevance: "Data statistik BPS membuktikan motor adalah moda transportasi utama masyarakat, menjamin keberlanjutan pasar jasa perawatan.",
      },
    },
    roadmapTemplates: [
      {
        id: "step-4-1",
        phase: 1,
        phaseTitle: "Riset & Legalitas Dasar",
        title: "Pilih lahan dengan drainase air lancar",
        description: "Pastikan saluran pembuangan air limbah cucian tidak menggenang di depan tempat usaha atau mengganggu tetangga.",
      },
      {
        id: "step-4-2",
        phase: 2,
        phaseTitle: "Persiapan Modal & Alat",
        title: "Uji tekanan mesin steam dan tabung salju",
        description: "Pastikan nozzle semprotan air tidak terlalu tajam agar tidak merusak stiker bodi motor pelanggan.",
      },
    ],
    tags: ["Jasa", "Otomotif", "Pria", "Cash Flow Harian", "Mudah"],
  },
  {
    id: "opp-sembako",
    title: "Warung Sembako Modern & Agen Pembayaran Digital",
    slug: "warung-sembako-modern",
    category: "ritel",
    shortDescription: "Toko kebutuhan pangan pokok harian warga dengan integrasi pembayaran tagihan digital.",
    fullDescription: "Menjual sembako (beras, minyak, telur, gula, bumbu dapur) dilengkapi layanan agen pembayaran (token listrik, pulsa, transfer bank). Menjadi pusat belanja warga pemukiman dengan sistem kasir rapi.",
    isSimulatedData: true,
    estimatedMinCapital: 10000000,
    estimatedMaxCapital: 20000000,
    minExperienceLevel: "pemula",
    difficultyLevel: "Mudah",
    suitabilityReason: "Produk kebutuhan pokok selalu dicari setiap hari tanpa terpengaruh tren musiman.",
    keyRisks: [
      "Margin keuntungan per satuan barang relatif tipis (5-15%).",
      "Barang kadaluarsa atau telur pecah/rusak jika inventaris tidak diputar rapi (*FIFO*).",
      "Tekanan utang/bon dari tetangga yang dapat mengganggu arus kas tunai.",
    ],
    keySuccessFactors: [
      "Harga bersaing dengan kulakan langsung dari agen grosir besar.",
      "Ketersediaan barang selalu lengkap (tidak pernah mengecewakan pembeli).",
      "Kelengkapan layanan transfer digital dan top-up e-wallet.",
    ],
    defaultAssumptions: {
      sellingPricePerUnit: 25000, // Nilai rata-rata keranjang belanja per transaksi
      costOfGoodsPerUnit: 22000, // HPP barang grosir (margin rata-rata 12%)
      dailySalesVolume: 60,      // 60 transaksi per hari
      operatingDaysPerMonth: 30, // Buka setiap hari
      monthlyFixedCosts: {
        rent: 1000000,
        salaries: 0,
        utilities: 350000,
        otherMarketing: 100000,
      },
      initialEquipmentCost: 8000000, // Rak besi bertingkat, etalase kaca, timbangan digital, papan nama
    },
    marketIntelligence: {
      socialMediaTrend: {
        platform: "Komunitas Warga Facebook & WA",
        trendScore: 84,
        hashtag: "#WarungTetangga #BelanjaDekatRumah",
        summary: "Gerakan belanja di warung tetangga dan kemudahan bayar pakai QRIS/transfer kas desa ramai didukung komunitas warga lokal.",
      },
      googlePlaces: {
        densityLevel: "Sedang",
        competitorRadiusKm: 0.4,
        footTrafficScore: "Sangat Tinggi",
        summary: "Di Google Places, toko kelontong dengan jam buka fleksibel (pagi buta hingga larut) memiliki rating ulasan loyalitas warga sangat tinggi.",
      },
      localNews: {
        headline: "Digitalisasi Warung Tradisional Tingkatkan Omzet UMKM hingga 35%",
        source: "Ekonomi Rakyat Digital",
        summary: "Penyediaan layanan pembayaran digital dan token listrik terbukti menambah aliran pendapatan harian warung kelontong modern.",
      },
      googleTrends: {
        searchVolumeIndex: 86,
        growthRatePercentage: 45,
        momentum: "Tumbuh Konsisten",
        summary: "Pencarian 'sembako murah terdekat' dan 'agen gas elpiji terdekat' konsisten berada di papan atas volume pencarian lokal.",
      },
      bpsStats: {
        metricName: "Porsi Belanja Bahan Pokok Esensial",
        metricValue: "51.3% dari keranjang belanja",
        relevance: "Data BPS menunjukkan barang kebutuhan pokok adalah pengeluaran paling inelastis (tetap dibeli terlepas dari kondisi ekonomi).",
      },
    },
    roadmapTemplates: [
      {
        id: "step-5-1",
        phase: 1,
        phaseTitle: "Riset & Legalitas Dasar",
        title: "Cari agen grosir sembako tangan pertama",
        description: "Bandingkan harga beras, minyak, dan telur di 3 distributor grosir pasar induk untuk mendapatkan selisih harga terbaik.",
      },
      {
        id: "step-5-2",
        phase: 2,
        phaseTitle: "Persiapan Modal & Alat",
        title: "Pasang rak terbuka & barcode scanner kasir",
        description: "Tata produk dengan rapi agar pembeli dapat melihat langsung dan gunakan aplikasi kasir gratisan di smartphone.",
      },
    ],
    tags: ["Ritel", "Sembako", "Perputaran Cepat", "Tahan Krisis", "Komunitas"],
  },
  {
    id: "opp-hidroponik",
    title: "Kebun Hidroponik Sayur Hijau Segar",
    slug: "kebun-hidroponik-sayuran",
    category: "agribisnis",
    shortDescription: "Budidaya sayuran premium bebas pestisida di lahan pekarangan terbatas untuk segmen sehat.",
    fullDescription: "Menanam sayuran hijau (selada romaine, pakcoy, kangkung, kale) dengan instalasi pipa PVC hidroponik sistem NFT. Hasil panen disuplai ke restoran lokal, penjual burger/salad, dan tetangga komplek.",
    isSimulatedData: true,
    estimatedMinCapital: 5000000,
    estimatedMaxCapital: 10000000,
    minExperienceLevel: "pernah_usaha",
    difficultyLevel: "Cukup Menantang",
    suitabilityReason: "Tren gaya hidup sehat perkotaan meningkatkan permintaan sayuran segar tanpa pestisida dengan harga jual premium.",
    keyRisks: [
      "Serangan hama ulat dan jamur daun jika sanitasi instalasi kurang terjaga.",
      "Kematian tanaman jika pompa air nutrisi mati mendadak akibat pemadaman listrik.",
      "Fluktuasi suhu air nutrisi saat cuaca terik yang menyebabkan akar membusuk.",
    ],
    keySuccessFactors: [
      "Disiplin mengecek kepekatan nutrisi (PPM) dan tingkat keasaman (pH) air setiap pagi.",
      "Memiliki pembeli tetap (restoran burger, katering diet) sebelum masa panen tiba.",
      "Pengemasan rapi dengan plastik berventilasi menjaga kesegaran sayur hingga ke dapur konsumen.",
    ],
    defaultAssumptions: {
      sellingPricePerUnit: 7000,  // Harga per pak 250 gram sayur segar
      costOfGoodsPerUnit: 2500,  // Nutrisi AB Mix, benih unggul, rockwool, kemasan
      dailySalesVolume: 35,      // Rata-rata ekuivalen 35 pak per hari
      operatingDaysPerMonth: 30,
      monthlyFixedCosts: {
        rent: 300000,            // Pemanfaatan atap/pekarangan rumah
        salaries: 0,
        utilities: 200000,       // Listrik pompa sirkulasi 24 jam & air
        otherMarketing: 100000,
      },
      initialEquipmentCost: 5500000, // Instalasi pipa NFT 400 lubang, tandon air, pompa, TDS meter, atap UV
    },
    marketIntelligence: {
      socialMediaTrend: {
        platform: "Instagram & TikTok Gaya Hidup Sehat",
        trendScore: 81,
        hashtag: "#SayurHidroponik #PolaHidupSehat",
        summary: "Tren makanan sehat (clean eating), salad segar bebas pestisida, dan jus detoks mengalami kenaikan engagement signifikan di perkotaan.",
      },
      googlePlaces: {
        densityLevel: "Rendah",
        competitorRadiusKm: 2.5,
        footTrafficScore: "Menengah",
        summary: "Google Places menunjukkan minimnya produsen sayur segar petik langsung di dekat pemukiman urban, membuka peluang supply langsung ke resto & perumahan.",
      },
      localNews: {
        headline: "Pemprov Galakkan Urban Farming untuk Perkuat Ketahanan Pangan Kota",
        source: "Buletin Pertanian Berkelanjutan",
        summary: "Program kemitraan supermarket lokal dan hotel mempermudah petani hidroponik mikro memasarkan hasil panen secara berkelanjutan.",
      },
      googleTrends: {
        searchVolumeIndex: 73,
        growthRatePercentage: 51,
        momentum: "Melesat Naik",
        summary: "Tren pencarian sayur organik, selada segar, dan kangkung hidroponik naik tajam didorong kesadaran kesehatan keluarga modern.",
      },
      bpsStats: {
        metricName: "Pertumbuhan Konsumsi Sayuran Segar Perkapita",
        metricValue: "Naik 7.8% YoY",
        relevance: "Laporan BPS memperlihatkan pergeseran gaya hidup konsumsi pangan segar bergizi tinggi di perkotaan.",
      },
    },
    roadmapTemplates: [
      {
        id: "step-6-1",
        phase: 1,
        phaseTitle: "Riset & Legalitas Dasar",
        title: "Rakit talang hidroponik menghadap sinar matahari",
        description: "Pastikan instalasi terkena sinar matahari minimal 5-6 jam per hari untuk fotosintesis optimal sayuran daun.",
      },
      {
        id: "step-6-2",
        phase: 2,
        phaseTitle: "Persiapan Modal & Alat",
        title: "Semai 200 benih di media rockwool",
        description: "Mulai penyemaian bertahap seminggu sekali agar jadwal panen bisa bergulir rutin setiap minggu.",
      },
    ],
    tags: ["Agribisnis", "Hidroponik", "Gaya Hidup Sehat", "Urban Farming", "Berkelanjutan"],
  },
];

export const businessOpportunities = MOCK_OPPORTUNITIES;
