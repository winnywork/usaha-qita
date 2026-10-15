import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "blue" | "green" | "orange" | "purple" | "neutral";
  size?: "sm" | "md";
}

export function Badge({
  className,
  variant = "default",
  size = "md",
  children,
  ...props
}: BadgeProps) {
  const variantStyles = {
    default: "bg-slate-100 text-slate-700 border-slate-200",
    blue: "bg-blue-50 text-bri-blue border-blue-200",
    green: "bg-emerald-50 text-emerald-700 border-emerald-200",
    orange: "bg-amber-50 text-amber-800 border-amber-200",
    purple: "bg-purple-50 text-purple-700 border-purple-200",
    neutral: "bg-slate-50 text-slate-600 border-slate-200",
  };

  const sizeStyles = {
    sm: "text-[11px] px-2 py-0.5 font-medium",
    md: "text-xs px-2.5 py-1 font-medium",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border leading-none select-none",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}