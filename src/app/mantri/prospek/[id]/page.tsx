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
  getLeadByIdAsync,
  updateLeadStatusAsync,
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
  const [isSaving, setIsSaving] = useState(false);

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

    // Ambil detail mutakhir langsung dari MySQL
    getLeadByIdAsync(leadId).then((dbFound) => {
      if (dbFound) {
        setLead(dbFound);
        setStatus(dbFound.status);
        setSurveyNotes(dbFound.surveyNotes || "");
        if (dbFound.creditAssessment) {
          setLoanAmount(dbFound.creditAssessment.recommendedLoanAmount);
          setTenorMonths(dbFound.creditAssessment.tenorMonths);
        }
      }
    });
  }, [router, leadId]);

  if (!isReady || !mantri) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-900">
        <div className="space-y-3 text-center">
          <div className="w-10 h-10 border-4 border-brand-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-500 font-medium">Memuat Dossier Calon Debitur...</p>
        </div>
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-900 p-4">
        <div className="max-w-md w-full text-center space-y-4 p-8 rounded-3xl bg-white border border-slate-200 shadow-sm">
          <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto" />
          <h2 className="text-lg font-bold text-slate-900">Dossier Prospek Tidak Ditemukan</h2>
          <p className="text-xs text-slate-500">
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
    lead.financialMetrics?.monthlyNetProfit || 0
  );

  const handleSaveAssessment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lead) return;
    setIsSaving(true);
    try {
      const updated = await updateLeadStatusAsync(lead.id, status, surveyNotes, currentAssessment);
      if (updated) {
        setLead(updated);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 4000);
      }
    } finally {
      setIsSaving(false);
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
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between">
      {/* 1. Header Resmi Mantri */}
      <header className="border-b border-slate-200 bg-white/95 backdrop-blur-md sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/mantri/dashboard"
              className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors shadow-2xs"
              title="Kembali ke Dashboard"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold text-brand-primary bg-brand-light px-2 py-0.5 rounded border border-brand-accent/40">
                  {lead.id}
                </span>
                <span className="text-xs text-slate-500">Dossier Evaluasi Debitur</span>
              </div>
              <h1 className="text-sm sm:text-base font-bold text-slate-900 leading-tight">
                {lead.applicantName} — {lead.businessTitle}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 transition-colors shadow-2xs"
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
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in shadow-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Perubahan status pipeline, hasil asesmen, dan catatan survei berhasil disinkronkan ke Google Cloud Firestore!</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* KOLOM KIRI (2 Kolom): Dossier Rencana Usaha & Riset Pasar 5 Sumber */}
          <div className="lg:col-span-2 space-y-6">
            {/* Bagian 1: Profil Calon Debitur & Lokasi Usaha */}
            <Card className="bg-white border-slate-200 text-slate-900 p-5 sm:p-6 rounded-3xl space-y-4 shadow-xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-brand-primary" />
                  <span>Identitas Calon Debitur & Lokasi Usaha</span>
                </h2>
                <span className="text-xs text-slate-500 font-mono">
                  Diajukan: {new Date(lead.submittedAt).toLocaleDateString("id-ID", { dateStyle: "long" })}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <span className="text-slate-500">Nama Lengkap Pemohon:</span>
                  <div className="text-sm font-bold text-slate-900">{lead.applicantName}</div>
                </div>
                <div className="space-y-1">
                  <span className="text-slate-500">Nomor WhatsApp Aktif:</span>
                  <div className="text-sm font-mono font-bold text-emerald-700">{lead.applicantPhone}</div>
                </div>
                <div className="space-y-1">
                  <span className="text-slate-500">Kota Domisili:</span>
                  <div className="font-semibold text-slate-800">{lead.city}</div>
                </div>
                <div className="space-y-1">
                  <span className="text-slate-500">Waktu Kontak Pilihan:</span>
                  <div className="font-semibold text-amber-800 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-amber-600" />
                    <span>{lead.preferredContactTime}</span>
                  </div>
                </div>
                <div className="sm:col-span-2 space-y-1 pt-1 border-t border-slate-100">
                  <span className="text-slate-500">Alamat Spesifik Rencana Usaha:</span>
                  <div className="font-semibold text-slate-900 text-sm">{lead.specificLocation}</div>
                  <span className="inline-block mt-1 text-[11px] px-2.5 py-0.5 rounded-full bg-slate-100 text-brand-primary font-medium border border-slate-200">
                    Karakteristik Area: {lead.locationEnvironment}
                  </span>
                </div>
              </div>
            </Card>

            {/* Bagian 2: Bukti Analisis Pasar 5 Sumber (Embedded Redesigned Panel) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Compass className="w-4 h-4 text-brand-primary" />
                  <span>Dossier Sinyal Pasar 5 Sumber (Verifikasi Otentik)</span>
                </h2>
                <span className="text-[11px] text-slate-500">Telah diverifikasi sistem UsahaQita</span>
              </div>

              {/* Komponen Panel Riset yang Rapi & Solid */}
              <MarketIntelligencePanel
                intelligence={lead.marketIntelligence}
                cityLocation={lead.city}
                specificLocation={lead.specificLocation}
                businessTitle={lead.businessTitle}
                category={lead.businessCategory}
              />
            </div>

            {/* Bagian 3: Finansial Calon Pengusaha */}
            <Card className="bg-white border-slate-200 text-slate-900 p-5 sm:p-6 rounded-3xl space-y-4 shadow-xs">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
                <Coins className="w-4 h-4 text-amber-600" />
                <span>Simulasi Kelayakan Finansial Calon Usaha</span>
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-[10px] text-slate-500 font-medium">Modal Sendiri</span>
                  <div className="text-xs sm:text-sm font-bold text-slate-900">
                    {formatRupiah(lead.availableCapital)}
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-[10px] text-slate-500 font-medium">Kebutuhan Modal</span>
                  <div className="text-xs sm:text-sm font-bold text-brand-primary">
                    {formatRupiah(lead.estimatedTotalCapital)}
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-[10px] text-slate-500 font-medium">Titik Impas (BEP)</span>
                  <div className="text-xs sm:text-sm font-bold text-amber-800">
                    {lead.financialMetrics.bepUnitsPerDay} unit/hari
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-[10px] text-slate-500 font-medium">Est. Laba Bersih</span>
                  <div className="text-xs sm:text-sm font-bold text-emerald-700">
                    {formatRupiah(lead.financialMetrics?.monthlyNetProfit || 0)}/bln
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* KOLOM KANAN (1 Kolom): Kalkulator Asesmen KUR Mantri & Update Status */}
          <div className="space-y-6">
            <Card className="bg-white border-2 border-brand-primary/20 text-slate-900 p-5 sm:p-6 rounded-3xl space-y-5 sticky top-20 shadow-lg shadow-blue-900/5">
              <div className="space-y-1 border-b border-slate-100 pb-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black uppercase tracking-wider text-brand-primary">
                    EVALUASI MANTRI BRI
                  </span>
                  <ShieldCheck className="w-4 h-4 text-brand-primary" />
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  Kalkulator Asesmen KUR Mikro
                </h3>
                <p className="text-xs text-slate-500">
                  Uji kapasitas angsuran debitur terhadap estimasi laba bulanan (*DSCR*).
                </p>
              </div>

              <form onSubmit={handleSaveAssessment} className="space-y-5">
                {/* 1. Status Pipeline */}
                <div className="space-y-1.5 text-left">
                  <label className="text-xs font-semibold text-slate-700">
                    Tahapan Pipeline Usaha:
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as PipelineStatus)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-brand-primary font-semibold transition-all"
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
                    <span className="font-semibold text-slate-700">Plafon Rekomendasi KUR:</span>
                    <span className="font-mono font-bold text-brand-primary text-sm">
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
                    className="w-full accent-[#0857c3] cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span>Rp 5 Jt</span>
                    <span>Rp 25 Jt</span>
                    <span>Rp 50 Jt</span>
                  </div>
                </div>

                {/* 3. Pilihan Tenor */}
                <div className="space-y-1.5 text-left">
                  <label className="text-xs font-semibold text-slate-700">
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
                            ? "bg-brand-primary text-white shadow-sm shadow-brand-primary/25"
                            : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200"
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
                <div className="p-4 rounded-2xl bg-brand-light/60 border border-brand-accent/40 space-y-2 text-left">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-600">Estimasi Angsuran / Bln:</span>
                    <span className="font-mono font-bold text-slate-900 text-sm">
                      {formatRupiah(currentAssessment.monthlyInstallment)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1 border-t border-brand-accent/30">
                    <span className="text-slate-600">Kapasitas DSCR:</span>
                    <span className="font-bold text-emerald-700 text-sm">
                      {currentAssessment.dscrRatio}x
                    </span>
                  </div>

                  {/* Penjelasan Perbankan */}
                  <div className="pt-2 text-[11px] leading-relaxed">
                    {currentAssessment.eligibilityGrade === "SANGAT_LAYAK" ? (
                      <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800">
                        <strong className="font-bold">STATUS: SANGAT LAYAK.</strong> Angsuran hanya menghabiskan{" "}
                        {Math.round((currentAssessment.monthlyInstallment / lead.financialMetrics?.monthlyNetProfit || 0) * 100)}%
                        dari laba bulanan debitur.
                      </div>
                    ) : currentAssessment.eligibilityGrade === "LAYAK" ? (
                      <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-300 text-brand-primary">
                        <strong className="font-bold">STATUS: LAYAK.</strong> Angsuran aman, namun perlu monitoring berkala penjualan harian.
                      </div>
                    ) : (
                      <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-300 text-rose-800">
                        <strong className="font-bold">STATUS: BERISIKO.</strong> Angsuran melebihi 80% laba bulanan. Sarankan tenor lebih panjang atau plafon lebih kecil.
                      </div>
                    )}
                  </div>
                </div>

                {/* 5. Catatan Survei Lapangan Mantri */}
                <div className="space-y-1.5 text-left">
                  <label className="text-xs font-semibold text-slate-700">
                    Catatan Verifikasi & Survei Fisik:
                  </label>
                  <textarea
                    rows={3}
                    value={surveyNotes}
                    onChange={(e) => setSurveyNotes(e.target.value)}
                    placeholder="Tuliskan catatan kondisi lokasi, kesiapan alat usaha, atau hasil wawancara..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-brand-primary transition-all resize-none"
                  />
                </div>

                {/* Tombol Simpan */}
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  disabled={isSaving}
                  className="w-full bg-brand-primary hover:bg-brand-dark text-white font-bold text-xs py-2.5 rounded-xl shadow-md shadow-brand-primary/25 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSaving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Menyimpan ke Cloud Firestore...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Simpan Hasil Asesmen Mantri</span>
                    </>
                  )}
                </Button>
              </form>
            </Card>
          </div>
        </div>
      </main>

      {/* 3. Footer */}
      <footer className="border-t border-slate-200 py-6 text-center text-xs text-slate-500">
        <p>© 2026 PT Bank Rakyat Indonesia (Persero) Tbk. Unit Kerja: {mantri.unitName}.</p>
      </footer>
    </div>
  );
}
