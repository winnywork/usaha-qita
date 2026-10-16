"use client";

import React from "react";
import {
  Share2,
  MapPin,
  Newspaper,
  TrendingUp,
  BarChart3,
  Sparkles,
} from "lucide-react";
import { MarketIntelligence } from "@/types/business";
import { useLanguage } from "@/context/LanguageContext";

interface MarketIntelligencePanelProps {
  intelligence: MarketIntelligence;
  cityLocation?: string;
  specificLocation?: string;
}

export function MarketIntelligencePanel({
  intelligence,
  cityLocation,
  specificLocation,
}: MarketIntelligencePanelProps) {
  const { t, language } = useLanguage();

  const { socialMediaTrend, googlePlaces, localNews, googleTrends, bpsStats } = intelligence;

  const locationDisplay = specificLocation
    ? `${specificLocation}, ${cityLocation || "Indonesia"}`
    : cityLocation || (language === "en" ? "Target Location" : "Lokasi Target");

  return (
    <div className="rounded-2xl border border-brand-primary/20 bg-gradient-to-b from-blue-50/50 via-white to-slate-50/60 p-4 sm:p-5 space-y-4 shadow-sm text-left">
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/80 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-brand-primary flex items-center justify-center text-white shadow-sm shrink-0">
            <Sparkles className="w-4 h-4 text-brand-accent" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <span>{t.rekomendasi.marketIntelTitle}</span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-brand-primary border border-blue-200">
                5 Sinyal Riset
              </span>
            </h4>
            <p className="text-[11px] text-slate-500">
              {locationDisplay && (
                <span>
                  {language === "en" ? "Calibrated for: " : "Dikalibrasi untuk area: "}
                  <strong className="text-slate-700">{locationDisplay}</strong>
                </span>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Grid 5 Sumber Riset Pasar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Sumber 1: Tren Media Sosial */}
        <div className="rounded-xl border border-rose-100 bg-rose-50/30 p-3.5 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-rose-800 flex items-center gap-1.5">
              <Share2 className="w-3.5 h-3.5 text-rose-600" />
              {t.rekomendasi.sourceSocial}
            </span>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 border border-rose-200">
              Skor: {socialMediaTrend.trendScore}/100
            </span>
          </div>
          <p className="text-xs text-slate-700 leading-relaxed">
            {socialMediaTrend.summary}
          </p>
          <div className="text-[11px] font-semibold text-rose-600">
            {socialMediaTrend.hashtag}
          </div>
        </div>

        {/* Sumber 2: Google Places & Lokasi */}
        <div className="rounded-xl border border-emerald-100 bg-emerald-50/30 p-3.5 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-emerald-800 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              {t.rekomendasi.sourcePlaces}
            </span>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
              {t.rekomendasi.densityLabel} {googlePlaces.densityLevel}
            </span>
          </div>
          <p className="text-xs text-slate-700 leading-relaxed">
            {googlePlaces.summary}
          </p>
          <div className="text-[11px] text-emerald-700 font-medium">
            {t.rekomendasi.footTrafficLabel} <strong className="font-bold">{googlePlaces.footTrafficScore}</strong> (Radius ~{googlePlaces.competitorRadiusKm} km)
          </div>
        </div>

        {/* Sumber 3: Google Trends */}
        <div className="rounded-xl border border-blue-100 bg-blue-50/30 p-3.5 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-brand-primary flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-brand-secondary" />
              {t.rekomendasi.sourceTrends}
            </span>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-brand-primary border border-blue-200">
              +{googleTrends.growthRatePercentage}% {googleTrends.momentum}
            </span>
          </div>
          <p className="text-xs text-slate-700 leading-relaxed">
            {googleTrends.summary}
          </p>
          <div className="text-[11px] text-brand-secondary font-medium">
            Search Index: <strong className="font-bold text-brand-primary">{googleTrends.searchVolumeIndex}/100</strong>
          </div>
        </div>

        {/* Sumber 4: Berita Ekonomi Lokal */}
        <div className="rounded-xl border border-amber-100 bg-amber-50/30 p-3.5 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-amber-900 flex items-center gap-1.5">
              <Newspaper className="w-3.5 h-3.5 text-amber-700" />
              {t.rekomendasi.sourceNews}
            </span>
            <span className="text-[10px] text-amber-800 font-medium">
              {localNews.source}
            </span>
          </div>
          <p className="text-xs font-semibold text-slate-800 leading-snug">
            &ldquo;{localNews.headline}&rdquo;
          </p>
          <p className="text-xs text-slate-600 leading-relaxed">
            {localNews.summary}
          </p>
        </div>
      </div>

      {/* Sumber 5: Data Statistik BPS */}
      <div className="rounded-xl border border-indigo-100 bg-indigo-50/30 p-3.5 space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-indigo-900 flex items-center gap-1.5">
            <BarChart3 className="w-3.5 h-3.5 text-indigo-700" />
            {t.rekomendasi.sourceBps}
          </span>
          <span className="text-[11px] font-bold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-full border border-indigo-200">
            {bpsStats.metricValue}
          </span>
        </div>
        <p className="text-xs text-slate-700 leading-relaxed">
          <strong className="font-semibold text-slate-900">{bpsStats.metricName}:</strong> {bpsStats.relevance}
        </p>
      </div>

      {/* Catatan Transparansi Footer */}
      <p className="text-[10px] text-slate-400 italic text-center pt-1">
        * Indikator di atas disintesis dari data historis tren regional, Google Places mapping, berita ekonomi, dan publikasi sensus BPS untuk keperluan simulasi studi kelayakan.
      </p>
    </div>
  );
}
