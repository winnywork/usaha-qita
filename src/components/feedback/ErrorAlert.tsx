import React from "react";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ErrorAlertProps {
  title?: string;
  message: string;
  className?: string;
}

export function ErrorAlert({
  title = "Terjadi Kendala",
  message,
  className,
}: ErrorAlertProps) {
  return (
    <div
      role="alert"
      className={cn(
        "rounded-2xl border border-red-200 bg-red-50/90 p-4 sm:p-5 flex items-start gap-3 text-red-900",
        className
      )}
    >
      <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
      <div className="flex-1">
        {title && <h4 className="text-sm font-bold text-red-950 mb-0.5">{title}</h4>}
        <p className="text-xs sm:text-sm text-red-800 leading-relaxed">{message}</p>
      </div>
    </div>
  );
}