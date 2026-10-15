import React from "react";
import { Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string;
  subtitle?: string;
  helperText?: string;
  variant?: "default" | "success" | "danger" | "warning" | "blue";
  icon?: React.ReactNode;
  className?: string;
}

export function MetricCard({
  title,
  value,
  subtitle,
  helperText,
  variant = "default",
  icon,
  className,
}: MetricCardProps) {
  const variantStyles = {
    default: "bg-white border-slate-200 text-slate-900",
    success: "bg-emerald-50/70 border-emerald-200 text-emerald-950",
    danger: "bg-red-50/70 border-red-200 text-red-950",
    warning: "bg-amber-50/70 border-amber-200 text-amber-950",
    blue: "bg-brand-light/80 border-brand-accent/50 text-brand-dark",
  };

  const valueColors = {
    default: "text-slate-900",
    success: "text-emerald-700",
    danger: "text-red-600",
    warning: "text-amber-700",
    blue: "text-brand-primary",
  };

  return (
    <div
      className={cn(
        "rounded-2xl border p-4 sm:p-5 flex flex-col justify-between gap-2 shadow-sm transition-all",
        variantStyles[variant],
        className
      )}
    >
      <div className="flex items-center justify-between text-xs font-medium text-slate-500">
        <span className="flex items-center gap-1.5 font-semibold text-slate-700">
          {icon}
          {title}
        </span>
        {helperText && (
          <span title={helperText} className="cursor-help text-slate-400 hover:text-slate-600">
            <Info className="w-3.5 h-3.5" />
          </span>
        )}
      </div>

      <div className="space-y-0.5">
        <div className={cn("text-xl sm:text-2xl font-black tracking-tight", valueColors[variant])}>
          {value}
        </div>
        {subtitle && <p className="text-[11px] text-slate-500 font-medium">{subtitle}</p>}
      </div>
    </div>
  );
}