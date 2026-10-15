import { NextRequest, NextResponse } from "next/server";

/**
 * Batas Server AI (Server Boundary)
 * Endpoint ini berjalan eksklusif di server Next.js.
 * Kunci API rahasia (GEMINI_API_KEY) TIDAK PERNAH dikirimkan ke browser pengguna.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { businessTitle, userCapital, monthlyGrossRevenue, monthlyNetProfit, isProfitable } = body;

    // Periksa apakah GEMINI_API_KEY tersedia di sisi server
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      // Fallback cerdas berbasis template lokal saat kunci AI belum dipasang
      const capitalFormatted = userCapital ? `Rp ${userCapital.toLocaleString("id-ID")}` : "modal awal Anda";
      const profitFormatted = monthlyNetProfit ? `Rp ${monthlyNetProfit.toLocaleString("id-ID")}` : "proyeksi surplus";

      return NextResponse.json({
        source: "local_template_engine",
        isAiActive: false,
        summary: `Berdasarkan kalkulasi deterministik untuk usaha ${businessTitle || "pilihan Anda"}: Dengan alokasi ${capitalFormatted} dan omzet bulanan sekitar ${monthlyGrossRevenue ? "Rp " + monthlyGrossRevenue.toLocaleString("id-ID") : "yang ditargetkan"}, estimasi laba bersih berada di kisaran ${profitFormatted}. Kondisi saat ini menunjukkan ${
          isProfitable ? "potensi laba yang sehat" : "perlu penyesuaian biaya agar tidak merugi"
        }. Kunci sukses terpenting adalah menjaga biaya bahan baku dan konsistensi pelayanan harian.`,
        recommendations: [
          "Fokus pada efisiensi biaya tetap (sewa tempat & listrik) di 3 bulan pertama.",
          "Catat setiap pengeluaran kas kecil harian secara disiplin.",
          "Manfaatkan pemasaran mulut ke mulut warga lokal dan promosi awal.",
        ],
      });
    }

    // Pada fase integrasi Gemini, panggilan SDK resmi Google Generative AI akan dilakukan di sini.
    return NextResponse.json({
      source: "gemini_ready_placeholder",
      isAiActive: true,
      message: "Server route siap untuk integrasi Gemini API pada fase lanjutan.",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Gagal memproses permintaan analisis AI.", details: String(error) },
      { status: 500 }
    );
  }
}