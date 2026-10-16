"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShieldAlert,
  CheckCircle2,
  Building2,
  FileText,
  CreditCard,
  Send,
  ArrowLeft,
  Clock,
  Lock,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ErrorAlert } from "@/components/feedback/ErrorAlert";
import { getSelectedOpportunity, getUserProfile } from "@/services/storageService";
import { submitNewLead } from "@/services/mantriService";
import { calculateFinancials } from "@/core/finance/calculator";
import { useLanguage } from "@/context/LanguageContext";
import { businessOpportunities } from "@/data/opportunities";

export default function MantriPage() {
  const [fullName, setFullName] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [businessName, setBusinessName] = useState<string>("");
  const [preferredContactTime, setPreferredContactTime] = useState<string>("Pagi (08:30 - 11:30 WIB)");
  const [hasAgreedConsent, setHasAgreedConsent] = useState<boolean>(false);

  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [submittedLeadId, setSubmittedLeadId] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const { t, language } = useLanguage();

  useEffect(() => {
    const opp = getSelectedOpportunity();
    if (opp) {
      setBusinessName(opp.title);
    }
    const user = getUserProfile();
    if (user && user.cityLocation) {
      setCity(user.cityLocation);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim()) {
      setErrorMessage(
        language === "en"
          ? "Please enter your full name."
          : "Mohon isi nama lengkap Anda."
      );
      return;
    }
    if (!phoneNumber.trim() || phoneNumber.length < 9) {
      setErrorMessage(
        language === "en"
          ? "Please enter a valid WhatsApp/phone number (min 9 digits)."
          : "Mohon isi nomor WhatsApp/telepon yang valid (minimal 9 digit)."
      );
      return;
    }
    if (!hasAgreedConsent) {
      setErrorMessage(
        language === "en"
          ? "Please agree to the educational simulation consultation terms."
          : "Mohon centang persetujuan konsultasi edukatif sebelum mengirim."
      );
      return;
    }

    setErrorMessage("");

    // Prepare lead data
    const user = getUserProfile();
    const opp = getSelectedOpportunity() || businessOpportunities[0];

    const fin = calculateFinancials(opp.defaultAssumptions);

    const lead = submitNewLead({
      applicantName: fullName.trim(),
      applicantPhone: phoneNumber.trim(),
      preferredContactTime,
      city: city || user?.cityLocation || "Indonesia",
      specificLocation: user?.specificLocation || "Area Rencana Usaha",
      locationEnvironment: user?.locationEnvironment || "Lingkungan Usaha",
      businessTitle: businessName || opp.title,
      businessCategory: opp.category,
      availableCapital: user?.availableCapital || 5000000,
      estimatedTotalCapital: opp.estimatedMinCapital,
      capitalDeficit: Math.max(0, opp.estimatedMinCapital - (user?.availableCapital || 5000000)),
      matchScore: 90,
      marketIntelligence: opp.marketIntelligence!,
      financialMetrics: {
        dailyVolume: opp.defaultAssumptions.dailySalesVolume,
        sellingPrice: opp.defaultAssumptions.sellingPricePerUnit,
        monthlyNetProfit: fin.monthlyNetProfit,
        bepUnitsPerDay: fin.bepUnitsPerDay,
        bepRupiahPerMonth: fin.bepMonthlyRevenue,
        paybackMonths: fin.estimatedPaybackMonths,
      },
      surveyNotes: "Permohonan konsultasi mandiri dari simulasi UsahaQita.",
    });

    setSubmittedLeadId(lead.id);
    setIsSubmitted(true);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-6 text-left">
      {/* Banner Akses Portal Mantri BRI (Untuk Petugas / Evaluator) */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shrink-0">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-blue-400">
                PORTAL RESMI BANK
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-semibold border border-blue-500/30">
                POV Mantri BRI
              </span>
            </div>
            <p className="text-xs text-slate-300 font-medium">
              Apakah Anda petugas Mantri BRI? Akses Dashboard Pemantauan & Verifikasi Debitur.
            </p>
          </div>
        </div>

        <Link
          href="/mantri/login"
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white transition-colors shrink-0 shadow-sm"
        >
          <Lock className="w-3.5 h-3.5" />
          <span>Login Mantri BRI</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Header Halaman (Calon Pengusaha) */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Badge variant="blue">{t.mantri.badge}</Badge>
          <span className="text-xs text-slate-500">
            {language === "en" ? "Phase 4: Field Guidance" : "Langkah 4: Pendampingan Usaha Nyata"}
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          {t.mantri.title}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl">
          {t.mantri.subtitle}
        </p>
      </div>

      {/* Banner Disclaimer Kepatuhan Perbankan */}
      <div className="rounded-2xl bg-amber-50/80 border border-amber-200/90 p-4 sm:p-5 flex items-start gap-3 text-xs text-amber-900 shadow-sm">
        <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h2 className="font-bold text-slate-900">{t.mantri.disclaimerTitle}</h2>
          <p className="leading-relaxed text-amber-800">
            {t.mantri.disclaimerDesc}
          </p>
        </div>
      </div>

      {/* 3 Pilar Pendampingan Mantri BRI */}
      <Card className="p-6 sm:p-8 space-y-5 bg-white border-slate-200 shadow-sm">
        <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
          <Building2 className="w-5 h-5 text-brand-primary" />
          {t.mantri.pillarsTitle}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-blue-50/80 border border-blue-200 space-y-2 text-xs">
            <div className="w-8 h-8 rounded-lg bg-white border border-blue-300 text-brand-primary flex items-center justify-center shadow-sm">
              <Building2 className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">{t.mantri.accountTitle}</h3>
            <p className="text-slate-600 leading-relaxed">
              {t.mantri.accountDesc}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-sky-50/80 border border-sky-200 space-y-2 text-xs">
            <div className="w-8 h-8 rounded-lg bg-white border border-sky-300 text-brand-secondary flex items-center justify-center shadow-sm">
              <CreditCard className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">{t.mantri.qrisTitle}</h3>
            <p className="text-slate-600 leading-relaxed">
              {t.mantri.qrisDesc}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-emerald-50/80 border border-emerald-200 space-y-2 text-xs">
            <div className="w-8 h-8 rounded-lg bg-white border border-emerald-300 text-emerald-700 flex items-center justify-center shadow-sm">
              <FileText className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">{t.mantri.literacyTitle}</h3>
            <p className="text-slate-600 leading-relaxed">
              {t.mantri.literacyDesc}
            </p>
          </div>
        </div>
      </Card>

      {/* Formulir Minat Konsultasi atau Layar Konfirmasi */}
      {isSubmitted ? (
        <Card className="p-8 text-center space-y-5 bg-gradient-to-b from-brand-light to-white border-brand-accent/40 shadow-sm animate-in fade-in">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-sm">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-xs font-mono font-bold text-brand-primary">
              ID Pengajuan: {submittedLeadId}
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              Permohonan Konsultasi Berhasil Terkirim ke Mantri BRI!
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
              {language === "en" ? "Thank you, " : "Terima kasih, "}
              <strong>{fullName}</strong>.{" "}
              {language === "en"
                ? `Your business plan for ${businessName || "Your Business"} in ${city} has been received and queued in the Mantri BRI monitoring dashboard.`
                : `Data rencana usaha Anda untuk ${businessName || "Usaha Anda"} di ${city} telah masuk ke dalam antrean dashboard monitoring Mantri BRI.`}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200 max-w-md mx-auto text-xs text-slate-600 text-left space-y-2 shadow-sm">
            <div className="font-bold text-brand-primary flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-brand-secondary" />
              <span>Jadwal Kontak: <strong>{preferredContactTime}</strong></span>
            </div>
            <p>
              Mantri BRI wilayah terdekat akan menghubungi Anda melalui WhatsApp di nomor{" "}
              <strong className="text-slate-900 font-mono">{phoneNumber}</strong> untuk mendiskusikan rencana usaha dan bimbingan rekening permodalan.
            </p>
          </div>

          {/* Shortcut Link untuk Penguji / Mantri */}
          <div className="p-3.5 rounded-2xl bg-slate-900 text-white max-w-md mx-auto text-xs space-y-2 shadow-sm">
            <div className="flex items-center gap-1.5 text-blue-400 font-bold">
              <Sparkles className="w-4 h-4" />
              <span>Khusus Demo / Evaluator:</span>
            </div>
            <p className="text-slate-300 text-[11px]">
              Ingin melihat pengajuan ini langsung dari sudut pandang petugas bank?
            </p>
            <Link
              href="/mantri/dashboard"
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 transition-colors w-full"
            >
              <span>Buka Dashboard Monitoring Mantri</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="pt-2 flex justify-center gap-3">
            <Link href="/roadmap">
              <Button size="sm" variant="primary">
                {t.mantri.backRoadmap}
              </Button>
            </Link>
            <Button size="sm" variant="secondary" onClick={() => setIsSubmitted(false)}>
              {t.mantri.sendAnother}
            </Button>
          </div>
        </Card>
      ) : (
        <Card className="p-6 sm:p-8 space-y-6 bg-white border-slate-200 shadow-sm">
          <div className="space-y-1">
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              Formulir Permohonan Pendampingan Mantri BRI
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Kirimkan ringkasan rencana usaha Anda untuk diverifikasi dan didampingi langsung oleh Mantri BRI terdekat.
            </p>
          </div>

          {errorMessage && <ErrorAlert message={errorMessage} />}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="fullName" className="text-xs sm:text-sm font-semibold text-slate-700">
                Nama Lengkap Calon Pengusaha
              </label>
              <input
                type="text"
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Contoh: Ahmad Fauzi"
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-accent/50 focus:border-brand-primary min-h-[44px]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="phoneNumber" className="text-xs sm:text-sm font-semibold text-slate-700">
                  Nomor WhatsApp Aktif
                </label>
                <input
                  type="tel"
                  id="phoneNumber"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="Contoh: 081234567890"
                  className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-accent/50 focus:border-brand-primary min-h-[44px]"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="preferredTime" className="text-xs sm:text-sm font-semibold text-slate-700">
                  Waktu Kontak yang Diinginkan
                </label>
                <select
                  id="preferredTime"
                  value={preferredContactTime}
                  onChange={(e) => setPreferredContactTime(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-accent/50 focus:border-brand-primary min-h-[44px]"
                >
                  <option value="Pagi (08:30 - 11:30 WIB)">Pagi (08:30 - 11:30 WIB)</option>
                  <option value="Siang (13:00 - 15:00 WIB)">Siang (13:00 - 15:00 WIB)</option>
                  <option value="Sore (15:30 - 17:00 WIB)">Sore (15:30 - 17:00 WIB)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="city" className="text-xs sm:text-sm font-semibold text-slate-700">
                  Kota / Wilayah Usaha
                </label>
                <input
                  type="text"
                  id="city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Contoh: Malang"
                  className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-accent/50 focus:border-brand-primary min-h-[44px]"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="businessName" className="text-xs sm:text-sm font-semibold text-slate-700">
                  Rencana Usaha Terpilih
                </label>
                <input
                  type="text"
                  id="businessName"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="Contoh: Booth Kopi Susu Gula Aren"
                  className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-accent/50 focus:border-brand-primary min-h-[44px]"
                />
              </div>
            </div>

            {/* Checkbox Persetujuan Eksplisit (Consent) */}
            <div className="pt-2">
              <label className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 border border-slate-300/80 cursor-pointer select-none hover:bg-slate-100 transition-colors">
                <input
                  type="checkbox"
                  checked={hasAgreedConsent}
                  onChange={(e) => setHasAgreedConsent(e.target.checked)}
                  className="w-4 h-4 mt-0.5 rounded text-brand-primary focus:ring-brand-primary cursor-pointer shrink-0"
                />
                <span className="text-xs text-slate-700 leading-relaxed">
                  Saya setuju data simulasi rencana usaha ini diteruskan kepada Mantri BRI untuk keperluan konsultasi edukatif dan pendampingan permodalan usaha mikro.
                </span>
              </label>
            </div>

            <Button
              type="submit"
              variant="accent"
              size="lg"
              fullWidth
              rightIcon={<Send className="w-4 h-4" />}
            >
              Kirim Rencana Usaha ke Mantri BRI
            </Button>
          </form>
        </Card>
      )}

      {/* Navigasi Balik */}
      <div className="flex justify-between items-center text-xs">
        <Link href="/analisis" className="text-brand-primary font-semibold hover:underline flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" />
          {language === "en" ? "Back to Financial Calculator" : "Kembali ke Kalkulator Finansial"}
        </Link>
      </div>
    </div>
  );
}
