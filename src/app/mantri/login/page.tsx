"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ShieldCheck,
  Building2,
  Lock,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  Sparkles,
  UserCheck,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { loginMantri, getCurrentMantri, DEMO_MANTRI_ACCOUNTS } from "@/services/mantriService";
import { useLanguage } from "@/context/LanguageContext";

export default function MantriLoginPage() {
  const router = useRouter();
  const { language } = useLanguage();

  const [personalNumber, setPersonalNumber] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // If already logged in, redirect straight to dashboard
  useEffect(() => {
    const active = getCurrentMantri();
    if (active) {
      router.push("/mantri/dashboard");
    }
  }, [router]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    setTimeout(() => {
      const res = loginMantri(personalNumber, pin);
      setIsLoading(false);
      if (res.success) {
        router.push("/mantri/dashboard");
      } else {
        setError(res.error || "Gagal masuk. Periksa kembali NIP dan PIN Anda.");
      }
    }, 400);
  };

  const handleQuickDemo = (nip: string, demoPin: string) => {
    setPersonalNumber(nip);
    setPin(demoPin);
    setError(null);
    setIsLoading(true);

    setTimeout(() => {
      const res = loginMantri(nip, demoPin);
      setIsLoading(false);
      if (res.success) {
        router.push("/mantri/dashboard");
      }
    }, 300);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-between relative overflow-hidden py-8 px-4 sm:px-6">
      {/* Background Decor Elements */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-brand-primary/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Bar with Back to Public Link */}
      <div className="max-w-md w-full mx-auto flex items-center justify-between mb-4">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{language === "en" ? "Back to UsahaQita Public" : "Kembali ke UsahaQita Publik"}</span>
        </Link>
        <span className="text-[11px] font-semibold tracking-wider text-amber-400 bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/30">
          BANK-GRADE SECURE
        </span>
      </div>

      {/* Main Login Card */}
      <div className="max-w-md w-full mx-auto space-y-6">
        <Card className="bg-slate-950/80 border-slate-800 text-slate-100 p-6 sm:p-8 rounded-3xl shadow-2xl backdrop-blur-md">
          {/* Header Portal */}
          <div className="text-center space-y-3 pb-6 border-b border-slate-800/80">
            <div className="mx-auto w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-brand-primary flex items-center justify-center text-white shadow-lg shadow-blue-600/30">
              <Building2 className="w-7 h-7 text-white" />
            </div>
            <div>
              <span className="text-[11px] font-black uppercase tracking-widest text-blue-400">
                PT BANK RAKYAT INDONESIA (PERSERO) TBK
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-white mt-0.5">
                Portal Mantri BRI
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Sistem Monitoring & Pendampingan Calon Debitur Mikro UsahaQita
              </p>
            </div>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {/* Form Login */}
          <form onSubmit={handleLogin} className="space-y-4 mt-6">
            <div className="space-y-1.5 text-left">
              <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                <span>Personal Number / NIP Mantri</span>
                <span className="text-[10px] text-slate-500">Contoh: BRI-882041</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={personalNumber}
                  onChange={(e) => setPersonalNumber(e.target.value)}
                  placeholder="BRI-XXXXXX"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all uppercase"
                />
              </div>
            </div>

            <div className="space-y-1.5 text-left">
              <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                <span>PIN Keamanan / Sandi</span>
                <span className="text-[10px] text-slate-500">6 Digit Angka</span>
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  maxLength={12}
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="••••••"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all tracking-widest"
                />
                <Lock className="w-4 h-4 text-slate-500 absolute right-3.5 top-3" />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-600/30 rounded-xl mt-2"
            >
              {isLoading ? (
                <span>Memverifikasi Kredensial...</span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <span>Masuk ke Dashboard Mantri</span>
                  <ArrowRight className="w-4 h-4" />
                </span>
              )}
            </Button>
          </form>

          {/* Quick Demo Login Box */}
          <div className="mt-6 pt-5 border-t border-slate-800/80 space-y-3 text-left">
            <div className="flex items-center gap-1.5 text-xs text-amber-400 font-bold">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Akses Cepat Pengujian (Demo Accounts):</span>
            </div>

            <div className="space-y-2">
              {DEMO_MANTRI_ACCOUNTS.map((acc) => (
                <button
                  key={acc.id}
                  type="button"
                  onClick={() => handleQuickDemo(acc.personalNumber, acc.pin)}
                  className="w-full p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800/90 border border-slate-800 hover:border-blue-500/50 text-left transition-all group flex items-center justify-between"
                >
                  <div className="space-y-0.5">
                    <div className="text-xs font-bold text-slate-200 group-hover:text-blue-400 transition-colors flex items-center gap-1.5">
                      <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{acc.name}</span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      {acc.unitName} • <span className="font-mono text-slate-300">{acc.personalNumber}</span>
                    </p>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-1 rounded bg-blue-600/20 text-blue-400 border border-blue-500/30 group-hover:bg-blue-600 group-hover:text-white transition-all">
                    1-Click Masuk
                  </span>
                </button>
              ))}
            </div>
          </div>
        </Card>

        {/* Security & Disclaimer Footer */}
        <div className="text-center space-y-1 text-[11px] text-slate-500">
          <p className="flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Kerahasiaan data calon debitur dilindungi standar kepatuhan perbankan.</span>
          </p>
          <p>Portal Khusus Petugas Pemeringkat & Pendamping Usaha Mikro BRI.</p>
        </div>
      </div>

      {/* Bottom spacer */}
      <div className="h-4" />
    </div>
  );
}
