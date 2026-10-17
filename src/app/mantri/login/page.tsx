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
import { loginMantriAsync, getCurrentMantri, DEMO_MANTRI_ACCOUNTS } from "@/services/mantriService";
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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await loginMantriAsync(personalNumber, pin);
      setIsLoading(false);
      if (res.success) {
        router.push("/mantri/dashboard");
      } else {
        setError(res.error || "Gagal masuk. Periksa kembali NIP dan PIN Anda.");
      }
    } catch {
      setIsLoading(false);
      setError("Terjadi kesalahan koneksi server database. Silakan coba lagi.");
    }
  };

  const handleQuickDemo = async (nip: string, demoPin: string) => {
    setPersonalNumber(nip);
    setPin(demoPin);
    setError(null);
    setIsLoading(true);

    try {
      const res = await loginMantriAsync(nip, demoPin);
      setIsLoading(false);
      if (res.success) {
        router.push("/mantri/dashboard");
      }
    } catch {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between relative overflow-hidden py-8 px-4 sm:px-6">
      {/* Background Decor Elements */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-brand-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-brand-secondary/5 rounded-full blur-3xl pointer-events-none" />

      {/* Top Bar with Back to Public Link */}
      <div className="max-w-md w-full mx-auto flex items-center justify-between mb-4">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-brand-primary transition-colors font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{language === "en" ? "Back to UsahaQita Public" : "Kembali ke UsahaQita Publik"}</span>
        </Link>
        <span className="text-[11px] font-bold tracking-wider text-brand-primary bg-brand-light px-2.5 py-0.5 rounded-full border border-brand-accent/40 shadow-2xs">
          BANK-GRADE SECURE
        </span>
      </div>

      {/* Main Login Card */}
      <div className="max-w-md w-full mx-auto space-y-6">
        <Card className="bg-white border-slate-200/90 text-slate-900 p-6 sm:p-8 rounded-3xl shadow-xl shadow-blue-900/5">
          {/* Header Portal */}
          <div className="text-center space-y-3 pb-6 border-b border-slate-100">
            <div className="mx-auto w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-primary to-brand-secondary flex items-center justify-center text-white shadow-md shadow-brand-primary/25">
              <Building2 className="w-7 h-7 text-white" />
            </div>
            <div>
              <span className="text-[11px] font-black uppercase tracking-widest text-brand-primary">
                PT BANK RAKYAT INDONESIA (PERSERO) TBK
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">
                Portal Mantri BRI
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Sistem Monitoring & Pendampingan Calon Debitur Mikro UsahaQita
              </p>
            </div>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          {/* Form Login */}
          <form onSubmit={handleLogin} className="space-y-4 mt-6">
            <div className="space-y-1.5 text-left">
              <label className="text-xs font-semibold text-slate-700 flex items-center justify-between">
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
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:bg-white focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all uppercase"
                />
              </div>
            </div>

            <div className="space-y-1.5 text-left">
              <label className="text-xs font-semibold text-slate-700 flex items-center justify-between">
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
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:bg-white focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all tracking-widest"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={isLoading}
              className="w-full bg-brand-primary hover:bg-brand-dark text-white font-bold text-sm shadow-md shadow-brand-primary/25 rounded-xl mt-2"
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
          <div className="mt-6 pt-5 border-t border-slate-100 space-y-3 text-left">
            <div className="flex items-center gap-1.5 text-xs text-brand-primary font-bold">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Akses Cepat Pengujian (Demo Accounts):</span>
            </div>

            <div className="space-y-2">
              {DEMO_MANTRI_ACCOUNTS.map((acc) => (
                <button
                  key={acc.id}
                  type="button"
                  onClick={() => handleQuickDemo(acc.personalNumber, acc.pin)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 hover:bg-brand-light/70 border border-slate-200 hover:border-brand-primary/40 text-left transition-all group flex items-center justify-between shadow-2xs"
                >
                  <div className="space-y-0.5">
                    <div className="text-xs font-bold text-slate-800 group-hover:text-brand-primary transition-colors flex items-center gap-1.5">
                      <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{acc.name}</span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      {acc.unitName} • <span className="font-mono text-slate-700">{acc.personalNumber}</span>
                    </p>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-1 rounded bg-white text-brand-primary border border-brand-accent/50 group-hover:bg-brand-primary group-hover:text-white transition-all shadow-2xs">
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
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
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
