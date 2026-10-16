"use client";

import React, { useState, useEffect } from "react";
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
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import {
  getCurrentMantri,
  logoutMantri,
  getConsultationLeads,
  generateWhatsAppUrl,
} from "@/services/mantriService";
import { ConsultationLead, MantriUser, PipelineStatus } from "@/types/mantri";
import { formatRupiah } from "@/core/finance/calculator";

export default function MantriDashboardPage() {
  const router = useRouter();
  const [mantri, setMantri] = useState<MantriUser | null>(null);
  const [leads, setLeads] = useState<ConsultationLead[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const active = getCurrentMantri();
    if (!active) {
      router.push("/mantri/login");
      return;
    }
    setMantri(active);
    setLeads(getConsultationLeads());
    setIsReady(true);
  }, [router]);

  const handleLogout = () => {
    logoutMantri();
    router.push("/mantri/login");
  };

  if (!isReady || !mantri) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
        <div className="space-y-3 text-center">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-400">Memuat Sesi Portal Mantri BRI...</p>
        </div>
      </div>
    );
  }

  // Filter Leads
  const filteredLeads = leads.filter((lead) => {
    const matchesStatus = selectedStatus === "ALL" || lead.status === selectedStatus;
    const query = searchQuery.toLowerCase();
    const matchesQuery =
      lead.applicantName.toLowerCase().includes(query) ||
      lead.businessTitle.toLowerCase().includes(query) ||
      lead.specificLocation.toLowerCase().includes(query) ||
      lead.id.toLowerCase().includes(query);
    return matchesStatus && matchesQuery;
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
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
            <Clock className="w-3 h-3" />
            <span>Pengajuan Baru</span>
          </span>
        );
      case "KONTAK_PERTAMA":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/30">
            <Phone className="w-3 h-3" />
            <span>Sudah Dihubungi</span>
          </span>
        );
      case "SURVEI_LAPANGAN":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-500/10 text-purple-400 border border-purple-500/30">
            <MapPin className="w-3 h-3" />
            <span>Survei Lapangan</span>
          </span>
        );
      case "REKOMENDASI_KUR":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="w-3 h-3" />
            <span>Rekomendasi KUR Terbit</span>
          </span>
        );
      case "BINA_MANDIRI":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-500/10 text-slate-400 border border-slate-500/30">
            <span>Bina Usaha Mandiri</span>
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
      {/* 1. Header Bar Resmi Mantri BRI */}
      <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Logo & Mantri Info */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-brand-primary flex items-center justify-center text-white shadow-md shadow-blue-600/30 shrink-0">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black tracking-wider uppercase text-blue-400">
                  PT BANK RAKYAT INDONESIA
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-300 border border-blue-500/30">
                  PORTAL MANTRI
                </span>
              </div>
              <h1 className="text-sm sm:text-base font-bold text-white">
                {mantri.unitName}
              </h1>
            </div>
          </div>

          {/* User Profile & Actions */}
          <div className="flex items-center justify-between md:justify-end gap-3 border-t md:border-t-0 pt-2 md:pt-0 border-slate-800">
            <div className="text-left md:text-right">
              <div className="text-xs font-bold text-white">{mantri.name}</div>
              <div className="text-[11px] text-slate-400 font-mono">
                {mantri.personalNumber} • Wilayah: {mantri.assignedAreas[0]} dkk.
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href="/"
                className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors flex items-center gap-1.5"
              >
                <span>Mode Publik</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
              <button
                onClick={handleLogout}
                className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 transition-colors flex items-center gap-1.5"
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 flex-1 w-full">
        {/* Banner Selamat Datang */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-gradient-to-r from-blue-900/40 via-slate-900 to-slate-900 border border-blue-800/40">
          <div className="space-y-1">
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              <span>Monitoring Pipeline Calon Debitur Mikro</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold">
                Live Sinkronisasi UsahaQita
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Pantau dan lakukan pendampingan usaha mikro berbasis analisis pasar 5 sumber dan kelayakan finansial BEP.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400 shrink-0">
            <Calendar className="w-4 h-4 text-blue-400" />
            <span>Hari ini: {new Date().toLocaleDateString("id-ID", { dateStyle: "long" })}</span>
          </div>
        </div>

        {/* 3. Kartu Statistik Eksekutif (KPIs) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 border-slate-800 text-slate-100 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">Total Prospek Masuk</span>
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-white">{totalLeads}</div>
            <p className="text-[11px] text-slate-500">
              {newLeadsCount} pengajuan baru membutuhkan respon
            </p>
          </Card>

          <Card className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 border-slate-800 text-slate-100 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">Butuh Survei Lokasi</span>
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
                <MapPin className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-white">{surveyCount}</div>
            <p className="text-[11px] text-slate-500">
              Jadwal verifikasi fisik tempat usaha
            </p>
          </Card>

          <Card className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 border-slate-800 text-slate-100 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">Rekomendasi KUR Terbit</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-emerald-400">{kurApprovedCount}</div>
            <p className="text-[11px] text-slate-500">
              Asesmen kredit mikro dinyatakan layak
            </p>
          </Card>

          <Card className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 border-slate-800 text-slate-100 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">Potensi Penyaluran KUR</span>
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
                <Coins className="w-4 h-4" />
              </div>
            </div>
            <div className="text-lg sm:text-xl font-black text-amber-400">
              {formatRupiah(totalPotentialKur)}
            </div>
            <p className="text-[11px] text-slate-500">
              Estimasi plafon pembiayaan mikro binaan
            </p>
          </Card>
        </div>

        {/* 4. Filter & Search Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => setSelectedStatus("ALL")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedStatus === "ALL"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                  : "bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
            >
              Semua ({leads.length})
            </button>
            <button
              onClick={() => setSelectedStatus("BARU_MASUK")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedStatus === "BARU_MASUK"
                  ? "bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/30"
                  : "bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
            >
              Baru Masuk ({newLeadsCount})
            </button>
            <button
              onClick={() => setSelectedStatus("SURVEI_LAPANGAN")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedStatus === "SURVEI_LAPANGAN"
                  ? "bg-purple-600 text-white shadow-md shadow-purple-600/30"
                  : "bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
            >
              Survei Lokasi ({surveyCount})
            </button>
            <button
              onClick={() => setSelectedStatus("REKOMENDASI_KUR")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedStatus === "REKOMENDASI_KUR"
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30"
                  : "bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
            >
              Siap KUR ({kurApprovedCount})
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama, usaha, lokasi..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
            />
          </div>
        </div>

        {/* 5. Daftar Kartu Prospek Calon Debitur */}
        {filteredLeads.length > 0 ? (
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
                  className="bg-slate-900/90 border-slate-800 hover:border-slate-700 text-slate-100 p-5 sm:p-6 rounded-3xl transition-all shadow-md space-y-4"
                >
                  {/* Baris Atas: ID, Status, & Waktu */}
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-blue-400 bg-blue-500/10 px-2.5 py-0.5 rounded-md border border-blue-500/20">
                        {lead.id}
                      </span>
                      {getStatusBadge(lead.status)}
                      <span className="text-xs text-slate-500">
                        Masuk: {new Date(lead.submittedAt).toLocaleDateString("id-ID", { dateStyle: "medium" })}
                      </span>
                    </div>

                    <div className="text-xs text-slate-400 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      <span>Preferensi Kontak: <strong className="text-slate-300">{lead.preferredContactTime}</strong></span>
                    </div>
                  </div>

                  {/* Baris Tengah: Info Pengusaha & Usaha */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Kolom 1: Profil Calon Pengusaha */}
                    <div className="space-y-1 text-left">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                        Calon Pengusaha
                      </span>
                      <h3 className="text-base font-bold text-white">
                        {lead.applicantName}
                      </h3>
                      <p className="text-xs text-slate-400 flex items-center gap-1.5 font-mono">
                        <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>{lead.applicantPhone}</span>
                      </p>
                      <p className="text-xs text-slate-400 flex items-center gap-1.5 pt-1">
                        <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                        <span>{lead.specificLocation}, {lead.city}</span>
                      </p>
                      <span className="inline-block text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-medium">
                        {lead.locationEnvironment}
                      </span>
                    </div>

                    {/* Kolom 2: Rencana Usaha & Riset 5 Sumber */}
                    <div className="space-y-1 text-left">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                        Rencana Usaha Terpilih
                      </span>
                      <h4 className="text-sm font-bold text-blue-300">
                        {lead.businessTitle}
                      </h4>
                      <p className="text-xs text-slate-400">
                        Kategori: <strong className="text-slate-200 capitalize">{lead.businessCategory}</strong> • Kecocokan: <strong className="text-emerald-400">{lead.matchScore}%</strong>
                      </p>
                      
                      {/* Mini Badges 5 Sumber Riset */}
                      <div className="pt-2 flex flex-wrap items-center gap-1.5 text-[10px]">
                        <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                          Places: {lead.marketIntelligence.googlePlaces.densityLevel}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-300 border border-rose-500/20">
                          Viral: {lead.marketIntelligence.socialMediaTrend.trendScore}/100
                        </span>
                        <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20">
                          Trends: +{lead.marketIntelligence.googleTrends.growthRatePercentage}%
                        </span>
                      </div>
                    </div>

                    {/* Kolom 3: Finansial & Asesmen KUR */}
                    <div className="space-y-1 text-left bg-slate-950/60 p-3 rounded-2xl border border-slate-800/80">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                        Kalkulasi Finansial & Pinjaman
                      </span>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400">Modal Sendiri:</span>
                        <span className="font-semibold text-white">{formatRupiah(lead.availableCapital)}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400">Laba Bersih Est.:</span>
                        <span className="font-bold text-emerald-400">{formatRupiah(lead.financialMetrics.monthlyNetProfit)}/bln</span>
                      </div>

                      {lead.creditAssessment && (
                        <div className="pt-2 border-t border-slate-800 text-xs space-y-0.5">
                          <div className="flex items-center justify-between">
                            <span className="text-amber-400 font-semibold">Simulasi KUR:</span>
                            <span className="font-bold text-amber-300">{formatRupiah(lead.creditAssessment.recommendedLoanAmount)}</span>
                          </div>
                          <div className="flex items-center justify-between text-[11px] text-slate-400">
                            <span>Angsuran (Tenor {lead.creditAssessment.tenorMonths} bln):</span>
                            <span className="text-slate-200 font-mono">{formatRupiah(lead.creditAssessment.monthlyInstallment)}/bln</span>
                          </div>
                          <div className="flex items-center justify-between text-[11px] pt-0.5">
                            <span className="text-slate-400">Rasio DSCR:</span>
                            <span className="font-bold text-emerald-400">{lead.creditAssessment.dscrRatio}x (Sangat Layak)</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Catatan Survei Mantri jika ada */}
                  {lead.surveyNotes && (
                    <div className="text-xs bg-slate-800/50 p-2.5 rounded-xl border border-slate-800 text-slate-300 italic text-left">
                      <strong className="text-slate-200 not-italic font-semibold">Catatan Mantri: </strong>
                      &ldquo;{lead.surveyNotes}&rdquo;
                    </div>
                  )}

                  {/* Baris Aksi Bawah */}
                  <div className="pt-2 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <span className="text-[11px] text-slate-500">
                      Terakhir diperbarui: {new Date(lead.lastUpdated).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" }) }
                    </span>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <a
                        href={waUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-emerald-300 bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 transition-colors w-full sm:w-auto"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>Hubungi WhatsApp</span>
                      </a>

                      <Link
                        href={`/mantri/prospek/${lead.id}`}
                        className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 transition-colors shadow-md shadow-blue-600/30 w-full sm:w-auto"
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
          <div className="p-12 text-center rounded-3xl bg-slate-900/50 border border-slate-800 space-y-3">
            <AlertCircle className="w-8 h-8 text-slate-500 mx-auto" />
            <h3 className="text-base font-bold text-white">Tidak Ada Prospek yang Cocok</h3>
            <p className="text-xs text-slate-400">
              Coba sesuaikan kata kunci pencarian atau ubah tab status filter di atas.
            </p>
          </div>
        )}
      </main>

      {/* 6. Footer Resmi */}
      <footer className="border-t border-slate-800 py-6 text-center text-xs text-slate-500 space-y-1">
        <p>© 2026 PT Bank Rakyat Indonesia (Persero) Tbk. Hak Cipta Dilindungi.</p>
        <p>Sistem Terintegrasi UsahaQita untuk Pendampingan & Pembiayaan Usaha Mikro Nasional.</p>
      </footer>
    </div>
  );
}
