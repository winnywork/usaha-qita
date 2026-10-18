"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { Language } from "@/i18n/translations";

interface LanguageSwitcherProps {
  className?: string;
  variant?: "dropdown" | "compact";
}

export function LanguageSwitcher({ className }: LanguageSwitcherProps) {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const options: { code: Language; label: string; fullLabel: string; flag: string }[] = [
    { code: "id", label: "ID", fullLabel: "Bahasa Indonesia", flag: "🇮🇩" },
    { code: "en", label: "EN", fullLabel: "English", flag: "🇺🇸" },
  ];

  const currentOption = options.find((opt) => opt.code === language) || options[0];

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className={`relative inline-block text-left select-none ${className || ""}`} ref={dropdownRef}>
      {/* Compact Dropdown Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label={`Pilihan bahasa: saat ini ${currentOption.fullLabel}`}
        className="inline-flex items-center gap-1.5 h-8 px-2.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 border border-slate-200/90 text-slate-700 transition-all shadow-2xs hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
      >
        <span className="text-sm leading-none">{currentOption.flag}</span>
        <span className="text-[11px] font-bold tracking-wider text-slate-800">{currentOption.label}</span>
        <ChevronDown
          className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${
            isOpen ? "rotate-180 text-brand-primary" : ""
          }`}
        />
      </button>

      {/* Floating Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-1.5 w-44 rounded-xl bg-white border border-slate-200 shadow-xl shadow-slate-900/10 py-1 z-50 animate-in fade-in zoom-in-95 duration-100">
          <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
            Pilih Bahasa / Language
          </div>
          {options.map((opt) => {
            const isSelected = language === opt.code;
            return (
              <button
                key={opt.code}
                type="button"
                onClick={() => {
                  setLanguage(opt.code);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold transition-colors ${
                  isSelected
                    ? "bg-brand-light text-brand-primary font-bold"
                    : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm leading-none">{opt.flag}</span>
                  <span className="text-[12px]">{opt.fullLabel}</span>
                </div>
                {isSelected && <Check className="w-3.5 h-3.5 text-brand-primary shrink-0" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}