import { BusinessOpportunity } from "@/types/business";
import { UserProfile } from "@/types/user";

export interface OpportunityMatchResult {
  opportunity: BusinessOpportunity;
  matchScore: number; // 0 - 100
  matchReasons: string[];
  isAffordable: boolean;
}

/**
 * Menyaring dan mengurutkan peluang usaha berdasarkan kecocokan profil pengguna
 */
export function matchOpportunities(
  opportunities: BusinessOpportunity[],
  profile: Partial<UserProfile>,
  searchQuery: string = ""
): OpportunityMatchResult[] {
  const query = searchQuery.trim().toLowerCase();

  return opportunities
    .map((opp) => {
      let score = 50; // Skor dasar
      const reasons: string[] = [];

      // 1. Evaluasi Kesesuaian Modal
      const userCapital = profile.availableCapital || 0;
      let isAffordable = false;

      if (userCapital > 0) {
        if (userCapital >= opp.estimatedMinCapital && userCapital <= opp.estimatedMaxCapital * 1.5) {
          score += 30;
          isAffordable = true;
          reasons.push("Modal Anda berada dalam rentang ideal untuk memulai usaha ini.");
        } else if (userCapital >= opp.estimatedMaxCapital * 1.5) {
          score += 25;
          isAffordable = true;
          reasons.push("Modal Anda sangat mencukupi, memungkinkan cadangan dana darurat operasional.");
        } else if (userCapital >= opp.estimatedMinCapital * 0.8) {
          score += 15;
          isAffordable = true;
          reasons.push("Modal hampir mencukupi; dapat dicapai dengan efisiensi alat bekas layak pakai.");
        } else {
          score -= 10;
          isAffordable = false;
          reasons.push("Membutuhkan modal lebih tinggi dari anggaran awal Anda saat ini.");
        }
      } else {
        isAffordable = true;
      }

      // 2. Evaluasi Minat Kategori
      if (profile.categoryInterest && profile.categoryInterest.length > 0) {
        if (profile.categoryInterest.includes(opp.category)) {
          score += 20;
          reasons.push(`Sesuai dengan minat bidang ${opp.category} yang Anda pilih.`);
        } else {
          score -= 15;
        }
      }

      // 3. Evaluasi Pengalaman
      if (profile.experience) {
        if (profile.experience === "pemula" && opp.minExperienceLevel === "pemula") {
          score += 10;
          reasons.push("Tingkat kesulitan ramah bagi pemula tanpa pengalaman bisnis sebelumnya.");
        } else if (profile.experience === "berpengalaman" || profile.experience === "pernah_usaha") {
          score += 10;
          reasons.push("Pengalaman Anda sebelumnya akan mempercepat pengembangan usaha ini.");
        }
      }

      // Batasi skor antara 10 dan 100
      const finalScore = Math.max(10, Math.min(100, score));

      return {
        opportunity: opp,
        matchScore: finalScore,
        matchReasons: reasons,
        isAffordable,
      };
    })
    .filter((item) => {
      // Filter pencarian teks jika pengguna mengetik kata kunci
      if (!query) return true;
      const titleMatch = item.opportunity.title.toLowerCase().includes(query);
      const descMatch = item.opportunity.shortDescription.toLowerCase().includes(query);
      const tagsMatch = item.opportunity.tags.some((tag) => tag.toLowerCase().includes(query));
      return titleMatch || descMatch || tagsMatch;
    })
    .sort((a, b) => b.matchScore - a.matchScore); // Urutkan dari skor tertinggi
}