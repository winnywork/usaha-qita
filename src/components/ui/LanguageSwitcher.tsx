"use client";

import React from "react";
import { Globe } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { Language } from "@/i18n/translations";

interface LanguageSwitcherProps {
  className?: string;
  variant?: "pill" | "compact";
}

export function LanguageSwitcher({ className, variant = "pill" }: LanguageSwitcherProps) {
  const { language, setLanguage } = useLanguage();

  const options: { code: Language; label: string; flag: string }[] = [
    { code: "id", label: "ID", flag: "🇮🇩" },
    { code: "en", label: "EN", flag: "🇺🇸" },
  ];

  if (variant === "compact") {
    return (
      <div className={`inline-flex items-center rounded-xl bg-slate-100 p-0.5 border border-slate-200 ${className || ""}`}>
        {options.map((opt) => (
          <button
            key={opt.code}
            type="button"
            onClick={() => setLanguage(opt.code)}
            aria-label={`Ganti bahasa ke ${opt.label}`}
            className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
              language === opt.code
                ? "bg-brand-primary text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <span className="mr-1">{opt.flag}</span>
            <span>{opt.label}</span>
          </button>
        ))}
      </div>
    );
  }

  return (
    <div
      className={`inline-flex items-center gap-1 p-1 rounded-xl bg-slate-100/90 border border-slate-200/80 shadow-inner select-none ${className || ""}`}
      role="group"
      aria-label="Pilihan Bahasa"
    >
      <div className="pl-1.5 pr-1 text-slate-400">
        <Globe className="w-3.5 h-3.5" />
      </div>
      {options.map((opt) => {
        const isActive = language === opt.code;
        return (
          <button
            key={opt.code}
            type="button"
            onClick={() => setLanguage(opt.code)}
            aria-pressed={isActive}
            className={`flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
              isActive
                ? "bg-brand-primary text-white shadow-sm shadow-blue-900/10"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
            }`}
          >
            <span>{opt.flag}</span>
            <span>{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}