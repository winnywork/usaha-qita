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
import { MarketIntelligencePanel } from "@/components/rekomendasi/MarketIntelligencePanel";
import { OpportunityCardSkeleton } from "@/components/feedback/LoadingSkeleton";
import { EmptyState } from "@/components/feedback/EmptyState";
import { SimulationBadge } from "@/components/ui/SimulationBadge";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { MOCK_OPPORTUNITIES } from "@/data/opportunities";
import { BusinessOpportunity } from "@/types/business";
import { matchOpportunities, OpportunityMatchResult } from "@/core/matching/matcher";
import { getUserProfile } from "@/services/storageService";
import { UserProfile } from "@/types/user";
import { formatRupiah } from "@/core/finance/calculator";
import { useLanguage } from "@/context/LanguageContext";

export default function RekomendasiPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [opportunities, setOpportunities] = useState<BusinessOpportunity[]>(MOCK_OPPORTUNITIES);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("semua");
  const [onlyAffordable, setOnlyAffordable] = useState<boolean>(false);
  const [selectedForModal, setSelectedForModal] = useState<OpportunityMatchResult | null>(null);
  const { t, language } = useLanguage();

  useEffect(() => {
    const user = getUserProfile();
    if (user) {
      setProfile(user);
      if (user.categoryInterest && user.categoryInterest.length === 1) {
        setSelectedCategory(user.categoryInterest[0]);
      }
    }

    // SWR: Tampilkan data dari local storage terlebih dahulu (0ms render instan)
    try {
      const cached = localStorage.getItem("usaha_qita_opportunities");
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setOpportunities(parsed);
          setIsLoading(false);
        }
      }
    } catch {
      // ignore
    }

    // Ambil data peluang usaha live terkini dari basis data Cloud Firestore / MySQL
    fetch("/api/opportunities")
      .then((res) => res.json())
      .then((json) => {
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          setOpportunities(json.data);
          try {
            localStorage.setItem("usaha_qita_opportunities", JSON.stringify(json.data));
          } catch {
            // ignore
          }
        }
      })
      .catch((err) => console.warn("Failed to fetch live opportunities:", err))
      .finally(() => setIsLoading(false));
  }, []);

  const matchResults = useMemo(() => {
    let oppList = opportunities;

    if (selectedCategory !== "semua") {
      oppList = oppList.filter((o) => o.category === selectedCategory);
    }

    const matched = matchOpportunities(oppList, profile || {}, searchQuery);

    if (onlyAffordable) {
      return matched.filter((m) => m.isAffordable);
    }

    return matched;
  }, [opportunities, profile, selectedCategory, searchQuery, onlyAffordable]);

  const categories = [
    { id: "semua", label: language === "en" ? "All Categories" : "Semua Kategori" },
    { id: "kuliner", label: language === "en" ? "Food & Drinks" : "Kuliner & Minuman" },
    { id: "jasa", label: language === "en" ? "Services & Care" : "Jasa & Servis" },
    { id: "ritel", label: language === "en" ? "Retail & Store" : "Ritel & Toko" },
    { id: "agribisnis", label: language === "en" ? "Agribusiness" : "Agribisnis" },
  ];

  return (
    <div className="space-y-8">
      {/* 1. Header & Rangkuman Profil */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2">
            <Badge variant="blue">{t.rekomendasi.badge}</Badge>
            <SimulationBadge showExplanation />
          </div>

          <Link href="/onboarding">
            <Button size="sm" variant="outline">
              {profile ? t.rekomendasi.adjustProfileBtn : t.rekomendasi.fillProfileBtn}
            </Button>
          </Link>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {t.rekomendasi.title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-3xl">
            {profile ? (
              <>
                {language === "en" ? "Tailored for " : "Disesuaikan untuk lokasi "}
                <strong>{profile.cityLocation}</strong>{" "}
                {language === "en" ? "with an available budget of " : "dengan kesiapan anggaran "}
                <span className="text-brand-primary font-bold">{formatRupiah(profile.availableCapital)}</span>{" "}
                {language === "en" ? "at experience level " : "pada tingkat pengalaman "}
                <strong>{profile.experience}</strong>.
              </>
            ) : (
              language === "en"
                ? "Potential micro-enterprise opportunities in Indonesia complete with initial financial projection models."
                : "Pilihan peluang usaha mikro potensial di Indonesia yang telah dilengkapi model perhitungan finansial awal."
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
              placeholder={t.rekomendasi.searchPlaceholder}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent/50 focus:border-brand-primary min-h-[44px]"
            />
          </div>

          {/* Toggle Terjangkau */}
          {profile && profile.availableCapital > 0 && (
            <label className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer select-none text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors">
              <input
                type="checkbox"
                checked={onlyAffordable}
                onChange={(e) => setOnlyAffordable(e.target.checked)}
                className="w-4 h-4 rounded text-brand-primary focus:ring-brand-primary cursor-pointer"
              />
              <span>
                {t.rekomendasi.onlyAffordable} ({formatRupiah(profile.availableCapital)})
              </span>
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
                  ? "bg-brand-primary text-white shadow-sm font-semibold"
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
              {language === "en" ? "Showing " : "Menampilkan "}
              <strong>{matchResults.length}</strong>{" "}
              {language === "en" ? "matched opportunities" : "peluang usaha yang cocok"}
            </span>
            <span>{language === "en" ? "Ranked by capital & preference score" : "Diurutkan berdasarkan skor kesesuaian modal & minat"}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {matchResults.map((result) => (
              <OpportunityCard
                key={result.opportunity.id}
                result={result}
                cityLocation={profile?.cityLocation}
                specificLocation={profile?.specificLocation}
                onSelect={() => setSelectedForModal(result)}
              />
            ))}
          </div>
        </div>
      ) : (
        <EmptyState
          title={t.rekomendasi.emptyTitle}
          description={t.rekomendasi.emptyDesc}
          actionLabel={t.rekomendasi.showAllBtn}
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
                aria-label="Tutup modal"
              >
                ✕
              </button>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {selectedForModal.opportunity.fullDescription}
            </p>

            {/* Rincian Asumsi Standar */}
            <div className="rounded-2xl bg-brand-light/80 border border-brand-accent/40 p-4 space-y-2 text-xs">
              <h4 className="font-bold text-brand-primary text-sm flex items-center gap-1.5">
                <Coins className="w-4 h-4 text-brand-secondary" />
                {language === "en" ? "Initial Financial Assumptions:" : "Asumsi Finansial Dasar (Dapat Diubah Nanti):"}
              </h4>
              <div className="grid grid-cols-2 gap-2 text-slate-700">
                <div>
                  <span className="text-slate-500">{t.analisis.sellingPrice}:</span>{" "}
                  <strong>{formatRupiah(selectedForModal.opportunity.defaultAssumptions.sellingPricePerUnit)}</strong>
                </div>
                <div>
                  <span className="text-slate-500">{t.analisis.costOfGoods}:</span>{" "}
                  <strong>{formatRupiah(selectedForModal.opportunity.defaultAssumptions.costOfGoodsPerUnit)}</strong>
                </div>
                <div>
                  <span className="text-slate-500">{t.analisis.dailyVolume}:</span>{" "}
                  <strong>{selectedForModal.opportunity.defaultAssumptions.dailySalesVolume} unit</strong>
                </div>
                <div>
                  <span className="text-slate-500">{t.analisis.initialEquipment}:</span>{" "}
                  <strong>{formatRupiah(selectedForModal.opportunity.defaultAssumptions.initialEquipmentCost)}</strong>
                </div>
              </div>
            </div>

            {/* Checklist Langkah Awal */}
            <div className="space-y-2">
              <h4 className="font-bold text-slate-900 text-sm">
                {language === "en" ? "Starter Roadmap Steps:" : "Contoh Langkah di Roadmap:"}
              </h4>
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

            {/* Bukti Analisis Pasar (5 Sumber Riset) */}
            {selectedForModal.opportunity.marketIntelligence && (
              <div className="pt-2 border-t border-slate-100">
                <MarketIntelligencePanel
                  intelligence={selectedForModal.opportunity.marketIntelligence}
                  cityLocation={profile?.cityLocation}
                  specificLocation={profile?.specificLocation}
                  businessTitle={selectedForModal.opportunity.title}
                  category={selectedForModal.opportunity.category}
                />
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <Button
                variant="secondary"
                size="md"
                onClick={() => setSelectedForModal(null)}
                className="w-full sm:w-auto"
              >
                {t.common.close}
              </Button>
              <Link href="/analisis" className="w-full sm:w-auto">
                <Button
                  variant="accent"
                  size="md"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                  className="w-full"
                >
                  {t.rekomendasi.selectAndAnalyze}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}