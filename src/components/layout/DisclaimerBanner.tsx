"use client";

import React from "react";
import { Info } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export function DisclaimerBanner() {
  const { t } = useLanguage();

  return (
    <aside aria-label="Informasi Edukasi" className="bg-sky-50/90 border-b border-brand-accent/40 px-4 py-2 text-slate-800 text-xs">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-brand-primary shrink-0" />
          <span>
            <strong className="text-brand-primary font-bold">Disclaimer:</strong> {t.nav.disclaimerText}
          </span>
        </div>
        <span className="hidden sm:inline-block text-[11px] font-bold text-brand-primary bg-brand-light border border-brand-accent/50 px-2 py-0.5 rounded">
          {t.nav.disclaimerTag}
        </span>
      </div>
    </aside>
  );
}