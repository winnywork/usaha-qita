"use client";

import React, { useState } from "react";
import {
  ArrowRight,
  Coins,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { SimulationBadge } from "@/components/ui/SimulationBadge";
import { OpportunityMatchResult } from "@/core/matching/matcher";
import { formatRupiah } from "@/core/finance/calculator";
import { saveSelectedOpportunity } from "@/services/storageService";
import { useLanguage } from "@/context/LanguageContext";
import { MarketIntelligencePanel } from "@/components/rekomendasi/MarketIntelligencePanel";

interface OpportunityCardProps {
  result: OpportunityMatchResult;
  cityLocation?: string;
  specificLocation?: string;
  onSelect?: () => void;
}

export function OpportunityCard({
  result,
  cityLocation,
  specificLocation,
  onSelect,
}: OpportunityCardProps) {
  const { opportunity, matchScore, matchReasons, isAffordable } = result;
  const { t } = useLanguage();
  const [showMarketIntel, setShowMarketIntel] = useState(false);

  const handleSelect = () => {
    saveSelectedOpportunity(opportunity);
    if (onSelect) onSelect();
  };

  return (
    <Card hoverable className="flex flex-col justify-between overflow-hidden border-slate-200">
      <CardContent className="p-5 sm:p-6 space-y-4">
        {/* Header Badge & Skor Kecocokan */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Badge variant="blue" className="capitalize">
              {opportunity.category}
            </Badge>
            <SimulationBadge />
          </div>

          <span
            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
              matchScore >= 80
                ? "bg-emerald-50 text-emerald-800 border border-emerald-300"
                : matchScore >= 60
                ? "bg-brand-light text-brand-primary border border-brand-accent/60"
                : "bg-slate-100 text-slate-700 border border-slate-300"
            }`}
          >
            {matchScore}% {t.rekomendasi.matchScore}
          </span>
        </div>

        {/* Judul & Deskripsi */}
        <div className="space-y-1.5">
          <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
            {opportunity.title}
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed">
            {opportunity.shortDescription}
          </p>
        </div>

        {/* Modal Info Box */}
        <div className="rounded-xl bg-brand-light/60 border border-brand-accent/30 p-3.5 space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-600 flex items-center gap-1.5 font-medium">
              <Coins className="w-4 h-4 text-brand-secondary" />
              {t.rekomendasi.estCapital}
            </span>
            <span className="font-bold text-brand-primary">
              {formatRupiah(opportunity.estimatedMinCapital)} -{" "}
              {formatRupiah(opportunity.estimatedMaxCapital)}
            </span>
          </div>

          {!isAffordable && (
            <p className="text-[11px] text-amber-700 font-medium pt-1">
              {t.rekomendasi.capitalExceeded}
            </p>
          )}
        </div>

        {/* Mengapa Cocok? */}
        {matchReasons.length > 0 && (
          <div className="space-y-1 pt-1">
            <span className="text-xs font-semibold text-slate-700 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              {t.rekomendasi.whyMatch}
            </span>
            <ul className="text-xs text-slate-600 space-y-1 pl-5 list-disc leading-relaxed">
              {matchReasons.slice(0, 3).map((reason, idx) => (
                <li key={idx}>{reason}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Risiko Utama */}
        {opportunity.keyRisks.length > 0 && (
          <div className="space-y-1 pt-1">
            <span className="text-xs font-semibold text-slate-700 flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              {t.rekomendasi.risks}
            </span>
            <p className="text-xs text-slate-600 leading-relaxed italic bg-amber-50/50 p-2.5 rounded-lg border border-amber-200/50">
              &ldquo;{opportunity.keyRisks[0]}&rdquo;
            </p>
          </div>
        )}

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {opportunity.tags.map((tag) => (
            <span
              key={tag}
              className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-normal"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Tombol Panel Sumber Riset Pasar (5 Pilar) */}
        {opportunity.marketIntelligence && (
          <div className="pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowMarketIntel(!showMarketIntel)}
              className="w-full flex items-center justify-between p-2.5 rounded-xl bg-blue-50/70 hover:bg-blue-100/70 border border-blue-200/80 text-brand-primary text-xs font-semibold transition-colors"
            >
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-brand-secondary" />
                <span>
                  {showMarketIntel
                    ? t.rekomendasi.marketIntelHide
                    : t.rekomendasi.marketIntelButton}
                </span>
              </div>
              {showMarketIntel ? (
                <ChevronUp className="w-4 h-4 text-brand-secondary" />
              ) : (
                <ChevronDown className="w-4 h-4 text-brand-secondary" />
              )}
            </button>

            {showMarketIntel && (
              <div className="mt-3">
                <MarketIntelligencePanel
                  intelligence={opportunity.marketIntelligence}
                  cityLocation={cityLocation}
                  specificLocation={specificLocation}
                />
              </div>
            )}
          </div>
        )}
      </CardContent>

      {/* Action Footer dengan Palet Baru */}
      <div className="p-5 sm:p-6 pt-0 border-t border-slate-100 bg-slate-50/50 mt-4 flex items-center justify-between gap-3">
        <span className="text-[11px] text-slate-500 font-medium">
          {t.rekomendasi.difficulty}{" "}
          <span className="font-semibold text-slate-700">{opportunity.difficultyLevel}</span>
        </span>

        <button
          onClick={handleSelect}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-brand-primary hover:bg-brand-secondary transition-colors shadow-sm shadow-blue-900/15"
        >
          <span>{t.rekomendasi.selectAndAnalyze}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </Card>
  );
}
