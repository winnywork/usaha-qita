import { getApps, initializeApp, cert, App } from "firebase-admin/app";
import { getFirestore, Firestore } from "firebase-admin/firestore";

function getFirebaseAdminApp(): App | null {
  const apps = getApps();
  if (apps.length > 0 && apps[0]) {
    return apps[0];
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
      return initializeApp({
        credential: cert({
          projectId,
          clientEmail,
          privateKey,
        }),
      });
    } catch (e) {
      console.warn("Failed to initialize Firebase Admin with service account:", e);
    }
  }

  // 2. Di Google Cloud Run / Firebase App Hosting, Application Default Credentials otomatis aktif
  if (projectId || process.env.K_SERVICE) {
    try {
      return initializeApp(
        projectId ? { projectId } : undefined
      );
    } catch (e) {
      console.warn("Failed to initialize Firebase Admin with default credentials:", e);
    }
  }

  return null;
}

export function getFirestoreDb(): Firestore | null {
  try {
    const app = getFirebaseAdminApp();
    if (!app) return null;
    return getFirestore(app);
  } catch (error) {
    console.warn("Firestore unavailable:", error);
    return null;
  }
}