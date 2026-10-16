import { describe, it, expect } from "vitest";
import { matchOpportunities } from "./matcher";
import { MOCK_OPPORTUNITIES } from "@/data/opportunities";
import { UserProfile } from "@/types/user";

describe("Mesin Pencocokan Peluang Usaha (Matcher Engine)", () => {
  it("memprioritaskan usaha kuliner modal kecil untuk pengguna pemula bermodal 5 juta", () => {
    const profile: Partial<UserProfile> = {
      availableCapital: 5000000,
      categoryInterest: ["kuliner"],
      experience: "pemula",
    };

    const results = matchOpportunities(MOCK_OPPORTUNITIES, profile);

    expect(results.length).toBeGreaterThan(0);
    // Peringkat pertama harus kuliner yang modalnya di kisaran 5 juta (misal: booth tahu crispy atau kopi susu)
    const topMatch = results[0];
    expect(topMatch.opportunity.category).toBe("kuliner");
    expect(topMatch.isAffordable).toBe(true);
    expect(topMatch.matchScore).toBeGreaterThanOrEqual(80);
    expect(topMatch.matchReasons.length).toBeGreaterThan(0);
  });

  it("mampu memfilter berdasarkan kata kunci pencarian", () => {
    const results = matchOpportunities(MOCK_OPPORTUNITIES, {}, "laundry");
    expect(results.length).toBe(1);
    expect(results[0].opportunity.slug).toBe("laundry-kiloan-rumahan");
  });

  it("memberikan label bahwa usaha di atas anggaran modal belum terjangkau", () => {
    const profile: Partial<UserProfile> = {
      availableCapital: 3000000, // 3 juta
    };

    const results = matchOpportunities(MOCK_OPPORTUNITIES, profile, "sembako");
    expect(results.length).toBe(1);
    // Warung sembako butuh modal belasan juta
    expect(results[0].isAffordable).toBe(false);
  });

  it("memiliki data MarketIntelligence lengkap 5 pilar pada setiap peluang usaha (AC-018)", () => {
    MOCK_OPPORTUNITIES.forEach((opp) => {
      expect(opp.marketIntelligence).toBeDefined();
      const mi = opp.marketIntelligence!;

      // 1. Sosial Media
      expect(mi.socialMediaTrend.platform).toBeTruthy();
      expect(mi.socialMediaTrend.trendScore).toBeGreaterThanOrEqual(1);
      expect(mi.socialMediaTrend.summary).toBeTruthy();

      // 2. Google Places
      expect(["Rendah", "Sedang", "Tinggi"]).toContain(mi.googlePlaces.densityLevel);
      expect(mi.googlePlaces.competitorRadiusKm).toBeGreaterThan(0);
      expect(mi.googlePlaces.summary).toBeTruthy();

      // 3. Berita Lokal
      expect(mi.localNews.headline).toBeTruthy();
      expect(mi.localNews.source).toBeTruthy();
      expect(mi.localNews.summary).toBeTruthy();

      // 4. Google Trends
      expect(mi.googleTrends.searchVolumeIndex).toBeGreaterThanOrEqual(1);
      expect(mi.googleTrends.growthRatePercentage).toBeGreaterThanOrEqual(0);
      expect(mi.googleTrends.summary).toBeTruthy();

      // 5. Statistik BPS
      expect(mi.bpsStats.metricName).toBeTruthy();
      expect(mi.bpsStats.metricValue).toBeTruthy();
      expect(mi.bpsStats.relevance).toBeTruthy();
    });
  });

  it("meningkatkan skor kecocokan saat karakteristik area target pengguna sesuai (AC-017)", () => {
    const campusProfile: Partial<UserProfile> = {
      availableCapital: 10000000,
      categoryInterest: ["kuliner"],
      locationEnvironment: "kampus",
      specificLocation: "Dekat Kampus ITB & Jl. Dipati Ukur",
    };

    const results = matchOpportunities(MOCK_OPPORTUNITIES, campusProfile, "kopi");
    expect(results.length).toBe(1);
    const kopiMatch = results[0];
    expect(kopiMatch.matchScore).toBeGreaterThanOrEqual(85);
    expect(
      kopiMatch.matchReasons.some((r) => r.includes("kampus") || r.includes("ITB"))
    ).toBe(true);
  });
});