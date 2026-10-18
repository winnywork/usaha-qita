"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Shield,
  Users,
  Building2,
  MapPin,
  Plus,
  Search,
  LogOut,
  X,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { MantriUserDto } from "@/app/api/admin/mantri/route";
import { MantriTable } from "@/components/admin/MantriTable";
import { MantriModal } from "@/components/admin/MantriModal";
import { QuickPinModal } from "@/components/admin/QuickPinModal";

interface AdminSession {
  username: string;
  name: string;
  role: string;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [adminUser, setAdminUser] = useState<AdminSession | null>(null);
  const [mantriList, setMantriList] = useState<MantriUserDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [branchFilter, setBranchFilter] = useState("ALL");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"ADD" | "EDIT">("ADD");
  const [activeUser, setActiveUser] = useState<MantriUserDto | null>(null);

  // Quick PIN Edit State
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [pinTargetUser, setPinTargetUser] = useState<MantriUserDto | null>(null);

  // Notifications
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // 1. Auth check
  useEffect(() => {
    const raw = sessionStorage.getItem("admin_session");
    if (!raw) {
      router.replace("/admin/login");
      return;
    }
    try {
      const parsed = JSON.parse(raw);
      setAdminUser(parsed);
    } catch {
      router.replace("/admin/login");
    }
  }, [router]);

  // 2. Fetch Mantri list
  const fetchMantriUsers = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/mantri");
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setMantriList(data.data);
      }
    } catch {
      setNotification({ type: "error", message: "Gagal memuat daftar petugas Mantri." });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (adminUser) {
      fetchMantriUsers();
    }
  }, [adminUser]);

  // Logout handler
  const handleLogout = () => {
    sessionStorage.removeItem("admin_session");
    router.replace("/admin/login");
  };

  // Open modal for adding
  const handleOpenAdd = () => {
    setModalMode("ADD");
    setActiveUser(null);
    setIsModalOpen(true);
  };

  // Open modal for editing
  const handleOpenEdit = (user: MantriUserDto) => {
    setModalMode("EDIT");
    setActiveUser(user);
    setIsModalOpen(true);
  };

  // Open quick PIN modal
  const handleOpenPinModal = (user: MantriUserDto) => {
    setPinTargetUser(user);
    setIsPinModalOpen(true);
  };

  // Handle Delete
  const handleDeleteMantri = async (user: MantriUserDto) => {
    const confirmDelete = window.confirm(
      `Apakah Anda yakin ingin menghapus petugas Mantri "${user.name}" (${user.personalNumber})? Tindakan ini tidak dapat dibatalkan.`
    );
    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/admin/mantri/${user.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setNotification({ type: "success", message: `Petugas Mantri ${user.name} berhasil dihapus.` });
        fetchMantriUsers();
      } else {
        setNotification({ type: "error", message: data.error || "Gagal menghapus petugas." });
      }
    } catch {
      setNotification({ type: "error", message: "Gagal menghapus petugas." });
    }
  };

  // Branch offices list for filter
  const branchList = useMemo(() => {
    const branches = new Set<string>();
    mantriList.forEach((m) => {
      if (m.branchOffice) branches.add(m.branchOffice);
    });
    return Array.from(branches);
  }, [mantriList]);

  // Filtered Mantri List
  const filteredMantri = useMemo(() => {
    return mantriList.filter((m) => {
      const q = searchQuery.toLowerCase();
      const matchQuery =
        m.name.toLowerCase().includes(q) ||
        m.personalNumber.toLowerCase().includes(q) ||
        m.unitName.toLowerCase().includes(q) ||
        m.branchOffice.toLowerCase().includes(q) ||
        (m.assignedAreas && m.assignedAreas.some((a) => a.toLowerCase().includes(q)));

      const matchBranch = branchFilter === "ALL" || m.branchOffice === branchFilter;

      return matchQuery && matchBranch;
    });
  }, [mantriList, searchQuery, branchFilter]);

  // Calculate unique areas count
  const totalAreasCovered = useMemo(() => {
    const areas = new Set<string>();
    mantriList.forEach((m) => {
      if (Array.isArray(m.assignedAreas)) {
        m.assignedAreas.forEach((a) => areas.add(a.toLowerCase().trim()));
      }
    });
    return areas.size;
  }, [mantriList]);

  if (!adminUser) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Bar Header */}
      <header className="sticky top-0 z-30 w-full bg-slate-900/90 backdrop-blur-md border-b border-slate-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Identity */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-md shadow-blue-900/30 border border-blue-400/20 shrink-0">
                <Shield className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-base sm:text-lg font-extrabold tracking-tight text-white leading-none">
                    Usaha Qita
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    Control Center
                  </span>
                </div>
                <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1 mt-0.5">
                  <Sparkles className="w-3 h-3 text-brand-accent" /> by MAXI Team
                </span>
              </div>
            </div>

            {/* Right: Admin Session & Logout */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-xs font-bold text-slate-200">
                  {adminUser.name}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  @{adminUser.username}
                </span>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 flex items-center gap-1.5 transition-colors"
                title="Keluar dari sesi administrator"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Keluar</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Toast / Notification Banner */}
        {notification && (
          <div
            className={`p-4 rounded-2xl flex items-center justify-between gap-3 text-xs sm:text-sm animate-in fade-in slide-in-from-top-2 duration-200 ${
              notification.type === "success"
                ? "bg-emerald-500/15 border border-emerald-500/30 text-emerald-300"
                : "bg-rose-500/15 border border-rose-500/30 text-rose-300"
            }`}
          >
            <div className="flex items-center gap-2">
              {notification.type === "success" ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              )}
              <span>{notification.message}</span>
            </div>
            <button
              type="button"
              onClick={() => setNotification(null)}
              className="p-1 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-slate-400 font-medium block">Total Petugas Mantri</span>
              <span className="text-2xl font-black text-white">{mantriList.length}</span>
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-slate-400 font-medium block">Kantor Cabang Terdaftar</span>
              <span className="text-2xl font-black text-white">{branchList.length}</span>
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-slate-400 font-medium block">Wilayah Kerja Binaan</span>
              <span className="text-2xl font-black text-white">{totalAreasCovered}</span>
            </div>
          </div>
        </div>

        {/* Action Controls & Filter */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-400" />
                <span>Manajemen Petugas Mantri</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Konfigurasi akun, mapping kantor cabang, unit kerja, wilayah binaan, dan kata sandi login Mantri.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={fetchMantriUsers}
                className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors border border-slate-700"
                title="Segarkan Data"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
              </button>

              <button
                type="button"
                onClick={handleOpenAdd}
                className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-blue-600/20 transition-all active:scale-[0.99]"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Mantri Baru</span>
              </button>
            </div>
          </div>

          {/* Search & Filter Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-800/80">
            <div className="sm:col-span-2 relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari berdasarkan nama, PN / NIP, kantor cabang, atau wilayah..."
                className="w-full pl-10 pr-4 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <select
                value={branchFilter}
                onChange={(e) => setBranchFilter(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="ALL">Semua Kantor Cabang (KC)</option>
                {branchList.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <MantriTable
            users={filteredMantri}
            isLoading={isLoading}
            onEdit={handleOpenEdit}
            onQuickPin={handleOpenPinModal}
            onDelete={handleDeleteMantri}
          />
        </div>
      </main>

      {/* MODAL: ADD / EDIT MANTRI */}
      {isModalOpen && (
        <MantriModal
          mode={modalMode}
          initialData={activeUser}
          onClose={() => setIsModalOpen(false)}
          onSuccess={(savedUser) => {
            setIsModalOpen(false);
            setNotification({
              type: "success",
              message: `Data petugas Mantri "${savedUser.name}" berhasil disimpan ke sistem cloud.`,
            });
            fetchMantriUsers();
          }}
        />
      )}

      {/* MODAL: QUICK PIN CHANGE */}
      {isPinModalOpen && pinTargetUser && (
        <QuickPinModal
          user={pinTargetUser}
          onClose={() => setIsPinModalOpen(false)}
          onSuccess={(updatedPin) => {
            setIsPinModalOpen(false);
            setNotification({
              type: "success",
              message: `PIN login untuk ${pinTargetUser.name} berhasil diperbarui menjadi "${updatedPin}".`,
            });
            fetchMantriUsers();
          }}
        />
      )}
    </div>
  );
}