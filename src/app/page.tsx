"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  TrendingUp,
  Calculator,
  CheckCircle2,
  Users,
  Shield,
  Layers,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { getUserProfile } from "@/services/storageService";
import { UserProfile } from "@/types/user";
import { formatRupiah } from "@/core/finance/calculator";
import { useLanguage } from "@/context/LanguageContext";

export default function HomePage() {
  const [savedProfile, setSavedProfile] = useState<UserProfile | null>(null);
  const { t } = useLanguage();

  useEffect(() => {
    const profile = getUserProfile();
    if (profile) {
      setSavedProfile(profile);
    }
  }, []);

  return (
    <div className="flex flex-col gap-12 sm:gap-16">
      {/* 1. Hero Section dengan Palet Baru (#0857C3, #307FE3, #71C5E8) */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-primary via-brand-dark to-slate-900 text-white p-6 sm:p-10 lg:p-14 shadow-xl shadow-blue-950/20">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-brand-accent/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-brand-secondary/25 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-5 sm:space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-blue-100">
            <Sparkles className="w-3.5 h-3.5 text-brand-accent" />
            <span>{t.hero.badge}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight text-white">
            {t.hero.titlePart1} <span className="text-brand-accent underline decoration-brand-secondary/60 underline-offset-8">{t.hero.titleHighlight}</span> {t.hero.titlePart2}
          </h1>

          <p className="text-sm sm:text-base lg:text-lg text-slate-200 leading-relaxed max-w-2xl">
            {t.hero.description}
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
            <Link href="/onboarding">
              <Button
                variant="accent"
                size="lg"
                fullWidth
                rightIcon={<ArrowRight className="w-5 h-5" />}
                className="shadow-lg shadow-blue-600/30"
              >
                {t.hero.startBtn}
              </Button>
            </Link>

            <Link href="/rekomendasi">
              <Button
                variant="outline"
                size="lg"
                fullWidth
                className="bg-white/10 text-white border-white/30 hover:bg-white/20 hover:text-white"
              >
                {t.hero.browseBtn}
              </Button>
            </Link>
          </div>

          <div className="pt-4 flex flex-wrap items-center gap-4 text-xs text-blue-200">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-brand-accent" />
              <span>{t.hero.point1}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-brand-accent" />
              <span>{t.hero.point2}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-brand-accent" />
              <span>{t.hero.point3}</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Dashboard Awal Pengguna (Jika Ada Profil Tersimpan) */}
      {savedProfile && (
        <section aria-labelledby="dashboard-title">
          <Card className="border-brand-accent/40 bg-gradient-to-r from-brand-light via-white to-sky-50/50">
            <CardContent className="p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant="blue">{t.dashboard.activePlanBadge}</Badge>
                  <span className="text-xs text-slate-500">{t.dashboard.storedLocally}</span>
                </div>
                <h2 id="dashboard-title" className="text-base sm:text-lg font-bold text-slate-900">
                  {t.dashboard.targetCity} {savedProfile.cityLocation || "Indonesia"} {t.dashboard.withCapital}{" "}
                  {formatRupiah(savedProfile.availableCapital)}
                </h2>
                <p className="text-xs sm:text-sm text-slate-600">
                  {t.dashboard.interestIn}{" "}
                  <span className="font-semibold text-brand-primary">
                    {savedProfile.categoryInterest.join(", ") || t.dashboard.allCategories}
                  </span>
                </p>
              </div>

              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                <Link href="/rekomendasi" className="w-full sm:w-auto">
                  <Button size="sm" variant="primary" rightIcon={<ArrowRight className="w-4 h-4" />}>
                    {t.dashboard.viewRecBtn}
                  </Button>
                </Link>
                <Link href="/onboarding" className="w-full sm:w-auto">
                  <Button size="sm" variant="secondary">
                    {t.dashboard.changeProfileBtn}
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </section>
      )}

      {/* 3. Tiga Langkah Sederhana */}
      <section className="space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {t.steps.sectionTitle}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            {t.steps.sectionDesc}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
          {/* Langkah 1 */}
          <Card hoverable className="p-6 space-y-4 border-slate-200">
            <div className="w-12 h-12 rounded-2xl bg-brand-light text-brand-primary border border-brand-accent/40 font-black flex items-center justify-center text-lg shadow-sm">
              1
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              {t.steps.step1Title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {t.steps.step1Desc}
            </p>
          </Card>

          {/* Langkah 2 */}
          <Card hoverable className="p-6 space-y-4 border-slate-200">
            <div className="w-12 h-12 rounded-2xl bg-sky-100 text-brand-secondary border border-sky-300 font-black flex items-center justify-center text-lg shadow-sm">
              2
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              {t.steps.step2Title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {t.steps.step2Desc}
            </p>
          </Card>

          {/* Langkah 3 */}
          <Card hoverable className="p-6 space-y-4 border-slate-200">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 border border-emerald-300 font-black flex items-center justify-center text-lg shadow-sm">
              3
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              {t.steps.step3Title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {t.steps.step3Desc}
            </p>
          </Card>
        </div>
      </section>

      {/* 4. Fitur Utama & Kepatuhan */}
      <section className="rounded-3xl bg-white border border-slate-200/80 p-6 sm:p-10 space-y-8 shadow-sm">
        <div className="max-w-2xl space-y-2">
          <Badge variant="blue">Usaha Qita — by MAXI Team</Badge>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Didesain Khusus untuk Wirausaha Pemula & UMKM
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Menghilangkan keraguan dengan hitungan matematika objektif sebelum mengucurkan dana modal.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-brand-light text-brand-primary border border-brand-accent/40 flex items-center justify-center">
              <Calculator className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-slate-900">Kalkulator BEP Murni</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Perhitungan matematis deterministik tanpa rumus tersembunyi yang membingungkan.
            </p>
          </div>

          <div className="space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-brand-secondary border border-sky-200 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-slate-900">3 Skenario Pasar</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Uji ketahanan usaha pada kondisi penjualan sepi (-30%), normal, maupun ramai.
            </p>
          </div>

          <div className="space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-brand-light text-brand-primary border border-brand-accent/40 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-slate-900">Data Simulasi Transparan</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Seluruh peluang diberi label simulasi edukasi agar ekspektasi hasil tetap realistis.
            </p>
          </div>

          <div className="space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-slate-900">Etika & Privasi Penuh</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Data rencana Anda tersimpan privat di perangkat sendiri tanpa kewajiban membuat akun.
            </p>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-xs text-slate-600">
            <Users className="w-5 h-5 text-brand-primary shrink-0" />
            <span>
              Siap melangkah dari karyawan atau pencari kerja menjadi pengusaha mandiri?
            </span>
          </div>
          <Link href="/onboarding">
            <Button size="md" variant="accent" rightIcon={<ArrowRight className="w-4 h-4" />}>
              {t.hero.startBtn}
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}