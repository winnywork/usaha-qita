import React from "react";
import { Info } from "lucide-react";

export function DisclaimerBanner() {
  return (
    <div className="bg-amber-50 border-b border-amber-200/80 px-4 py-2 text-amber-900 text-xs">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            <strong>Konsep Literasi:</strong> Data usaha adalah simulasi edukasi untuk membantu perencanaan awal, bukan jaminan angka pasar riil.
          </span>
        </div>
        <span className="hidden sm:inline-block text-[11px] font-semibold text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded">
          Versi Purwarupa MVP
        </span>
      </div>
    </div>
  );
}