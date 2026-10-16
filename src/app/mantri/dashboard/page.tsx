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
      <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-900">
        <div className="space-y-3 text-center">
          <div className="w-10 h-10 border-4 border-brand-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-500 font-medium">Memuat Sesi Portal Mantri BRI...</p>
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
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-300">
            <Clock className="w-3 h-3 text-amber-600" />
            <span>Pengajuan Baru</span>
          </span>
        );
      case "KONTAK_PERTAMA":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-brand-primary border border-brand-accent/40">
            <Phone className="w-3 h-3 text-brand-primary" />
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
      <header className="border-b border-slate-200 bg-white/95 backdrop-blur-md sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Logo & Mantri Info */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-primary to-brand-secondary flex items-center justify-center text-white shadow-md shadow-brand-primary/20 shrink-0">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black tracking-wider uppercase text-brand-primary">
                  PT BANK RAKYAT INDONESIA
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-light text-brand-primary border border-brand-accent/40">
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
                {mantri.personalNumber} • Wilayah: {mantri.assignedAreas[0]} dkk.
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 flex-1 w-full">
        {/* Banner Selamat Datang */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-gradient-to-r from-brand-primary via-brand-primary to-brand-secondary text-white shadow-lg shadow-brand-primary/15 border border-brand-primary/20">
          <div className="space-y-1">
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              <span>Monitoring Pipeline Calon Debitur Mikro</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-white/20 text-white border border-white/30 font-semibold backdrop-blur-xs">
                Live Sinkronisasi UsahaQita
              </span>
            </h2>
            <p className="text-xs text-blue-100">
              Pantau dan lakukan pendampingan usaha mikro berbasis analisis pasar 5 sumber dan kelayakan finansial BEP.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-blue-100 shrink-0">
            <Calendar className="w-4 h-4 text-blue-200" />
            <span>Hari ini: {new Date().toLocaleDateString("id-ID", { dateStyle: "long" })}</span>
          </div>
        </div>

        {/* 3. Kartu Statistik Eksekutif (KPIs) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-4 sm:p-5 rounded-2xl bg-white border-slate-200 text-slate-900 space-y-2 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Total Prospek Masuk</span>
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-brand-primary flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900">{totalLeads}</div>
            <p className="text-[11px] text-slate-500">
              {newLeadsCount} pengajuan baru membutuhkan respon
            </p>
          </Card>

          <Card className="p-4 sm:p-5 rounded-2xl bg-white border-slate-200 text-slate-900 space-y-2 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Butuh Survei Lokasi</span>
              <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                <MapPin className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900">{surveyCount}</div>
            <p className="text-[11px] text-slate-500">
              Jadwal verifikasi fisik tempat usaha
            </p>
          </Card>

          <Card className="p-4 sm:p-5 rounded-2xl bg-white border-slate-200 text-slate-900 space-y-2 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Rekomendasi KUR Terbit</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-emerald-700">{kurApprovedCount}</div>
            <p className="text-[11px] text-slate-500">
              Asesmen kredit mikro dinyatakan layak
            </p>
          </Card>

          <Card className="p-4 sm:p-5 rounded-2xl bg-white border-slate-200 text-slate-900 space-y-2 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Potensi Penyaluran KUR</span>
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                <Coins className="w-4 h-4" />
              </div>
            </div>
            <div className="text-lg sm:text-xl font-black text-brand-primary">
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
                  ? "bg-brand-primary text-white shadow-sm shadow-brand-primary/25 font-bold"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              Semua ({leads.length})
            </button>
            <button
              onClick={() => setSelectedStatus("BARU_MASUK")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedStatus === "BARU_MASUK"
                  ? "bg-amber-500 text-white font-bold shadow-sm shadow-amber-500/25"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              Baru Masuk ({newLeadsCount})
            </button>
            <button
              onClick={() => setSelectedStatus("SURVEI_LAPANGAN")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedStatus === "SURVEI_LAPANGAN"
                  ? "bg-purple-600 text-white font-bold shadow-sm shadow-purple-600/25"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              Survei Lokasi ({surveyCount})
            </button>
            <button
              onClick={() => setSelectedStatus("REKOMENDASI_KUR")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedStatus === "REKOMENDASI_KUR"
                  ? "bg-emerald-600 text-white font-bold shadow-sm shadow-emerald-600/25"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              Siap KUR ({kurApprovedCount})
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama, usaha, lokasi..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 placeholder-slate-400 text-xs focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all shadow-2xs"
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
                  className="bg-white border-slate-200 hover:border-brand-primary/40 text-slate-900 p-5 sm:p-6 rounded-3xl transition-all shadow-xs hover:shadow-md space-y-4"
                >
                  {/* Baris Atas: ID, Status, & Waktu */}
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-brand-primary bg-brand-light px-2.5 py-0.5 rounded-md border border-brand-accent/40">
                        {lead.id}
                      </span>
                      {getStatusBadge(lead.status)}
                      <span className="text-xs text-slate-500">
                        Masuk: {new Date(lead.submittedAt).toLocaleDateString("id-ID", { dateStyle: "medium" })}
                      </span>
                    </div>

                    <div className="text-xs text-slate-500 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>Preferensi Kontak: <strong className="text-slate-700">{lead.preferredContactTime}</strong></span>
                    </div>
                  </div>

                  {/* Baris Tengah: Info Pengusaha & Usaha */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Kolom 1: Profil Calon Pengusaha */}
                    <div className="space-y-1 text-left">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Calon Pengusaha
                      </span>
                      <h3 className="text-base font-bold text-slate-900">
                        {lead.applicantName}
                      </h3>
                      <p className="text-xs text-slate-500 flex items-center gap-1.5 font-mono">
                        <Phone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{lead.applicantPhone}</span>
                      </p>
                      <p className="text-xs text-slate-500 flex items-center gap-1.5 pt-1">
                        <MapPin className="w-3.5 h-3.5 text-brand-primary shrink-0" />
                        <span>{lead.specificLocation}, {lead.city}</span>
                      </p>
                      <span className="inline-block text-[11px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">
                        {lead.locationEnvironment}
                      </span>
                    </div>

                    {/* Kolom 2: Rencana Usaha & Riset 5 Sumber */}
                    <div className="space-y-1 text-left">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Rencana Usaha Terpilih
                      </span>
                      <h4 className="text-sm font-bold text-brand-primary">
                        {lead.businessTitle}
                      </h4>
                      <p className="text-xs text-slate-500">
                        Kategori: <strong className="text-slate-700 capitalize">{lead.businessCategory}</strong> • Kecocokan: <strong className="text-emerald-700">{lead.matchScore}%</strong>
                      </p>
                      
                      {/* Mini Badges 5 Sumber Riset */}
                      <div className="pt-2 flex flex-wrap items-center gap-1.5 text-[10px]">
                        <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                          Places: {lead.marketIntelligence.googlePlaces.densityLevel}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-rose-50 text-rose-800 border border-rose-200">
                          Viral: {lead.marketIntelligence.socialMediaTrend.trendScore}/100
                        </span>
                        <span className="px-2 py-0.5 rounded bg-blue-50 text-brand-primary border border-blue-200">
                          Trends: +{lead.marketIntelligence.googleTrends.growthRatePercentage}%
                        </span>
                      </div>
                    </div>

                    {/* Kolom 3: Finansial & Asesmen KUR */}
                    <div className="space-y-1 text-left bg-slate-50/80 p-3 rounded-2xl border border-slate-200">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                        Kalkulasi Finansial & Pinjaman
                      </span>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-500">Modal Sendiri:</span>
                        <span className="font-semibold text-slate-900">{formatRupiah(lead.availableCapital)}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-500">Laba Bersih Est.:</span>
                        <span className="font-bold text-emerald-700">{formatRupiah(lead.financialMetrics.monthlyNetProfit)}/bln</span>
                      </div>

                      {lead.creditAssessment && (
                        <div className="pt-2 border-t border-slate-200 text-xs space-y-0.5">
                          <div className="flex items-center justify-between">
                            <span className="text-brand-primary font-semibold">Simulasi KUR:</span>
                            <span className="font-bold text-slate-900">{formatRupiah(lead.creditAssessment.recommendedLoanAmount)}</span>
                          </div>
                          <div className="flex items-center justify-between text-[11px] text-slate-500">
                            <span>Angsuran (Tenor {lead.creditAssessment.tenorMonths} bln):</span>
                            <span className="text-slate-800 font-mono">{formatRupiah(lead.creditAssessment.monthlyInstallment)}/bln</span>
                          </div>
                          <div className="flex items-center justify-between text-[11px] pt-0.5">
                            <span className="text-slate-500">Rasio DSCR:</span>
                            <span className="font-bold text-emerald-700">{lead.creditAssessment.dscrRatio}x (Sangat Layak)</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Catatan Survei Mantri jika ada */}
                  {lead.surveyNotes && (
                    <div className="text-xs bg-amber-50/70 p-2.5 rounded-xl border border-amber-200/80 text-amber-900 italic text-left">
                      <strong className="text-amber-950 not-italic font-semibold">Catatan Mantri: </strong>
                      &ldquo;{lead.surveyNotes}&rdquo;
                    </div>
                  )}

                  {/* Baris Aksi Bawah */}
                  <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <span className="text-[11px] text-slate-500">
                      Terakhir diperbarui: {new Date(lead.lastUpdated).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" }) }
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
                        className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-brand-primary hover:bg-brand-dark transition-colors shadow-sm shadow-brand-primary/25 w-full sm:w-auto"
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
          <div className="p-12 text-center rounded-3xl bg-white border border-slate-200 space-y-3 shadow-xs">
            <AlertCircle className="w-8 h-8 text-slate-400 mx-auto" />
            <h3 className="text-base font-bold text-slate-900">Tidak Ada Prospek yang Cocok</h3>
            <p className="text-xs text-slate-500">
              Coba sesuaikan kata kunci pencarian atau ubah tab status filter di atas.
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
