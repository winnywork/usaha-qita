import { NextRequest, NextResponse } from "next/server";

export interface AiAnalysisPayload {
  businessTitle: string;
  userCapital: number;
  monthlyGrossRevenue: number;
  monthlyFixedCosts?: number;
  monthlyVariableCosts?: number;
  monthlyNetProfit: number;
  netProfitMarginPercentage?: number;
  bepUnitsPerDay?: number;
  bepMonthlyRevenue?: number;
  estimatedPaybackMonths?: number;
  isProfitable: boolean;
  cityLocation?: string;
  specificLocation?: string;
  locationEnvironment?: string;
  language?: "id" | "en";
}

export interface AiStructuredResult {
  summary: string;
  strengths: string[];
  risks: string[];
  actionPlan: string[];
}

function getLocalTemplateResponse(
  payload: AiAnalysisPayload,
  isEnglish: boolean
): AiStructuredResult {
  const {
    businessTitle,
    userCapital,
    monthlyGrossRevenue,
    monthlyNetProfit,
    isProfitable,
    bepUnitsPerDay = 0,
    estimatedPaybackMonths = 0,
  } = payload;

  const capitalFormatted = userCapital ? `Rp ${userCapital.toLocaleString("id-ID")}` : "modal awal";
  const profitFormatted = monthlyNetProfit ? `Rp ${Math.abs(monthlyNetProfit).toLocaleString("id-ID")}` : "0";
  const revenueFormatted = monthlyGrossRevenue ? `Rp ${monthlyGrossRevenue.toLocaleString("id-ID")}` : "0";

  if (isEnglish) {
    if (isProfitable) {
      return {
        summary: `Deterministic feasibility assessment for ${businessTitle || "your selected business"}: With capital allocation of ${capitalFormatted} and monthly gross revenue projection of ${revenueFormatted}, this model forecasts a solid net profit of ${profitFormatted}/month. Estimated payback horizon is approximately ${estimatedPaybackMonths > 0 ? `${estimatedPaybackMonths} months` : "under 1 year"}.`,
        strengths: [
          `Viable unit margins: projected sales volume exceeds the daily break-even threshold of ${bepUnitsPerDay} units/day.`,
          "Positive operational cash flow potential, enabling working capital reserve accumulation.",
          "Balanced ratio between monthly fixed overheads and overall gross profit generation.",
        ],
        risks: [
          "Raw ingredient price fluctuations that could momentarily compress gross margins.",
          "Local foot traffic variations during seasonal holidays or adverse weather.",
        ],
        actionPlan: [
          "Establish partnerships with at least two alternative ingredient vendors to secure wholesale pricing.",
          `Set a daily sales milestone target of at least ${Math.ceil(bepUnitsPerDay * 1.2)} units to maintain a safe operational buffer above BEP.`,
          "Separate business operating cash from personal funds from day one.",
        ],
      };
    } else {
      return {
        summary: `Financial viability warning for ${businessTitle || "your selected business"}: Current assumptions result in a projected monthly net loss of ${profitFormatted}. Anticipated revenue (${revenueFormatted}) is insufficient to cover total fixed overhead and variable costs. Recalibrating assumptions is strongly advised.`,
        strengths: [
          "Early deficit detection during simulation before risking actual capital in the market.",
          "Clear visibility into specific overhead drivers that require cost rationalization.",
        ],
        risks: [
          "Capital exhaustion risk if operations launch without adjusting sales volume or pricing.",
          "Fixed overhead burden (rent and wages) dominates initial revenue capacity.",
        ],
        actionPlan: [
          "Evaluate unit pricing: test a modest 10%-15% price adjustment aligned with local market tolerance.",
          "Streamline fixed occupancy costs: consider booth sharing, temporary kiosks, or revenue-share space.",
          `Re-evaluate daily volume targets to surpass the break-even milestone of ${bepUnitsPerDay} units/day before launching.`,
        ],
      };
    }
  }

  // Default: Bahasa Indonesia
  if (isProfitable) {
    return {
      summary: `Evaluasi kelayakan untuk usaha ${businessTitle || "pilihan Anda"}: Dengan alokasi modal ${capitalFormatted} dan omzet bulanan ${revenueFormatted}, simulasi menghasilkan estimasi laba bersih yang sehat sebesar ${profitFormatted}/bulan. Estimasi waktu pengembalian modal adalah sekitar ${estimatedPaybackMonths > 0 ? `${estimatedPaybackMonths} bulan` : "kurang dari 1 tahun"}.`,
      strengths: [
        `Margin operasional sehat: target volume penjualan harian berada di atas titik impas (${bepUnitsPerDay} unit/hari).`,
        "Potensi arus kas positif yang memungkinkan pembentukan dana cadangan usaha sejak bulan pertama.",
        "Proporsi biaya tetap terukur terhadap kapasitas omzet kotor.",
      ],
      risks: [
        "Kenaikan harga bahan baku sewaktu-waktu yang dapat mengikis margin keuntungan kotor.",
        "Variasi penjualan harian akibat faktor cuaca atau hari kerja efektif.",
      ],
      actionPlan: [
        "Jalin kerja sama dengan 2 supplier bahan baku alternatif untuk menjaga kepastian harga grosir.",
        `Tetapkan target penjualan harian minimal ${Math.ceil(bepUnitsPerDay * 1.2)} unit untuk menjaga batas aman di atas BEP.`,
        "Pisahkan rekening operasional usaha dengan tabungan pribadi sejak hari pertama berjualan.",
      ],
    };
  } else {
    return {
      summary: `Peringatan kesehatan finansial untuk usaha ${businessTitle || "pilihan Anda"}: Pada asumsi biaya saat ini, usaha mengalami defisit/rugi estimasi ${profitFormatted}/bulan. Omzet (${revenueFormatted}) belum mencukupi untuk menutup akumulasi biaya tetap dan bahan baku. Perlu kalibrasi ulang angka rencana.`,
      strengths: [
        "Defisit berhasil terdeteksi pada tahap simulasi sebelum modal nyata digelontorkan.",
        "Pemberian transparansi angka secara jujur untuk mencegah risiko kehabisan kas operasional.",
      ],
      risks: [
        "Risiko pengikisan modal awal jika operasional dimulai tanpa efisiensi biaya tetap atau penyesuaian harga jual.",
        "Beban sewa tempat atau gaji pegawai terlalu dominan dibandingkan volume penjualan yang diasumsikan.",
      ],
      actionPlan: [
        "Evaluasi harga jual produk: uji kemungkinan menaikkan harga 10-15% sesuai daya beli pasar lokal.",
        "Tekan biaya sewa tempat: pertimbangkan sistem bagi hasil atau lokasi skala mikro/gerobak di awal.",
        `Tingkatkan target penjualan harian agar melewati batas impas ${bepUnitsPerDay} unit/hari sebelum memulai operasional.`,
      ],
    };
  }
}

/**
 * Batas Server AI (Server Boundary)
 * Endpoint ini berjalan eksklusif di server Next.js.
 * Kunci API rahasia (GEMINI_API_KEY) TIDAK PERNAH dikirimkan ke browser pengguna.
 */
export async function POST(req: NextRequest) {
  try {
    const body: AiAnalysisPayload = await req.json();
    const isEnglish = body.language === "en";

    // Periksa apakah GEMINI_API_KEY tersedia di sisi server
    const apiKey = process.env.GEMINI_API_KEY?.trim();

    if (!apiKey) {
      // Graceful fallback otomatis berbasis template cerdas deterministik lokal
      const template = getLocalTemplateResponse(body, isEnglish);
      return NextResponse.json({
        source: "local_template_engine",
        isAiActive: false,
        ...template,
      });
    }

    const promptInstruction = isEnglish
      ? `You are an expert MSME Financial Mentor for the Indonesian entrepreneurship education platform 'Usaha Qita — by MAXI Team'.
Analyze the provided business financial simulation data and provide actionable, encouraging, yet realistically grounded insights.
Return ONLY a valid JSON object matching this schema without any markdown formatting, backticks, or outer wrapper:
{
  "summary": "2-3 concise sentences evaluating business viability and profit prospects.",
  "strengths": ["Key advantage or growth potential 1", "Advantage 2", "Advantage 3"],
  "risks": ["Practical operational or market risk 1", "Risk 2"],
  "actionPlan": ["Immediate tactical recommendation 1", "Recommendation 2", "Recommendation 3"]
}`
      : `Anda adalah Konsultan Finansial & Mentor Usaha Mikro & UMKM untuk platform edukasi 'Usaha Qita — by MAXI Team'.
Tugas Anda adalah menganalisis data simulasi finansial usaha yang diberikan dan memberikan masukan yang praktis, realistis, empatik, serta aplikatif untuk calon pengusaha pemula di Indonesia.
Berikan respons HANYA dalam format JSON valid sesuai skema berikut tanpa tanda petik markdown luar (tanpa \`\`\`json):
{
  "summary": "Ringkasan eksekutif 2-3 kalimat mengenai kelayakan finansial dan potensi keuntungan usaha ini.",
  "strengths": ["Poin keunggulan/potensi kunci 1", "Poin keunggulan 2", "Poin keunggulan 3"],
  "risks": ["Potensi risiko operasional/pasar 1", "Risiko 2"],
  "actionPlan": ["Langkah taktis konkret 1", "Langkah konkret 2", "Langkah konkret 3"]
}`;

    const userContent = `Data Simulasi Usaha & Konteks Lokasi:
- Nama Usaha: ${body.businessTitle || "Usaha Baru"}
- Kota Domisili: ${body.cityLocation || "Indonesia"}
- Area / Titik Lokasi Spesifik: ${body.specificLocation || "Area strategis umum"}
- Tipe Lingkungan Area: ${body.locationEnvironment || "Fleksibel"}
- Modal Awal Disiapkan: Rp ${(body.userCapital || 0).toLocaleString("id-ID")}
- Proyeksi Omzet Bulanan: Rp ${(body.monthlyGrossRevenue || 0).toLocaleString("id-ID")}
- Total Biaya Tetap Bulanan: Rp ${(body.monthlyFixedCosts || 0).toLocaleString("id-ID")}
- Total Biaya Variabel Bulanan: Rp ${(body.monthlyVariableCosts || 0).toLocaleString("id-ID")}
- Estimasi Laba/Rugi Bersih Bulanan: Rp ${(body.monthlyNetProfit || 0).toLocaleString("id-ID")} (${body.isProfitable ? "Untung" : "Rugi"})
- Margin Laba Bersih: ${body.netProfitMarginPercentage || 0}%
- Titik Impas (BEP): ${body.bepUnitsPerDay || 0} unit/hari (Rp ${(body.bepMonthlyRevenue || 0).toLocaleString("id-ID")}/bulan)
- Estimasi Waktu Balik Modal: ${body.estimatedPaybackMonths || 0} bulan
- Bahasa Respons: ${isEnglish ? "English" : "Bahasa Indonesia"}`;

    // Panggilan live ke Google Gemini API dengan model fallback multi-tier
    const modelsToTry = ["gemini-3.1-flash-lite", "gemini-flash-latest", "gemini-3.8-flash"];
    let rawResultText: string | null = null;

    for (const modelName of modelsToTry) {
      try {
        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;
        const geminiRes = await fetch(geminiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                role: "user",
                parts: [{ text: `${promptInstruction}\n\n${userContent}` }],
              },
            ],
            generationConfig: {
              responseMimeType: "application/json",
              temperature: 0.3,
            },
          }),
          signal: AbortSignal.timeout(6000),
        });

        if (geminiRes.ok) {
          const geminiData = await geminiRes.json();
          const text = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text) {
            rawResultText = text;
            break; // Berhasil, keluar dari loop
          }
        } else {
          console.warn(`Gemini model ${modelName} returned status ${geminiRes.status}. Trying next candidate.`);
        }
      } catch (err) {
        console.warn(`Gemini model ${modelName} request error:`, err);
      }
    }

    if (!rawResultText) {
      console.warn("All live Gemini models unavailable. Using graceful local fallback.");
      const fallback = getLocalTemplateResponse(body, isEnglish);
      return NextResponse.json({
        source: "local_template_engine",
        isAiActive: false,
        ...fallback,
      });
    }

    // Bersihkan kemungkinan markdown code block jika ada
    const cleaned = rawResultText.replace(/```json\s*/gi, "").replace(/```\s*$/gi, "").trim();
    const parsed = JSON.parse(cleaned);

    return NextResponse.json({
      source: "gemini_api",
      isAiActive: true,
      summary: parsed.summary || "",
      strengths: Array.isArray(parsed.strengths) ? parsed.strengths : [],
      risks: Array.isArray(parsed.risks) ? parsed.risks : [],
      actionPlan: Array.isArray(parsed.actionPlan) ? parsed.actionPlan : [],
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Gagal memproses permintaan analisis AI.", details: String(error) },
      { status: 500 }
    );
  }
}
