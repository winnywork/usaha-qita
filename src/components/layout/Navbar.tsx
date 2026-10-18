"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, Menu, X, ArrowRight, ShieldCheck, Building2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { useLanguage } from "@/context/LanguageContext";

export function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useLanguage();

  // If inside internal Mantri Portal routes, hide public navbar (they have their own bank-grade header)
  if (
    pathname.startsWith("/mantri/dashboard") ||
    pathname.startsWith("/mantri/prospek") ||
    pathname.startsWith("/mantri/login") ||
    pathname.startsWith("/admin")
  ) {
    return null;
  }

  const navLinks = [
    { href: "/", label: t.nav.beranda },
    { href: "/rekomendasi", label: t.nav.peluangUsaha },
    { href: "/analisis", label: t.nav.analisisFinansial },
    { href: "/roadmap", label: t.nav.roadmapUsaha },
    { href: "/mantri", label: t.nav.konsultasiMantri },
  ];

  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true;
    if (path !== "/" && pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & Identity */}
          <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group shrink-0 py-1">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-brand-primary to-brand-secondary flex items-center justify-center text-white shadow-md shadow-blue-900/15 group-hover:scale-105 transition-transform shrink-0">
              <Compass className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="flex flex-col justify-center">
              <span className="text-base sm:text-lg font-extrabold tracking-tight text-slate-900 leading-none">
                Usaha Qita
              </span>
              <span className="text-[10px] sm:text-[11px] font-bold text-brand-secondary uppercase tracking-wider mt-0.5">
                {t.nav.brandConcept}
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links - Centered & Clean */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm transition-all ${
                  isActive(link.href)
                    ? "bg-brand-light text-brand-primary border border-brand-accent/40 shadow-2xs font-bold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-semibold"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Right Action Bar: Mantri Portal + Language + CTA Button (All aligned vertically at 38px) */}
          <div className="hidden lg:flex items-center gap-2.5 xl:gap-3 shrink-0">
            {/* Quick Access to Mantri Portal */}
            <Link
              href="/mantri/login"
              className="h-[38px] px-3.5 rounded-xl text-xs font-bold text-blue-900 bg-blue-50/90 hover:bg-blue-100 border border-blue-200/90 flex items-center gap-1.5 transition-colors shadow-2xs shrink-0"
              title="Akses Portal Monitoring Petugas Mantri BRI"
            >
              <Building2 className="w-3.5 h-3.5 text-blue-700" />
              <span>Portal Mantri</span>
            </Link>

            <div className="h-[38px] flex items-center shrink-0">
              <LanguageSwitcher />
            </div>

            <Link href="/onboarding" className="shrink-0">
              <Button size="sm" variant="accent" className="h-[38px] px-4 text-xs font-bold shadow-sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                {t.nav.planButton}
              </Button>
            </Link>
          </div>

          {/* Mobile Right Bar: Mantri Pill + Language Switcher + Hamburger (Active only below lg) */}
          <div className="flex lg:hidden items-center gap-2">
            <Link
              href="/mantri/login"
              className="h-8 px-2.5 rounded-lg text-[11px] font-bold text-blue-900 bg-blue-50 border border-blue-200 flex items-center gap-1"
            >
              <Building2 className="w-3 h-3 text-blue-700" />
              <span>Mantri</span>
            </Link>

            <LanguageSwitcher variant="compact" />

            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="w-9 h-9 flex items-center justify-center rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-primary transition-colors"
              aria-label="Buka menu navigasi"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu (Visible only below lg when open) */}
      {isOpen && (
        <div className="lg:hidden border-b border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top-2 duration-150 shadow-lg">
          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`px-4 py-3 rounded-xl text-sm transition-colors ${
                  isActive(link.href)
                    ? "bg-brand-light text-brand-primary border border-brand-accent/40 font-bold"
                    : "text-slate-700 hover:bg-slate-100 font-semibold"
                }`}
              >
                {link.label}
              </Link>
            ))}

            {/* Mobile Link to Mantri Portal */}
            <Link
              href="/mantri/login"
              onClick={() => setIsOpen(false)}
              className="px-4 py-3 rounded-xl text-sm font-bold text-blue-950 bg-blue-50/80 border border-blue-200/80 flex items-center gap-2 mt-1"
            >
              <Building2 className="w-4 h-4 text-blue-700" />
              <span>Portal Monitoring Mantri BRI</span>
            </Link>
          </div>

          <div className="pt-2">
            <Link href="/onboarding" onClick={() => setIsOpen(false)} className="w-full block">
              <Button fullWidth variant="accent" size="md" className="h-11 font-bold shadow-sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
                {t.hero.startBtn}
              </Button>
            </Link>
          </div>

          <div className="pt-2 text-[11px] text-slate-500 flex items-center gap-1.5 px-1 border-t border-slate-100">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>{t.nav.mobileNotice}</span>
          </div>
        </div>
      )}
    </header>
  );
}