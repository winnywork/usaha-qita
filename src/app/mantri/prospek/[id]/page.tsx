"use client";

import React, { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Phone,
  MapPin,
  Clock,
  Coins,
  CheckCircle2,
  AlertTriangle,
  Save,
  ShieldCheck,
  Compass,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { MarketIntelligencePanel } from "@/components/rekomendasi/MarketIntelligencePanel";
import {
  getCurrentMantri,
  getLeadById,
  updateLeadStatus,
  calculateKurAssessment,
  generateWhatsAppUrl,
} from "@/services/mantriService";
import { ConsultationLead, MantriUser, PipelineStatus } from "@/types/mantri";
import { formatRupiah } from "@/core/finance/calculator";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function MantriProspekDetailPage({ params }: PageProps) {
  const router = useRouter();
  const resolvedParams = use(params);
  const leadId = resolvedParams.id;

  const [mantri, setMantri] = useState<MantriUser | null>(null);
  const [lead, setLead] = useState<ConsultationLead | null>(null);
  const [isReady, setIsReady] = useState(false);

  // Edit State
  const [status, setStatus] = useState<PipelineStatus>("BARU_MASUK");
  const [surveyNotes, setSurveyNotes] = useState("");
  const [loanAmount, setLoanAmount] = useState<number>(10000000);
  const [tenorMonths, setTenorMonths] = useState<12 | 24 | 36>(12);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    const active = getCurrentMantri();
    if (!active) {
      router.push("/mantri/login");
      return;
    }
    setMantri(active);

    const found = getLeadById(leadId);
    if (found) {
      setLead(found);
      setStatus(found.status);
      setSurveyNotes(found.surveyNotes || "");
      if (found.creditAssessment) {
        setLoanAmount(found.creditAssessment.recommendedLoanAmount);
        setTenorMonths(found.creditAssessment.tenorMonths);
      } else if (found.capitalDeficit > 0) {
        setLoanAmount(Math.min(50000000, Math.max(5000000, found.capitalDeficit)));
      }
    }
    setIsReady(true);
  }, [router, leadId]);

  if (!isReady || !mantri) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        <div className="space-y-3 text-center">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-400">Memuat Dossier Calon Debitur...</p>
        </div>
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white p-4">
        <div className="max-w-md w-full text-center space-y-4 p-8 rounded-3xl bg-slate-900 border border-slate-800">
          <AlertTriangle className="w-10 h-10 text-amber-400 mx-auto" />
          <h2 className="text-lg font-bold">Dossier Prospek Tidak Ditemukan</h2>
          <p className="text-xs text-slate-400">
            ID pengajuan &ldquo;{leadId}&rdquo; tidak terdaftar dalam basis data lokal.
          </p>
          <Link href="/mantri/dashboard">
            <Button variant="primary" size="md">
              Kembali ke Dashboard Mantri
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Calculate live KUR assessment based on current sliders
  const currentAssessment = calculateKurAssessment(
    loanAmount,
    tenorMonths,
    lead.financialMetrics.monthlyNetProfit
  );

  const handleSaveAssessment = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = updateLeadStatus(lead.id, status, surveyNotes, currentAssessment);
    if (updated) {
      setLead(updated);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  const waUrl = generateWhatsAppUrl(
    lead.applicantPhone,
    lead.applicantName,
    lead.businessTitle,
    mantri.name,
    mantri.unitName
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
      {/* 1. Header Resmi Mantri */}
      <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/mantri/dashboard"
              className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors"
              title="Kembali ke Dashboard"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                  {lead.id}
                </span>
                <span className="text-xs text-slate-400">Dossier Evaluasi Debitur</span>
              </div>
              <h1 className="text-sm sm:text-base font-bold text-white leading-tight">
                {lead.applicantName} — {lead.businessTitle}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-emerald-300 bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Chat WhatsApp</span>
            </a>
          </div>
        </div>
      </header>

      {/* 2. Main Content Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 flex-1 w-full">
        {/* Toast Notifikasi Simpan */}
        {saveSuccess && (
          <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Perubahan status pipeline dan asesmen kredit berhasil disimpan ke sistem!</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* KOLOM KIRI (2 Kolom): Dossier Rencana Usaha & Riset Pasar 5 Sumber */}
          <div className="lg:col-span-2 space-y-6">
            {/* Bagian 1: Profil Calon Debitur & Lokasi Usaha */}
            <Card className="bg-slate-900/90 border-slate-800 text-slate-100 p-5 sm:p-6 rounded-3xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                <h2 className="text-sm font-bold text-white flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-blue-400" />
                  <span>Identitas Calon Debitur & Lokasi Usaha</span>
                </h2>
                <span className="text-xs text-slate-400 font-mono">
                  Diajukan: {new Date(lead.submittedAt).toLocaleDateString("id-ID", { dateStyle: "long" })}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <span className="text-slate-400">Nama Lengkap Pemohon:</span>
                  <div className="text-sm font-bold text-white">{lead.applicantName}</div>
                </div>
                <div className="space-y-1">
                  <span className="text-slate-400">Nomor WhatsApp Aktif:</span>
                  <div className="text-sm font-mono font-bold text-emerald-400">{lead.applicantPhone}</div>
                </div>
                <div className="space-y-1">
                  <span className="text-slate-400">Kota Domisili:</span>
                  <div className="font-semibold text-slate-200">{lead.city}</div>
                </div>
                <div className="space-y-1">
                  <span className="text-slate-400">Waktu Kontak Pilihan:</span>
                  <div className="font-semibold text-amber-300 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{lead.preferredContactTime}</span>
                  </div>
                </div>
                <div className="sm:col-span-2 space-y-1 pt-1 border-t border-slate-800">
                  <span className="text-slate-400">Alamat Spesifik Rencana Usaha:</span>
                  <div className="font-semibold text-white text-sm">{lead.specificLocation}</div>
                  <span className="inline-block mt-1 text-[11px] px-2.5 py-0.5 rounded-full bg-slate-800 text-blue-300 border border-slate-700">
                    Karakteristik Area: {lead.locationEnvironment}
                  </span>
                </div>
              </div>
            </Card>

            {/* Bagian 2: Bukti Analisis Pasar 5 Sumber (Embedded Redesigned Panel) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-white flex items-center gap-2">
                  <Compass className="w-4 h-4 text-brand-secondary" />
                  <span>Dossier Sinyal Pasar 5 Sumber (Verifikasi Otentik)</span>
                </h2>
                <span className="text-[11px] text-slate-400">Telah diverifikasi sistem UsahaQita</span>
              </div>

              {/* Komponen Panel Riset yang Rapi & Solid */}
              <MarketIntelligencePanel
                intelligence={lead.marketIntelligence}
                cityLocation={lead.city}
                specificLocation={lead.specificLocation}
              />
            </div>

            {/* Bagian 3: Finansial Calon Pengusaha */}
            <Card className="bg-slate-900/90 border-slate-800 text-slate-100 p-5 sm:p-6 rounded-3xl space-y-4">
              <h2 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800/80 pb-3">
                <Coins className="w-4 h-4 text-amber-400" />
                <span>Simulasi Kelayakan Finansial Calon Usaha</span>
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-400">Modal Sendiri</span>
                  <div className="text-xs sm:text-sm font-bold text-white">
                    {formatRupiah(lead.availableCapital)}
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-400">Kebutuhan Modal</span>
                  <div className="text-xs sm:text-sm font-bold text-blue-300">
                    {formatRupiah(lead.estimatedTotalCapital)}
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-400">Titik Impas (BEP)</span>
                  <div className="text-xs sm:text-sm font-bold text-amber-300">
                    {lead.financialMetrics.bepUnitsPerDay} unit/hari
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-400">Est. Laba Bersih</span>
                  <div className="text-xs sm:text-sm font-bold text-emerald-400">
                    {formatRupiah(lead.financialMetrics.monthlyNetProfit)}/bln
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* KOLOM KANAN (1 Kolom): Kalkulator Asesmen KUR Mantri & Update Status */}
          <div className="space-y-6">
            <Card className="bg-slate-900 border-blue-900/60 text-slate-100 p-5 sm:p-6 rounded-3xl space-y-5 sticky top-20 shadow-xl">
              <div className="space-y-1 border-b border-slate-800 pb-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black uppercase tracking-wider text-blue-400">
                    EVALUASI MANTRI BRI
                  </span>
                  <ShieldCheck className="w-4 h-4 text-blue-400" />
                </div>
                <h3 className="text-base font-bold text-white">
                  Kalkulator Asesmen KUR Mikro
                </h3>
                <p className="text-xs text-slate-400">
                  Uji kapasitas angsuran debitur terhadap estimasi laba bulanan (*DSCR*).
                </p>
              </div>

              <form onSubmit={handleSaveAssessment} className="space-y-5">
                {/* 1. Status Pipeline */}
                <div className="space-y-1.5 text-left">
                  <label className="text-xs font-semibold text-slate-300">
                    Tahapan Pipeline Usaha:
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as PipelineStatus)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-blue-500 font-semibold"
                  >
                    <option value="BARU_MASUK">🟡 Pengajuan Baru (Belum Dihubungi)</option>
                    <option value="KONTAK_PERTAMA">🔵 Kontak Pertama (Sudah Dihubungi)</option>
                    <option value="SURVEI_LAPANGAN">🟣 Jadwal / Selesai Survei Lapangan</option>
                    <option value="REKOMENDASI_KUR">🟢 Rekomendasi KUR Terbit (Disetujui)</option>
                    <option value="BINA_MANDIRI">⚪ Bina Usaha Mandiri (Edukasi Modal)</option>
                  </select>
                </div>

                {/* 2. Plafon Pinjaman KUR */}
                <div className="space-y-1.5 text-left">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-300">Plafon Rekomendasi KUR:</span>
                    <span className="font-mono font-bold text-amber-300 text-sm">
                      {formatRupiah(loanAmount)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={5000000}
                    max={50000000}
                    step={1000000}
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(Number(e.target.value))}
                    className="w-full accent-blue-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span>Rp 5 Jt</span>
                    <span>Rp 25 Jt</span>
                    <span>Rp 50 Jt</span>
                  </div>
                </div>

                {/* 3. Pilihan Tenor */}
                <div className="space-y-1.5 text-left">
                  <label className="text-xs font-semibold text-slate-300">
                    Jangka Waktu (Tenor):
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {([12, 24, 36] as const).map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setTenorMonths(t)}
                        className={`py-2 rounded-xl text-xs font-bold transition-all ${
                          tenorMonths === t
                            ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                            : "bg-slate-950 text-slate-400 hover:text-white border border-slate-800"
                        }`}
                      >
                        {t} Bulan
                      </button>
                    ))}
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Suku Bunga Subsidi: <strong>6% efektif p.a.</strong>
                  </p>
                </div>

                {/* 4. Hasil Asesmen Kredit & Rasio DSCR */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-left">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Estimasi Angsuran / Bln:</span>
                    <span className="font-mono font-bold text-white text-sm">
                      {formatRupiah(currentAssessment.monthlyInstallment)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-800">
                    <span className="text-slate-400">Kapasitas DSCR:</span>
                    <span className="font-bold text-emerald-400 text-sm">
                      {currentAssessment.dscrRatio}x
                    </span>
                  </div>

                  {/* Penjelasan Perbankan */}
                  <div className="pt-2 text-[11px] leading-relaxed">
                    {currentAssessment.eligibilityGrade === "SANGAT_LAYAK" ? (
                      <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300">
                        <strong className="font-bold">STATUS: SANGAT LAYAK.</strong> Angsuran hanya menghabiskan{" "}
                        {Math.round((currentAssessment.monthlyInstallment / lead.financialMetrics.monthlyNetProfit) * 100)}%
                        dari laba bulanan debitur.
                      </div>
                    ) : currentAssessment.eligibilityGrade === "LAYAK" ? (
                      <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-300">
                        <strong className="font-bold">STATUS: LAYAK.</strong> Angsuran aman, namun perlu monitoring berkala penjualan harian.
                      </div>
                    ) : (
                      <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300">
                        <strong className="font-bold">STATUS: BERISIKO.</strong> Angsuran melebihi 80% laba bulanan. Sarankan tenor lebih panjang atau plafon lebih kecil.
                      </div>
                    )}
                  </div>
                </div>

                {/* 5. Catatan Survei Lapangan Mantri */}
                <div className="space-y-1.5 text-left">
                  <label className="text-xs font-semibold text-slate-300">
                    Catatan Verifikasi & Survei Fisik:
                  </label>
                  <textarea
                    rows={3}
                    value={surveyNotes}
                    onChange={(e) => setSurveyNotes(e.target.value)}
                    placeholder="Tuliskan catatan kondisi lokasi, kesiapan alat usaha, atau hasil wawancara..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-all resize-none"
                  />
                </div>

                {/* Tombol Simpan */}
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs py-2.5 rounded-xl shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Simpan Hasil Asesmen Mantri</span>
                </Button>
              </form>
            </Card>
          </div>
        </div>
      </main>

      {/* 3. Footer */}
      <footer className="border-t border-slate-800 py-6 text-center text-xs text-slate-500">
        <p>© 2026 PT Bank Rakyat Indonesia (Persero) Tbk. Unit Kerja: {mantri.unitName}.</p>
      </footer>
    </div>
  );
}
