-- ========================================================
-- UsahaQita Database Schema for MySQL / MariaDB
-- Dapat dieksekusi langsung di Navicat (Query / Execute SQL)
-- ========================================================

CREATE DATABASE IF NOT EXISTS `usaha_qita` 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE `usaha_qita`;

-- 1. Tabel users
CREATE TABLE IF NOT EXISTS `users` (
  `id` VARCHAR(191) NOT NULL PRIMARY KEY,
  `name` VARCHAR(191) NOT NULL,
  `email` VARCHAR(191) NULL UNIQUE,
  `phone` VARCHAR(50) NULL,
  `city` VARCHAR(100) NULL,
  `specificLocation` VARCHAR(191) NULL,
  `locationType` VARCHAR(100) NULL,
  `availableCapital` DOUBLE NOT NULL DEFAULT 0,
  `riskTolerance` VARCHAR(50) NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Tabel business_opportunities
CREATE TABLE IF NOT EXISTS `business_opportunities` (
  `id` VARCHAR(191) NOT NULL PRIMARY KEY,
  `title` VARCHAR(191) NOT NULL,
  `slug` VARCHAR(191) NOT NULL UNIQUE,
  `category` VARCHAR(100) NOT NULL,
  `description` TEXT NOT NULL,
  `estimatedMinCapital` DOUBLE NOT NULL,
  `targetMarket` VARCHAR(191) NOT NULL,
  `locationEnvironments` TEXT NOT NULL,
  `financialTemplate` TEXT NOT NULL,
  `marketIntelligence` TEXT NOT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Tabel mantri_users
CREATE TABLE IF NOT EXISTS `mantri_users` (
  `id` VARCHAR(191) NOT NULL PRIMARY KEY,
  `name` VARCHAR(191) NOT NULL,
  `personalNumber` VARCHAR(100) NOT NULL UNIQUE,
  `pin` VARCHAR(50) NOT NULL,
  `unitName` VARCHAR(191) NOT NULL,
  `branchOffice` VARCHAR(191) NOT NULL,
  `role` VARCHAR(50) NOT NULL DEFAULT 'MANTRI',
  `assignedAreas` TEXT NOT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Tabel leads (Prospek Calon Debitur UsahaQita)
CREATE TABLE IF NOT EXISTS `leads` (
  `id` VARCHAR(191) NOT NULL PRIMARY KEY,
  `submittedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `applicantName` VARCHAR(191) NOT NULL,
  `applicantPhone` VARCHAR(50) NOT NULL,
  `preferredContactTime` VARCHAR(100) NOT NULL,
  `city` VARCHAR(100) NOT NULL,
  `specificLocation` VARCHAR(191) NOT NULL,
  `locationEnvironment` VARCHAR(191) NOT NULL,
  `businessTitle` VARCHAR(191) NOT NULL,
  `businessCategory` VARCHAR(100) NOT NULL,
  `availableCapital` DOUBLE NOT NULL,
  `estimatedTotalCapital` DOUBLE NOT NULL,
  `capitalDeficit` DOUBLE NOT NULL,
  `matchScore` INT NOT NULL,
  `marketIntelligenceJson` LONGTEXT NOT NULL,
  `financialMetricsJson` LONGTEXT NOT NULL,
  `status` VARCHAR(50) NOT NULL DEFAULT 'BARU_MASUK',
  `assignedMantriId` VARCHAR(191) NULL,
  `surveyNotes` TEXT NULL,
  `creditAssessmentJson` TEXT NULL,
  `lastUpdated` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  `userId` VARCHAR(191) NULL,
  `opportunityId` VARCHAR(191) NULL,
  INDEX `idx_leads_status` (`status`),
  INDEX `idx_leads_mantri` (`assignedMantriId`),
  CONSTRAINT `fk_leads_user` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_leads_opportunity` FOREIGN KEY (`opportunityId`) REFERENCES `business_opportunities`(`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_leads_mantri` FOREIGN KEY (`assignedMantriId`) REFERENCES `mantri_users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Tabel financial_plans
CREATE TABLE IF NOT EXISTS `financial_plans` (
  `id` VARCHAR(191) NOT NULL PRIMARY KEY,
  `userId` VARCHAR(191) NULL,
  `businessTitle` VARCHAR(191) NOT NULL,
  `sellingPrice` DOUBLE NOT NULL,
  `dailyVolume` INT NOT NULL,
  `monthlyGrossRevenue` DOUBLE NOT NULL,
  `monthlyFixedCosts` DOUBLE NOT NULL,
  `monthlyVariableCosts` DOUBLE NOT NULL,
  `monthlyNetProfit` DOUBLE NOT NULL,
  `bepUnitsPerDay` INT NOT NULL,
  `bepRupiahPerMonth` DOUBLE NOT NULL,
  `paybackMonths` DOUBLE NOT NULL,
  `isProfitable` TINYINT(1) NOT NULL DEFAULT 1,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  CONSTRAINT `fk_plans_user` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================================
-- SEED INITIAL DATA (Akun Mantri & Sample Leads Awal)
-- ========================================================

INSERT INTO `mantri_users` (`id`, `name`, `personalNumber`, `pin`, `unitName`, `branchOffice`, `role`, `assignedAreas`)
VALUES 
  ('mantri-01', 'Budi Santoso, S.E.', 'BRI-882041', '123456', 'BRI Unit Dinoyo', 'KC Malang Soekarno Hatta', 'MANTRI', '["Dinoyo", "Tlogomas", "Ketawanggede", "Merjosari"]'),
  ('mantri-02', 'Siti Rahmawati, M.M.', 'BRI-882042', '123456', 'BRI Unit Lowokwaru', 'KC Malang Soekarno Hatta', 'MANTRI', '["Lowokwaru", "Jatimulyo", "Mojolangu", "Tulusrejo"]')
ON DUPLICATE KEY UPDATE `name`=VALUES(`name`);

INSERT INTO `leads` (
  `id`, `submittedAt`, `applicantName`, `applicantPhone`, `preferredContactTime`,
  `city`, `specificLocation`, `locationEnvironment`, `businessTitle`, `businessCategory`,
  `availableCapital`, `estimatedTotalCapital`, `capitalDeficit`, `matchScore`,
  `marketIntelligenceJson`, `financialMetricsJson`, `status`, `assignedMantriId`,
  `surveyNotes`, `creditAssessmentJson`, `lastUpdated`
)
VALUES
(
  'UQ-2026-001', NOW() - INTERVAL 3 HOUR, 'Ahmad Fauzi', '081234567890', 'Pagi (08:30 - 11:00 WIB)',
  'Malang', 'Jl. MT Haryono (Dekat Kampus UB/UIN)', 'Kawasan Kampus & Kos Mahasiswa',
  'Booth Kopi Susu Gula Aren Kekinian', 'kuliner', 5000000, 15000000, 10000000, 92,
  '{"googlePlaces":{"densityLevel":"Tinggi","nearbyCompetitors":14,"averageRating":4.6},"socialMediaTrend":{"trendScore":94,"monthlyHashtagVolume":"45K+"},"googleTrends":{"interestScore":88,"growthRatePercentage":28},"localEconomicNews":{"summary":"Ekspansi sentra kuliner mahasiswa di koridor MT Haryono meningkat 20%."},"bpsDemographics":{"purchasingPowerIndex":"Tinggi","targetDemographicDensity":"Tinggi (8.200 mhs/km2)"}}',
  '{"dailyVolume":65,"sellingPrice":15000,"monthlyNetProfit":4850000,"bepUnitsPerDay":24,"bepRupiahPerMonth":10800000,"paybackMonths":2.1}',
  'BARU_MASUK', 'mantri-01',
  'Calon debitur sangat siap dengan resep kopi susu gula aren. Lokasi sewa teras ruko dekat gerbang kampus sudah di-booking.',
  '{"requestedLoanAmount":10000000,"recommendedLoanAmount":10000000,"interestRatePerYear":6,"tenorMonths":12,"monthlyInstallment":883333,"estimatedMonthlyProfit":4850000,"dscrRatio":5.49,"eligibilityGrade":"SANGAT_LAYAK"}',
  NOW() - INTERVAL 2 HOUR
),
(
  'UQ-2026-002', NOW() - INTERVAL 24 HOUR, 'Dewi Lestari', '085712349988', 'Siang (13:00 - 15:00 WIB)',
  'Malang', 'Jl. Soekarno Hatta No. 45', 'Pusat Perkantoran & Kuliner',
  'Laundry Kiloan Express & Sepatu', 'jasa', 8000000, 20000000, 12000000, 88,
  '{"googlePlaces":{"densityLevel":"Sedang","nearbyCompetitors":6,"averageRating":4.4},"socialMediaTrend":{"trendScore":82,"monthlyHashtagVolume":"22K+"},"googleTrends":{"interestScore":78,"growthRatePercentage":15},"localEconomicNews":{"summary":"Kawasan kos eksekutif Suhat membutuhkan layanan laundry premium higienis cepat."},"bpsDemographics":{"purchasingPowerIndex":"Sangat Tinggi","targetDemographicDensity":"Padat Kos & Kantor"}}',
  '{"dailyVolume":45,"sellingPrice":9000,"monthlyNetProfit":5200000,"bepUnitsPerDay":18,"bepRupiahPerMonth":4860000,"paybackMonths":3.8}',
  'SURVEI_LAPANGAN', 'mantri-01',
  'Survei fisik mesin cuci 2 unit dan instalasi pengering gas sudah dicek. Tinggal menunggu kelengkapan IUMK/NIB.',
  '{"requestedLoanAmount":12000000,"recommendedLoanAmount":12000000,"interestRatePerYear":6,"tenorMonths":24,"monthlyInstallment":560000,"estimatedMonthlyProfit":5200000,"dscrRatio":9.29,"eligibilityGrade":"SANGAT_LAYAK"}',
  NOW() - INTERVAL 8 HOUR
),
(
  'UQ-2026-003', NOW() - INTERVAL 48 HOUR, 'Bambang Sudiro', '081399887766', 'Sore (15:30 - 17:00 WIB)',
  'Malang', 'Jl. Raya Tlogomas (Area Kos)', 'Kawasan Pemukiman & Kos',
  'Warung Makan Nasi Kulit & Tahu Crispy', 'kuliner', 3000000, 8000000, 5000000, 85,
  '{"googlePlaces":{"densityLevel":"Tinggi","nearbyCompetitors":11,"averageRating":4.5},"socialMediaTrend":{"trendScore":89,"monthlyHashtagVolume":"38K+"},"googleTrends":{"interestScore":84,"growthRatePercentage":22},"localEconomicNews":{"summary":"Permintaan makanan hemat mahasiswa di Tlogomas tetap tinggi sepanjang semester aktif."},"bpsDemographics":{"purchasingPowerIndex":"Menengah","targetDemographicDensity":"Tinggi Mahasiswa"}}',
  '{"dailyVolume":35,"sellingPrice":18000,"monthlyNetProfit":4500000,"bepUnitsPerDay":14,"bepRupiahPerMonth":7560000,"paybackMonths":1.8}',
  'REKOMENDASI_KUR', 'mantri-01',
  'Dapur higienis, sudah punya 20 pelanggan langganan awal dari grup WhatsApp mahasiswa rantau.',
  '{"requestedLoanAmount":5000000,"recommendedLoanAmount":5000000,"interestRatePerYear":6,"tenorMonths":12,"monthlyInstallment":441666,"estimatedMonthlyProfit":4500000,"dscrRatio":10.18,"eligibilityGrade":"SANGAT_LAYAK"}',
  NOW() - INTERVAL 12 HOUR
),
(
  'UQ-2026-004', NOW() - INTERVAL 72 HOUR, 'Rian Pratama', '087811223344', 'Pagi (09:00 - 11:30 WIB)',
  'Malang', 'Jl. Candi Mendut / Candi Panggung', 'Jalan Protokol / Sentra Usaha',
  'Jasa Cuci Motor & Helm Hidrolik', 'otomotif', 7000000, 18000000, 11000000, 80,
  '{"googlePlaces":{"densityLevel":"Sedang","nearbyCompetitors":5,"averageRating":4.2},"socialMediaTrend":{"trendScore":70,"monthlyHashtagVolume":"12K+"},"googleTrends":{"interestScore":68,"growthRatePercentage":10},"localEconomicNews":{"summary":"Kebutuhan cuci motor cepat di koridor Candi Mendut tinggi di musim hujan."},"bpsDemographics":{"purchasingPowerIndex":"Menengah","targetDemographicDensity":"Sentra Komersial"}}',
  '{"dailyVolume":25,"sellingPrice":15000,"monthlyNetProfit":3800000,"bepUnitsPerDay":11,"bepRupiahPerMonth":4950000,"paybackMonths":3.2}',
  'KONTAK_PERTAMA', 'mantri-02',
  'Sudah dihubungi via WhatsApp. Jadwal survei lokasi air dan izin drainase hari Kamis.',
  '{"requestedLoanAmount":10000000,"recommendedLoanAmount":10000000,"interestRatePerYear":6,"tenorMonths":12,"monthlyInstallment":883333,"estimatedMonthlyProfit":3800000,"dscrRatio":4.30,"eligibilityGrade":"SANGAT_LAYAK"}',
  NOW() - INTERVAL 20 HOUR
)
ON DUPLICATE KEY UPDATE `applicantName`=VALUES(`applicantName`);
