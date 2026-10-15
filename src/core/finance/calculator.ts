import { FinancialAssumptions, FinancialResult, FinancialScenario } from "@/types/finance";

/**
 * Menghitung seluruh metrik keuangan usaha secara deterministik (murni & tanpa efek samping).
 */
export function calculateFinancials(assumptions: FinancialAssumptions): FinancialResult {
  const {
    sellingPricePerUnit,
    costOfGoodsPerUnit,
    dailySalesVolume,
    operatingDaysPerMonth,
    monthlyFixedCosts: fixed,
    initialEquipmentCost,
  } = assumptions;

  // 1. Omzet Kotor Bulanan
  const monthlyGrossRevenue = Math.max(0, dailySalesVolume * sellingPricePerUnit * operatingDaysPerMonth);

  // 2. Biaya Variabel Bulanan
  const monthlyVariableCosts = Math.max(0, dailySalesVolume * costOfGoodsPerUnit * operatingDaysPerMonth);

  // 3. Biaya Tetap Bulanan
  const monthlyFixedCosts = Math.max(
    0,
    (fixed.rent || 0) + (fixed.salaries || 0) + (fixed.utilities || 0) + (fixed.otherMarketing || 0)
  );

  // 4. Total Biaya Bulanan
  const monthlyTotalCosts = monthlyFixedCosts + monthlyVariableCosts;

  // 5. Laba Bersih Bulanan
  const monthlyNetProfit = monthlyGrossRevenue - monthlyTotalCosts;

  // 6. Margin Laba Bersih (%)
  const netProfitMarginPercentage =
    monthlyGrossRevenue > 0
      ? Number(((monthlyNetProfit / monthlyGrossRevenue) * 100).toFixed(2))
      : 0;

  // 7. Margin Kontribusi per Satuan (Rp)
  const contributionMarginPerUnit = sellingPricePerUnit - costOfGoodsPerUnit;

  // 8. Rasio Margin Kontribusi (0 s/d 1)
  const contributionMarginRatio =
    sellingPricePerUnit > 0
      ? Number((contributionMarginPerUnit / sellingPricePerUnit).toFixed(4))
      : 0;

  // 9. Titik Impas (Break-Even Point / BEP)
  let bepUnitsPerMonth = 0;
  let bepUnitsPerDay = 0;
  let bepMonthlyRevenue = 0;

  if (contributionMarginPerUnit > 0) {
    bepUnitsPerMonth = Math.ceil(monthlyFixedCosts / contributionMarginPerUnit);
    bepMonthlyRevenue = bepUnitsPerMonth * sellingPricePerUnit;
    bepUnitsPerDay = operatingDaysPerMonth > 0 ? Math.ceil(bepUnitsPerMonth / operatingDaysPerMonth) : 0;
  } else {
    // Jika margin kontribusi nol atau negatif, BEP tidak dapat tercapai secara matematis
    bepUnitsPerMonth = Number.POSITIVE_INFINITY;
    bepMonthlyRevenue = Number.POSITIVE_INFINITY;
    bepUnitsPerDay = Number.POSITIVE_INFINITY;
  }

  // 10. Estimasi Waktu Pengembalian Modal Awal (Payback Period dalam Bulan)
  const estimatedPaybackMonths =
    monthlyNetProfit > 0 && initialEquipmentCost > 0
      ? Number((initialEquipmentCost / monthlyNetProfit).toFixed(1))
      : 0;

  return {
    monthlyGrossRevenue,
    monthlyVariableCosts,
    monthlyFixedCosts,
    monthlyTotalCosts,
    monthlyNetProfit,
    netProfitMarginPercentage,
    contributionMarginPerUnit,
    contributionMarginRatio,
    bepMonthlyRevenue,
    bepUnitsPerMonth,
    bepUnitsPerDay,
    estimatedPaybackMonths,
    isProfitable: monthlyNetProfit > 0,
  };
}

/**
 * Menerapkan skenario pasar (Konservatif -30%, Moderat normal, Agresif +30%)
 */
export function applyScenario(
  assumptions: FinancialAssumptions,
  scenario: FinancialScenario
): FinancialAssumptions {
  if (scenario === "moderat") {
    return assumptions;
  }

  const multiplier = scenario === "konservatif" ? 0.7 : 1.3;
  const adjustedDailyVolume = Math.max(1, Math.round(assumptions.dailySalesVolume * multiplier));

  return {
    ...assumptions,
    dailySalesVolume: adjustedDailyVolume,
  };
}

/**
 * Format angka ke format mata uang Rupiah Indonesia yang rapi (contoh: Rp 5.000.000)
 */
export function formatRupiah(amount: number): string {
  if (!Number.isFinite(amount)) {
    return "Tidak Terhingga (Rugi)";
  }
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Mengubah string format Rupiah atau angka biasa menjadi number murni
 */
export function parseRupiah(value: string | number): number {
  if (typeof value === "number") return isNaN(value) ? 0 : value;
  const cleaned = value.replace(/[^0-9]/g, "");
  return cleaned ? parseInt(cleaned, 10) : 0;
}
