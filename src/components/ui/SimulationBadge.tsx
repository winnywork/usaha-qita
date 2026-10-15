import React from "react";
import { Sparkles, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface SimulationBadgeProps {
  className?: string;
  showExplanation?: boolean;
}

export function SimulationBadge({ className, showExplanation = false }: SimulationBadgeProps) {
  return (
    <div className={cn("inline-flex flex-col gap-1", className)}>
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-900 border border-amber-300 shadow-sm">
        <Sparkles className="w-3.5 h-3.5 text-amber-600" />
        <span>Data Simulasi Edukasi</span>
      </span>
      {showExplanation && (
        <span className="inline-flex items-center gap-1 text-[11px] text-slate-500">
          <Info className="w-3 h-3 text-slate-400 shrink-0" />
          Model perencanaan perkiraan, bukan jaminan angka riil pasar.
        </span>
      )}
    </div>
  );
}