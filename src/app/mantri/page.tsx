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

export default function MantriPage() {
  const [fullName, setFullName] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [businessName, setBusinessName] = useState<string>("");
  const [hasAgreedConsent, setHasAgreedConsent] = useState<boolean>(false);

  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

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
      setErrorMessage("Silakan masukkan nama lengkap Anda.");
      return;
    }

    if (!phoneNumber.trim() || phoneNumber.length < 9) {
      setErrorMessage("Silakan masukkan nomor telepon / WhatsApp yang aktif.");
      return;
    }

    if (!hasAgreedConsent) {
      setErrorMessage(
        "Anda wajib menyetujui pernyataan transparansi dan persetujuan konsultasi sebelum mengirim data."
      );
      return;
    }

    // Simulasi pengiriman data minat konsultasi yang aman
    setIsSubmitted(true);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2">
          <Badge variant="blue">Edukasi & Pendampingan</Badge>
          <span className="text-xs text-slate-500 font-medium">Layanan Lapangan Unit Kerja</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Konsultasi & Literasi Bersama Mantri BRI
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Pahami bagaimana pendampingan tatap muka dengan Mantri di unit kerja BRI terdekat dapat membantu literasi keuangan, transaksi digital, dan tata kelola usaha Anda.
        </p>
      </div>

      {/* Box Penegasan Kepatuhan & Transparansi */}
      <div className="rounded-2xl bg-amber-50 border border-amber-300 p-5 space-y-2 text-amber-950 text-xs sm:text-sm leading-relaxed">
        <div className="flex items-center gap-2 font-bold text-amber-900">
          <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0" />
          <span>Pernyataan Penting Mengenai Layanan Ini:</span>
        </div>
        <ul className="list-disc pl-5 space-y-1 text-xs text-amber-900">
          <li>
            <strong>Bukan Persetujuan Pinjaman:</strong> Formulir ini murni sebagai pengantar minat konsultasi edukatif, bukan permohonan pinjaman online, dan tidak menjamin kelulusan kredit apa pun.
          </li>
          <li>
            <strong>Bukan Sistem Resmi BRI:</strong> Usaha Qita adalah purwarupa konsep edukasi perencanaan usaha. Konsultasi fisik dilakukan secara langsung di kantor unit kerja BRI resmi terdekat.
          </li>
          <li>
            <strong>Persetujuan Sukarela:</strong> Data kontak Anda hanya digunakan untuk penjadwalan konsultasi dan tidak akan diperjualbelikan kepada pihak ketiga.
          </li>
        </ul>
      </div>

      {/* Penjelasan Peran Mantri BRI */}
      <Card className="p-6 sm:p-8 space-y-6 bg-white border-slate-200">
        <h2 className="text-base sm:text-lg font-bold text-slate-900">
          Apa Saja yang Dapat Dikonsultasikan dengan Mantri BRI?
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-bri-blue flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Pembukaan Rekening</h3>
            <p className="text-slate-600 leading-relaxed">
              Panduan memisahkan rekening tabungan pribadi dengan rekening kas transaksi operasional harian.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Merchant QRIS BRI</h3>
            <p className="text-slate-600 leading-relaxed">
              Kemudahan menerima pembayaran non-tunai dari berbagai aplikasi dompet digital di toko Anda.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Literasi Dokumen</h3>
            <p className="text-slate-600 leading-relaxed">
              Edukasi syarat legalitas dasar seperti NIB dan pencatatan arus kas yang sehat bagi UMKM.
            </p>
          </div>
        </div>
      </Card>

      {/* Formulir Minat Konsultasi atau Layar Konfirmasi */}
      {isSubmitted ? (
        <Card className="p-8 text-center space-y-5 bg-gradient-to-b from-emerald-50/70 to-white border-emerald-200">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-slate-900">
              Minat Konsultasi Berhasil Dicatat!
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
              Terima kasih, <strong>{fullName}</strong>. Data rencana usaha Anda untuk{" "}
              <strong>{businessName || "Usaha Anda"}</strong> di wilayah <strong>{city}</strong> telah tersimpan dalam simulasi.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200 max-w-md mx-auto text-xs text-slate-600 text-left space-y-1.5">
            <div className="font-bold text-slate-800 flex items-center gap-1.5">
              <Info className="w-4 h-4 text-bri-blue" />
              Langkah Selanjutnya:
            </div>
            <p>
              Untuk konsultasi langsung, Anda dapat mengunjungi kantor Unit Kerja BRI terdekat di domisili Anda dengan membawa KTP dan berkas rencana usaha yang telah Anda buat di aplikasi ini.
            </p>
          </div>

          <div className="pt-2 flex justify-center gap-3">
            <Link href="/roadmap">
              <Button size="sm" variant="primary">
                Kembali ke Roadmap Usaha
              </Button>
            </Link>
            <Button size="sm" variant="secondary" onClick={() => setIsSubmitted(false)}>
              Kirim Minat Lain
            </Button>
          </div>
        </Card>
      ) : (
        <Card className="p-6 sm:p-8 space-y-6 bg-white border-slate-200">
          <div className="space-y-1">
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              Formulir Minat Jadwal Konsultasi Tatap Muka
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Lengkapi data di bawah untuk merencanakan diskusi literasi usaha Anda.
            </p>
          </div>

          {errorMessage && <ErrorAlert message={errorMessage} />}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="fullName" className="text-xs sm:text-sm font-semibold text-slate-700">
                Nama Lengkap Anda
              </label>
              <input
                type="text"
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Contoh: Budi Santoso"
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-bri-blue min-h-[44px]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="phoneNumber" className="text-xs sm:text-sm font-semibold text-slate-700">
                  Nomor WhatsApp / Telepon
                </label>
                <input
                  type="tel"
                  id="phoneNumber"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="Contoh: 081234567890"
                  className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-bri-blue min-h-[44px]"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="city" className="text-xs sm:text-sm font-semibold text-slate-700">
                  Kota / Kabupaten Lokasi Usaha
                </label>
                <input
                  type="text"
                  id="city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Contoh: Bandung"
                  className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-bri-blue min-h-[44px]"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="businessName" className="text-xs sm:text-sm font-semibold text-slate-700">
                Rencana Usaha yang Hendak Dikonsultasikan
              </label>
              <input
                type="text"
                id="businessName"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="Contoh: Booth Camilan Tahu Crispy"
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-bri-blue min-h-[44px]"
              />
            </div>

            {/* Checkbox Persetujuan Eksplisit (Consent) */}
            <div className="pt-2">
              <label className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 border border-slate-300/80 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={hasAgreedConsent}
                  onChange={(e) => setHasAgreedConsent(e.target.checked)}
                  className="w-4 h-4 mt-0.5 rounded text-bri-blue focus:ring-blue-200 cursor-pointer shrink-0"
                />
                <span className="text-xs text-slate-700 leading-relaxed">
                  <strong>Saya menyetujui secara sadar:</strong> Bahwa formulir ini adalah pengantar literasi konsultasi ke unit kerja fisik dan bukan merupakan pengajuan pinjaman online, tidak ada data rahasia perbankan yang diakses, serta tidak menjamin persetujuan kredit perbankan dalam bentuk apa pun.
                </span>
              </label>
            </div>

            <Button
              type="submit"
              variant="orange"
              size="lg"
              fullWidth
              rightIcon={<Send className="w-4 h-4" />}
            >
              Kirim Formulir Minat Konsultasi
            </Button>
          </form>
        </Card>
      )}

      {/* Navigasi Balik */}
      <div className="flex justify-between items-center text-xs">
        <Link href="/analisis" className="text-bri-blue font-semibold hover:underline flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Kalkulator Finansial
        </Link>
      </div>
    </div>
  );
}