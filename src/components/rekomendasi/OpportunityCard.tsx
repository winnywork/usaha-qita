import React from "react";
import {
  ArrowRight,
  Coins,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { SimulationBadge } from "@/components/ui/SimulationBadge";
import { OpportunityMatchResult } from "@/core/matching/matcher";
import { formatRupiah } from "@/core/finance/calculator";
import { saveSelectedOpportunity } from "@/services/storageService";

interface OpportunityCardProps {
  result: OpportunityMatchResult;
  onSelect?: () => void;
}

export function OpportunityCard({ result, onSelect }: OpportunityCardProps) {
  const { opportunity, matchScore, matchReasons, isAffordable } = result;

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
                ? "bg-blue-50 text-bri-blue border border-blue-300"
                : "bg-slate-100 text-slate-700 border border-slate-300"
            }`}
          >
            {matchScore}% Cocok
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
        <div className="rounded-xl bg-slate-50 border border-slate-200/80 p-3.5 space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500 flex items-center gap-1.5 font-medium">
              <Coins className="w-4 h-4 text-amber-600" />
              Estimasi Kebutuhan Modal:
            </span>
            <span className="font-bold text-slate-900">
              {formatRupiah(opportunity.estimatedMinCapital)} -{" "}
              {formatRupiah(opportunity.estimatedMaxCapital)}
            </span>
          </div>

          {!isAffordable && (
            <p className="text-[11px] text-amber-700 font-medium pt-1">
              * Di atas anggaran awal Anda, dapat dipertimbangkan setelah modal bertambah.
            </p>
          )}
        </div>

        {/* Mengapa Cocok? */}
        {matchReasons.length > 0 && (
          <div className="space-y-1 pt-1">
            <span className="text-xs font-semibold text-slate-700 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Alasan Rekomendasi:
            </span>
            <ul className="text-xs text-slate-600 space-y-1 pl-5 list-disc leading-relaxed">
              {matchReasons.slice(0, 2).map((reason, idx) => (
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
              Risiko yang Perlu Diantisipasi:
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
      </CardContent>

      {/* Action Footer */}
      <div className="p-5 sm:p-6 pt-0 border-t border-slate-100 bg-slate-50/50 mt-4 flex items-center justify-between gap-3">
        <span className="text-[11px] text-slate-500 font-medium">
          Tingkat: <span className="font-semibold text-slate-700">{opportunity.difficultyLevel}</span>
        </span>

        <button
          onClick={handleSelect}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-bri-blue hover:bg-bri-blue-hover transition-colors shadow-sm"
        >
          <span>Pilih & Analisis</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </Card>
  );
}