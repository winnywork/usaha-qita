import { NextRequest, NextResponse } from "next/server";
import { getFirestoreDb } from "@/lib/firebaseAdmin";
import { prisma } from "@/lib/prisma";

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

    // 1. Verifikasi langsung ke basis data Google Cloud Firestore (koleksi admin_users)
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
      console.warn("Firestore admin login check failed, trying MySQL:", fErr);
    }

    // 2. Verifikasi ke basis data MySQL jika Firestore tidak aktif
    try {
      const adminInDb = await prisma.user.findFirst({
        where: {
          email: cleanUsername,
          riskTolerance: "SUPERADMIN",
        },
      });

      if (adminInDb && adminInDb.specificLocation === cleanPassword) {
        return NextResponse.json({
          success: true,
          source: "database",
          user: {
            username: cleanUsername,
            name: adminInDb.name,
            role: "SUPERADMIN",
          },
        });
      }
    } catch (dbErr) {
      console.warn("MySQL admin check skipped:", dbErr);
    }

    // 3. Fallback parameterisasi dari environment variable lokal (.env)
    const envAdminUser = process.env.ADMIN_USERNAME || "superadmin";
    const envAdminPass = process.env.ADMIN_PASSWORD || process.env.INITIAL_ADMIN_PASSWORD;

    if (envAdminPass && cleanUsername === envAdminUser && cleanPassword === envAdminPass) {
      return NextResponse.json({
        success: true,
        source: "env_parameterized",
        user: {
          username: cleanUsername,
          name: "Super Administrator",
          role: "SUPERADMIN",
        },
      });
    }

    // Kredensial tidak cocok
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