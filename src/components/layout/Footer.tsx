import React from "react";
import Link from "next/link";
import { Compass, ShieldAlert } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 text-xs sm:text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5 text-white">
              <div className="w-8 h-8 rounded-lg bg-bri-blue flex items-center justify-center">
                <Compass className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-base tracking-tight">Usaha Qita</span>
              <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-bri-orange font-semibold">
                powered by BRI
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 max-w-md leading-relaxed">
              Asisten perencanaan usaha cerdas dan ramah bagi masyarakat Indonesia yang ingin memulai atau mengembangkan usaha dengan perhitungan matematis yang terukur.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-sm">Alur Navigasi</h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Beranda
                </Link>
              </li>
              <li>
                <Link href="/onboarding" className="hover:text-white transition-colors">
                  Formulir Profil Usaha
                </Link>
              </li>
              <li>
                <Link href="/rekomendasi" className="hover:text-white transition-colors">
                  Katalog Peluang Usaha
                </Link>
              </li>
            </ul>
          </div>

          {/* Literacy & Concept Note */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-sm">Prinsip & Nilai</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Didesain dengan pendekatan transparansi penuh: seluruh data peluang usaha adalah simulasi edukasi untuk membekali calon pengusaha sebelum melangkah ke dunia nyata.
            </p>
          </div>
        </div>

        {/* Legal Disclaimer Box */}
        <div className="rounded-xl bg-slate-800/80 border border-slate-700 p-4 sm:p-5 flex items-start gap-3 text-slate-300 text-xs leading-relaxed mb-8">
          <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <p>
            <strong className="text-white">Pernyataan Transparansi Produk:</strong> &ldquo;Usaha Qita — powered by BRI&rdquo; adalah purwarupa konsep edukasi perencanaan usaha independen. Aplikasi ini bukan merupakan produk atau layanan perbankan resmi dari PT Bank Rakyat Indonesia (Persero) Tbk, tidak memberikan jaminan atau persetujuan pinjaman kredit, dan tidak terhubung ke basis data internal perbankan. Seluruh angka estimasi dan simulasi pasar ditujukan untuk literasi perencanaan.
          </p>
        </div>

        {/* Copyright */}
        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>&copy; {new Date().getFullYear()} Usaha Qita. Hak Cipta Dilindungi Undang-Undang.</p>
          <p>Dibuat untuk pemberdayaan wirausaha pemula Indonesia.</p>
        </div>
      </div>
    </footer>
  );
}