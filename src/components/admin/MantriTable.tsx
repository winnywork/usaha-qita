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
      <div className="p-12 text-center text-slate-400 text-xs sm:text-sm flex flex-col items-center gap-3">
        <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <span>Memuat data petugas dari basis data cloud...</span>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="p-12 text-center text-slate-400 space-y-2">
        <Users className="w-8 h-8 mx-auto text-slate-600" />
        <p className="text-sm font-semibold text-slate-300">Tidak ada data petugas Mantri ditemukan.</p>
        <p className="text-xs text-slate-500">
          Coba sesuaikan kata kunci pencarian atau daftarkan akun Mantri baru.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs sm:text-sm">
        <thead className="bg-slate-950/60 text-slate-400 uppercase text-[11px] font-bold tracking-wider border-b border-slate-800">
          <tr>
            <th className="py-3.5 px-4">Nama Petugas</th>
            <th className="py-3.5 px-4">Personal Number (PN)</th>
            <th className="py-3.5 px-4">Kantor & Unit Kerja</th>
            <th className="py-3.5 px-4">Wilayah Binaan</th>
            <th className="py-3.5 px-4">PIN / Password</th>
            <th className="py-3.5 px-4 text-right">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/80">
          {users.map((mantri) => {
            const isRevealed = !!revealedPins[mantri.id];
            return (
              <tr key={mantri.id} className="hover:bg-slate-800/40 transition-colors">
                {/* Name & Role */}
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-700 to-indigo-800 text-white flex items-center justify-center font-bold text-xs shrink-0 border border-blue-400/20">
                      {mantri.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <span className="font-bold text-white block">{mantri.name}</span>
                      <span className="text-[10px] font-semibold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20 inline-block mt-0.5">
                        {mantri.role || "MANTRI"}
                      </span>
                    </div>
                  </div>
                </td>

                {/* Personal Number */}
                <td className="py-4 px-4 font-mono font-semibold text-slate-300">
                  <span className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 inline-block">
                    {mantri.personalNumber}
                  </span>
                </td>

                {/* Branch & Unit */}
                <td className="py-4 px-4">
                  <span className="font-semibold text-slate-200 block">{mantri.unitName}</span>
                  <span className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                    <Building2 className="w-3 h-3 text-slate-500" />
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
                          className="px-2 py-0.5 bg-slate-800 text-slate-300 text-[11px] rounded-md border border-slate-700"
                        >
                          {area}
                        </span>
                      ))
                    ) : (
                      <span className="text-slate-500 text-xs italic">Belum dipetakan</span>
                    )}
                  </div>
                </td>

                {/* PIN / Password */}
                <td className="py-4 px-4">
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-xs px-2 py-1 rounded bg-slate-950 border border-slate-800 text-slate-300">
                      {isRevealed ? mantri.pin : "••••••"}
                    </span>
                    <button
                      type="button"
                      onClick={() => toggleRevealPin(mantri.id)}
                      className="p-1 text-slate-400 hover:text-slate-200 rounded"
                      title={isRevealed ? "Sembunyikan PIN" : "Lihat PIN"}
                    >
                      {isRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => onQuickPin(mantri)}
                      className="p-1 text-blue-400 hover:text-blue-300 rounded"
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
                      className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-blue-400 hover:text-blue-300 rounded-lg text-xs font-semibold flex items-center gap-1 border border-slate-700 transition-colors"
                      title="Edit Profil & Penempatan"
                    >
                      <Edit2 className="w-3 h-3" />
                      <span>Edit</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onDelete(mantri)}
                      className="p-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 rounded-lg text-xs border border-rose-500/30 transition-colors"
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