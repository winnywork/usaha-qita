"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  ArrowLeft,
  Check,
  Utensils,
  Wrench,
  Store,
  Sprout,
  Palette,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { CurrencyInput } from "@/components/ui/CurrencyInput";
import { Badge } from "@/components/ui/Badge";
import { ErrorAlert } from "@/components/feedback/ErrorAlert";
import {
  UserProfile,
  BusinessCategory,
  TargetGoal,
  ExperienceLevel,
  TimeCommitment,
  CATEGORY_LABELS,
} from "@/types/user";
import { getUserProfile, saveUserProfile } from "@/services/storageService";
import { formatRupiah } from "@/core/finance/calculator";

const CATEGORY_ICONS: Record<BusinessCategory, React.ReactNode> = {
  kuliner: <Utensils className="w-5 h-5 text-amber-600" />,
  jasa: <Wrench className="w-5 h-5 text-blue-600" />,
  ritel: <Store className="w-5 h-5 text-emerald-600" />,
  agribisnis: <Sprout className="w-5 h-5 text-green-600" />,
  kreatif: <Palette className="w-5 h-5 text-purple-600" />,
};

export default function OnboardingPage() {
  const router = useRouter();

  // Form State
  const [targetGoal, setTargetGoal] = useState<TargetGoal>("mulai_baru");
  const [cityLocation, setCityLocation] = useState<string>("Jakarta");
  const [categoryInterest, setCategoryInterest] = useState<BusinessCategory[]>(["kuliner"]);
  const [availableCapital, setAvailableCapital] = useState<number>(5000000); // 5 Juta bawaan
  const [experience, setExperience] = useState<ExperienceLevel>("pemula");
  const [timeCommitment, setTimeCommitment] = useState<TimeCommitment>("penuh_waktu");

  // Step wizard: 1 (Tujuan & Lokasi), 2 (Bidang Usaha), 3 (Modal & Pengalaman)
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [errorMessage, setErrorMessage] = useState<string>("");

  // Load existing profile if any
  useEffect(() => {
    const existing = getUserProfile();
    if (existing) {
      if (existing.targetGoal) setTargetGoal(existing.targetGoal);
      if (existing.cityLocation) setCityLocation(existing.cityLocation);
      if (existing.categoryInterest && existing.categoryInterest.length > 0)
        setCategoryInterest(existing.categoryInterest);
      if (existing.availableCapital) setAvailableCapital(existing.availableCapital);
      if (existing.experience) setExperience(existing.experience);
      if (existing.timeCommitment) setTimeCommitment(existing.timeCommitment);
    }
  }, []);

  const toggleCategory = (cat: BusinessCategory) => {
    setErrorMessage("");
    if (categoryInterest.includes(cat)) {
      if (categoryInterest.length === 1) {
        setErrorMessage("Pilih minimal 1 kategori bidang usaha yang Anda minati.");
        return;
      }
      setCategoryInterest(categoryInterest.filter((c) => c !== cat));
    } else {
      setCategoryInterest([...categoryInterest, cat]);
    }
  };

  const handleNext = () => {
    setErrorMessage("");

    if (currentStep === 1) {
      if (!cityLocation.trim()) {
        setErrorMessage("Silakan isi nama kota atau domisili rencana lokasi usaha Anda.");
        return;
      }
      setCurrentStep(2);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (currentStep === 2) {
      if (categoryInterest.length === 0) {
        setErrorMessage("Pilih minimal satu kategori minat usaha.");
        return;
      }
      setCurrentStep(3);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (currentStep === 3) {
      if (availableCapital < 1000000) {
        setErrorMessage("Anggaran modal awal minimal adalah Rp 1.000.000 untuk simulasi usaha.");
        return;
      }

      // Simpan profil ke localStorage
      const profile: UserProfile = {
        targetGoal,
        cityLocation: cityLocation.trim(),
        categoryInterest,
        availableCapital,
        experience,
        timeCommitment,
      };

      saveUserProfile(profile);

      // Navigasi ke katalog rekomendasi peluang
      router.push("/rekomendasi");
    }
  };

  const handlePrev = () => {
    setErrorMessage("");
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 sm:space-y-8">
      {/* Header Wizard */}
      <div className="space-y-3 text-center sm:text-left">
        <div className="inline-flex items-center gap-2">
          <Badge variant="blue">Langkah {currentStep} dari 3</Badge>
          <span className="text-xs text-slate-500">Perencanaan Personal</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Formulir Profil & Rencana Usaha
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Informasi ini digunakan untuk menyaring dan mencocokkan peluang usaha yang paling realistis sesuai kondisi modal Anda.
        </p>

        {/* Progress Bar */}
        <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
          <div
            className="bg-bri-blue h-full transition-all duration-300"
            style={{ width: `${(currentStep / 3) * 100}%` }}
          />
        </div>
      </div>

      {errorMessage && (
        <ErrorAlert message={errorMessage} />
      )}

      {/* STEP 1: Tujuan & Lokasi */}
      {currentStep === 1 && (
        <Card className="p-6 sm:p-8 space-y-6">
          <div className="space-y-2">
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              1. Apa Tujuan Utama & Lokasi Usaha Anda?
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Tentukan apakah Anda ingin merintis usaha pertama kali atau membuka cabang baru.
            </p>
          </div>

          {/* Pilihan Tujuan */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setTargetGoal("mulai_baru")}
              className={`p-4 rounded-2xl border text-left flex flex-col gap-2 transition-all min-h-[90px] ${
                targetGoal === "mulai_baru"
                  ? "border-bri-blue bg-blue-50/70 ring-2 ring-bri-blue/20"
                  : "border-slate-200 bg-white hover:border-slate-300"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-slate-900">Merintis Usaha Baru</span>
                {targetGoal === "mulai_baru" && <Check className="w-4 h-4 text-bri-blue" />}
              </div>
              <span className="text-xs text-slate-600 leading-relaxed">
                Pertama kali memulai wirausaha dari nol dengan risiko terukur.
              </span>
            </button>

            <button
              type="button"
              onClick={() => setTargetGoal("ekspansi_usaha")}
              className={`p-4 rounded-2xl border text-left flex flex-col gap-2 transition-all min-h-[90px] ${
                targetGoal === "ekspansi_usaha"
                  ? "border-bri-blue bg-blue-50/70 ring-2 ring-bri-blue/20"
                  : "border-slate-200 bg-white hover:border-slate-300"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-slate-900">Ekspansi / Tambah Cabang</span>
                {targetGoal === "ekspansi_usaha" && <Check className="w-4 h-4 text-bri-blue" />}
              </div>
              <span className="text-xs text-slate-600 leading-relaxed">
                Sudah memiliki usaha dan ingin menambah lini produk atau cabang baru.
              </span>
            </button>
          </div>

          {/* Input Lokasi */}
          <div className="space-y-2">
            <label htmlFor="cityLocation" className="text-xs sm:text-sm font-semibold text-slate-700">
              Kota / Kabupaten Domisili Usaha
            </label>
            <input
              type="text"
              id="cityLocation"
              value={cityLocation}
              onChange={(e) => setCityLocation(e.target.value)}
              placeholder="Contoh: Bandung, Surabaya, Medan, Solo"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-bri-blue min-h-[44px]"
            />
            <p className="text-[11px] text-slate-500">
              Lokasi membantu menentukan perkiraan biaya sewa tempat dan kebiasaan konsumen setempat.
            </p>
          </div>
        </Card>
      )}

      {/* STEP 2: Bidang Usaha yang Diminati */}
      {currentStep === 2 && (
        <Card className="p-6 sm:p-8 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                2. Bidang Usaha yang Anda Minati
              </h2>
              <span className="text-xs text-slate-500 font-medium">Bisa pilih lebih dari satu</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500">
              Pilih bidang yang sesuai dengan keahlian atau kegemaran Anda sehari-hari.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {(Object.keys(CATEGORY_LABELS) as BusinessCategory[]).map((cat) => {
              const isSelected = categoryInterest.includes(cat);
              const info = CATEGORY_LABELS[cat];

              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => toggleCategory(cat)}
                  className={`p-4 rounded-2xl border text-left flex items-start gap-4 transition-all min-h-[64px] ${
                    isSelected
                      ? "border-bri-blue bg-blue-50/70 ring-2 ring-bri-blue/20"
                      : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                >
                  <div className="p-2 rounded-xl bg-white border border-slate-200 shrink-0">
                    {CATEGORY_ICONS[cat]}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-slate-900">{info.title}</span>
                      <div
                        className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                          isSelected
                            ? "bg-bri-blue border-bri-blue text-white"
                            : "border-slate-300 bg-white"
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5" />}
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                      {info.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </Card>
      )}

      {/* STEP 3: Modal & Kesiapan Pengalaman */}
      {currentStep === 3 && (
        <Card className="p-6 sm:p-8 space-y-6">
          <div className="space-y-2">
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              3. Berapa Modal yang Anda Miliki Saat Ini?
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Masukkan tabungan atau dana mandiri yang siap dialokasikan tanpa mengganggu dana darurat keluarga.
            </p>
          </div>

          {/* Currency Input Modal */}
          <CurrencyInput
            label="Kesiapan Anggaran Modal Awal"
            value={availableCapital}
            onChange={(val) => setAvailableCapital(val)}
            helperText="Paling sedikit Rp 1.000.000 untuk memulai simulasi peluang usaha."
          />

          {/* Quick presets for convenience */}
          <div className="space-y-1.5">
            <span className="text-xs font-semibold text-slate-600">Pilihan Cepat:</span>
            <div className="flex flex-wrap gap-2">
              {[3000000, 5000000, 10000000, 20000000, 35000000].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setAvailableCapital(preset)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors ${
                    availableCapital === preset
                      ? "bg-bri-blue text-white border-bri-blue"
                      : "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200"
                  }`}
                >
                  {formatRupiah(preset)}
                </button>
              ))}
            </div>
          </div>

          {/* Tingkat Pengalaman Usaha */}
          <div className="space-y-2 pt-2">
            <label className="text-xs sm:text-sm font-semibold text-slate-700">
              Tingkat Pengalaman Berbisnis
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: "pemula", title: "Pemula Total", desc: "Belum pernah jualan sebelumnya" },
                { id: "pernah_usaha", title: "Pernah Berjualan", desc: "Pernah jualan kecil-kecilan / reseller" },
                { id: "berpengalaman", title: "Berpengalaman", desc: "Sudah paham cara kelola stok & kas" },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setExperience(item.id as ExperienceLevel)}
                  className={`p-3.5 rounded-xl border text-left flex flex-col gap-1 transition-all ${
                    experience === item.id
                      ? "border-bri-blue bg-blue-50/70 ring-2 ring-bri-blue/20"
                      : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                >
                  <span className="font-bold text-xs sm:text-sm text-slate-900">{item.title}</span>
                  <span className="text-[11px] text-slate-500 leading-tight">{item.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Komitmen Waktu */}
          <div className="space-y-2 pt-2">
            <label className="text-xs sm:text-sm font-semibold text-slate-700">
              Alokasi Waktu Menjalankan Usaha
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { id: "penuh_waktu", title: "Penuh Waktu (Full Time)", desc: "Fokus harian penuh sebagai mata pencaharian utama" },
                { id: "sampingan", title: "Usaha Sampingan (Side Hustle)", desc: "Dijalankan sepulang kerja atau saat akhir pekan" },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setTimeCommitment(item.id as TimeCommitment)}
                  className={`p-3.5 rounded-xl border text-left flex flex-col gap-1 transition-all ${
                    timeCommitment === item.id
                      ? "border-bri-blue bg-blue-50/70 ring-2 ring-bri-blue/20"
                      : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                >
                  <span className="font-bold text-xs sm:text-sm text-slate-900">{item.title}</span>
                  <span className="text-[11px] text-slate-500 leading-tight">{item.desc}</span>
                </button>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between gap-3 pt-2">
        {currentStep > 1 ? (
          <Button
            type="button"
            variant="secondary"
            onClick={handlePrev}
            leftIcon={<ArrowLeft className="w-4 h-4" />}
          >
            Kembali
          </Button>
        ) : (
          <div />
        )}

        <Button
          type="button"
          variant="orange"
          size="lg"
          onClick={handleNext}
          rightIcon={<ArrowRight className="w-5 h-5" />}
        >
          {currentStep === 3 ? "Temukan Peluang Usaha Saya" : "Lanjutkan"}
        </Button>
      </div>
    </div>
  );
}