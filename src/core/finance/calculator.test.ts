import { describe, it, expect } from "vitest";
import {
  calculateFinancials,
  applyScenario,
  formatRupiah,
  parseRupiah,
} from "./calculator";
import { FinancialAssumptions } from "@/types/finance";

describe("Mesin Kalkulator Finansial Deterministik (AC-005)", () => {
  const standardAssumptions: FinancialAssumptions = {
    sellingPricePerUnit: 15000,
    costOfGoodsPerUnit: 9000, // Margin per unit = Rp 6.000
    dailySalesVolume: 40,
    operatingDaysPerMonth: 25,
    monthlyFixedCosts: {
      rent: 1500000,
      salaries: 0,
      utilities: 500000,
      otherMarketing: 1000000,
    },
    initialEquipmentCost: 6000000,
  };

  it("menghitung metrik finansial skenario baku AC-005 dengan presisi", () => {
    const result = calculateFinancials(standardAssumptions);

    // Omzet Kotor: 40 * 15.000 * 25 = 15.000.000
    expect(result.monthlyGrossRevenue).toBe(15000000);

    // Biaya Variabel: 40 * 9.000 * 25 = 9.000.000
    expect(result.monthlyVariableCosts).toBe(9000000);

    // Biaya Tetap: 1.500.000 + 500.000 + 1.000.000 = 3.000.000
    expect(result.monthlyFixedCosts).toBe(3000000);

    // Total Biaya: 9.000.000 + 3.000.000 = 12.000.000
    expect(result.monthlyTotalCosts).toBe(12000000);

    // Laba Bersih: 15.000.000 - 12.000.000 = 3.000.000
    expect(result.monthlyNetProfit).toBe(3000000);

    // Margin Laba Bersih: (3.000.000 / 15.000.000) * 100 = 20%
    expect(result.netProfitMarginPercentage).toBe(20);

    // Margin Kontribusi: 15.000 - 9.000 = 6.000
    expect(result.contributionMarginPerUnit).toBe(6000);

    // Titik Impas (BEP):
    // BEP Unit Bulanan = 3.000.000 / 6.000 = 500 unit
    expect(result.bepUnitsPerMonth).toBe(500);

    // BEP Unit Harian = ceil(500 / 25) = 20 unit/hari
    expect(result.bepUnitsPerDay).toBe(20);

    // BEP Rupiah Bulanan = 500 * 15.000 = 7.500.000
    expect(result.bepMonthlyRevenue).toBe(7500000);

    // Waktu Balik Modal: 6.000.000 / 3.000.000 = 2.0 bulan
    expect(result.estimatedPaybackMonths).toBe(2);

    expect(result.isProfitable).toBe(true);
  });

  it("menangani kondisi merugi ketika HPP lebih besar daripada harga jual", () => {
    const losingAssumptions: FinancialAssumptions = {
      ...standardAssumptions,
      sellingPricePerUnit: 10000,
      costOfGoodsPerUnit: 12000, // Rugi Rp 2.000 per unit
    };

    const result = calculateFinancials(losingAssumptions);

    expect(result.contributionMarginPerUnit).toBe(-2000);
    expect(result.isProfitable).toBe(false);
    expect(result.monthlyNetProfit).toBeLessThan(0);
    expect(result.bepUnitsPerMonth).toBe(Number.POSITIVE_INFINITY);
    expect(result.estimatedPaybackMonths).toBe(0);
  });

  it("menerapkan skenario pasar konservatif (-30%) dan agresif (+30%)", () => {
    const conservative = applyScenario(standardAssumptions, "konservatif");
    expect(conservative.dailySalesVolume).toBe(28); // 40 * 0.7 = 28

    const aggressive = applyScenario(standardAssumptions, "agresif");
    expect(aggressive.dailySalesVolume).toBe(52); // 40 * 1.3 = 52

    const moderate = applyScenario(standardAssumptions, "moderat");
    expect(moderate.dailySalesVolume).toBe(40);
  });

  it("memformat dan mem-parse mata uang Rupiah dengan benar", () => {
    expect(formatRupiah(5000000)).toContain("5.000.000");
    expect(parseRupiah("Rp 7.500.000")).toBe(7500000);
    expect(parseRupiah(1250000)).toBe(1250000);
  });
});
