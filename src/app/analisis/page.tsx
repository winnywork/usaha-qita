"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Calculator,
  RotateCcw,
  Save,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { SimulationBadge } from "@/components/ui/SimulationBadge";
import { CurrencyInput } from "@/components/ui/CurrencyInput";
import { RangeSlider } from "@/components/ui/RangeSlider";
import { MetricCard } from "@/components/analisis/MetricCard";
import { ScenarioComparison } from "@/components/analisis/ScenarioComparison";
import { MOCK_OPPORTUNITIES } from "@/data/opportunities";
import {
  getSelectedOpportunity,
  saveCustomAssumptions,
  getCustomAssumptions,
} from "@/services/storageService";
import { BusinessOpportunity } from "@/types/business";
import { FinancialAssumptions } from "@/types/finance";
import { calculateFinancials, formatRupiah } from "@/core/finance/calculator";
import { useLanguage } from "@/context/LanguageContext";

export default function AnalisisPage() {
  const [opportunity, setOpportunity] = useState<BusinessOpportunity>(MOCK_OPPORTUNITIES[0]);
  const [assumptions, setAssumptions] = useState<FinancialAssumptions>(
    MOCK_OPPORTUNITIES[0].defaultAssumptions
  );
  const [saveNotification, setSaveNotification] = useState<string>("");
  const { t, language } = useLanguage();

  useEffect(() => {
    const selected = getSelectedOpportunity();
    if (selected) {
      setOpportunity(selected);
      const custom = getCustomAssumptions(selected.id);
      if (custom) {
        setAssumptions(custom);
      } else {
        setAssumptions(selected.defaultAssumptions);
      }
    }
  }, []);

  const result = useMemo(() => {
    return calculateFinancials(assumptions);
  }, [assumptions]);

  const handleReset = () => {
    setAssumptions(opportunity.defaultAssumptions);
    saveCustomAssumptions(opportunity.id, opportunity.defaultAssumptions);
    setSaveNotification(
      language === "en"
        ? "Assumptions have been reset to default values."
        : "Asumsi telah dikembalikan ke standar awal bawaan."
    );
    setTimeout(() => setSaveNotification(""), 3000);
  };

  const handleSave = () => {
    saveCustomAssumptions(opportunity.id, assumptions);
    setSaveNotification(
      language === "en"
        ? "Custom assumptions saved in your browser!"
        : "Asumsi kustom berhasil disimpan di browser Anda!"
    );
    setTimeout(() => setSaveNotification(""), 3000);
  };

  return (
    <div className="space-y-8">
      {/* 1. Header Informasi Usaha */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2">
            <Badge variant="blue" className="capitalize">
              {opportunity.category}
            </Badge>
            <SimulationBadge showExplanation />
          </div>

          <div className="flex items-center gap-2">
            <Link href="/rekomendasi">
              <Button size="sm" variant="secondary">
                {t.analisis.changeChoice}
              </Button>
            </Link>
          </div>
        </div>

        <div className="space-y-1.5">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {t.analisis.title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-3xl">
            {language === "en" ? "Interactive simulation for " : "Simulasi interaktif untuk "}
            <strong>{opportunity.title}</strong>.{" "}
            {t.analisis.subtitle}
          </p>
        </div>

        {saveNotification && (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{saveNotification}</span>
          </div>
        )}
      </div>

      {/* 2. Grid Utama */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Kolom Kiri: Form Parameter Asumsi */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="p-5 sm:p-6 space-y-6 bg-white border-slate-200 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Calculator className="w-4 h-4 text-brand-primary" />
                {t.analisis.inputTitle}
              </h2>
              <button
                onClick={handleReset}
                title={t.analisis.resetTitle}
                className="text-xs text-slate-500 hover:text-brand-primary flex items-center gap-1 font-semibold transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                {t.common.reset}
              </button>
            </div>

            {/* Bagian A */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                {t.analisis.sectionA}
              </h3>

              <CurrencyInput
                label={t.analisis.sellingPrice}
                value={assumptions.sellingPricePerUnit}
                onChange={(val) =>
                  setAssumptions({ ...assumptions, sellingPricePerUnit: Math.max(100, val) })
                }
              />

              <CurrencyInput
                label={t.analisis.costOfGoods}
                value={assumptions.costOfGoodsPerUnit}
                onChange={(val) =>
                  setAssumptions({ ...assumptions, costOfGoodsPerUnit: Math.max(0, val) })
                }
              />

              <div className="p-3 rounded-xl bg-brand-light/70 border border-brand-accent/30 text-xs flex justify-between items-center text-slate-700">
                <span className="font-medium">{t.analisis.grossMarginUnit}</span>
                <strong className={result.contributionMarginPerUnit > 0 ? "text-emerald-700 font-bold" : "text-red-600 font-bold"}>
                  {formatRupiah(result.contributionMarginPerUnit)}
                </strong>
              </div>
            </div>

            {/* Bagian B */}
            <div className="space-y-4 pt-2 border-t border-slate-100">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                {t.analisis.sectionB}
              </h3>

              <RangeSlider
                label={t.analisis.dailyVolume}
                value={assumptions.dailySalesVolume}
                min={5}
                max={250}
                step={5}
                formatValue={(val) => `${val} unit/${language === "en" ? "day" : "hari"}`}
                onChange={(val) => setAssumptions({ ...assumptions, dailySalesVolume: val })}
              />

              <RangeSlider
                label={t.analisis.operatingDays}
                value={assumptions.operatingDaysPerMonth}
                min={15}
                max={31}
                step={1}
                formatValue={(val) => `${val} ${language === "en" ? "days" : "hari"}`}
                onChange={(val) =>
                  setAssumptions({ ...assumptions, operatingDaysPerMonth: val })
                }
              />
            </div>

            {/* Bagian C */}
            <div className="space-y-4 pt-2 border-t border-slate-100">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                {t.analisis.sectionC}
              </h3>

              <CurrencyInput
                label={t.analisis.rent}
                value={assumptions.monthlyFixedCosts.rent}
                onChange={(val) =>
                  setAssumptions({
                    ...assumptions,
                    monthlyFixedCosts: { ...assumptions.monthlyFixedCosts, rent: val },
                  })
                }
              />

              <CurrencyInput
                label={t.analisis.salaries}
                value={assumptions.monthlyFixedCosts.salaries}
                onChange={(val) =>
                  setAssumptions({
                    ...assumptions,
                    monthlyFixedCosts: { ...assumptions.monthlyFixedCosts, salaries: val },
                  })
                }
                helperText={t.analisis.salariesHelper}
              />

              <CurrencyInput
                label={t.analisis.utilities}
                value={assumptions.monthlyFixedCosts.utilities}
                onChange={(val) =>
                  setAssumptions({
                    ...assumptions,
                    monthlyFixedCosts: { ...assumptions.monthlyFixedCosts, utilities: val },
                  })
                }
              />

              <CurrencyInput
                label={t.analisis.marketing}
                value={assumptions.monthlyFixedCosts.otherMarketing}
                onChange={(val) =>
                  setAssumptions({
                    ...assumptions,
                    monthlyFixedCosts: { ...assumptions.monthlyFixedCosts, otherMarketing: val },
                  })
                }
              />
            </div>

            {/* Bagian D */}
            <div className="space-y-4 pt-2 border-t border-slate-100">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                {t.analisis.sectionD}
              </h3>

              <CurrencyInput
                label={t.analisis.initialEquipment}
                value={assumptions.initialEquipmentCost}
                onChange={(val) =>
                  setAssumptions({ ...assumptions, initialEquipmentCost: val })
                }
              />
            </div>

            <Button
              fullWidth
              variant="primary"
              size="md"
              onClick={handleSave}
              leftIcon={<Save className="w-4 h-4" />}
            >
              {t.analisis.saveAssumptionsBtn}
            </Button>
          </Card>
        </div>

        {/* Kolom Kanan: Tampilan Hasil Metrik Finansial & BEP */}
        <div className="lg:col-span-7 space-y-6">
          {/* Status Keuntungan Utama */}
          <div
            className={`rounded-3xl p-6 sm:p-8 border shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all ${
              result.isProfitable
                ? "bg-gradient-to-br from-emerald-600 via-teal-700 to-slate-900 text-white border-emerald-600 shadow-emerald-950/15"
                : "bg-gradient-to-br from-red-600 via-rose-700 to-slate-900 text-white border-red-600 shadow-red-950/15"
            }`}
          >
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider opacity-90">
                {result.isProfitable ? t.analisis.netProfitTitle : t.analisis.netLossTitle}
              </span>
              <div className="text-3xl sm:text-4xl font-black">
                {formatRupiah(result.monthlyNetProfit)}
              </div>
              <p className="text-xs opacity-90">
                {result.isProfitable
                  ? `${t.analisis.netMarginText} ${result.netProfitMarginPercentage}%.`
                  : t.analisis.lossText}
              </p>
            </div>

            <div className="bg-white/15 backdrop-blur-md rounded-2xl p-4 border border-white/20 text-center shrink-0 w-full sm:w-auto">
              <span className="text-[11px] font-semibold opacity-90 block">
                {t.analisis.paybackLabel}
              </span>
              <span className="text-xl sm:text-2xl font-black">
                {result.isProfitable && result.estimatedPaybackMonths > 0
                  ? `${result.estimatedPaybackMonths} ${t.analisis.months}`
                  : t.analisis.unreached}
              </span>
            </div>
          </div>

          {/* Grid 4 Metrik Pokok */}
          <div className="grid grid-cols-2 gap-4">
            <MetricCard
              title={t.analisis.grossRevenue}
              value={formatRupiah(result.monthlyGrossRevenue)}
              subtitle={`${assumptions.dailySalesVolume} unit x ${assumptions.operatingDaysPerMonth} ${language === "en" ? "days" : "hari"}`}
            />

            <MetricCard
              title={t.analisis.totalCosts}
              value={formatRupiah(result.monthlyTotalCosts)}
              subtitle={`Tetap: ${formatRupiah(result.monthlyFixedCosts)}`}
            />

            <MetricCard
              title={t.analisis.bepUnit}
              value={
                Number.isFinite(result.bepUnitsPerDay)
                  ? `${result.bepUnitsPerDay} unit / ${language === "en" ? "day" : "hari"}`
                  : t.analisis.unreached
              }
              subtitle={
                Number.isFinite(result.bepUnitsPerMonth)
                  ? `Total ${result.bepUnitsPerMonth} unit/${language === "en" ? "month" : "bulan"}`
                  : "Margin minus"
              }
              variant={assumptions.dailySalesVolume >= result.bepUnitsPerDay ? "success" : "warning"}
            />

            <MetricCard
              title={t.analisis.bepRevenue}
              value={
                Number.isFinite(result.bepMonthlyRevenue)
                  ? formatRupiah(result.bepMonthlyRevenue)
                  : "Rugi"
              }
              subtitle="Nilai omzet impas minimal"
              variant="blue"
            />
          </div>

          {/* Komparasi 3 Skenario Pasar */}
          <Card className="p-5 sm:p-6 bg-white border-slate-200">
            <ScenarioComparison baseAssumptions={assumptions} />
          </Card>

          {/* Tautan Aksi Lanjutan */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
            <Link href="/roadmap" className="w-full sm:w-auto">
              <Button
                fullWidth
                variant="accent"
                size="md"
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                {t.analisis.proceedRoadmap}
              </Button>
            </Link>

            <Link href="/mantri" className="w-full sm:w-auto">
              <Button fullWidth variant="outline" size="md">
                {t.analisis.consultMantri}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}