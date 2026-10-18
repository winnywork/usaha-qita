"use client";

import React, { useState } from "react";
import { Building2, Edit2, Trash2, KeyRound, Eye, EyeOff, Users } from "lucide-react";
import { MantriUserDto } from "@/app/api/admin/mantri/route";

interface MantriTableProps {
  users: MantriUserDto[];
  isLoading: boolean;
  onEdit: (user: MantriUserDto) => void;
  onQuickPin: (user: MantriUserDto) => void;
  onDelete: (user: MantriUserDto) => void;
}

export function MantriTable({ users, isLoading, onEdit, onQuickPin, onDelete }: MantriTableProps) {
  const [revealedPins, setRevealedPins] = useState<Record<string, boolean>>({});

  const toggleRevealPin = (id: string) => {
    setRevealedPins((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  if (isLoading) {
    return (
      <div className="p-12 text-center text-slate-500 text-xs sm:text-sm flex flex-col items-center gap-3">
        <div className="w-6 h-6 border-2 border-[#0857c3] border-t-transparent rounded-full animate-spin" />
        <span>Memuat data petugas dari basis data cloud...</span>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="p-12 text-center text-slate-500 space-y-2 bg-white">
        <Users className="w-8 h-8 mx-auto text-slate-400" />
        <p className="text-sm font-semibold text-slate-700">Tidak ada data petugas Mantri ditemukan.</p>
        <p className="text-xs text-slate-500">
          Coba sesuaikan kata kunci pencarian atau daftarkan akun Mantri baru.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto bg-white">
      <table className="w-full text-left text-xs sm:text-sm">
        <thead className="bg-slate-50 text-slate-700 uppercase text-[11px] font-bold tracking-wider border-b border-slate-200">
          <tr>
            <th className="py-3.5 px-4">Nama Petugas</th>
            <th className="py-3.5 px-4">Personal Number (PN)</th>
            <th className="py-3.5 px-4">Kantor & Unit Kerja</th>
            <th className="py-3.5 px-4">Wilayah Binaan</th>
            <th className="py-3.5 px-4">PIN / Password</th>
            <th className="py-3.5 px-4 text-right">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {users.map((mantri) => {
            const isRevealed = !!revealedPins[mantri.id];
            return (
              <tr key={mantri.id} className="hover:bg-blue-50/40 transition-colors">
                {/* Name & Role */}
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#0857c3] to-[#0a6fe0] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
                      {mantri.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 block">{mantri.name}</span>
                      <span className="text-[10px] font-semibold text-[#0857c3] bg-blue-50 px-2 py-0.5 rounded border border-blue-200 inline-block mt-0.5">
                        {mantri.role || "MANTRI"}
                      </span>
                    </div>
                  </div>
                </td>

                {/* Personal Number */}
                <td className="py-4 px-4 font-mono font-semibold text-slate-800">
                  <span className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 inline-block text-xs">
                    {mantri.personalNumber}
                  </span>
                </td>

                {/* Branch & Unit */}
                <td className="py-4 px-4">
                  <span className="font-semibold text-slate-900 block">{mantri.unitName}</span>
                  <span className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                    <Building2 className="w-3 h-3 text-slate-400" />
                    {mantri.branchOffice}
                  </span>
                </td>

                {/* Assigned Areas */}
                <td className="py-4 px-4">
                  <div className="flex flex-wrap gap-1 max-w-xs">
                    {Array.isArray(mantri.assignedAreas) && mantri.assignedAreas.length > 0 ? (
                      mantri.assignedAreas.map((area, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[11px] font-medium rounded-md border border-slate-200"
                        >
                          {area}
                        </span>
                      ))
                    ) : (
                      <span className="text-slate-400 text-xs italic">Belum dipetakan</span>
                    )}
                  </div>
                </td>

                {/* PIN / Password */}
                <td className="py-4 px-4">
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-xs px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-slate-800">
                      {isRevealed ? mantri.pin : "••••••"}
                    </span>
                    <button
                      type="button"
                      onClick={() => toggleRevealPin(mantri.id)}
                      className="p-1 text-slate-400 hover:text-slate-700 rounded hover:bg-slate-100"
                      title={isRevealed ? "Sembunyikan PIN" : "Lihat PIN"}
                    >
                      {isRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => onQuickPin(mantri)}
                      className="p-1 text-amber-600 hover:text-amber-700 rounded hover:bg-amber-50"
                      title="Ganti PIN/Password Cepat"
                    >
                      <KeyRound className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>

                {/* Actions */}
                <td className="py-4 px-4 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      type="button"
                      onClick={() => onEdit(mantri)}
                      className="px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-[#0857c3] rounded-lg text-xs font-semibold flex items-center gap-1 border border-blue-200 transition-colors"
                      title="Edit Profil & Penempatan"
                    >
                      <Edit2 className="w-3 h-3" />
                      <span>Edit</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onDelete(mantri)}
                      className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg text-xs border border-rose-200 transition-colors"
                      title="Hapus Petugas"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}