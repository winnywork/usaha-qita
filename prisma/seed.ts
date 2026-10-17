import { PrismaClient } from "@prisma/client";
import { MOCK_OPPORTUNITIES } from "../src/data/opportunities";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  for (const opp of MOCK_OPPORTUNITIES) {
    const financialTemplate = JSON.stringify({
      shortDescription: opp.shortDescription,
      difficultyLevel: opp.difficultyLevel,
      minExperienceLevel: opp.minExperienceLevel,
      estimatedMaxCapital: opp.estimatedMaxCapital,
      keyRisks: opp.keyRisks,
      keySuccessFactors: opp.keySuccessFactors,
      defaultAssumptions: opp.defaultAssumptions,
      roadmapTemplates: opp.roadmapTemplates,
      tags: opp.tags,
      suitabilityReason: opp.suitabilityReason,
    });

    const marketIntelligence = JSON.stringify(opp.marketIntelligence || {});

    await prisma.businessOpportunity.upsert({
      where: { id: opp.id },
      update: {
        title: opp.title,
        slug: opp.slug,
        category: opp.category,
        description: opp.fullDescription || opp.shortDescription,
        estimatedMinCapital: opp.estimatedMinCapital,
        targetMarket: opp.tags.join(", "),
        locationEnvironments: JSON.stringify(opp.tags),
        financialTemplate,
        marketIntelligence,
      },
      create: {
        id: opp.id,
        title: opp.title,
        slug: opp.slug,
        category: opp.category,
        description: opp.fullDescription || opp.shortDescription,
        estimatedMinCapital: opp.estimatedMinCapital,
        targetMarket: opp.tags.join(", "),
        locationEnvironments: JSON.stringify(opp.tags),
        financialTemplate,
        marketIntelligence,
      },
    });
    console.log("Seeded opportunity: " + opp.title);
  }

  const mantriUsers = [
    {
      id: "mantri-01",
      name: "Budi Santoso, S.E.",
      personalNumber: "BRI-882041",
      pin: "123456",
      unitName: "BRI Unit Dinoyo",
      branchOffice: "KC Malang Soekarno Hatta",
      role: "MANTRI",
      assignedAreas: JSON.stringify(["Dinoyo", "Tlogomas", "Ketawanggede", "Merjosari"]),
    },
    {
      id: "mantri-02",
      name: "Siti Rahmawati, M.M.",
      personalNumber: "BRI-882042",
      pin: "123456",
      unitName: "BRI Unit Lowokwaru",
      branchOffice: "KC Malang Soekarno Hatta",
      role: "MANTRI",
      assignedAreas: JSON.stringify(["Lowokwaru", "Jatimulyo", "Mojolangu", "Tulusrejo"]),
    },
  ];

  for (const m of mantriUsers) {
    await prisma.mantri.upsert({
      where: { personalNumber: m.personalNumber },
      update: {
        name: m.name,
        pin: m.pin,
        unitName: m.unitName,
        branchOffice: m.branchOffice,
        role: m.role,
        assignedAreas: m.assignedAreas,
      },
      create: m,
    });
    console.log("Seeded mantri user: " + m.name);
  }

  console.log("Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });