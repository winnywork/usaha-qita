import { describe, it, expect } from "vitest";
import { POST } from "./route";
import { NextRequest } from "next/server";

describe("Batas Server AI Route Handler (/api/ai) (AC-015)", () => {
  it("mengembalikan respons template fallback terstruktur saat mode offline/tanpa API key (ID)", async () => {
    const payload = {
      businessTitle: "Kedai Kopi Susu Mantap",
      userCapital: 5000000,
      monthlyGrossRevenue: 15000000,
      monthlyFixedCosts: 3000000,
      monthlyVariableCosts: 9000000,
      monthlyNetProfit: 3000000,
      netProfitMarginPercentage: 20,
      bepUnitsPerDay: 20,
      bepMonthlyRevenue: 7500000,
      estimatedPaybackMonths: 2,
      isProfitable: true,
      language: "id" as const,
    };

    const req = new NextRequest("http://localhost:3000/api/ai", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.source).toBe("local_template_engine");
    expect(data.isAiActive).toBe(false);
    expect(data.summary).toContain("Kedai Kopi Susu Mantap");
    expect(Array.isArray(data.strengths)).toBe(true);
    expect(data.strengths.length).toBeGreaterThan(0);
    expect(Array.isArray(data.risks)).toBe(true);
    expect(data.risks.length).toBeGreaterThan(0);
    expect(Array.isArray(data.actionPlan)).toBe(true);
    expect(data.actionPlan.length).toBeGreaterThan(0);
  });

  it("mengembalikan respons bahasa Inggris saat parameter language bernilai en (AC-016)", async () => {
    const payload = {
      businessTitle: "Crispy Tofu Kiosk",
      userCapital: 3500000,
      monthlyGrossRevenue: 12000000,
      monthlyFixedCosts: 2500000,
      monthlyVariableCosts: 7000000,
      monthlyNetProfit: 2500000,
      netProfitMarginPercentage: 20.8,
      bepUnitsPerDay: 18,
      bepMonthlyRevenue: 5000000,
      estimatedPaybackMonths: 1.4,
      isProfitable: true,
      language: "en" as const,
    };

    const req = new NextRequest("http://localhost:3000/api/ai", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.summary).toContain("Crispy Tofu Kiosk");
    expect(data.summary).toContain("Deterministic feasibility assessment");
    expect(data.strengths[0]).toContain("unit margins");
  });

  it("memberikan analisis peringatan risiko saat kondisi finansial merugi (isProfitable: false)", async () => {
    const losingPayload = {
      businessTitle: "Usaha Terlalu Mahal",
      userCapital: 10000000,
      monthlyGrossRevenue: 8000000,
      monthlyFixedCosts: 6000000,
      monthlyVariableCosts: 5000000,
      monthlyNetProfit: -3000000,
      netProfitMarginPercentage: -37.5,
      bepUnitsPerDay: 50,
      bepMonthlyRevenue: 12000000,
      estimatedPaybackMonths: 0,
      isProfitable: false,
      language: "id" as const,
    };

    const req = new NextRequest("http://localhost:3000/api/ai", {
      method: "POST",
      body: JSON.stringify(losingPayload),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.summary).toContain("defisit/rugi");
    expect(data.actionPlan[0]).toContain("Evaluasi harga jual");
  });
});
