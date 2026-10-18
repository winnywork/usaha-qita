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

  // If inside internal Mantri Portal or Administrator routes, hide public navbar
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
        <div className="flex items-center justify-between h-15 sm:h-16">
          {/* Logo & Identity */}
          <Link href="/" className="flex items-center gap-2.5 group shrink-0 py-1">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-brand-primary to-brand-secondary flex items-center justify-center text-white shadow-md shadow-blue-900/15 group-hover:scale-105 transition-transform shrink-0">
              <Compass className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="flex flex-col justify-center">
              <span className="text-sm sm:text-base font-extrabold tracking-tight text-slate-900 leading-none">
                Usaha Qita
              </span>
              <span className="text-[9px] sm:text-[10px] font-bold text-brand-secondary uppercase tracking-wider mt-0.5">
                {t.nav.brandConcept}
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links - Clean, Compact Typography */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-1.5 rounded-xl text-xs xl:text-[13px] transition-all ${
                  isActive(link.href)
                    ? "bg-brand-light text-brand-primary border border-brand-accent/40 shadow-2xs font-bold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 font-semibold"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Right Action Bar: Compact Flag Dropdown + CTA Button */}
          <div className="hidden lg:flex items-center gap-2.5 shrink-0">
            {/* Compact Flag Dropdown */}
            <LanguageSwitcher />

            {/* Compact Primary CTA Button */}
            <Link href="/onboarding" className="shrink-0">
              <Button
                size="sm"
                variant="accent"
                className="h-8 px-3.5 text-xs font-bold shadow-sm rounded-xl"
                rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
              >
                {t.nav.planButton}
              </Button>
            </Link>
          </div>

          {/* Mobile Right Bar: Language Dropdown + Hamburger */}
          <div className="flex lg:hidden items-center gap-2">
            <LanguageSwitcher />

            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="w-8 h-8 flex items-center justify-center rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-primary transition-colors"
              aria-label="Buka menu navigasi"
            >
              {isOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isOpen && (
        <div className="lg:hidden border-b border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top-2 duration-150 shadow-lg">
          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`px-3.5 py-2.5 rounded-xl text-xs sm:text-sm transition-colors ${
                  isActive(link.href)
                    ? "bg-brand-light text-brand-primary border border-brand-accent/40 font-bold"
                    : "text-slate-700 hover:bg-slate-100 font-semibold"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="pt-2">
            <Link href="/onboarding" onClick={() => setIsOpen(false)} className="w-full block">
              <Button fullWidth variant="accent" size="md" className="h-10 text-xs sm:text-sm font-bold shadow-sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
                {t.hero.startBtn}
              </Button>
            </Link>
          </div>

          {/* Mobile Link to Mantri Portal at the bottom of the drawer */}
          <div className="pt-2 border-t border-slate-100">
            <Link
              href="/mantri/login"
              onClick={() => setIsOpen(false)}
              className="px-3.5 py-2 rounded-xl text-xs font-bold text-blue-900 bg-blue-50/80 border border-blue-200/80 flex items-center gap-2"
            >
              <Building2 className="w-3.5 h-3.5 text-blue-700" />
              <span>Portal Khusus Petugas Mantri BRI</span>
            </Link>
          </div>

          <div className="pt-1 text-[11px] text-slate-500 flex items-center gap-1.5 px-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>{t.nav.mobileNotice}</span>
          </div>
        </div>
      )}
    </header>
  );
}