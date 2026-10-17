"use client";

import React, { useState } from "react";
import {
  Share2,
  MapPin,
  Newspaper,
  TrendingUp,
  BarChart3,
  Sparkles,
  ShieldCheck,
  Compass,
  RefreshCw,
} from "lucide-react";
import { MarketIntelligence } from "@/types/business";
import { useLanguage } from "@/context/LanguageContext";
import { fetchDynamicMarketIntelligence } from "@/services/marketIntelligenceService";

interface MarketIntelligencePanelProps {
  intelligence: MarketIntelligence;
  cityLocation?: string;
  specificLocation?: string;
  businessTitle?: string;
  category?: string;
}

export function MarketIntelligencePanel({
  intelligence,
  cityLocation,
  specificLocation,
  businessTitle,
  category,
}: MarketIntelligencePanelProps) {
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState<"all" | "places" | "social" | "trends" | "news_bps">("all");
  const [intel, setIntel] = useState<MarketIntelligence>(intelligence);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDynamic, setIsDynamic] = useState<boolean>(false);

  const { socialMediaTrend, googlePlaces, localNews, googleTrends, bpsStats } = intel;

  const handleRefresh = async () => {
    if (!businessTitle) return;
    setIsLoading(true);
    try {
      const res = await fetchDynamicMarketIntelligence(
        {
          businessTitle,
          category: category || "kuliner",
          cityLocation,
          specificLocation,
        },
        intelligence
      );
      setIntel(res.data);
      if (res.source === "live_ai_grounded") {
        setIsDynamic(true);
      }
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
    }
  };

  const locationDisplay = specificLocation
    ? `${specificLocation}, ${cityLocation || "Indonesia"}`
    : cityLocation || (language === "en" ? "Target Location" : "Lokasi Target");

  const densityLabelText = language === "en" ? "Competitor Density:" : "Kepadatan Kompetitor:";
  const densityValueText =
    language === "en"
      ? googlePlaces.densityLevel === "Rendah"
        ? "Low"
        : googlePlaces.densityLevel === "Sedang"
        ? "Moderate"
        : "High"
      : googlePlaces.densityLevel;

  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-5 space-y-4 shadow-sm text-left">
      {/* 1. Header Panel Bersih & Terstruktur */}
      <div className="flex flex-col gap-2 pb-3 border-b border-slate-100">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-brand-primary flex items-center justify-center text-white shrink-0 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-brand-accent" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">
                {t.rekomendasi.marketIntelTitle}
              </h4>
            </div>
          </div>

          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-brand-primary border border-blue-200 shrink-0">
            5 Sumber Riset
          </span>
        </div>

        {locationDisplay && (
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700 w-fit">
              <MapPin className="w-3.5 h-3.5 text-brand-secondary shrink-0" />
              <span>
                {language === "en" ? "Calibrated area: " : "Area riset: "}
                <strong className="text-slate-900 font-semibold">{locationDisplay}</strong>
              </span>
              {isDynamic && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 ml-1">
                  Live AI Grounded
                </span>
              )}
            </div>
            {businessTitle && (
              <button
                type="button"
                onClick={handleRefresh}
                disabled={isLoading}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-primary hover:text-brand-dark px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-colors"
                title="Perbarui sinyal intelijen pasar real-time"
              >
                <RefreshCw className={`w-3 h-3 ${isLoading ? "animate-spin" : ""}`} />
                <span>{isLoading ? "Menghitung..." : "Perbarui Sinyal Pasar"}</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* 2. Tab Segmented Navigation Antar Sumber */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        <button
          type="button"
          onClick={() => setActiveTab("all")}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 ${
            activeTab === "all"
              ? "bg-brand-primary text-white shadow-sm"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200/80"
          }`}
        >
          {language === "en" ? "All 5 Sources" : "Semua (5 Sumber)"}
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("places")}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 flex items-center gap-1.5 ${
            activeTab === "places"
              ? "bg-emerald-700 text-white shadow-sm"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200/80"
          }`}
        >
          <MapPin className="w-3 h-3" />
          <span>Google Places</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("social")}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 flex items-center gap-1.5 ${
            activeTab === "social"
              ? "bg-rose-600 text-white shadow-sm"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200/80"
          }`}
        >
          <Share2 className="w-3 h-3" />
          <span>Medsos Viral</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("trends")}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 flex items-center gap-1.5 ${
            activeTab === "trends"
              ? "bg-brand-secondary text-white shadow-sm"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200/80"
          }`}
        >
          <TrendingUp className="w-3 h-3" />
          <span>Google Trends</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("news_bps")}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 flex items-center gap-1.5 ${
            activeTab === "news_bps"
              ? "bg-indigo-700 text-white shadow-sm"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200/80"
          }`}
        >
          <BarChart3 className="w-3 h-3" />
          <span>Berita & BPS</span>
        </button>
      </div>

      {/* 3. Daftar Kartu Sumber Riset (Vertical Single-Column Stack) */}
      <div className="space-y-3 pt-1">
        {/* PILAR 1: Google Places & Pemetaan Lokasi */}
        {(activeTab === "all" || activeTab === "places") && (
          <div className="rounded-xl border border-emerald-200/90 bg-emerald-50/25 p-3.5 space-y-2.5 transition-all">
            {/* Header: Judul & Status Kepadatan */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <MapPin className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-bold text-emerald-950 uppercase tracking-wider">
                  {t.rekomendasi.sourcePlaces}
                </span>
              </div>

              {/* Status Kepadatan Kompetitor yang Rapi & Jelas */}
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] text-slate-600 font-medium">
                  {densityLabelText}
                </span>
                <span
                  className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                    googlePlaces.densityLevel === "Rendah"
                      ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                      : googlePlaces.densityLevel === "Sedang"
                      ? "bg-amber-100 text-amber-900 border-amber-300"
                      : "bg-rose-100 text-rose-900 border-rose-300"
                  }`}
                >
                  {densityValueText}
                </span>
              </div>
            </div>

            {/* Narasi Ringkasan yang Mudah Dibaca */}
            <p className="text-xs text-slate-700 leading-relaxed font-medium">
              {googlePlaces.summary}
            </p>

            {/* Chips Indikator Terstruktur */}
            <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-emerald-100/90 text-[11px]">
              <span className="inline-flex items-center gap-1 font-semibold text-emerald-900 bg-white/90 px-2 py-0.5 rounded-md border border-emerald-200">
                <Compass className="w-3 h-3 text-emerald-600" />
                <span>{t.rekomendasi.footTrafficLabel} {googlePlaces.footTrafficScore}</span>
              </span>
              <span className="text-slate-600 font-medium bg-white/90 px-2 py-0.5 rounded-md border border-emerald-200">
                Radius Kompetitor: ~{googlePlaces.competitorRadiusKm} km
              </span>
            </div>
          </div>
        )}

        {/* PILAR 2: Tren Media Sosial */}
        {(activeTab === "all" || activeTab === "social") && (
          <div className="rounded-xl border border-rose-200/90 bg-rose-50/25 p-3.5 space-y-2.5 transition-all">
            {/* Header: Judul & Skor Viralitas */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
                  <Share2 className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-bold text-rose-950 uppercase tracking-wider">
                  {t.rekomendasi.sourceSocial}
                </span>
              </div>

              <div className="flex items-center gap-1.5 bg-rose-100/90 border border-rose-200 px-2.5 py-0.5 rounded-full text-[11px] font-bold text-rose-800">
                <span>Skor Viral:</span>
                <span className="text-xs font-black text-rose-900">{socialMediaTrend.trendScore}/100</span>
              </div>
            </div>

            {/* Narasi Ringkasan */}
            <p className="text-xs text-slate-700 leading-relaxed font-medium">
              {socialMediaTrend.summary}
            </p>

            {/* Chips Tagar & Platform */}
            <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-rose-100/90 text-[11px]">
              <span className="font-bold text-rose-700 bg-white/90 px-2.5 py-0.5 rounded-md border border-rose-200">
                {socialMediaTrend.hashtag}
              </span>
              <span className="text-slate-600 font-medium bg-white/90 px-2 py-0.5 rounded-md border border-rose-200">
                Platform: {socialMediaTrend.platform}
              </span>
            </div>
          </div>
        )}

        {/* PILAR 3: Google Trends */}
        {(activeTab === "all" || activeTab === "trends") && (
          <div className="rounded-xl border border-blue-200/90 bg-blue-50/25 p-3.5 space-y-2.5 transition-all">
            {/* Header: Judul & Pertumbuhan */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-blue-100 text-brand-primary flex items-center justify-center shrink-0">
                  <TrendingUp className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  {t.rekomendasi.sourceTrends}
                </span>
              </div>

              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-brand-primary border border-blue-200">
                +{googleTrends.growthRatePercentage}% ({googleTrends.momentum})
              </span>
            </div>

            {/* Narasi Ringkasan */}
            <p className="text-xs text-slate-700 leading-relaxed font-medium">
              {googleTrends.summary}
            </p>

            {/* Chips Volume & Momentum */}
            <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-blue-100/90 text-[11px]">
              <span className="font-semibold text-brand-primary bg-white/90 px-2 py-0.5 rounded-md border border-blue-200">
                {t.rekomendasi.searchIndexLabel} <strong className="font-bold">{googleTrends.searchVolumeIndex}/100</strong>
              </span>
              <span className="text-slate-600 font-medium bg-white/90 px-2 py-0.5 rounded-md border border-blue-200">
                {t.rekomendasi.momentumLabel} {googleTrends.momentum}
              </span>
            </div>
          </div>
        )}

        {/* PILAR 4 & 5: Berita Lokal & Statistik Konsumsi BPS */}
        {(activeTab === "all" || activeTab === "news_bps") && (
          <div className="space-y-3">
            {/* Berita Lokal */}
            <div className="rounded-xl border border-amber-200/90 bg-amber-50/25 p-3.5 space-y-2.5 transition-all">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                    <Newspaper className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-bold text-amber-950 uppercase tracking-wider">
                    {t.rekomendasi.sourceNews}
                  </span>
                </div>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-white/90 border border-amber-200 text-amber-900">
                  {localNews.source}
                </span>
              </div>

              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-900 leading-snug">
                  &ldquo;{localNews.headline}&rdquo;
                </p>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  {localNews.summary}
                </p>
              </div>
            </div>

            {/* Statistik Konsumsi BPS */}
            <div className="rounded-xl border border-indigo-200/90 bg-indigo-50/25 p-3.5 space-y-2.5 transition-all">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
                    <BarChart3 className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-bold text-indigo-950 uppercase tracking-wider">
                    {t.rekomendasi.sourceBps}
                  </span>
                </div>
                <span className="text-xs font-black text-indigo-800 bg-indigo-100 px-2.5 py-0.5 rounded-full border border-indigo-200">
                  {bpsStats.metricValue}
                </span>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                <strong className="text-slate-900 font-semibold">{bpsStats.metricName}:</strong> {bpsStats.relevance}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 4. Catatan Metodologi & Transparansi Kaki */}
      <div className="pt-2 border-t border-slate-100 flex items-start gap-1.5 text-[11px] text-slate-500 leading-relaxed">
        <ShieldCheck className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
        <p>
          {language === "en"
            ? "Data points are calibrated from Google Places mapping, regional business news, and national BPS surveys."
            : "Data disintesis dari pemetaan Google Places, berita ekonomi daerah, dan sensus konsumsi BPS untuk kalibrasi studi kelayakan."}
        </p>
      </div>
    </div>
  );
}
