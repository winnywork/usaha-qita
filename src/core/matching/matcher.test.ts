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
});