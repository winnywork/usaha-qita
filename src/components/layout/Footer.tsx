"use client";

import React from "react";
import Link from "next/link";
import { Compass, ShieldAlert } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 text-xs sm:text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5 text-white">
              <div className="w-8 h-8 rounded-lg bg-brand-primary flex items-center justify-center">
                <Compass className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-base tracking-tight">Usaha Qita</span>
              <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-brand-accent font-semibold">
                powered by BRI
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 max-w-md leading-relaxed">
              {t.footer.desc}
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-sm">{t.footer.navTitle}</h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  {t.nav.beranda}
                </Link>
              </li>
              <li>
                <Link href="/onboarding" className="hover:text-white transition-colors">
                  {t.nav.mulaiRencana}
                </Link>
              </li>
              <li>
                <Link href="/rekomendasi" className="hover:text-white transition-colors">
                  {t.nav.peluangUsaha}
                </Link>
              </li>
              <li>
                <Link href="/analisis" className="hover:text-white transition-colors">
                  {t.nav.analisisFinansial}
                </Link>
              </li>
              <li>
                <Link href="/roadmap" className="hover:text-white transition-colors">
                  {t.nav.roadmapUsaha}
                </Link>
              </li>
            </ul>
          </div>

          {/* Principles */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-sm">{t.footer.valuesTitle}</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              {t.footer.valuesDesc}
            </p>
          </div>
        </div>

        {/* Legal Disclaimer Box */}
        <div className="rounded-xl bg-slate-800/80 border border-slate-700 p-4 sm:p-5 flex items-start gap-3 text-slate-300 text-xs leading-relaxed mb-8">
          <ShieldAlert className="w-5 h-5 text-brand-accent shrink-0 mt-0.5" />
          <p>{t.footer.disclaimerNotice}</p>
        </div>

        {/* Copyright */}
        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>&copy; {new Date().getFullYear()} Usaha Qita. {t.footer.rights}</p>
          <p>{t.footer.subRights}</p>
        </div>
      </div>
    </footer>
  );
}