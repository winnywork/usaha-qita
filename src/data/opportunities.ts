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
    roadmapTemplates: [
      {
        id: "step-1",
        phase: 1,
        phaseTitle: "Riset & Lokasi",
        title: "Survei titik sewa teras toko",
        description: "Cari minimarket atau ruko dengan tingkat keramaian tinggi dan izin pemilik yang jelas.",
      },
      {
        id: "step-2",
        phase: 1,
        phaseTitle: "Riset & Legalitas",
        title: "Daftar NIB usaha mikro via OSS",
        description: "Registrasi izin Nomor Induk Berusaha perseorangan gratis dan resmi secara online.",
      },
      {
        id: "step-3",
        phase: 2,
        phaseTitle: "Pengadaan Alat",
        title: "Beli kompor bertekanan & gerobak portable",
        description: "Pastikan kompor mampu memanaskan minyak stabil di suhu 180°C agar tahu mekar krispi.",
      },
      {
        id: "step-4",
        phase: 3,
        phaseTitle: "Peluncuran",
        title: "Promo 'Beli 2 Gratis 1' selama 3 hari pertama",
        description: "Menarik antrean pertama dan membangun awareness warga sekitar lokasi.",
      },
    ],
    tags: ["Modal Terjangkau", "Perputaran Cepat", "Teras Minimarket", "Cocok Pemula"],
  },
  {
    id: "opp-kopi-susu",
    title: "Kedai Minuman Kopi Susu & Teh Nusantara",
    slug: "kopi-susu-gerobak",
    category: "kuliner",
    shortDescription: "Minuman kopi gula aren kekinian dan teh racik melati segar dengan kemasan cup press praktis.",
    fullDescription: "Konsep grab-and-go menyasar pekerja kantor, pelajar, dan ojek online. Menjual kopi susu gula aren, es cokelat, dan varian teh wangi dengan harga ramah kantong Rp 10.000 - Rp 15.000.",
    isSimulatedData: true,
    estimatedMinCapital: 6000000,
    estimatedMaxCapital: 12000000,
    minExperienceLevel: "pemula",
    difficultyLevel: "Menengah",
    suitabilityReason: "Peminat kopi dan minuman dingin di Indonesia terus stabil dan repeat order dari pelanggan harian sangat tinggi.",
    keyRisks: [
      "Persaingan brand minuman franchise nasional di sekitar titik jualan.",
      "Ketergantungan pada cuaca (penjualan minuman dingin cenderung menurun saat hujan lebat).",
      "Ketahanan bahan baku susu segar yang relatif singkat.",
    ],
    keySuccessFactors: [
      "Rasa kopi yang mantap dengan takaran gula aren yang pas dan konsisten.",
      "Kemasan gelas pres rapi anti tumpah yang nyaman dibawa berkendara.",
      "Program loyalitas sederhana: kumpulkan 10 stempel gratis 1 gelas.",
    ],
    defaultAssumptions: {
      sellingPricePerUnit: 14000,
      costOfGoodsPerUnit: 6500,  // Biji kopi, susu UHT/evaporasi, sirup aren, cup + seal
      dailySalesVolume: 50,
      operatingDaysPerMonth: 28,
      monthlyFixedCosts: {
        rent: 1200000,
        salaries: 0,
        utilities: 350000,
        otherMarketing: 250000,
      },
      initialEquipmentCost: 7500000, // Mesin espresso manual/rok presso, grinder, sealer cup, coolbox
    },
    roadmapTemplates: [
      {
        id: "ks-1",
        phase: 1,
        phaseTitle: "Formulasi Rasa",
        title: "Uji coba resep & blind taste test",
        description: "Uji coba rasa kopi susu pada 20 orang teman dan tetangga untuk menemukan manis & creamy yang pas.",
      },
      {
        id: "ks-2",
        phase: 2,
        phaseTitle: "Persiapan Mesin",
        title: "Beli cup sealer & grinder elektrik",
        description: "Investasi pada alat pres gelas yang awet dan gilingan kopi yang konsisten.",
      },
      {
        id: "ks-3",
        phase: 3,
        phaseTitle: "Peluncuran",
        title: "Daftar merchant QRIS BRI & pembayaran digital",
        description: "Mudahkan transaksi pelanggan tanpa uang kembalian menggunakan QRIS.",
      },
    ],
    tags: ["Minuman Kekinian", "Margin Tinggi", "Repeat Order", "Digital Payment Ready"],
  },
  {
    id: "opp-laundry-kiloan",
    title: "Laundry Kiloan Rumahan 'Bersih Wangi'",
    slug: "laundry-kiloan-rumahan",
    category: "jasa",
    shortDescription: "Jasa cuci, setrika uap, dan pewangi premium untuk kos-kosan, keluarga muda, dan mahasiswa.",
    fullDescription: "Usaha jasa kebutuhan primer mencuci dan menyetrika pakaian harian. Menggunakan mesin cuci komersial kapasitas 10kg, pengering pakaian gas, dan setrika uap boiler untuk hasil licin dan rapi.",
    isSimulatedData: true,
    estimatedMinCapital: 16000000,
    estimatedMaxCapital: 30000000,
    minExperienceLevel: "pernah_usaha",
    difficultyLevel: "Menengah",
    suitabilityReason: "Kebutuhan jasa mencuci adalah kebutuhan primer yang tidak pernah surut, terutama di area padat kos dan karyawan.",
    keyRisks: [
      "Risiko pakaian pelanggan tertukar, rusak, atau luntur jika SOP pemilahan pakaian diabaikan.",
      "Kenaikan tarif utilitas air dan listrik jika kapasitas tidak dioptimalkan.",
      "Keterlambatan pengeringan saat musim hujan jika mesin pengering rusak.",
    ],
    keySuccessFactors: [
      "Sistem penomoran nota pakaian yang rapi dan teliti anti tertukar.",
      "Pilihan aroma parfum laundry yang tahan berhari-hari.",
      "Layanan antar-jemput gratis untuk radius 2 km pertama.",
    ],
    defaultAssumptions: {
      sellingPricePerUnit: 8000,  // Tarif per 1 kg cuci + setrika
      costOfGoodsPerUnit: 2500,  // Deterjen cair, softener, pewangi semprot, plastik packing, gas dryer
      dailySalesVolume: 40,      // Rata-rata 40 kg per hari
      operatingDaysPerMonth: 28,
      monthlyFixedCosts: {
        rent: 1500000,           // Sewa kios atau alokasi garasi rumah
        salaries: 1800000,       // 1 orang asisten cuci/setrika
        utilities: 650000,       // Air PAM & listrik
        otherMarketing: 200000,
      },
      initialEquipmentCost: 19000000, // 2 mesin cuci front loading, 1 dryer gas, setrika uap boiler, rak
    },
    roadmapTemplates: [
      {
        id: "ld-1",
        phase: 1,
        phaseTitle: "Riset Pasar",
        title: "Pemetaan area kos mahasiswa/karyawan",
        description: "Pastikan rasio hunian sewa di radius 1 km cukup tinggi dan minim fasilitas jemuran luas.",
      },
      {
        id: "ld-2",
        phase: 2,
        phaseTitle: "Instalasi Air & Listrik",
        title: "Pasang filter air bersih dan tandon cadangan",
        description: "Air yang jernih dan bebas kapur wajib agar pakaian putih tidak berubah kusam.",
      },
    ],
    tags: ["Kebutuhan Primer", "Langganan Bulanan", "Usaha Jasa", "Peluang Antar-Jemput"],
  },
  {
    id: "opp-cuci-motor",
    title: "Jasa Cuci Motor Salju & Semir Ban Kilap",
    slug: "cuci-motor-salju",
    category: "jasa",
    shortDescription: "Jasa cuci sepeda motor berbusa tebal dengan pembersih kolong dan semir ban kinclong.",
    fullDescription: "Penyedia jasa perawatan kebersihan motor dengan kompresor steam tekanan tinggi, tabung snow wash, dan sampo ramah cat motor. Memberikan hasil bersih tuntas hingga ke sela-sela rantai dan velg.",
    isSimulatedData: true,
    estimatedMinCapital: 7000000,
    estimatedMaxCapital: 14000000,
    minExperienceLevel: "pemula",
    difficultyLevel: "Mudah",
    suitabilityReason: "Jumlah kepemilikan motor di Indonesia sangat masif dan banyak pemilik tidak memiliki waktu untuk mencuci motor sendiri.",
    keyRisks: [
      "Penjualan sepi saat musim kemarau panjang tanpa debu tebal.",
      "Pencegahan komplain lecet pada bodi motor saat proses pengelapan kotoran kasar.",
      "Ketersediaan sumber pasokan air sumur/PAM yang stabil.",
    ],
    keySuccessFactors: [
      "Pembersihan kolong mesin secara detail tanpa terburu-buru.",
      "Ruang tunggu yang bersih, nyaman, dan beratap dengan akses air minum/WiFi gratis.",
      "Kartu apresiasi: Cuci 5 kali gratis 1 kali cuci.",
    ],
    defaultAssumptions: {
      sellingPricePerUnit: 15000, // Tarif per motor bebek/matic
      costOfGoodsPerUnit: 3500,  // Sampo salju, semir ban, air, bensin pompa genset/listrik, kain kanebo
      dailySalesVolume: 25,      // 25 motor per hari
      operatingDaysPerMonth: 28,
      monthlyFixedCosts: {
        rent: 1000000,
        salaries: 1500000,       // 1 tenaga cuci lepas / bagi hasil
        utilities: 300000,
        otherMarketing: 150000,
      },
      initialEquipmentCost: 8500000, // Mesin steam air tekanan tinggi, kompresor udara, tabung salju 20L
    },
    roadmapTemplates: [
      {
        id: "cm-1",
        phase: 1,
        phaseTitle: "Lokasi & Saluran Air",
        title: "Pilih lahan dengan drainase air lancar",
        description: "Pastikan pembuangan air limbah cucian tidak menggenang ke jalan raya atau mengganggu tetangga.",
      },
      {
        id: "cm-2",
        phase: 2,
        phaseTitle: "Instalasi Mesin",
        title: "Uji tekanan mesin steam dan tabung salju",
        description: "Atur tekanan air agar aman untuk kelistrikan motor dan cat kendaraan.",
      },
    ],
    tags: ["Pasar Luas", "Bisa Dikelola Tim", "Layanan Kilat", "Modal Terukur"],
  },
  {
    id: "opp-warung-sembako",
    title: "Warung Sembako Modern & Agen Pembayaran Digital",
    slug: "warung-sembako-digital",
    category: "ritel",
    shortDescription: "Toko kebutuhan pokok rumah tangga lengkap dengan layanan transfer uang, pulsa, dan tagihan listrik.",
    fullDescription: "Menggabungkan penjualan sembako (beras, minyak, telur, mi instan, gula) dengan loket transaksi digital terpercaya bagi warga pemukiman yang jauh dari mesin ATM perbankan.",
    isSimulatedData: true,
    estimatedMinCapital: 18000000,
    estimatedMaxCapital: 35000000,
    minExperienceLevel: "pernah_usaha",
    difficultyLevel: "Menengah",
    suitabilityReason: "Sembako adalah kebutuhan harian yang terus dicari setiap pagi hingga malam oleh seluruh keluarga.",
    keyRisks: [
      "Persaingan margin tipis pada produk sembako kemasan pabrik.",
      "Risiko barang rusak atau kadaluarsa jika sistem First-In First-Out (FIFO) tidak berjalan.",
      "Pengelolaan utang piutang tetangga yang dapat mengganggu arus kas.",
    ],
    keySuccessFactors: [
      "Harga jual bersaing dan ketersediaan stok sembako selalu lengkap.",
      "Kebersihan toko dan penataan rak barang yang rapi mirip minimarket modern.",
      "Menyediakan layanan transaksi keuangan mini (transfer, top up e-wallet, bayar listrik).",
    ],
    defaultAssumptions: {
      sellingPricePerUnit: 25000, // Nilai rata-rata keranjang belanja per struk
      costOfGoodsPerUnit: 21500, // HPP barang dagangan (margin ~14%)
      dailySalesVolume: 60,      // 60 transaksi struk belanja per hari
      operatingDaysPerMonth: 30, // Buka setiap hari
      monthlyFixedCosts: {
        rent: 1800000,
        salaries: 1500000,
        utilities: 450000,
        otherMarketing: 150000,
      },
      initialEquipmentCost: 20000000, // Rak gondola toko, meja kasir, timbangan digital, stok barang awal
    },
    roadmapTemplates: [
      {
        id: "ws-1",
        phase: 1,
        phaseTitle: "Suplier & Kulakan",
        title: "Cari agen grosir sembako tangan pertama",
        description: "Bandingkan harga dari 3 distributor grosir di pasar induk untuk mendapatkan selisih harga terbaik.",
      },
      {
        id: "ws-2",
        phase: 2,
        phaseTitle: "Penataan Toko",
        title: "Pasang rak terbuka & barcode scanner kasir",
        description: "Gunakan aplikasi pencatatan kasir gratis di smartphone untuk mencatat stok barang otomatis.",
      },
    ],
    tags: ["Kebutuhan Pokok", "Transaksi Harian Ramai", "Bisa Tambah Layanan Digital", "Pelanggan Tetap"],
  },
  {
    id: "opp-hidroponik",
    title: "Kebun Hidroponik Sayur Hijau Segar",
    slug: "hidroponik-sayur-segar",
    category: "agribisnis",
    shortDescription: "Budidaya selada, pakcoy, dan bayam hijau bebas pestisida di pekarangan rumah untuk pasar sehat.",
    fullDescription: "Usaha pertanian modern memanfaatkan sistem talang pipa PVC dan nutrisi AB Mix di lahan sempit perkotaan. Menghasilkan sayuran bersih, renyah, dan berharga jual tinggi ke restoran, pedagang burger/salad, dan warga komplek.",
    isSimulatedData: true,
    estimatedMinCapital: 5000000,
    estimatedMaxCapital: 10000000,
    minExperienceLevel: "pemula",
    difficultyLevel: "Mudah",
    suitabilityReason: "Bisa dimulai dari halaman rumah atau atap rumah (rooftop) tanpa memerlukan kepemilikan tanah sawah yang luas.",
    keyRisks: [
      "Serangan hama kutu daun atau jamur jika sirkulasi udara dan jaring serangga kurang rapat.",
      "Kematian bibit jika pompa nutrisi air mati terlalu lama saat pemadaman listrik.",
      "Masa simpan sayur segar yang cepat layu jika tidak segera didistribusikan setelah panen.",
    ],
    keySuccessFactors: [
      "Menjalin kerja sama pemesanan rutin dengan pedagang makanan sehat atau kedai burger sebelum masa panen.",
      "Menjaga pH dan kadar kepekatan nutrisi (PPM) air secara rutin setiap pagi.",
      "Kemasan kantong berpori dengan label sayur hidroponik segar dan higienis.",
    ],
    defaultAssumptions: {
      sellingPricePerUnit: 10000, // Harga per 250 gram selada/pakcoy segar
      costOfGoodsPerUnit: 3500,  // Benih unggul, rockwool, nutrisi pupuk AB mix, plastik kemasan
      dailySalesVolume: 20,      // Rata-rata setara 20 pack per hari (siklus panen bergilir)
      operatingDaysPerMonth: 28,
      monthlyFixedCosts: {
        rent: 400000,            // Alokasi sewa pekarangan atau rooftop
        salaries: 0,             // Dirawat mandiri 1-2 jam per hari
        utilities: 200000,       // Listrik pompa sirkulasi air 24 jam & air PAM
        otherMarketing: 100000,
      },
      initialEquipmentCost: 5500000, // Instalasi pipa DFT/NFT 600 lubang, tandon air, pompa, TDS meter, jaring net
    },
    roadmapTemplates: [
      {
        id: "hp-1",
        phase: 1,
        phaseTitle: "Instalasi Modul",
        title: "Rakit talang hidroponik menghadap sinar matahari",
        description: "Sayuran membutuhkan minimal 6 jam sinar matahari langsung setiap hari untuk tumbuh maksimal.",
      },
      {
        id: "hp-2",
        phase: 2,
        phaseTitle: "Semaian Pertama",
        title: "Semai 200 benih di media rockwool",
        description: "Pantau kelembapan spon semai selama 10-14 hari hingga daun sejati pertama muncul.",
      },
    ],
    tags: ["Pertanian Modern", "Pekarangan Rumah", "Pasar Sehat", "Ramah Lingkungan"],
  },
];
