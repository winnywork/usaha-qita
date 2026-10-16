"use client";

import React, { useState, useEffect } from "react";
import {
  Sparkles,
  Bot,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Info,
  ChevronRight,
  TrendingUp,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useLanguage } from "@/context/LanguageContext";
import { requestBusinessAnalysis, AiAnalysisResponse } from "@/services/aiService";

export interface AiAdvisorCardProps {
  businessTitle: string;
  userCapital: number;
  monthlyGrossRevenue: number;
  monthlyFixedCosts: number;
  monthlyVariableCosts: number;
  monthlyNetProfit: number;
  netProfitMarginPercentage: number;
  bepUnitsPerDay: number;
  bepMonthlyRevenue: number;
  estimatedPaybackMonths: number;
  isProfitable: boolean;
  cityLocation?: string;
  specificLocation?: string;
  locationEnvironment?: string;
}

export function AiAdvisorCard({
  businessTitle,
  userCapital,
  monthlyGrossRevenue,
  monthlyFixedCosts,
  monthlyVariableCosts,
  monthlyNetProfit,
  netProfitMarginPercentage,
  bepUnitsPerDay,
  bepMonthlyRevenue,
  estimatedPaybackMonths,
  isProfitable,
  cityLocation,
  specificLocation,
  locationEnvironment,
}: AiAdvisorCardProps) {
  const { t, language } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<AiAnalysisResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const cacheKey = `usaha_qita_ai_${businessTitle.replace(/\s+/g, "_").toLowerCase()}`;
  const currentHash = `${monthlyGrossRevenue}_${monthlyNetProfit}_${language}`;

  // Coba muat cache dari LocalStorage saat inisialisasi
  useEffect(() => {
    try {
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed.hash === currentHash && parsed.data) {
          setAnalysis(parsed.data);
        }
      }
    } catch {
      // Abaikan error LocalStorage
    }
  }, [cacheKey, currentHash]);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await requestBusinessAnalysis({
        businessTitle,
        userCapital,
        monthlyGrossRevenue,
        monthlyFixedCosts,
        monthlyVariableCosts,
        monthlyNetProfit,
        netProfitMarginPercentage,
        bepUnitsPerDay,
        bepMonthlyRevenue,
        estimatedPaybackMonths,
        isProfitable,
        cityLocation,
        specificLocation,
        locationEnvironment,
        language,
      });

      setAnalysis(res);

      // Simpan ke cache
      try {
        localStorage.setItem(
          cacheKey,
          JSON.stringify({
            hash: currentHash,
            data: res,
          })
        );
      } catch {
        // Abaikan kegagalan kuota LocalStorage
      }
    } catch {
      setError(
        language === "en"
          ? "Unable to fetch advisor insights right now. Please try again."
          : "Gagal mengambil rekomendasi asisten AI saat ini. Silakan coba lagi."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="overflow-hidden border border-brand-primary/20 bg-gradient-to-b from-white to-blue-50/20 shadow-md">
      {/* Header Kartu */}
      <div className="bg-gradient-to-r from-brand-primary via-brand-secondary to-slate-900 p-5 sm:p-6 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0 border border-white/30 text-white shadow-inner">
            <Sparkles className="w-5 h-5 text-brand-accent animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-base sm:text-lg tracking-tight">
                {t.aiAdvisor.title}
              </h3>
              {analysis && (
                <span
                  className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border flex items-center gap-1 ${
                    analysis.isAiActive
                      ? "bg-emerald-500/20 border-emerald-400/40 text-emerald-200"
                      : "bg-white/15 border-white/25 text-blue-100"
                  }`}
                >
                  <Bot className="w-3 h-3" />
                  {analysis.isAiActive
                    ? t.aiAdvisor.badgeGemini
                    : t.aiAdvisor.badgeOffline}
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-blue-100/90 mt-0.5 max-w-xl leading-relaxed">
              {t.aiAdvisor.subtitle}
            </p>
          </div>
        </div>

        {analysis && (
          <Button
            size="sm"
            variant="outline"
            onClick={handleGenerate}
            disabled={loading}
            className="border-white/30 text-white hover:bg-white/10 shrink-0 self-start sm:self-center"
            leftIcon={<RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />}
          >
            {t.aiAdvisor.btnRegenerate}
          </Button>
        )}
      </div>

      {/* Konten Utama */}
      <div className="p-5 sm:p-6 space-y-6">
        {/* State 1: Belum Melakukan Analisis */}
        {!analysis && !loading && (
          <div className="py-6 sm:py-8 flex flex-col items-center text-center space-y-4 max-w-lg mx-auto">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-brand-primary shadow-sm">
              <Bot className="w-7 h-7 text-brand-secondary" />
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-slate-800 text-base">
                {language === "en"
                  ? "Want personalized AI feedback on these figures?"
                  : "Ingin masukan cerdas AI mengenai angka simulasi ini?"}
              </h4>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                {language === "en"
                  ? "Our AI assistant evaluates your profit margins, operational break-even, and immediate action steps tailored for Indonesian entrepreneurs."
                  : "Asisten AI akan menelaah margin keuntungan, batas impas operasional harian, serta langkah pengamanan kas khusus untuk wirausaha pemula di Indonesia."}
              </p>
            </div>
            {error && (
              <p className="text-xs text-red-600 bg-red-50 p-2.5 rounded-lg border border-red-200 w-full">
                {error}
              </p>
            )}
            <Button
              variant="primary"
              size="md"
              onClick={handleGenerate}
              leftIcon={<Sparkles className="w-4 h-4 text-brand-accent" />}
              className="px-6 py-2.5 shadow-md shadow-brand-primary/20"
            >
              {t.aiAdvisor.btnGenerate}
            </Button>
          </div>
        )}

        {/* State 2: Sedang Loading */}
        {loading && (
          <div className="py-8 space-y-4 animate-pulse">
            <div className="flex items-center gap-3 text-brand-primary text-sm font-semibold justify-center">
              <RefreshCw className="w-4 h-4 animate-spin text-brand-secondary" />
              <span>{t.aiAdvisor.loadingText}</span>
            </div>
            <div className="space-y-2.5 max-w-2xl mx-auto">
              <div className="h-4 bg-slate-200 rounded-lg w-full"></div>
              <div className="h-4 bg-slate-200 rounded-lg w-5/6"></div>
              <div className="h-4 bg-slate-200 rounded-lg w-3/4"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-3">
              <div className="h-32 bg-slate-100 rounded-xl border border-slate-200"></div>
              <div className="h-32 bg-slate-100 rounded-xl border border-slate-200"></div>
              <div className="h-32 bg-slate-100 rounded-xl border border-slate-200"></div>
            </div>
          </div>
        )}

        {/* State 3: Tampilan Hasil Analisis AI */}
        {analysis && !loading && (
          <div className="space-y-6">
            {/* Ringkasan Eksekutif */}
            <div className="p-4 sm:p-5 rounded-2xl bg-brand-light/40 border border-brand-accent/40 relative">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-brand-primary shrink-0" />
                <h4 className="text-xs font-bold text-brand-primary uppercase tracking-wider">
                  {t.aiAdvisor.summaryTitle}
                </h4>
              </div>
              <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
                &ldquo;{analysis.summary}&rdquo;
              </p>
            </div>

            {/* Grid 3 Kartu Saran Terstruktur */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Kolom 1: Keunggulan & Potensi Laba */}
              <div className="rounded-xl border border-emerald-200 bg-emerald-50/40 p-4 space-y-3">
                <div className="flex items-center gap-2 text-emerald-800">
                  <div className="w-6 h-6 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  </div>
                  <h5 className="font-bold text-xs uppercase tracking-wider">
                    {t.aiAdvisor.strengthsTitle}
                  </h5>
                </div>
                <ul className="space-y-2 text-xs text-slate-700">
                  {analysis.strengths.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 leading-relaxed">
                      <span className="text-emerald-600 font-bold shrink-0 mt-0.5">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Kolom 2: Risiko & Tantangan */}
              <div className="rounded-xl border border-amber-200 bg-amber-50/40 p-4 space-y-3">
                <div className="flex items-center gap-2 text-amber-800">
                  <div className="w-6 h-6 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                  </div>
                  <h5 className="font-bold text-xs uppercase tracking-wider">
                    {t.aiAdvisor.risksTitle}
                  </h5>
                </div>
                <ul className="space-y-2 text-xs text-slate-700">
                  {analysis.risks.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 leading-relaxed">
                      <span className="text-amber-600 font-bold shrink-0 mt-0.5">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Kolom 3: Rekomendasi Langkah Taktis */}
              <div className="rounded-xl border border-blue-200 bg-blue-50/40 p-4 space-y-3">
                <div className="flex items-center gap-2 text-brand-primary">
                  <div className="w-6 h-6 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                    <Lightbulb className="w-4 h-4 text-brand-secondary" />
                  </div>
                  <h5 className="font-bold text-xs uppercase tracking-wider">
                    {t.aiAdvisor.actionTitle}
                  </h5>
                </div>
                <ul className="space-y-2 text-xs text-slate-700">
                  {analysis.actionPlan.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 leading-relaxed">
                      <ChevronRight className="w-3.5 h-3.5 text-brand-secondary shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Catatan Kepatuhan & Transparansi */}
            <div className="pt-2 border-t border-slate-100 flex items-start gap-2.5 text-slate-500 text-[11px] leading-relaxed">
              <Info className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
              <p>{t.aiAdvisor.disclaimer}</p>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
