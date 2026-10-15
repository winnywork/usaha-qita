export interface AiAnalysisResponse {
  source: string;
  isAiActive: boolean;
  summary: string;
  recommendations: string[];
}

/**
 * Layanan pemanggil API server dari sisi browser.
 * Selalu memanggil /api/ai internal tanpa membawa rahasia atau API key.
 */
export async function requestBusinessAnalysis(payload: {
  businessTitle: string;
  userCapital: number;
  monthlyGrossRevenue: number;
  monthlyNetProfit: number;
  isProfitable: boolean;
}): Promise<AiAnalysisResponse> {
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