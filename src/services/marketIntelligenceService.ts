import { MarketIntelligence } from "@/types/business";

export interface MarketIntelRequestPayload {
  businessTitle: string;
  category: string;
  cityLocation?: string;
  specificLocation?: string;
  locationEnvironment?: string;
}

export async function fetchDynamicMarketIntelligence(
  payload: MarketIntelRequestPayload,
  fallback: MarketIntelligence
): Promise<{ data: MarketIntelligence; source: "live_ai_grounded" | "regional_database_fallback" | "cached" }> {
  const cacheKey = `uq_intel_${(payload.businessTitle || "").replace(/\s+/g, "_")}_${(payload.cityLocation || "").toLowerCase()}_${(payload.specificLocation || "").toLowerCase()}`;

  if (typeof window !== "undefined") {
    try {
      const cached = sessionStorage.getItem(cacheKey);
      if (cached) {
        return { data: JSON.parse(cached) as MarketIntelligence, source: "cached" };
      }
    } catch {
      // ignore storage errors
    }
  }

  try {
    const res = await fetch("/api/market-intelligence", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data) {
        if (typeof window !== "undefined") {
          try {
            sessionStorage.setItem(cacheKey, JSON.stringify(json.data));
          } catch {
            // ignore storage full
          }
        }
        return { data: json.data as MarketIntelligence, source: json.source || "live_ai_grounded" };
      }
    }
  } catch (err) {
    console.warn("Could not fetch dynamic market intelligence, using fallback:", err);
  }

  return { data: fallback, source: "regional_database_fallback" };
}