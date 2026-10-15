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
  Info,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ErrorAlert } from "@/components/feedback/ErrorAlert";
import { getSelectedOpportunity, getUserProfile } from "@/services/storageService";
import { useLanguage } from "@/context/LanguageContext";

export default function MantriPage() {
  const [fullName, setFullName] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [businessName, setBusinessName] = useState<string>("");
  const [hasAgreedConsent, setHasAgreedConsent] = useState<boolean>(false);

  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
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
    setErrorMessage("");

    if (!fullName.trim()) {
      setErrorMessage(
        language === "en" ? "Please enter your full name." : "Silakan masukkan nama lengkap Anda."
      );
      return;
    }

    if (!phoneNumber.trim() || phoneNumber.length < 9) {
      setErrorMessage(
        language === "en"
          ? "Please enter an active WhatsApp / phone number."
          : "Silakan masukkan nomor telepon / WhatsApp yang aktif."
      );
      return;
    }

    if (!hasAgreedConsent) {
      setErrorMessage(
        language === "en"
          ? "You must consciously agree to the transparency disclaimer before proceeding."
          : "Anda wajib menyetujui pernyataan transparansi dan persetujuan konsultasi sebelum mengirim data."
      );
      return;
    }

    setIsSubmitted(true);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2">
          <Badge variant="blue">{t.mantri.badge}</Badge>
          <span className="text-xs text-slate-500 font-medium">{t.mantri.fieldService}</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {t.mantri.title}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          {t.mantri.subtitle}
        </p>
      </div>

      {/* Box Penegasan Kepatuhan & Transparansi dengan Palet Baru */}
      <div className="rounded-2xl bg-sky-50/90 border border-brand-accent/50 p-5 space-y-2 text-slate-800 text-xs sm:text-sm leading-relaxed shadow-sm">
        <div className="flex items-center gap-2 font-bold text-brand-primary">
          <ShieldAlert className="w-5 h-5 text-brand-secondary shrink-0" />
          <span>{t.mantri.warningTitle}</span>
        </div>
        <ul className="list-disc pl-5 space-y-1 text-xs text-slate-700">
          <li>{t.mantri.warning1}</li>
          <li>{t.mantri.warning2}</li>
          <li>{t.mantri.warning3}</li>
        </ul>
      </div>

      {/* Penjelasan Peran Mantri BRI */}
      <Card className="p-6 sm:p-8 space-y-6 bg-white border-slate-200">
        <h2 className="text-base sm:text-lg font-bold text-slate-900">
          {t.mantri.whatToConsult}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-brand-light/70 border border-brand-accent/30 space-y-2 text-xs">
            <div className="w-8 h-8 rounded-lg bg-white border border-brand-accent/40 text-brand-primary flex items-center justify-center shadow-sm">
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
        <Card className="p-8 text-center space-y-5 bg-gradient-to-b from-brand-light to-white border-brand-accent/40 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-sm">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-slate-900">
              {t.mantri.successTitle}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
              {language === "en" ? "Thank you, " : "Terima kasih, "}
              <strong>{fullName}</strong>.{" "}
              {language === "en"
                ? `Your business plan for ${businessName || "Your Business"} in ${city} has been simulated.`
                : `Data rencana usaha Anda untuk ${businessName || "Usaha Anda"} di wilayah ${city} telah tersimpan dalam simulasi.`}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200 max-w-md mx-auto text-xs text-slate-600 text-left space-y-1.5 shadow-sm">
            <div className="font-bold text-brand-primary flex items-center gap-1.5">
              <Info className="w-4 h-4 text-brand-secondary" />
              {t.mantri.nextStepTitle}
            </div>
            <p>{t.mantri.nextStepDesc}</p>
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
              {t.mantri.formTitle}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              {t.mantri.formSubtitle}
            </p>
          </div>

          {errorMessage && <ErrorAlert message={errorMessage} />}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="fullName" className="text-xs sm:text-sm font-semibold text-slate-700">
                {t.mantri.nameLabel}
              </label>
              <input
                type="text"
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Contoh: Budi Santoso"
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-accent/50 focus:border-brand-primary min-h-[44px]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="phoneNumber" className="text-xs sm:text-sm font-semibold text-slate-700">
                  {t.mantri.phoneLabel}
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
                <label htmlFor="city" className="text-xs sm:text-sm font-semibold text-slate-700">
                  {t.mantri.cityLabel}
                </label>
                <input
                  type="text"
                  id="city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Contoh: Bandung"
                  className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-accent/50 focus:border-brand-primary min-h-[44px]"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="businessName" className="text-xs sm:text-sm font-semibold text-slate-700">
                {t.mantri.businessLabel}
              </label>
              <input
                type="text"
                id="businessName"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="Contoh: Booth Camilan Tahu Crispy"
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
                  {t.mantri.consentText}
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
              {t.mantri.submitBtn}
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