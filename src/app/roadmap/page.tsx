"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Circle,
  ArrowRight,
  BookOpen,
  RotateCcw,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { SimulationBadge } from "@/components/ui/SimulationBadge";
import { MOCK_OPPORTUNITIES } from "@/data/opportunities";
import {
  getSelectedOpportunity,
  saveRoadmapStepStatus,
  getAllRoadmapProgress,
} from "@/services/storageService";
import { BusinessOpportunity, RoadmapStep } from "@/types/business";

const DEFAULT_ROADMAP_STEPS: RoadmapStep[] = [
  // Fase 1: Riset & Legalitas Dasar
  {
    id: "step-1-1",
    phase: 1,
    phaseTitle: "Fase 1: Riset Pasar & Legalitas Usaha",
    title: "Survei Titik Lokasi & Warga Sekitar",
    description: "Amati kepadatan pejalan kaki dan kendaraan di jam sibuk pagi, siang, dan sore hari di calon lokasi usaha Anda.",
  },
  {
    id: "step-1-2",
    phase: 1,
    phaseTitle: "Fase 1: Riset Pasar & Legalitas Usaha",
    title: "Buat NIB (Nomor Induk Berusaha) Perseorangan",
    description: "Daftar NIB gratis dan resmi secara online di portal oss.go.id agar usaha Anda diakui secara hukum.",
  },
  {
    id: "step-1-3",
    phase: 1,
    phaseTitle: "Fase 1: Riset Pasar & Legalitas Usaha",
    title: "Buka Rekening Khusus Usaha",
    description: "Pisahkan uang pribadi/rumah tangga dari uang kas usaha sejak hari pertama untuk mencegah kebocoran modal.",
  },

  // Fase 2: Pengadaan Modal & Peralatan
  {
    id: "step-2-1",
    phase: 2,
    phaseTitle: "Fase 2: Pengadaan Alat & Bahan Baku",
    title: "Susun Daftar Belanja Alat Prioritas",
    description: "Beli hanya peralatan esensial yang langsung menghasilkan produk. Pertimbangkan alat bekas layak pakai untuk menghemat modal awal.",
  },
  {
    id: "step-2-2",
    phase: 2,
    phaseTitle: "Fase 2: Pengadaan Alat & Bahan Baku",
    title: "Uji Coba Resep / Kualitas Layanan ke 10 Orang Pertama",
    description: "Minta masukan jujur dari teman dan tetangga mengenai rasa, porsi, dan kemasan sebelum resmi diluncurkan.",
  },

  // Fase 3: Promosi & Peluncuran Resmi
  {
    id: "step-3-1",
    phase: 3,
    phaseTitle: "Fase 3: Peluncuran & Pemasaran Awal",
    title: "Pasang QRIS Pembayaran Digital",
    description: "Sediakan metode pembayaran non-tunai agar konsumen tidak batal beli saat tidak membawa uang pas.",
  },
  {
    id: "step-3-2",
    phase: 3,
    phaseTitle: "Fase 3: Peluncuran & Pemasaran Awal",
    title: "Luncurkan Promo Pembukaan (Grand Opening)",
    description: "Berikan promo menarik selama 3 hari pertama (misal: Beli 2 Gratis 1 atau diskon pengenalan) untuk memancing antrean.",
  },

  // Fase 4: Evaluasi 30 Hari Pertama
  {
    id: "step-4-1",
    phase: 4,
    phaseTitle: "Fase 4: Evaluasi 30 Hari Pertama",
    title: "Bandingkan Penjualan Riil dengan Titik Impas (BEP)",
    description: "Cek apakah rata-rata unit harian sudah melampaui angka BEP kalkulator. Jika belum, tinjau kembali strategi promosi dan lokasi.",
  },
  {
    id: "step-4-2",
    phase: 4,
    phaseTitle: "Fase 4: Evaluasi 30 Hari Pertama",
    title: "Konsultasikan Kebutuhan Pengembangan Usaha",
    description: "Jika usaha berjalan stabil dan ingin menambah stok atau cabang, pelajari opsi bimbingan literasi keuangan di unit kerja Mantri BRI setempat.",
  },
];

export default function RoadmapPage() {
  const [opportunity, setOpportunity] = useState<BusinessOpportunity>(MOCK_OPPORTUNITIES[0]);
  const [checklist, setChecklist] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const selected = getSelectedOpportunity();
    if (selected) {
      setOpportunity(selected);
    }
    const saved = getAllRoadmapProgress();
    setChecklist(saved);
  }, []);

  const steps = DEFAULT_ROADMAP_STEPS;

  const toggleStep = (stepId: string) => {
    const nextStatus = !checklist[stepId];
    const updated = { ...checklist, [stepId]: nextStatus };
    setChecklist(updated);
    saveRoadmapStepStatus(stepId, nextStatus);
  };

  const handleResetChecklist = () => {
    steps.forEach((s) => saveRoadmapStepStatus(s.id, false));
    setChecklist({});
  };

  const completedCount = steps.filter((s) => checklist[s.id]).length;
  const progressPercentage = Math.round((completedCount / steps.length) * 100);

  // Group steps by phase
  const phases = [1, 2, 3, 4];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2">
            <Badge variant="blue">Peta Jalan Eksekusi</Badge>
            <SimulationBadge />
          </div>

          <div className="flex items-center gap-2">
            <Link href="/analisis">
              <Button size="sm" variant="secondary">
                Lihat Kalkulator Finansial
              </Button>
            </Link>
          </div>
        </div>

        <div className="space-y-1.5">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Roadmap Langkah Memulai: {opportunity.title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Panduan langkah demi langkah dari persiapan izin dasar, pembelian peralatan, peluncuran, hingga evaluasi 30 hari pertama. Centang setiap tugas yang telah selesai!
          </p>
        </div>

        {/* Progress Tracker Card */}
        <Card className="p-5 sm:p-6 bg-gradient-to-r from-blue-50/80 via-white to-emerald-50/60 border-slate-200">
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="font-bold text-slate-900 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Progres Kesiapan Usaha Anda:
              </span>
              <span className="font-bold text-bri-blue">
                {completedCount} dari {steps.length} Selesai ({progressPercentage}%)
              </span>
            </div>

            <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden">
              <div
                className="bg-emerald-500 h-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>

            <div className="flex justify-between items-center text-[11px] text-slate-500 pt-1">
              <span>Progres tersimpan secara otomatis di browser Anda.</span>
              <button
                onClick={handleResetChecklist}
                className="hover:text-slate-800 flex items-center gap-1 font-medium"
              >
                <RotateCcw className="w-3 h-3" />
                Reset Centang
              </button>
            </div>
          </div>
        </Card>
      </div>

      {/* Daftar Tugas Berdasarkan Fase */}
      <div className="space-y-8">
        {phases.map((phaseNumber) => {
          const phaseSteps = steps.filter((s) => s.phase === phaseNumber);
          const phaseTitle = phaseSteps[0]?.phaseTitle || `Fase ${phaseNumber}`;

          return (
            <div key={phaseNumber} className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-bri-blue text-white font-bold text-xs flex items-center justify-center">
                  {phaseNumber}
                </span>
                <h2 className="text-base sm:text-lg font-bold text-slate-900">
                  {phaseTitle}
                </h2>
              </div>

              <div className="space-y-3 pl-2 sm:pl-3 border-l-2 border-slate-200">
                {phaseSteps.map((step) => {
                  const isChecked = Boolean(checklist[step.id]);

                  return (
                    <div
                      key={step.id}
                      onClick={() => toggleStep(step.id)}
                      className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 select-none ${
                        isChecked
                          ? "bg-emerald-50/50 border-emerald-200 text-slate-800"
                          : "bg-white border-slate-200/90 hover:border-slate-300 text-slate-900"
                      }`}
                    >
                      <button
                        type="button"
                        aria-label={`Centang ${step.title}`}
                        className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-colors ${
                          isChecked
                            ? "bg-emerald-600 border-emerald-600 text-white"
                            : "border-slate-300 bg-white"
                        }`}
                      >
                        {isChecked ? (
                          <CheckCircle2 className="w-4 h-4 text-white" />
                        ) : (
                          <Circle className="w-3 h-3 text-transparent" />
                        )}
                      </button>

                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between gap-2">
                          <h3
                            className={`text-sm font-bold ${
                              isChecked ? "line-through text-slate-500" : "text-slate-900"
                            }`}
                          >
                            {step.title}
                          </h3>
                          {isChecked && (
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                              Selesai
                            </span>
                          )}
                        </div>
                        <p
                          className={`text-xs leading-relaxed ${
                            isChecked ? "text-slate-400" : "text-slate-600"
                          }`}
                        >
                          {step.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bantuan & Navigasi ke Mantri */}
      <Card className="p-6 bg-blue-50/60 border-blue-200 text-slate-800 space-y-4">
        <div className="flex items-start gap-3">
          <BookOpen className="w-5 h-5 text-bri-blue shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h3 className="font-bold text-sm text-slate-900">
              Butuh Pendampingan Lebih Lanjut di Lapangan?
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Pelajari bagaimana Mantri BRI di unit kerja terdekat dapat memberikan konsultasi literasi keuangan dan pengelolaan transaksi fisik untuk mendukung kemajuan usaha Anda.
            </p>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <Link href="/mantri">
            <Button size="sm" variant="orange" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Pelajari Konsultasi Mantri BRI
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}