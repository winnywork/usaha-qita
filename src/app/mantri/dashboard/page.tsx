"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Building2,
  Users,
  CheckCircle2,
  Clock,
  Coins,
  Search,
  MapPin,
  Phone,
  ArrowRight,
  LogOut,
  Calendar,
  AlertCircle,
  ExternalLink,
  RefreshCw,
  Database,
  Sparkles,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import {
  getCurrentMantri,
  logoutMantri,
  fetchLeadsFromDatabase,
  generateWhatsAppUrl,
} from "@/services/mantriService";
import { ConsultationLead, MantriUser, PipelineStatus } from "@/types/mantri";
import { formatRupiah } from "@/core/finance/calculator";

export default function MantriDashboardPage() {
  const router = useRouter();
  const [mantri, setMantri] = useState<MantriUser | null>(null);
  const [leads, setLeads] = useState<ConsultationLead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [territoryScope, setTerritoryScope] = useState<"MY_AREA" | "ALL">("MY_AREA");
  const [isReady, setIsReady] = useState(false);

  const loadLeads = useCallback(async () => {
    setIsLoading(true);
    try {
      const liveLeads = await fetchLeadsFromDatabase();
      setLeads(liveLeads);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const active = getCurrentMantri();
    if (!active) {
      router.push("/mantri/login");
      return;
    }
    setMantri(active);
    setIsReady(true);
    loadLeads();
  }, [router, loadLeads]);

  const handleLogout = () => {
    logoutMantri();
    router.push("/mantri/login");
  };

  if (!isReady || !mantri) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-900">
        <div className="space-y-3 text-center">
          <div className="w-10 h-10 border-4 border-[#0857c3] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-500 font-medium">Memuat Sesi Portal Mantri BRI...</p>
        </div>
      </div>
    );
  }

  // Filter Leads by Status, Search, and Territory Scope
  const filteredLeads = leads.filter((lead) => {
    // 1. Status Filter
    const matchesStatus = selectedStatus === "ALL" || lead.status === selectedStatus;

    // 2. Search Query Filter
    const query = searchQuery.toLowerCase().trim();
    const matchesQuery =
      !query ||
      lead.applicantName.toLowerCase().includes(query) ||
      lead.businessTitle.toLowerCase().includes(query) ||
      lead.specificLocation.toLowerCase().includes(query) ||
      lead.city.toLowerCase().includes(query) ||
      lead.id.toLowerCase().includes(query);

    // 3. Territory Filter
    let matchesTerritory = true;
    if (territoryScope === "MY_AREA") {
      const isAssignedDirectly = lead.assignedMantriId === mantri.id;
      const isSameUnit =
        lead.assignedUnit &&
        mantri.unitName &&
        lead.assignedUnit.toLowerCase().includes(mantri.unitName.toLowerCase());
      const isAreaCovered =
        Array.isArray(mantri.assignedAreas) &&
        mantri.assignedAreas.some((area) => {
          const a = area.toLowerCase().trim();
          return (
            lead.specificLocation.toLowerCase().includes(a) ||
            a.includes(lead.specificLocation.toLowerCase()) ||
            lead.city.toLowerCase().includes(a)
          );
        });
      const isBranchMatch =
        lead.assignedBranch &&
        mantri.branchOffice &&
        lead.assignedBranch.toLowerCase() === mantri.branchOffice.toLowerCase();

      matchesTerritory = Boolean(isAssignedDirectly || isSameUnit || isAreaCovered || isBranchMatch);
    }

    return matchesStatus && matchesQuery && matchesTerritory;
  });

  // Calculate KPIs
  const totalLeads = leads.length;
  const newLeadsCount = leads.filter((l) => l.status === "BARU_MASUK").length;
  const surveyCount = leads.filter((l) => l.status === "SURVEI_LAPANGAN").length;
  const kurApprovedCount = leads.filter((l) => l.status === "REKOMENDASI_KUR").length;
  const totalPotentialKur = leads.reduce(
    (sum, l) => sum + (l.creditAssessment?.recommendedLoanAmount || 0),
    0
  );

  const getStatusBadge = (status: PipelineStatus) => {
    switch (status) {
      case "BARU_MASUK":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-300">
            <Clock className="w-3 h-3 text-amber-600" />
            <span>Pengajuan Baru</span>
          </span>
        );
      case "KONTAK_PERTAMA":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-[#0857c3] border border-blue-200">
            <Phone className="w-3 h-3 text-[#0857c3]" />
            <span>Sudah Dihubungi</span>
          </span>
        );
      case "SURVEI_LAPANGAN":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-50 text-purple-800 border border-purple-200">
            <MapPin className="w-3 h-3 text-purple-600" />
            <span>Survei Lapangan</span>
          </span>
        );
      case "REKOMENDASI_KUR":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-300">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>Rekomendasi KUR Terbit</span>
          </span>
        );
      case "BINA_MANDIRI":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-300">
            <span>Bina Usaha Mandiri</span>
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between">
      {/* 1. Header Bar Resmi Mantri BRI */}
      <header className="border-b border-slate-200 bg-white/95 backdrop-blur-md sticky top-0 z-40 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Logo & Mantri Info */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0857c3] flex items-center justify-center text-white shadow-md shadow-blue-900/15 shrink-0">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black tracking-wider uppercase text-[#0857c3]">
                  PT BANK RAKYAT INDONESIA
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-[#0857c3] border border-blue-200">
                  PORTAL MANTRI
                </span>
              </div>
              <h1 className="text-sm sm:text-base font-bold text-slate-900">
                {mantri.unitName}
              </h1>
            </div>
          </div>

          {/* User Profile & Actions */}
          <div className="flex items-center justify-between md:justify-end gap-3 border-t md:border-t-0 pt-2 md:pt-0 border-slate-100">
            <div className="text-left md:text-right">
              <div className="text-xs font-bold text-slate-900">{mantri.name}</div>
              <div className="text-[11px] text-slate-500 font-mono">
                {mantri.personalNumber} • {mantri.branchOffice}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href="/"
                className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors flex items-center gap-1.5"
              >
                <span>Mode Publik</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-colors flex items-center gap-1.5"
                title="Keluar dari sesi Mantri"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Keluar</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 2. Main Dashboard Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 flex-1 w-full">
        {/* Banner Selamat Datang & Status Koneksi Live */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-gradient-to-r from-[#0857c3] to-[#0a6fe0] text-white shadow-lg shadow-blue-900/15 border border-blue-400/20">
          <div className="space-y-1">
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              <span>Monitoring Pipeline Calon Debitur Mikro</span>
              <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-white/20 text-white border border-white/30 font-semibold backdrop-blur-xs flex items-center gap-1">
                <Database className="w-3 h-3" /> Cloud Firestore Live
              </span>
            </h2>
            <p className="text-xs text-blue-100">
              Pantau dan lakukan pendampingan usaha mikro berbasis analisis pasar riil dan asesmen kelayakan kredit KUR.
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs text-blue-100 shrink-0">
            <button
              type="button"
              onClick={loadLeads}
              disabled={isLoading}
              className="px-3 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold transition-all flex items-center gap-1.5 shadow-2xs border border-white/30"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
              <span>{isLoading ? "Menyinkronkan..." : "Segarkan Cloud"}</span>
            </button>
            <div className="flex items-center gap-1.5 text-blue-100">
              <Calendar className="w-4 h-4 text-blue-200" />
              <span>{new Date().toLocaleDateString("id-ID", { dateStyle: "medium" })}</span>
            </div>
          </div>
        </div>

        {/* 3. Kartu Statistik Eksekutif (KPIs) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-4 sm:p-5 rounded-2xl bg-white border-slate-200 text-slate-900 space-y-2 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Total Prospek Masuk</span>
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#0857c3] flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900">{totalLeads}</div>
            <span className="text-[11px] text-slate-500 font-medium block">Calon debitur terdata di cloud</span>
          </Card>

          <Card className="p-4 sm:p-5 rounded-2xl bg-white border-slate-200 text-slate-900 space-y-2 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Perlu Kontak Awal</span>
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-amber-600">{newLeadsCount}</div>
            <span className="text-[11px] text-slate-500 font-medium block">Belum dihubungi via WA</span>
          </Card>

          <Card className="p-4 sm:p-5 rounded-2xl bg-white border-slate-200 text-slate-900 space-y-2 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Dalam Survei Fisik</span>
              <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center">
                <MapPin className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-purple-600">{surveyCount}</div>
            <span className="text-[11px] text-slate-500 font-medium block">Sedang verifikasi lapangan</span>
          </Card>

          <Card className="p-4 sm:p-5 rounded-2xl bg-white border-slate-200 text-slate-900 space-y-2 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">KUR Direkomendasikan</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <Coins className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-emerald-600">{kurApprovedCount}</div>
            <span className="text-[11px] text-slate-500 font-medium block">
              Plafon: {formatRupiah(totalPotentialKur)}
            </span>
          </Card>
        </div>

        {/* 4. Toolbar Filter Wilayah & Status */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
          {/* Baris Pilihan Wilayah (Wilayah Binaan vs Semua) */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setTerritoryScope("MY_AREA")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  territoryScope === "MY_AREA"
                    ? "bg-[#0857c3] text-white shadow-xs"
                    : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                }`}
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>Wilayah Binaan ({mantri.unitName})</span>
              </button>

              <button
                type="button"
                onClick={() => setTerritoryScope("ALL")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  territoryScope === "ALL"
                    ? "bg-[#0857c3] text-white shadow-xs"
                    : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                }`}
              >
                <span>Semua Prospek ({leads.length})</span>
              </button>
            </div>

            <div className="text-xs text-slate-500 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#0857c3]" />
              <span>Menampilkan: <strong>{filteredLeads.length}</strong> calon debitur</span>
            </div>
          </div>

          {/* Search Input & Status Buttons */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                placeholder="Cari berdasarkan nama calon, jenis usaha, lokasi, atau ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#0857c3] transition-all"
              />
            </div>

            {/* Filter Pipeline Status Buttons */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
              {[
                { id: "ALL", label: "Semua" },
                { id: "BARU_MASUK", label: "Baru" },
                { id: "KONTAK_PERTAMA", label: "Dihubungi" },
                { id: "SURVEI_LAPANGAN", label: "Survei" },
                { id: "REKOMENDASI_KUR", label: "Rekomendasi" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedStatus(tab.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                    selectedStatus === tab.id
                      ? "bg-[#0857c3] text-white shadow-xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200/80"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 5. Daftar Dossier Prospek Masuk */}
        {isLoading ? (
          <div className="p-12 text-center rounded-3xl bg-white border border-slate-200 space-y-3 shadow-2xs">
            <div className="w-8 h-8 border-3 border-[#0857c3] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-slate-500 font-medium">Menyinkronkan data prospek dari Google Cloud Firestore...</p>
          </div>
        ) : filteredLeads.length > 0 ? (
          <div className="space-y-4">
            {filteredLeads.map((lead) => {
              const waUrl = generateWhatsAppUrl(
                lead.applicantPhone,
                lead.applicantName,
                lead.businessTitle,
                mantri.name,
                mantri.unitName
              );

              return (
                <Card
                  key={lead.id}
                  className="p-5 sm:p-6 rounded-2xl bg-white border-slate-200 shadow-2xs hover:shadow-md transition-all space-y-4 text-left"
                >
                  {/* Baris Atas: ID, Status Badge, dan Tanggal Masuk */}
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                        {lead.id}
                      </span>
                      {getStatusBadge(lead.status)}
                      {lead.assignedUnit && (
                        <span className="text-[10px] font-semibold text-[#0857c3] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                          {lead.assignedUnit}
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-500 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>Masuk: {new Date(lead.submittedAt).toLocaleDateString("id-ID", { dateStyle: "medium" })}</span>
                    </div>
                  </div>

                  {/* Body Kartu: 3 Kolom Responsif */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {/* Kolom 1: Profil Calon Pengusaha */}
                    <div className="space-y-1 text-left">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Calon Pengusaha
                      </span>
                      <h3 className="text-base font-bold text-slate-900">
                        {lead.applicantName}
                      </h3>
                      <p className="text-xs text-slate-600 flex items-center gap-1.5 font-mono">
                        <Phone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{lead.applicantPhone}</span>
                      </p>
                      <p className="text-xs text-slate-600 flex items-center gap-1.5 pt-1">
                        <MapPin className="w-3.5 h-3.5 text-[#0857c3] shrink-0" />
                        <span>{lead.specificLocation}, {lead.city}</span>
                      </p>
                      <span className="inline-block text-[11px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium mt-1">
                        {lead.locationEnvironment}
                      </span>
                    </div>

                    {/* Kolom 2: Rencana Usaha & Riset 5 Sumber */}
                    <div className="space-y-1 text-left">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Rencana Usaha Terpilih
                      </span>
                      <h4 className="text-sm font-bold text-[#0857c3]">
                        {lead.businessTitle}
                      </h4>
                      <p className="text-xs text-slate-500">
                        Kategori: <strong className="text-slate-700 capitalize">{lead.businessCategory}</strong> • Kecocokan: <strong className="text-emerald-700">{lead.matchScore}%</strong>
                      </p>

                      {/* Mini Badges 5 Sumber Riset */}
                      <div className="pt-2 flex flex-wrap items-center gap-1.5 text-[10px]">
                        <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                          Places: {lead.marketIntelligence?.googlePlaces?.densityLevel || "Sedang"}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-rose-50 text-rose-800 border border-rose-200">
                          Viral: {lead.marketIntelligence?.socialMediaTrend?.trendScore ?? 80}/100
                        </span>
                        <span className="px-2 py-0.5 rounded bg-blue-50 text-[#0857c3] border border-blue-200">
                          Trends: +{lead.marketIntelligence?.googleTrends?.growthRatePercentage ?? 15}%
                        </span>
                      </div>
                    </div>

                    {/* Kolom 3: Finansial & Asesmen KUR */}
                    <div className="space-y-1 text-left bg-slate-50 p-3 rounded-2xl border border-slate-200">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                        Kalkulasi Finansial & Pinjaman
                      </span>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-500">Modal Sendiri:</span>
                        <span className="font-semibold text-slate-900">{formatRupiah(lead.availableCapital)}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-500">Laba Bersih Est.:</span>
                        <span className="font-bold text-emerald-700">{formatRupiah(lead.financialMetrics?.monthlyNetProfit || 0)}/bln</span>
                      </div>

                      {lead.creditAssessment && (
                        <div className="pt-2 border-t border-slate-200 text-xs space-y-0.5">
                          <div className="flex items-center justify-between">
                            <span className="text-[#0857c3] font-semibold">Simulasi KUR:</span>
                            <span className="font-bold text-slate-900">{formatRupiah(lead.creditAssessment.recommendedLoanAmount)}</span>
                          </div>
                          <div className="flex items-center justify-between text-[11px] text-slate-500">
                            <span>Angsuran ({lead.creditAssessment.tenorMonths} bln):</span>
                            <span className="text-slate-800 font-mono">{formatRupiah(lead.creditAssessment.monthlyInstallment)}/bln</span>
                          </div>
                          <div className="flex items-center justify-between text-[11px] pt-0.5">
                            <span className="text-slate-500">Rasio DSCR:</span>
                            <span className="font-bold text-emerald-700">{lead.creditAssessment.dscrRatio}x (Layak)</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Catatan Survei Mantri jika ada */}
                  {lead.surveyNotes && (
                    <div className="text-xs bg-amber-50/80 p-3 rounded-xl border border-amber-200 text-amber-900 italic text-left">
                      <strong className="text-amber-950 not-italic font-semibold">Catatan Petugas: </strong>
                      &ldquo;{lead.surveyNotes}&rdquo;
                    </div>
                  )}

                  {/* Baris Aksi Bawah */}
                  <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <span className="text-[11px] text-slate-500">
                      Terakhir diperbarui: {new Date(lead.lastUpdated).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" })}
                    </span>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <a
                        href={waUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 transition-colors w-full sm:w-auto shadow-2xs"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>Hubungi WhatsApp</span>
                      </a>

                      <Link
                        href={`/mantri/prospek/${lead.id}`}
                        className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#0857c3] hover:bg-[#06449a] transition-colors shadow-md shadow-blue-700/20 w-full sm:w-auto"
                      >
                        <span>Review & Asesmen Lengkap</span>
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="p-12 text-center rounded-3xl bg-white border border-slate-200 space-y-3 shadow-2xs">
            <AlertCircle className="w-8 h-8 text-slate-400 mx-auto" />
            <h3 className="text-base font-bold text-slate-900">Tidak Ada Prospek yang Cocok</h3>
            <p className="text-xs text-slate-500">
              Coba sesuaikan kata kunci pencarian atau ubah filter wilayah di atas.
            </p>
          </div>
        )}
      </main>

      {/* 6. Footer Resmi */}
      <footer className="border-t border-slate-200 py-6 text-center text-xs text-slate-500 space-y-1">
        <p>© 2026 PT Bank Rakyat Indonesia (Persero) Tbk. Hak Cipta Dilindungi.</p>
        <p>Sistem Terintegrasi UsahaQita untuk Pendampingan & Pembiayaan Usaha Mikro Nasional.</p>
      </footer>
    </div>
  );
}