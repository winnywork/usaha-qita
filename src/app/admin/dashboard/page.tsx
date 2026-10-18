"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Users,
  Building2,
  MapPin,
  Plus,
  Search,
  RefreshCw,
  LogOut,
  AlertCircle,
  CheckCircle2,
  X,
  Menu,
  ChevronRight,
  Database,
} from "lucide-react";
import { MantriUserDto } from "@/app/api/admin/mantri/route";
import { MantriTable } from "@/components/admin/MantriTable";
import { MantriModal } from "@/components/admin/MantriModal";
import { QuickPinModal } from "@/components/admin/QuickPinModal";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

interface AdminSessionUser {
  username: string;
  role: string;
  name: string;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<AdminSessionUser | null>(null);
  const [mantriList, setMantriList] = useState<MantriUserDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [branchFilter, setBranchFilter] = useState("ALL");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"ADD" | "EDIT">("ADD");
  const [activeUser, setActiveUser] = useState<MantriUserDto | null>(null);

  // Quick PIN modal state
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [pinTargetUser, setPinTargetUser] = useState<MantriUserDto | null>(null);

  // Notification Toast
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // 1. Check session auth
  useEffect(() => {
    const rawSession = sessionStorage.getItem("admin_session");
    if (!rawSession) {
      router.replace("/admin/login");
      return;
    }
    try {
      const user = JSON.parse(rawSession) as AdminSessionUser;
      setCurrentUser(user);
    } catch {
      router.replace("/admin/login");
    }
  }, [router]);

  // 2. Fetch mantri users from Cloud DB
  const fetchMantriUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/mantri");
      const data = await res.json();
      if (data.success && Array.isArray(data.users)) {
        setMantriList(data.users);
      } else {
        setNotification({
          type: "error",
          message: data.error || "Gagal mengambil data petugas Mantri.",
        });
      }
    } catch {
      setNotification({
        type: "error",
        message: "Koneksi ke endpoint administrator terputus.",
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMantriUsers();
  }, [fetchMantriUsers]);

  // Logout handler
  const handleLogout = () => {
    sessionStorage.removeItem("admin_session");
    router.replace("/admin/login");
  };

  // Open Add Modal
  const handleOpenAdd = () => {
    setActiveUser(null);
    setModalMode("ADD");
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (user: MantriUserDto) => {
    setActiveUser(user);
    setModalMode("EDIT");
    setIsModalOpen(true);
  };

  // Open Quick PIN Modal
  const handleOpenPinModal = (user: MantriUserDto) => {
    setPinTargetUser(user);
    setIsPinModalOpen(true);
  };

  // Delete User
  const handleDeleteMantri = async (user: MantriUserDto) => {
    const confirmed = window.confirm(
      `Apakah Anda yakin ingin menghapus petugas Mantri "${user.name}" (${user.personalNumber}) dari sistem cloud?`
    );
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/admin/mantri/${user.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setNotification({
          type: "success",
          message: `Petugas "${user.name}" berhasil dihapus dari sistem.`,
        });
        fetchMantriUsers();
      } else {
        setNotification({
          type: "error",
          message: data.error || "Gagal menghapus data petugas.",
        });
      }
    } catch {
      setNotification({
        type: "error",
        message: "Terjadi gangguan saat menghapus data di server.",
      });
    }
  };

  // Filtered List
  const filteredMantri = mantriList.filter((m) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      m.name.toLowerCase().includes(q) ||
      m.personalNumber.toLowerCase().includes(q) ||
      m.branchOffice.toLowerCase().includes(q) ||
      m.unitName.toLowerCase().includes(q) ||
      (Array.isArray(m.assignedAreas) &&
        m.assignedAreas.some((area) => area.toLowerCase().includes(q)));

    const matchesBranch = branchFilter === "ALL" || m.branchOffice === branchFilter;

    return matchesSearch && matchesBranch;
  });

  // Unique branch list for filter
  const branchList = Array.from(new Set(mantriList.map((m) => m.branchOffice))).filter(Boolean);

  // Total distinct areas covered
  const totalAreasCovered = Array.from(
    new Set(mantriList.flatMap((m) => (Array.isArray(m.assignedAreas) ? m.assignedAreas : [])))
  ).length;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row text-slate-800">
      {/* 1. Left Sidebar Navigation */}
      <AdminSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onLogout={handleLogout}
        adminName={currentUser?.name || currentUser?.username || "superadmin"}
      />

      {/* 2. Main Content Container */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-2xs">
          <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
            {/* Left: Mobile hamburger & Breadcrumb */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsSidebarOpen(true)}
                className="md:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl"
                aria-label="Buka Menu Sidebar"
              >
                <Menu className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                <span className="text-slate-500">Administrasi</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-bold text-[#0857c3] bg-blue-50 px-2 py-0.5 rounded-lg border border-blue-200/80">
                  User Administrasi
                </span>
              </div>
            </div>

            {/* Right Header Status Actions */}
            <div className="flex items-center gap-3">
              {/* Cloud DB Badge */}
              <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[11px] font-semibold text-emerald-700">
                <Database className="w-3 h-3 text-emerald-600" />
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Cloud Firestore Live</span>
              </div>

              {/* Logout Button */}
              <button
                type="button"
                onClick={handleLogout}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 flex items-center gap-1.5 transition-colors"
                title="Keluar dari sesi administrator"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Keluar</span>
              </button>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl w-full mx-auto">
          {/* Toast / Notification Banner */}
          {notification && (
            <div
              className={`p-4 rounded-2xl flex items-center justify-between gap-3 text-xs sm:text-sm animate-in fade-in slide-in-from-top-2 duration-200 ${
                notification.type === "success"
                  ? "bg-emerald-50 border border-emerald-200 text-emerald-800"
                  : "bg-rose-50 border border-rose-200 text-rose-800"
              }`}
            >
              <div className="flex items-center gap-2">
                {notification.type === "success" ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                )}
                <span className="font-medium">{notification.message}</span>
              </div>
              <button
                type="button"
                onClick={() => setNotification(null)}
                className="p-1 hover:bg-black/5 rounded-lg text-slate-500 hover:text-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Stats Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white border border-slate-200/90 rounded-2xl p-5 flex items-center gap-4 shadow-2xs hover:shadow-sm transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#0857c3] shrink-0">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-slate-500 font-medium block">Total Petugas Mantri</span>
                <span className="text-2xl font-black text-slate-900">{mantriList.length}</span>
              </div>
            </div>

            <div className="bg-white border border-slate-200/90 rounded-2xl p-5 flex items-center gap-4 shadow-2xs hover:shadow-sm transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-700 shrink-0">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-slate-500 font-medium block">Kantor Cabang Terdaftar</span>
                <span className="text-2xl font-black text-slate-900">{branchList.length}</span>
              </div>
            </div>

            <div className="bg-white border border-slate-200/90 rounded-2xl p-5 flex items-center gap-4 shadow-2xs hover:shadow-sm transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-slate-500 font-medium block">Wilayah Kerja Binaan</span>
                <span className="text-2xl font-black text-slate-900">{totalAreasCovered}</span>
              </div>
            </div>
          </div>

          {/* Action Controls & Filter */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 space-y-4 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Users className="w-5 h-5 text-[#0857c3]" />
                  <span>Manajemen Petugas Mantri (User Administrasi)</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Konfigurasi akun, mapping kantor cabang, unit kerja, wilayah binaan, dan kata sandi login Mantri.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={fetchMantriUsers}
                  className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 rounded-xl transition-colors border border-slate-200"
                  title="Segarkan Data"
                >
                  <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
                </button>

                <button
                  type="button"
                  onClick={handleOpenAdd}
                  className="px-4 py-2.5 bg-[#0857c3] hover:bg-[#06449a] text-white font-bold rounded-xl text-xs sm:text-sm flex items-center gap-2 shadow-md shadow-blue-700/20 transition-all active:scale-[0.99]"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Mantri Baru</span>
                </button>
              </div>
            </div>

            {/* Search & Filter Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-100">
              <div className="sm:col-span-2 relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Search className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari berdasarkan nama, PN / NIP, kantor cabang, atau wilayah..."
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0857c3]"
                />
              </div>

              <div>
                <select
                  value={branchFilter}
                  onChange={(e) => setBranchFilter(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0857c3]"
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

          {/* Users Table Container */}
          <div className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-2xs">
            <MantriTable
              users={filteredMantri}
              isLoading={isLoading}
              onEdit={handleOpenEdit}
              onQuickPin={handleOpenPinModal}
              onDelete={handleDeleteMantri}
            />
          </div>
        </main>
      </div>

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