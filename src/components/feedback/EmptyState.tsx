import React from "react";
import { Inbox, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export function EmptyState({
  title = "Belum Ada Data Ditemukan",
  description = "Coba ubah filter atau sesuaikan anggaran modal Anda untuk melihat peluang usaha lainnya.",
  actionLabel = "Atur Ulang Pencarian",
  onAction,
  icon,
}: EmptyStateProps) {
  return (
    <div className="w-full flex flex-col items-center justify-center p-8 sm:p-12 text-center bg-white rounded-2xl border border-dashed border-slate-300">
      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-slate-100 text-slate-500 flex items-center justify-center mb-4">
        {icon || <Inbox className="w-7 h-7 sm:w-8 sm:h-8" />}
      </div>
      <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-1.5">{title}</h3>
      <p className="text-xs sm:text-sm text-slate-500 max-w-md mb-6 leading-relaxed">
        {description}
      </p>
      {onAction && (
        <Button variant="outline" size="sm" onClick={onAction} leftIcon={<RefreshCw className="w-4 h-4" />}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}