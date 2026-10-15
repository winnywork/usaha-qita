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

export default function HomePage() {
  const [savedProfile, setSavedProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const profile = getUserProfile();
    if (profile) {
      setSavedProfile(profile);
    }
  }, []);

  return (
    <div className="flex flex-col gap-12 sm:gap-16">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-bri-blue via-bri-blue-dark to-slate-900 text-white p-6 sm:p-10 lg:p-14 shadow-xl shadow-blue-950/15">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-white/5 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-bri-orange/15 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-5 sm:space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-medium text-blue-100">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Asisten Perencanaan Usaha Digital â€” Konsep Edukasi</span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight text-white">
            Wujudkan Rencana Usaha dengan <span className="text-amber-300">Hitungan yang Tepat</span> & Terukur.
          </h1>

          <p className="text-sm sm:text-base lg:text-lg text-slate-200 leading-relaxed max-w-2xl">
            Bukan sekadar ide; ketahui modal minimum, proyeksi omzet, titik impas (BEP), dan langkah konkret memulai usaha mikro Anda tanpa rasa bingung.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
            <Link href="/onboarding">
              <Button
                variant="orange"
                size="lg"
                fullWidth
                rightIcon={<ArrowRight className="w-5 h-5" />}
                className="shadow-lg shadow-orange-900/20"
              >
                Mulai Rencanakan Usaha
              </Button>
            </Link>

            <Link href="/rekomendasi">
              <Button
                variant="outline"
                size="lg"
                fullWidth
                className="bg-white/10 text-white border-white/30 hover:bg-white/20 hover:text-white"
              >
                Jelajahi Katalog Peluang
              </Button>
            </Link>
          </div>

          <div className="pt-4 flex flex-wrap items-center gap-4 text-xs text-blue-200">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Kalkulasi Deterministik</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Simulasi Bebas Biaya</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Data Privat di Browser</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Dashboard Awal Pengguna (Jika Ada Profil Tersimpan) */}
      {savedProfile && (
        <section aria-labelledby="dashboard-title">
          <Card className="border-blue-200 bg-gradient-to-r from-blue-50/70 via-white to-amber-50/40">
            <CardContent className="p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant="blue">Rencana Aktif Anda</Badge>
                  <span className="text-xs text-slate-500">Tersimpan di Browser</span>
                </div>
                <h2 id="dashboard-title" className="text-base sm:text-lg font-bold text-slate-900">
                  Target Usaha di {savedProfile.cityLocation || "Indonesia"} dengan Modal{" "}
                  {formatRupiah(savedProfile.availableCapital)}
                </h2>
                <p className="text-xs sm:text-sm text-slate-600">
                  Minat kategori:{" "}
                  <span className="font-semibold text-slate-800">
                    {savedProfile.categoryInterest.join(", ") || "Semua Bidang"}
                  </span>
                </p>
              </div>

              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                <Link href="/rekomendasi" className="w-full sm:w-auto">
                  <Button size="sm" variant="primary" rightIcon={<ArrowRight className="w-4 h-4" />}>
                    Lihat Rekomendasi
                  </Button>
                </Link>
                <Link href="/onboarding" className="w-full sm:w-auto">
                  <Button size="sm" variant="secondary">
                    Ubah Profil
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
            Tiga Langkah Mudah Merencanakan
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Dari sekadar keinginan menjadi rencana usaha matang yang siap dijalankan.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
          {/* Langkah 1 */}
          <Card hoverable className="p-6 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 text-bri-blue font-black flex items-center justify-center text-lg">
              1
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              Isi Profil & Modal Anda
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Tentukan anggaran modal yang dimiliki, tingkat pengalaman, dan bidang usaha yang diminati (kuliner, jasa, ritel, agribisnis).
            </p>
          </Card>

          {/* Langkah 2 */}
          <Card hoverable className="p-6 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 font-black flex items-center justify-center text-lg">
              2
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              Analisis Finansial & BEP
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Ketahui berapa banyak produk yang harus terjual per hari agar modal balik dan usaha mulai mencetak keuntungan bersih.
            </p>
          </Card>

          {/* Langkah 3 */}
          <Card hoverable className="p-6 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 font-black flex items-center justify-center text-lg">
              3
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              Peta Jalan & Pendampingan
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Ikuti checklist terstruktur minggu demi minggu, serta pahami bagaimana pendampingan lapangan Mantri BRI dapat membantu Anda.
            </p>
          </Card>
        </div>
      </section>

      {/* 4. Fitur Utama & Kepatuhan */}
      <section className="rounded-3xl bg-white border border-slate-200/80 p-6 sm:p-10 space-y-8 shadow-sm">
        <div className="max-w-2xl space-y-2">
          <Badge variant="orange">Mengapa Usaha Qita?</Badge>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Didesain Khusus untuk Karakteristik Wirausaha Pemula Indonesia
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Menghilangkan rasa takut gagal dengan hitungan objektif sebelum mengeluarkan uang modal.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-bri-blue flex items-center justify-center">
              <Calculator className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-slate-900">Kalkulator BEP Murni</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Perhitungan matematis deterministik tanpa rumus tersembunyi yang membingungkan.
            </p>
          </div>

          <div className="space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-slate-900">3 Skenario Pasar</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Uji ketahanan usaha pada kondisi penjualan sepi (-30%), normal, maupun ramai.
            </p>
          </div>

          <div className="space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-slate-900">Data Simulasi Transparan</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Seluruh peluang diberi label simulasi edukasi agar ekspektasi hasil tetap realistis.
            </p>
          </div>

          <div className="space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
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
            <Users className="w-5 h-5 text-bri-blue shrink-0" />
            <span>
              Siap melangkah dari karyawan atau pencari kerja menjadi pengusaha mandiri?
            </span>
          </div>
          <Link href="/onboarding">
            <Button size="md" variant="primary" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Mulai Susun Rencana Gratis
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}