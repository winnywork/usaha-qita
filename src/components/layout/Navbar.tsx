"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, Menu, X, ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Beranda" },
    { href: "/onboarding", label: "Mulai Rencana" },
    { href: "/rekomendasi", label: "Peluang Usaha" },
    { href: "/analisis", label: "Analisis Finansial" },
    { href: "/roadmap", label: "Roadmap Usaha" },
    { href: "/mantri", label: "Konsultasi Mantri" },
  ];

  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true;
    if (path !== "/" && pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & Identity */}
          <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group shrink-0">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-bri-blue to-bri-blue-dark flex items-center justify-center text-white shadow-md shadow-blue-900/10 group-hover:scale-105 transition-transform">
              <Compass className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="flex flex-col">
              <span className="text-base sm:text-lg font-bold tracking-tight text-slate-900 leading-tight">
                Usaha Qita
              </span>
              <span className="text-[10px] sm:text-xs font-semibold text-bri-orange uppercase tracking-wider">
                powered by BRI (Konsep)
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 rounded-xl text-xs xl:text-sm font-medium transition-all ${
                  isActive(link.href)
                    ? "bg-blue-50 text-bri-blue font-semibold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Action / CTA */}
          <div className="hidden sm:flex items-center gap-3 shrink-0">
            <Link href="/onboarding">
              <Button size="sm" variant="orange" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Rencanakan Usaha
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-bri-blue"
            aria-label="Buka menu navigasi"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu (360px - 1024px) */}
      {isOpen && (
        <div className="lg:hidden border-b border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top-2 duration-150">
          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  isActive(link.href)
                    ? "bg-blue-50 text-bri-blue font-semibold"
                    : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="pt-3">
            <Link href="/onboarding" onClick={() => setIsOpen(false)} className="w-full block">
              <Button fullWidth variant="orange" size="md" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Mulai Rencana Sekarang
              </Button>
            </Link>
          </div>

          <div className="pt-2 text-[11px] text-slate-500 flex items-center gap-1.5 px-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>Simulasi edukatif independen untuk calon wirausaha UMKM.</span>
          </div>
        </div>
      )}
    </header>
  );
}