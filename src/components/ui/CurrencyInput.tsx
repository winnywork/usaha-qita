import React, { ChangeEvent } from "react";
import { cn } from "@/lib/utils";
import { parseRupiah } from "@/core/finance/calculator";

export interface CurrencyInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value"> {
  value: number;
  onChange: (value: number) => void;
  label?: string;
  helperText?: string;
  error?: string;
}

export function CurrencyInput({
  value,
  onChange,
  label,
  helperText,
  error,
  className,
  id,
  placeholder = "0",
  disabled,
  ...props
}: CurrencyInputProps) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const numeric = parseRupiah(raw);
    onChange(numeric);
  };

  const displayValue = value > 0 ? new Intl.NumberFormat("id-ID").format(value) : "";

  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-xs sm:text-sm font-semibold text-slate-700">
          {label}
        </label>
      )}

      <div className="relative rounded-xl shadow-sm">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
          <span className="text-slate-500 font-bold text-sm">Rp</span>
        </div>
        <input
          type="text"
          inputMode="numeric"
          id={inputId}
          value={displayValue}
          onChange={handleChange}
          disabled={disabled}
          placeholder={placeholder}
          className={cn(
            "block w-full rounded-xl border bg-white py-3 pl-11 pr-4 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 min-h-[44px] transition-all",
            error
              ? "border-red-400 focus:border-red-500 focus:ring-red-200"
              : "border-slate-300 focus:border-bri-blue focus:ring-blue-100",
            disabled && "bg-slate-50 text-slate-400 cursor-not-allowed",
            className
          )}
          {...props}
        />
      </div>

      {error ? (
        <p className="text-xs text-red-600 font-medium">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-slate-500">{helperText}</p>
      ) : null}
    </div>
  );
}