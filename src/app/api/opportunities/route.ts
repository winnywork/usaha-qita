import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getFirestoreDb } from "@/lib/firebaseAdmin";
import { MOCK_OPPORTUNITIES } from "@/data/opportunities";
import { BusinessOpportunity, MarketIntelligence, RoadmapStep } from "@/types/business";
import { BusinessCategory, ExperienceLevel } from "@/types/user";
import { FinancialAssumptions } from "@/types/finance";
import { getMemoryCache, setMemoryCache } from "@/lib/cacheUtils";

const CACHE_KEY = "opportunities_list";

interface ParsedTemplateData {
  shortDescription?: string;
  difficultyLevel?: "Mudah" | "Menengah" | "Cukup Menantang";
  minExperienceLevel?: ExperienceLevel;
  estimatedMaxCapital?: number;
  keyRisks?: string[];
  keySuccessFactors?: string[];
  defaultAssumptions?: FinancialAssumptions;
  roadmapTemplates?: RoadmapStep[];
  suitabilityReason?: string;
}

function formatOpportunityFromDb(opp: {
  id: string;
  title: string;
  slug: string;
  category: string;
  description: string;
  estimatedMinCapital: number;
  targetMarket: string;
  locationEnvironments: string;
  financialTemplate: string;
  marketIntelligence: string;
}): BusinessOpportunity {
  let parsedTemplate: ParsedTemplateData = {};
  try {
    parsedTemplate = JSON.parse(opp.financialTemplate) as ParsedTemplateData;
  } catch {
    parsedTemplate = {};
  }

  let parsedMarket: MarketIntelligence | undefined = undefined;
  try {
    parsedMarket = JSON.parse(opp.marketIntelligence) as MarketIntelligence;
  } catch {
    parsedMarket = undefined;
  }

  let parsedTags: string[] = [];
  try {
    parsedTags = JSON.parse(opp.locationEnvironments) as string[];
  } catch {
    parsedTags = [];
  }

  return {
    id: opp.id,
    title: opp.title,
    slug: opp.slug,
    category: opp.category as BusinessCategory,
    shortDescription: parsedTemplate.shortDescription || opp.description,
    fullDescription: opp.description,
    isSimulatedData: true,
    estimatedMinCapital: opp.estimatedMinCapital,
    estimatedMaxCapital: parsedTemplate.estimatedMaxCapital || opp.estimatedMinCapital * 1.5,
    minExperienceLevel: parsedTemplate.minExperienceLevel || "pemula",
    difficultyLevel: parsedTemplate.difficultyLevel || "Mudah",
    suitabilityReason: parsedTemplate.suitabilityReason || opp.targetMarket,
    keyRisks: parsedTemplate.keyRisks || [],
    keySuccessFactors: parsedTemplate.keySuccessFactors || [],
    defaultAssumptions: parsedTemplate.defaultAssumptions || MOCK_OPPORTUNITIES[0].defaultAssumptions,
    roadmapTemplates: parsedTemplate.roadmapTemplates || [],
    tags: parsedTags,
    marketIntelligence: parsedMarket,
  };
}

// GET /api/opportunities - Ambil semua peluang usaha dari database Cloud Firestore / MySQL
export async function GET() {
  const cached = getMemoryCache<BusinessOpportunity[]>(CACHE_KEY, 60000);
  if (cached) {
    return NextResponse.json({
      success: true,
      source: "memory_cache",
      count: cached.length,
      data: cached,
    });
  }

  try {
    const firestore = getFirestoreDb();
    if (firestore) {
      const snap = await firestore
        .collection("business_opportunities")
        .orderBy("estimatedMinCapital", "asc")
        .get();

      if (!snap.empty) {
        const list: BusinessOpportunity[] = [];
        snap.forEach((doc) => { list.push(doc.data() as BusinessOpportunity); });
        setMemoryCache(CACHE_KEY, list);
        return NextResponse.json({
          success: true,
          source: "firebase_firestore",
          count: list.length,
          data: list,
        }, {
          headers: { "Cache-Control": "public, max-age=30, stale-while-revalidate=120" },
        });
      }
    }
  } catch (fErr) {
    console.warn("Firestore opportunities query failed, trying MySQL:", fErr);
  }
  try {
    const opportunities = await prisma.businessOpportunity.findMany({
      orderBy: { estimatedMinCapital: "asc" },
    });

    if (opportunities.length > 0) {
      const formatted = opportunities.map(formatOpportunityFromDb);
      return NextResponse.json({
        success: true,
        source: "database",
        count: formatted.length,
        data: formatted,
      });
    }

    return NextResponse.json({
      success: true,
      source: "fallback_dataset",
      count: MOCK_OPPORTUNITIES.length,
      data: MOCK_OPPORTUNITIES,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Database unavailable";
    console.warn("Could not load opportunities from MySQL, falling back to local dataset:", message);
    return NextResponse.json({
      success: true,
      source: "fallback_dataset",
      count: MOCK_OPPORTUNITIES.length,
      data: MOCK_OPPORTUNITIES,
    });
  }
}