import { getFirestoreDb } from "../src/lib/firebaseAdmin";
import { MOCK_OPPORTUNITIES } from "../src/data/opportunities";

async function main() {
  const db = getFirestoreDb();
  if (!db) {
    console.error("Firestore is not initialized.");
    process.exit(1);
  }

  console.log("Seeding Firestore...");

  // 1. Opportunities
  for (const opp of MOCK_OPPORTUNITIES) {
    await db.collection("business_opportunities").doc(opp.id).set(opp, { merge: true });
    console.log("Seeded opportunity in Firestore: " + opp.title);
  }

  // 2. Mantri Users (Preserve existing if already in database)
  const defaultMantriPin = process.env.INITIAL_MANTRI_PIN || "123456";
  const mantriUsers = [
    {
      id: "mantri-01",
      name: "Budi Santoso, S.E.",
      personalNumber: "BRI-882041",
      unitName: "BRI Unit Dinoyo",
      branchOffice: "KC Malang Soekarno Hatta",
      role: "MANTRI",
      assignedAreas: ["Dinoyo", "Tlogomas", "Ketawanggede", "Merjosari"],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "mantri-02",
      name: "Siti Rahmawati, M.M.",
      personalNumber: "BRI-882042",
      unitName: "BRI Unit Lowokwaru",
      branchOffice: "KC Malang Soekarno Hatta",
      role: "MANTRI",
      assignedAreas: ["Lowokwaru", "Jatimulyo", "Mojolangu", "Tulusrejo"],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  for (const m of mantriUsers) {
    const existing = await db.collection("mantri_users").doc(m.id).get();
    if (!existing.exists) {
      await db.collection("mantri_users").doc(m.id).set({
        ...m,
        pin: defaultMantriPin,
      });
      console.log("Created initial Mantri user in Firestore: " + m.name);
    } else {
      console.log("Mantri user already exists in Firestore (preserved): " + m.name);
    }
  }

  // 3. Administrator Users (Parameterized from environment, preserved if already exists)
  const initialAdminPass = process.env.INITIAL_ADMIN_PASSWORD || process.env.ADMIN_PASSWORD;
  const adminDoc = await db.collection("admin_users").doc("superadmin").get();

  if (!adminDoc.exists) {
    if (initialAdminPass) {
      await db.collection("admin_users").doc("superadmin").set({
        id: "admin-super",
        username: "superadmin",
        password: initialAdminPass,
        name: "Super Administrator",
        role: "SUPERADMIN",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      console.log("Seeded initial Admin user in Firestore from environment variable.");
    } else {
      console.log("Admin user does not exist yet. Please set INITIAL_ADMIN_PASSWORD in .env to initialize.");
    }
  } else {
    console.log("Admin user 'superadmin' already exists in Firestore (credentials preserved in DB).");
  }

  console.log("Firestore seeding completed successfully!");
}

main().catch(console.error);