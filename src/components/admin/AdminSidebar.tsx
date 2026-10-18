"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Compass,
  ChevronDown,
  Users,
  ShieldCheck,
  LogOut,
  X,
  Sparkles,
} from "lucide-react";

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
  adminName?: string;
}

export function AdminSidebar({
  isOpen,
  onClose,
  onLogout,
  adminName = "superadmin",
}: AdminSidebarProps) {
  const [isAdminMenuOpen, setIsAdminMenuOpen] = useState(true);

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white text-slate-800">
      {/* Brand Header */}
      <div className="h-16 px-5 border-b border-slate-200 flex items-center justify-between shrink-0">
        <Link href="/admin/dashboard" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-[#0857c3] text-white flex items-center justify-center shadow-md shadow-blue-900/15 group-hover:scale-105 transition-transform shrink-0">
            <Compass className="w-5 h-5" />
          </div>
          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-slate-900 text-sm tracking-tight">Usaha Qita</span>
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-blue-50 text-[#0857c3] border border-blue-200">
                Admin
              </span>
            </div>
            <span className="text-[10px] text-slate-500 font-semibold tracking-wide">
              Control Center
            </span>
          </div>
        </Link>

        {/* Close button on mobile */}
        <button
          type="button"
          onClick={onClose}
          className="md:hidden p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg"
          aria-label="Tutup Menu"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation Menus */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-4">
        {/* Navigation Section: Administrasi */}
        <div>
          <div className="px-3 mb-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Menu Utama
          </div>

          {/* Administrasi Group Heading / Accordion */}
          <div className="space-y-1">
            <button
              type="button"
              onClick={() => setIsAdminMenuOpen(!isAdminMenuOpen)}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-blue-50 text-[#0857c3] flex items-center justify-center border border-blue-100">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <span>Administrasi</span>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                  isAdminMenuOpen ? "rotate-180 text-[#0857c3]" : ""
                }`}
              />
            </button>

            {/* Sub-menu items */}
            {isAdminMenuOpen && (
              <div className="pl-4 pr-1 pt-0.5 space-y-1">
                <Link
                  href="/admin/dashboard"
                  onClick={onClose}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-[#0857c3] bg-blue-50/80 border-l-4 border-[#0857c3] shadow-2xs transition-all"
                >
                  <Users className="w-3.5 h-3.5 text-[#0857c3]" />
                  <span>User Administrasi</span>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Info Card / MAXI Concept */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-br from-blue-50/70 to-indigo-50/40 border border-blue-100 text-xs text-slate-600 space-y-1.5">
          <div className="flex items-center gap-1.5 font-bold text-[#0857c3]">
            <Sparkles className="w-3.5 h-3.5 text-[#0857c3]" />
            <span>Usaha Qita Internal</span>
          </div>
          <p className="text-[11px] leading-relaxed text-slate-600">
            Modul pengelolaan otorisasi akun Mantri dan pemetaan kantor unit binaan.
          </p>
        </div>
      </div>

      {/* Admin User Profile & Logout at Bottom */}
      <div className="p-3 border-t border-slate-200 bg-slate-50/80 shrink-0">
        <div className="p-2.5 rounded-xl bg-white border border-slate-200/90 shadow-2xs flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-[#0857c3] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
              {adminName.slice(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <span className="font-bold text-xs text-slate-900 block truncate leading-tight">
                {adminName}
              </span>
              <span className="text-[10px] text-slate-500 font-medium block truncate">
                Super Administrator
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onLogout}
            className="p-1.5 rounded-lg text-rose-600 hover:text-rose-700 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-colors"
            title="Keluar dari sesi administrator"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden md:flex flex-col w-64 border-r border-slate-200 bg-white shrink-0 h-screen sticky top-0 shadow-xs z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer (with Backdrop) */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex animate-in fade-in duration-150">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
            onClick={onClose}
          />
          <div className="relative w-72 max-w-[85vw] bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}