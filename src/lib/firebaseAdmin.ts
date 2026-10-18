import { getApps, initializeApp, cert, App } from "firebase-admin/app";
import { getFirestore, Firestore } from "firebase-admin/firestore";

let cachedApp: App | null = null;
let cachedDb: Firestore | null = null;

function getFirebaseAdminApp(): App | null {
  if (cachedApp) return cachedApp;

  const apps = getApps();
  if (apps.length > 0 && apps[0]) {
    cachedApp = apps[0];
    return cachedApp;
  }

  const projectId =
    process.env.FIREBASE_PROJECT_ID ||
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const rawPrivateKey = process.env.FIREBASE_PRIVATE_KEY;
  const privateKey = rawPrivateKey ? rawPrivateKey.replace(/\\n/g, "\n") : undefined;

  // 1. Kredensial Service Account lengkap
  if (projectId && clientEmail && privateKey) {
    try {
      cachedApp = initializeApp({
        credential: cert({
          projectId,
          clientEmail,
          privateKey,
        }),
      });
      return cachedApp;
    } catch (e) {
      console.warn("Failed to initialize Firebase Admin with service account:", e);
    }
  }

  // 2. Di Google Cloud Run / Firebase App Hosting, Application Default Credentials otomatis aktif
  if (projectId || process.env.K_SERVICE) {
    try {
      cachedApp = initializeApp(
        projectId ? { projectId } : undefined
      );
      return cachedApp;
    } catch (e) {
      console.warn("Failed to initialize Firebase Admin with default credentials:", e);
    }
  }

  return null;
}

export function getFirestoreDb(): Firestore | null {
  if (cachedDb) return cachedDb;

  try {
    const app = getFirebaseAdminApp();
    if (!app) return null;
    cachedDb = getFirestore(app);
    return cachedDb;
  } catch (error) {
    console.warn("Firestore unavailable:", error);
    return null;
  }
}
