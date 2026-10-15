"use client";

import React from "react";
import Link from "next/link";
import { Compass, ShieldAlert } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-brand-primary text-blue-100 border-t border-brand-dark text-xs sm:text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5 text-white">
              <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-md flex items-center justify-center text-white shadow-sm">
                <Compass className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-base tracking-tight text-white">Usaha Qita</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-white/15 text-white font-semibold border border-white/20">
                powered by BRI
              </span>
            </div>
            <p className="text-xs sm:text-sm text-blue-100/90 max-w-md leading-relaxed">
              {t.footer.desc}
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm tracking-wide">{t.footer.navTitle}</h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <Link href="/" className="text-blue-100 hover:text-white transition-colors">
                  {t.nav.beranda}
                </Link>
              </li>
              <li>
                <Link href="/onboarding" className="text-blue-100 hover:text-white transition-colors">
                  {t.nav.mulaiRencana}
                </Link>
              </li>
              <li>
                <Link href="/rekomendasi" className="text-blue-100 hover:text-white transition-colors">
                  {t.nav.peluangUsaha}
                </Link>
              </li>
              <li>
                <Link href="/analisis" className="text-blue-100 hover:text-white transition-colors">
                  {t.nav.analisisFinansial}
                </Link>
              </li>
              <li>
                <Link href="/roadmap" className="text-blue-100 hover:text-white transition-colors">
                  {t.nav.roadmapUsaha}
                </Link>
              </li>
            </ul>
          </div>

          {/* Principles */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm tracking-wide">{t.footer.valuesTitle}</h4>
            <p className="text-xs text-blue-100/90 leading-relaxed">
              {t.footer.valuesDesc}
            </p>
          </div>
        </div>

        {/* Legal Disclaimer Box */}
        <div className="rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 p-4 sm:p-5 flex items-start gap-3 text-blue-50 text-xs leading-relaxed mb-8 shadow-sm">
          <ShieldAlert className="w-5 h-5 text-brand-accent shrink-0 mt-0.5" />
          <p>{t.footer.disclaimerNotice}</p>
        </div>

        {/* Copyright */}
        <div className="pt-6 border-t border-white/15 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-blue-200">
          <p>&copy; {new Date().getFullYear()} Usaha Qita. {t.footer.rights}</p>
          <p>{t.footer.subRights}</p>
        </div>
      </div>
    </footer>
  );
}