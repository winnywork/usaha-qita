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
  ArrowRight,
  MapPin,
  Coins,
  TrendingUp,
  MessageSquare,
  UserCheck,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ErrorAlert } from "@/components/feedback/ErrorAlert";
import {
  getSelectedOpportunity,
  getUserProfile,
  getCustomAssumptions,
} from "@/services/storageService";
import {
  submitNewLeadAsync,
  generateUserToMantriWhatsAppUrl,
} from "@/services/mantriService";
import { ConsultationLead } from "@/types/mantri";
import { calculateFinancials } from "@/core/finance/calculator";
import { useLanguage } from "@/context/LanguageContext";
import { businessOpportunities } from "@/data/opportunities";

export default function MantriPage() {
  const [fullName, setFullName] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [specificLocation, setSpecificLocation] = useState<string>("");
  const [businessName, setBusinessName] = useState<string>("");
  const [preferredContactTime, setPreferredContactTime] = useState<string>("Pagi (08:30 - 11:30 WIB)");
  const [hasAgreedConsent, setHasAgreedConsent] = useState<boolean>(false);

  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submittedLead, setSubmittedLead] = useState<ConsultationLead | null>(null);
  const [submittedLeadId, setSubmittedLeadId] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const { t, language } = useLanguage();

  useEffect(() => {
    const opp = getSelectedOpportunity();
    if (opp) {
      setBusinessName(opp.title);
    }
    const user = getUserProfile();
    if (user) {
      if (user.cityLocation) setCity(user.cityLocation);
      if (user.specificLocation) setSpecificLocation(user.specificLocation);
    }
  }, []);

  const formatRupiah = (val?: number) => {
    if (val === undefined || val === null) return "Rp 0";
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handleSubmit = async (e: React.FormEvent) => {
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
    setIsSubmitting(true);

    try {
      const user = getUserProfile();
      const opp = getSelectedOpportunity() || businessOpportunities[0];
      const customAssumptions = getCustomAssumptions(opp.id);
      const finalAssumptions = customAssumptions || opp.defaultAssumptions;
      const fin = calculateFinancials(finalAssumptions);

      const estimatedTotalCapital = finalAssumptions.initialEquipmentCost || opp.estimatedMinCapital;
      const availableCapital = user?.availableCapital || 5000000;
      const capitalDeficit = Math.max(0, estimatedTotalCapital - availableCapital);

      const lead = await submitNewLeadAsync({
        applicantName: fullName.trim(),
        applicantPhone: phoneNumber.trim(),
        preferredContactTime,
        city: city.trim() || user?.cityLocation || "Malang",
        specificLocation: specificLocation.trim() || user?.specificLocation || city.trim() || "Pusat Kota",
        locationEnvironment: user?.locationEnvironment || "Area Komersial",
        businessTitle: businessName.trim() || opp.title,
        businessCategory: opp.category,
        availableCapital,
        estimatedTotalCapital,
        capitalDeficit,
        matchScore: 90,
        marketIntelligence: opp.marketIntelligence!,
        financialMetrics: {
          dailyVolume: finalAssumptions.dailySalesVolume,
          sellingPrice: finalAssumptions.sellingPricePerUnit,
          monthlyNetProfit: fin.monthlyNetProfit,
          bepUnitsPerDay: fin.bepUnitsPerDay,
          bepRupiahPerMonth: fin.bepMonthlyRevenue,
          paybackMonths: fin.estimatedPaybackMonths,
        },
        surveyNotes: "Permohonan konsultasi mandiri dari simulasi platform UsahaQita.",
      });

      setSubmittedLead(lead);
      setSubmittedLeadId(lead.id);
      setIsSubmitted(true);
    } catch {
      setErrorMessage(
        language === "en"
          ? "Failed to submit request. Please try again."
          : "Gagal mengirim permohonan konsultasi. Silakan periksa koneksi dan coba lagi."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const mantriPhone = submittedLead?.assignedMantriPhone || "081234567891";
  const mantriName = submittedLead?.assignedMantriName || "Mantri Pembina BRI";
  const unitName = submittedLead?.assignedUnit || "BRI Unit";

  const waUrl = generateUserToMantriWhatsAppUrl({
    mantriPhone,
    mantriName,
    unitName,
    applicantName: fullName,
    businessTitle: businessName,
    city: city || "Indonesia",
    leadId: submittedLead?.id || submittedLeadId,
    availableCapital: submittedLead?.availableCapital,
    capitalDeficit: submittedLead?.capitalDeficit,
  });

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-6 text-left">
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
        <Card className="p-6 sm:p-8 space-y-6 bg-gradient-to-b from-blue-50/40 via-white to-white border-blue-200/90 shadow-md animate-in fade-in">
          <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100/70 border border-blue-200 text-xs font-mono font-bold text-brand-primary">
              <span>No. Registrasi: {submittedLead?.id || submittedLeadId}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              <span className="text-[10px] text-emerald-700 font-semibold uppercase">Cloud Firestore Live</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Permohonan Konsultasi Berhasil Terhubung!
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
              {language === "en" ? "Thank you, " : "Terima kasih, "}
              <strong className="text-slate-900">{fullName}</strong>.{" "}
              {language === "en"
                ? `Your business plan for "${businessName || "Your Business"}" has been linked to the assigned Mantri officer for ${city}.`
                : `Rencana usaha "${businessName || "Usaha Anda"}" telah otomatis dipetakan ke Mantri pembina BRI di wilayah ${city}.`}
            </p>
          </div>

          {/* Assigned Mantri Officer Card */}
          <div className="p-5 rounded-2xl bg-white border-2 border-brand-primary/20 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-brand-primary flex items-center justify-center font-bold text-lg border border-blue-100 shrink-0">
                  <UserCheck className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-[10px] font-bold text-brand-secondary uppercase tracking-wider">
                    Mantri Pembina Wilayah Anda
                  </div>
                  <div className="text-base font-bold text-slate-900">
                    {submittedLead?.assignedMantriName || "Petugas Mantri BRI"}
                  </div>
                  <div className="text-xs text-slate-500 font-medium">
                    {submittedLead?.assignedUnit || "BRI Unit Wilayah Terdekat"}{" "}
                    {submittedLead?.assignedBranch ? `? ${submittedLead.assignedBranch}` : ""}
                  </div>
                </div>
              </div>

              <Badge variant="blue" className="self-start sm:self-center shrink-0 text-[10px]">
                Siap Konsultasi
              </Badge>
            </div>

            {/* WhatsApp CTA Action */}
            <div className="space-y-2">
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 w-full py-3.5 px-4 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 shadow-md shadow-emerald-600/20 transition-all text-sm group"
              >
                <MessageSquare className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span>Hubungi Mantri via WhatsApp Langsung</span>
                <ArrowRight className="w-4 h-4" />
              </a>
              <p className="text-[11px] text-center text-slate-500">
                Pesan WhatsApp otomatis sudah disiapkan berisi ID pengajuan, estimasi modal sendiri, dan kebutuhan pembiayaan Anda.
              </p>
            </div>
          </div>

          {/* Financial & Location Summary Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs text-left">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-slate-500 text-[11px] flex items-center gap-1">
                <Coins className="w-3.5 h-3.5 text-brand-primary" />
                <span>Modal Sendiri</span>
              </div>
              <div className="font-bold text-slate-900 mt-1 text-xs sm:text-sm">
                {formatRupiah(submittedLead?.availableCapital)}
              </div>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-slate-500 text-[11px] flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-brand-secondary" />
                <span>Kebutuhan KUR</span>
              </div>
              <div className="font-bold text-amber-700 mt-1 text-xs sm:text-sm">
                {formatRupiah(submittedLead?.capitalDeficit)}
              </div>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-slate-500 text-[11px] flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                <span>Estimasi Laba/Bln</span>
              </div>
              <div className="font-bold text-emerald-700 mt-1 text-xs sm:text-sm">
                {formatRupiah(submittedLead?.financialMetrics?.monthlyNetProfit)}
              </div>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-slate-500 text-[11px] flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-rose-500" />
                <span>Wilayah Usaha</span>
              </div>
              <div className="font-bold text-slate-900 mt-1 text-xs sm:text-sm truncate">
                {submittedLead?.specificLocation || specificLocation || city}
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200/80 text-xs text-slate-700 text-left space-y-1.5">
            <div className="font-bold text-brand-primary flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-brand-secondary" />
              <span>Jadwal Kontak Pilihan: <strong>{preferredContactTime}</strong></span>
            </div>
            <p className="text-[11px] leading-relaxed text-slate-600">
              Jika Anda tidak sempat menghubungi terlebih dahulu, Mantri pembina akan menghubungi Anda pada waktu yang telah dipilih melalui WhatsApp di nomor:{" "}
              <strong className="text-slate-900 font-mono">{phoneNumber}</strong>.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row justify-center gap-3">
            <Link href="/roadmap" className="w-full sm:w-auto">
              <Button size="md" variant="primary" fullWidth rightIcon={<ArrowRight className="w-4 h-4" />}>
                {t.mantri.backRoadmap}
              </Button>
            </Link>
            <Button
              size="md"
              variant="secondary"
              className="w-full sm:w-auto"
              onClick={() => {
                setIsSubmitted(false);
                setSubmittedLead(null);
              }}
            >
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
              Kirimkan ringkasan rencana usaha Anda untuk diverifikasi dan didampingi langsung oleh Mantri BRI pemegang wilayah.
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
                  Kota / Kabupaten
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
                <label htmlFor="specificLocation" className="text-xs sm:text-sm font-semibold text-slate-700">
                  Kecamatan / Kelurahan Rencana Usaha
                </label>
                <input
                  type="text"
                  id="specificLocation"
                  value={specificLocation}
                  onChange={(e) => setSpecificLocation(e.target.value)}
                  placeholder="Contoh: Lowokwaru / Dinoyo"
                  className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-accent/50 focus:border-brand-primary min-h-[44px]"
                />
                <p className="text-[11px] text-slate-500">
                  Digunakan untuk auto-mapping ke Mantri pemegang wilayah terdekat.
                </p>
              </div>
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
                  Saya setuju data rencana usaha ini diteruskan ke database Cloud Firestore untuk dipetakan ke Mantri BRI pemegang wilayah dan pendampingan permodalan usaha mikro.
                </span>
              </label>
            </div>

            <Button
              type="submit"
              variant="accent"
              size="lg"
              fullWidth
              disabled={isSubmitting}
              isLoading={isSubmitting}
              rightIcon={<Send className="w-4 h-4" />}
            >
              {isSubmitting
                ? (language === "en" ? "Connecting to Mantri..." : "Menghubungkan ke Mantri...")
                : "Kirim Rencana Usaha & Hubungkan ke Mantri"}
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
