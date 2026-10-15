"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  Coins,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { OpportunityCard } from "@/components/rekomendasi/OpportunityCard";
import { OpportunityCardSkeleton } from "@/components/feedback/LoadingSkeleton";
import { EmptyState } from "@/components/feedback/EmptyState";
import { SimulationBadge } from "@/components/ui/SimulationBadge";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { MOCK_OPPORTUNITIES } from "@/data/opportunities";
import { matchOpportunities, OpportunityMatchResult } from "@/core/matching/matcher";
import { getUserProfile } from "@/services/storageService";
import { UserProfile } from "@/types/user";
import { formatRupiah } from "@/core/finance/calculator";

export default function RekomendasiPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("semua");
  const [onlyAffordable, setOnlyAffordable] = useState<boolean>(false);
  const [selectedForModal, setSelectedForModal] = useState<OpportunityMatchResult | null>(null);

  useEffect(() => {
    const user = getUserProfile();
    if (user) {
      setProfile(user);
      if (user.categoryInterest && user.categoryInterest.length === 1) {
        setSelectedCategory(user.categoryInterest[0]);
      }
    }
    setIsLoading(false);
  }, []);

  // Filter & match logic
  const matchResults = useMemo(() => {
    let opportunities = MOCK_OPPORTUNITIES;

    // Filter kategori jika bukan "semua"
    if (selectedCategory !== "semua") {
      opportunities = opportunities.filter((o) => o.category === selectedCategory);
    }

    const matched = matchOpportunities(opportunities, profile || {}, searchQuery);

    if (onlyAffordable) {
      return matched.filter((m) => m.isAffordable);
    }

    return matched;
  }, [profile, selectedCategory, searchQuery, onlyAffordable]);

  const categories = [
    { id: "semua", label: "Semua Kategori" },
    { id: "kuliner", label: "Kuliner & Minuman" },
    { id: "jasa", label: "Jasa & Servis" },
    { id: "ritel", label: "Ritel & Toko" },
    { id: "agribisnis", label: "Agribisnis" },
  ];

  return (
    <div className="space-y-8">
      {/* 1. Header & Rangkuman Profil */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2">
            <Badge variant="blue">Rekomendasi Cerdas</Badge>
            <SimulationBadge showExplanation />
          </div>

          <Link href="/onboarding">
            <Button size="sm" variant="outline">
              {profile ? "Sesuaikan Ulang Profil" : "Isi Profil Saya"}
            </Button>
          </Link>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Peluang Usaha Terpilih untuk Anda
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-3xl">
            {profile ? (
              <>
                Disesuaikan untuk lokasi <strong>{profile.cityLocation}</strong> dengan kesiapan anggaran{" "}
                <span className="text-bri-blue font-bold">{formatRupiah(profile.availableCapital)}</span>{" "}
                pada tingkat pengalaman <strong>{profile.experience}</strong>.
              </>
            ) : (
              "Pilihan peluang usaha mikro potensial di Indonesia yang telah dilengkapi model perhitungan finansial awal."
            )}
          </p>
        </div>
      </div>

      {/* 2. Filter Bar & Search Input */}
      <Card className="p-4 sm:p-5 space-y-4 bg-white border-slate-200">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari ide usaha (contoh: tahu, kopi, laundry, sembako)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-bri-blue min-h-[44px]"
            />
          </div>

          {/* Toggle Terjangkau */}
          {profile && profile.availableCapital > 0 && (
            <label className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer select-none text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors">
              <input
                type="checkbox"
                checked={onlyAffordable}
                onChange={(e) => setOnlyAffordable(e.target.checked)}
                className="w-4 h-4 rounded text-bri-blue focus:ring-blue-200 cursor-pointer"
              />
              <span>Hanya Sesuai Modal ({formatRupiah(profile.availableCapital)})</span>
            </label>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? "bg-bri-blue text-white shadow-sm font-semibold"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </Card>

      {/* 3. Daftar Hasil Kartu Peluang Usaha */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <OpportunityCardSkeleton />
          <OpportunityCardSkeleton />
          <OpportunityCardSkeleton />
        </div>
      ) : matchResults.length > 0 ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>
              Menampilkan <strong>{matchResults.length}</strong> peluang usaha yang cocok
            </span>
            <span>Diurutkan berdasarkan skor kesesuaian modal & minat</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {matchResults.map((result) => (
              <OpportunityCard
                key={result.opportunity.id}
                result={result}
                onSelect={() => setSelectedForModal(result)}
              />
            ))}
          </div>
        </div>
      ) : (
        <EmptyState
          title="Tidak Ada Peluang yang Cocok dengan Kriteria Ini"
          description="Coba bersihkan pencarian kata kunci atau nonaktifkan filter batas modal untuk melihat seluruh daftar opsi usaha."
          actionLabel="Tampilkan Semua Usaha"
          onAction={() => {
            setSearchQuery("");
            setSelectedCategory("semua");
            setOnlyAffordable(false);
          }}
        />
      )}

      {/* 4. Modal Ringkasan Peluang Usaha Terpilih */}
      {selectedForModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto border border-slate-200 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant="blue" className="capitalize">
                    {selectedForModal.opportunity.category}
                  </Badge>
                  <SimulationBadge />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                  {selectedForModal.opportunity.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedForModal(null)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold p-1"
              >
                âœ•
              </button>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {selectedForModal.opportunity.fullDescription}
            </p>

            {/* Rincian Asumsi Standar */}
            <div className="rounded-2xl bg-blue-50/70 border border-blue-200 p-4 space-y-2 text-xs">
              <h4 className="font-bold text-bri-blue text-sm flex items-center gap-1.5">
                <Coins className="w-4 h-4" />
                Asumsi Finansial Dasar (Dapat Diubah Nanti):
              </h4>
              <div className="grid grid-cols-2 gap-2 text-slate-700">
                <div>
                  <span className="text-slate-500">Harga Jual Unit:</span>{" "}
                  <strong>{formatRupiah(selectedForModal.opportunity.defaultAssumptions.sellingPricePerUnit)}</strong>
                </div>
                <div>
                  <span className="text-slate-500">HPP / Modal Bahan:</span>{" "}
                  <strong>{formatRupiah(selectedForModal.opportunity.defaultAssumptions.costOfGoodsPerUnit)}</strong>
                </div>
                <div>
                  <span className="text-slate-500">Target Harian:</span>{" "}
                  <strong>{selectedForModal.opportunity.defaultAssumptions.dailySalesVolume} unit/hari</strong>
                </div>
                <div>
                  <span className="text-slate-500">Modal Alat Awal:</span>{" "}
                  <strong>{formatRupiah(selectedForModal.opportunity.defaultAssumptions.initialEquipmentCost)}</strong>
                </div>
              </div>
            </div>

            {/* Checklist Langkah Awal */}
            <div className="space-y-2">
              <h4 className="font-bold text-slate-900 text-sm">Contoh Langkah di Roadmap:</h4>
              <div className="space-y-1.5">
                {selectedForModal.opportunity.roadmapTemplates.slice(0, 3).map((step) => (
                  <div key={step.id} className="flex items-start gap-2 text-xs text-slate-600">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>
                      <strong>{step.title}:</strong> {step.description}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <Button
                variant="secondary"
                size="md"
                onClick={() => setSelectedForModal(null)}
                className="w-full sm:w-auto"
              >
                Tutup
              </Button>
              <Button
                variant="orange"
                size="md"
                rightIcon={<ArrowRight className="w-4 h-4" />}
                onClick={() => {
                  alert(
                    "Pilihan tersimpan di perangkat Anda! Pada iterasi berikutnya, fitur kalkulator finansial interaktif dan roadmap lengkap akan terhubung ke data pilihan ini."
                  );
                  setSelectedForModal(null);
                }}
                className="w-full sm:w-auto"
              >
                Lanjutkan Rencana Ini
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}