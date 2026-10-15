export interface MonthlyFixedCosts {
  rent: number;           // Biaya sewa tempat bulanan (Rp)
  salaries: number;       // Total upah/gaji karyawan bulanan (Rp)
  utilities: number;      // Tagihan listrik, air, internet (Rp)
  otherMarketing: number; // Biaya promosi & operasional lainnya (Rp)
}

export interface FinancialAssumptions {
  sellingPricePerUnit: number;     // Harga jual per satuan produk/jasa (Rp)
  costOfGoodsPerUnit: number;      // Harga Pokok Penjualan (HPP) per satuan (Rp)
  dailySalesVolume: number;        // Estimasi unit yang terjual setiap hari
  operatingDaysPerMonth: number;   // Jumlah hari operasional dalam 1 bulan (umumnya 25 - 30 hari)
  monthlyFixedCosts: MonthlyFixedCosts;
  initialEquipmentCost: number;    // Modal belanja awal untuk peralatan & perlengkapan (Rp)
}

export interface FinancialResult {
  monthlyGrossRevenue: number;       // Omzet kotor bulanan (Rp)
  monthlyVariableCosts: number;      // Total biaya variabel bulanan (Rp)
  monthlyFixedCosts: number;         // Total biaya tetap bulanan (Rp)
  monthlyTotalCosts: number;         // Total seluruh biaya pengeluaran bulanan (Rp)
  monthlyNetProfit: number;          // Estimasi laba bersih bulanan (Rp)
  netProfitMarginPercentage: number; // Persentase margin laba bersih (%)
  contributionMarginPerUnit: number; // Margin kontribusi per unit (Rp)
  contributionMarginRatio: number;   // Rasio margin kontribusi (desimal 0 s/d 1)
  bepMonthlyRevenue: number;         // Titik impas omzet bulanan (Rp)
  bepUnitsPerMonth: number;          // Titik impas total unit per bulan
  bepUnitsPerDay: number;            // Titik impas rata-rata unit per hari
  estimatedPaybackMonths: number;    // Estimasi waktu pengembalian modal awal (bulan)
  isProfitable: boolean;             // Bernilai true jika laba bersih bulanan > 0
}

export type FinancialScenario = "konservatif" | "moderat" | "agresif";
