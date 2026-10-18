"use client";

import React, { useState } from "react";
import { Users, X, Eye, EyeOff } from "lucide-react";
import { MantriUserDto } from "@/app/api/admin/mantri/route";

interface MantriModalProps {
  mode: "ADD" | "EDIT";
  initialData?: MantriUserDto | null;
  onClose: () => void;
  onSuccess: (savedUser: MantriUserDto) => void;
}

export function MantriModal({ mode, initialData, onClose, onSuccess }: MantriModalProps) {
  const [name, setName] = useState(initialData?.name || "");
  const [personalNumber, setPersonalNumber] = useState(initialData?.personalNumber || "");
  const [pin, setPin] = useState(initialData?.pin || "");
  const [phoneNumber, setPhoneNumber] = useState(initialData?.phoneNumber || "");
  const [branchOffice, setBranchOffice] = useState(initialData?.branchOffice || "");
  const [unitName, setUnitName] = useState(initialData?.unitName || "");
  const [role, setRole] = useState(initialData?.role || "MANTRI");
  const [assignedAreas, setAssignedAreas] = useState(
    Array.isArray(initialData?.assignedAreas) ? initialData.assignedAreas.join(", ") : ""
  );
  const [showPin, setShowPin] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !personalNumber.trim() || !pin.trim() || !branchOffice.trim() || !unitName.trim()) {
      setError("Mohon lengkapi semua data wajib bertanda bintang.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const areasArray = assignedAreas
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const payload = {
      name: name.trim(),
      personalNumber: personalNumber.trim().toUpperCase(),
      pin: pin.trim(),
      phoneNumber: phoneNumber.trim(),
      branchOffice: branchOffice.trim(),
      unitName: unitName.trim(),
      role: role.trim(),
      assignedAreas: areasArray,
    };

    try {
      const url =
        mode === "ADD"
          ? "/api/admin/mantri"
          : `/api/admin/mantri/${initialData?.id}`;
      const method = mode === "ADD" ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      const savedUser = data.user || data.data;

      if (data.success && savedUser) {
        onSuccess(savedUser);
      } else {
        setError(data.error || "Gagal menyimpan data Mantri.");
      }
    } catch {
      setError("Terjadi kendala jaringan saat menghubungi server.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl space-y-6 p-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-[#0857c3]" />
              <span>{mode === "ADD" ? "Tambah Petugas Mantri Baru" : "Edit Profil & Mapping Mantri"}</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Isikan data kepegawaian dan area tugas operasional petugas.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Nama Lengkap */}
            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-semibold text-slate-700 block">
                Nama Lengkap & Gelar <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Contoh: Budi Santoso, S.E."
                required
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0857c3]"
              />
            </div>

            {/* Personal Number (NIP) */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 block">
                Personal Number (PN / NIP) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={personalNumber}
                onChange={(e) => setPersonalNumber(e.target.value)}
                placeholder="Contoh: BRI-882043"
                required
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0857c3] font-mono"
              />
            </div>

            {/* Nomor WhatsApp Mantri */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 block">
                Nomor WhatsApp Mantri
              </label>
              <input
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Contoh: 081234567890"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0857c3] font-mono text-xs sm:text-sm"
              />
            </div>

            {/* PIN / Password */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 block">
                PIN / Password Login Mantri <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPin ? "text" : "password"}
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="Contoh: 123456"
                  required
                  className="w-full pl-3.5 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0857c3] font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPin(!showPin)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-700"
                >
                  {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Kantor Cabang */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 block">
                Kantor Cabang (KC) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={branchOffice}
                onChange={(e) => setBranchOffice(e.target.value)}
                placeholder="Contoh: KC Malang Soekarno Hatta"
                required
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0857c3]"
              />
            </div>

            {/* Unit Kerja */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 block">
                Unit Kerja BRI <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={unitName}
                onChange={(e) => setUnitName(e.target.value)}
                placeholder="Contoh: BRI Unit Dinoyo"
                required
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0857c3]"
              />
            </div>

            {/* Role */}
            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-semibold text-slate-700 block">
                Peran / Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0857c3]"
              >
                <option value="MANTRI">MANTRI (Petugas Lapangan & Konsultan)</option>
                <option value="SUPERVISOR">SUPERVISOR (Penyelia Unit Kerja)</option>
                <option value="KANCA_HEAD">KANCA HEAD (Pimpinan Kantor Cabang)</option>
              </select>
            </div>

            {/* Wilayah Binaan (Comma-separated) */}
            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-semibold text-slate-700 block">
                Wilayah Penugasan / Binaan (Pisahkan dengan koma)
              </label>
              <input
                type="text"
                value={assignedAreas}
                onChange={(e) => setAssignedAreas(e.target.value)}
                placeholder="Contoh: Dinoyo, Tlogomas, Ketawanggede, Merjosari"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0857c3]"
              />
              <span className="text-[11px] text-slate-500 block">
                Wilayah ini digunakan sistem untuk mencocokkan prospek nasabah secara otomatis ke Mantri yang berwenang.
              </span>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 bg-[#0857c3] hover:bg-[#06449a] text-white font-bold rounded-xl shadow-md shadow-blue-700/20 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Menyimpan...</span>
                </>
              ) : (
                <span>{mode === "ADD" ? "Daftarkan Petugas" : "Simpan Perubahan"}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}