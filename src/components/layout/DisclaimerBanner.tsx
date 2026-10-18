"use client";

import React from "react";
import { ShieldCheck } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export function DisclaimerBanner() {
  const { t } = useLanguage();

  return (
    <aside aria-label="Informasi Edukasi & Kepatuhan" className="bg-gradient-to-r from-sky-50/90 via-blue-50/80 to-sky-50/90 border-b border-brand-accent/30 px-4 py-2 text-slate-700 text-xs">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="truncate sm:overflow-visible">
            <strong className="text-brand-primary font-bold">Transparansi:</strong> {t.nav.disclaimerText}
          </span>
        </div>
        <span className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-bold text-brand-primary bg-white/90 border border-brand-accent/40 px-2.5 py-0.5 rounded-full shadow-2xs shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          {t.nav.disclaimerTag}
        </span>
      </div>
    </aside>
  );
}