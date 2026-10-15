import React from "react";
import { cn } from "@/lib/utils";

export interface RangeSliderProps {
  label?: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  formatValue?: (val: number) => string;
  helperText?: string;
  className?: string;
  id?: string;
}

export function RangeSlider({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  formatValue,
  helperText,
  className,
  id,
}: RangeSliderProps) {
  const sliderId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

  return (
    <div className={cn("w-full flex flex-col gap-2", className)}>
      <div className="flex items-center justify-between text-xs sm:text-sm">
        {label && (
          <label htmlFor={sliderId} className="font-semibold text-slate-700">
            {label}
          </label>
        )}
        <span className="font-bold text-bri-blue px-2.5 py-0.5 bg-blue-50 border border-blue-200 rounded-lg">
          {formatValue ? formatValue(value) : value}
        </span>
      </div>

      <div className="relative flex items-center py-1">
        <input
          type="range"
          id={sliderId}
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-bri-blue focus:outline-none focus:ring-2 focus:ring-blue-200"
        />
      </div>

      <div className="flex justify-between items-center text-[11px] text-slate-400">
        <span>{formatValue ? formatValue(min) : min}</span>
        {helperText && <span className="text-slate-500 font-normal">{helperText}</span>}
        <span>{formatValue ? formatValue(max) : max}</span>
      </div>
    </div>
  );
}