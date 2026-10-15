import React from "react";
import { TrendingDown, TrendingUp, Minus } from "lucide-react";
import { FinancialAssumptions } from "@/types/finance";
import { calculateFinancials, applyScenario, formatRupiah } from "@/core/finance/calculator";

interface ScenarioComparisonProps {
  baseAssumptions: FinancialAssumptions;
}

export function ScenarioComparison({ baseAssumptions }: ScenarioComparisonProps) {
  const conservativeAssumptions = applyScenario(baseAssumptions, "konservatif");
  const moderateAssumptions = applyScenario(baseAssumptions, "moderat");
  const aggressiveAssumptions = applyScenario(baseAssumptions, "agresif");

  const conservativeResult = calculateFinancials(conservativeAssumptions);
  const moderateResult = calculateFinancials(moderateAssumptions);
  const aggressiveResult = calculateFinancials(aggressiveAssumptions);

  const scenarios = [
    {
      id: "konservatif",
      name: "Skenario Konservatif (Lesu)",
      description: "Penjualan turun 30% dari target normal (misal cuaca buruk / awal merintis)",
      icon: <TrendingDown className="w-4 h-4 text-amber-600" />,
      dailyUnits: conservativeAssumptions.dailySalesVolume,
      result: conservativeResult,
      borderColor: "border-amber-200",
      bgColor: "bg-amber-50/40",
    },
    {
      id: "moderat",
      name: "Skenario Moderat (Normal)",
      description: "Target penjualan harian yang realistis sesuai kapasitas operasional",
      icon: <Minus className="w-4 h-4 text-bri-blue" />,
      dailyUnits: moderateAssumptions.dailySalesVolume,
      result: moderateResult,
      borderColor: "border-blue-200 ring-2 ring-blue-500/10",
      bgColor: "bg-blue-50/50",
    },
    {
      id: "agresif",
      name: "Skenario Agresif (Ramai)",
      description: "Penjualan naik 30% saat musim ramai, akhir pekan, atau promosi efektif",
      icon: <TrendingUp className="w-4 h-4 text-emerald-600" />,
      dailyUnits: aggressiveAssumptions.dailySalesVolume,
      result: aggressiveResult,
      borderColor: "border-emerald-200",
      bgColor: "bg-emerald-50/40",
    },
  ];

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h3 className="text-base sm:text-lg font-bold text-slate-900">
          Uji Ketahanan: Simulasi 3 Skenario Pasar
        </h3>
        <p className="text-xs sm:text-sm text-slate-500">
          Ketahui apakah usaha Anda tetap menghasilkan keuntungan jika penjualan sedang sepi atau membludak.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {scenarios.map((sc) => (
          <div
            key={sc.id}
            className={`rounded-2xl border p-5 flex flex-col justify-between gap-4 transition-all ${sc.borderColor} ${sc.bgColor}`}
          >
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 font-bold text-sm text-slate-900">
                {sc.icon}
                <span>{sc.name}</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">{sc.description}</p>
              <div className="pt-2 text-xs text-slate-700">
                Target Terjual: <strong>{sc.dailyUnits} unit/hari</strong>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200/60 space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Omzet Bulanan:</span>
                <span className="font-semibold text-slate-900">
                  {formatRupiah(sc.result.monthlyGrossRevenue)}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-500">Total Pengeluaran:</span>
                <span className="text-slate-700">
                  {formatRupiah(sc.result.monthlyTotalCosts)}
                </span>
              </div>

              <div className="flex justify-between items-center pt-1 border-t border-slate-200/40">
                <span className="font-bold text-slate-700">Laba Bersih:</span>
                <span
                  className={`font-black text-sm ${
                    sc.result.isProfitable ? "text-emerald-700" : "text-red-600"
                  }`}
                >
                  {formatRupiah(sc.result.monthlyNetProfit)}
                </span>
              </div>

              <div className="flex justify-between items-center text-[11px] text-slate-500">
                <span>Margin Bersih:</span>
                <span className="font-semibold">
                  {sc.result.netProfitMarginPercentage}%
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}