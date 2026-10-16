export interface AiAnalysisPayload {
  businessTitle: string;
  userCapital: number;
  monthlyGrossRevenue: number;
  monthlyFixedCosts?: number;
  monthlyVariableCosts?: number;
  monthlyNetProfit: number;
  netProfitMarginPercentage?: number;
  bepUnitsPerDay?: number;
  bepMonthlyRevenue?: number;
  estimatedPaybackMonths?: number;
  isProfitable: boolean;
  language?: "id" | "en";
}

export interface AiAnalysisResponse {
  source: "gemini_api" | "local_template_engine";
  isAiActive: boolean;
  summary: string;
  strengths: string[];
  risks: string[];
  actionPlan: string[];
}

/**
 * Layanan pemanggil API server dari sisi browser.
 * Selalu memanggil /api/ai internal di sisi server tanpa membawa rahasia atau API key.
 */
export async function requestBusinessAnalysis(
  payload: AiAnalysisPayload
): Promise<AiAnalysisResponse> {
  const response = await fetch("/api/ai", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Permintaan analisis gagal dengan status ${response.status}`);
  }

  return response.json();
}
