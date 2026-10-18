"use client";

import React, { useState } from "react";
import { KeyRound, X } from "lucide-react";
import { MantriUserDto } from "@/app/api/admin/mantri/route";

interface QuickPinModalProps {
  user: MantriUserDto;
  onClose: () => void;
  onSuccess: (updatedPin: string) => void;
}

export function QuickPinModal({ user, onClose, onSuccess }: QuickPinModalProps) {
  const [newPin, setNewPin] = useState(user.pin);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPin.trim()) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch(`/api/admin/mantri/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin: newPin.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        onSuccess(newPin.trim());
      } else {
        setError(data.error || "Gagal memperbarui PIN.");
      }
    } catch {
      setError("Gagal menghubungi server.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-sm p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-blue-400" />
            <span>Ganti PIN / Password Mantri</span>
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-slate-400">
          Ubah password akses untuk <strong className="text-slate-200">{user.name}</strong> ({user.personalNumber}).
        </p>

        {error && (
          <p className="text-xs text-rose-400 bg-rose-500/10 p-2 rounded-lg border border-rose-500/20">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300 block">
              Password / PIN Baru
            </label>
            <input
              type="text"
              value={newPin}
              onChange={(e) => setNewPin(e.target.value)}
              placeholder="Masukkan PIN baru"
              required
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs shadow-md shadow-blue-600/20 transition-all disabled:opacity-50"
            >
              {isSubmitting ? "Menyimpan..." : "Update Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}