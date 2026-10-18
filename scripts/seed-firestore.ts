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

  // 2. Mantri Users
  const mantriUsers = [
    {
      id: "mantri-01",
      name: "Budi Santoso, S.E.",
      personalNumber: "BRI-882041",
      pin: "123456",
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
      pin: "123456",
      unitName: "BRI Unit Lowokwaru",
      branchOffice: "KC Malang Soekarno Hatta",
      role: "MANTRI",
      assignedAreas: ["Lowokwaru", "Jatimulyo", "Mojolangu", "Tulusrejo"],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  for (const m of mantriUsers) {
    await db.collection("mantri_users").doc(m.id).set(m, { merge: true });
    console.log("Seeded Mantri user in Firestore: " + m.name);
  }

  // 3. Administrator Users
  const adminUsers = [
    {
      id: "admin-super",
      username: "superadmin",
      password: "P@ssw0rd",
      name: "Super Administrator",
      role: "SUPERADMIN",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  for (const a of adminUsers) {
    await db.collection("admin_users").doc(a.username).set(a, { merge: true });
    console.log("Seeded Admin user in Firestore: " + a.username);
  }

  console.log("Firestore seeding completed successfully!");
}

main().catch(console.error);