"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminIndexPage() {
  const router = useRouter();

  useEffect(() => {
    const session = sessionStorage.getItem("admin_session");
    if (session) {
      router.replace("/admin/dashboard");
    } else {
      router.replace("/admin/login");
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-500 text-sm">
      <div className="flex items-center gap-3">
        <div className="w-5 h-5 border-2 border-[#0857c3] border-t-transparent rounded-full animate-spin" />
        <span>Memverifikasi otorisasi administrator...</span>
      </div>
    </div>
  );
}