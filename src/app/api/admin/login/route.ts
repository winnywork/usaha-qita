import { NextRequest, NextResponse } from "next/server";
import { getFirestoreDb } from "@/lib/firebaseAdmin";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: "Username dan password wajib diisi." },
        { status: 400 }
      );
    }

    const cleanUsername = String(username).trim();
    const cleanPassword = String(password).trim();

    // 1. Cek lewat Firebase Cloud Firestore
    try {
      const firestore = getFirestoreDb();
      if (firestore) {
        const docRef = firestore.collection("admin_users").doc(cleanUsername);
        const docSnap = await docRef.get();

        if (docSnap.exists) {
          const adminData = docSnap.data();
          if (adminData && adminData.password === cleanPassword) {
            return NextResponse.json({
              success: true,
              source: "firebase_firestore",
              user: {
                username: adminData.username || cleanUsername,
                name: adminData.name || "Super Administrator",
                role: adminData.role || "SUPERADMIN",
              },
            });
          }
        }
      }
    } catch (fErr) {
      console.warn("Firestore admin login check failed, falling back:", fErr);
    }

    // 2. Fallback Root Superadmin (superadmin / P@ssw0rd)
    if (cleanUsername === "superadmin" && cleanPassword === "P@ssw0rd") {
      // Auto-sync ke Firestore jika belum ada
      try {
        const firestore = getFirestoreDb();
        if (firestore) {
          await firestore.collection("admin_users").doc("superadmin").set({
            username: "superadmin",
            password: "P@ssw0rd",
            name: "Super Administrator",
            role: "SUPERADMIN",
            updatedAt: new Date().toISOString(),
          }, { merge: true });
        }
      } catch (syncErr) {
        console.warn("Auto-sync superadmin to Firestore failed:", syncErr);
      }

      return NextResponse.json({
        success: true,
        source: "master_credential",
        user: {
          username: "superadmin",
          name: "Super Administrator",
          role: "SUPERADMIN",
        },
      });
    }

    return NextResponse.json(
      { success: false, error: "Username atau password administrator salah." },
      { status: 401 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Terjadi kesalahan internal";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}