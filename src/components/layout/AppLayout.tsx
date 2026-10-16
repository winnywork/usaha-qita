"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { DisclaimerBanner } from "@/components/layout/DisclaimerBanner";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const pathname = usePathname();

  // Internal bank portal routes should render full-bleed with their own bank header & styling
  const isMantriPortal =
    pathname.startsWith("/mantri/dashboard") ||
    pathname.startsWith("/mantri/prospek") ||
    pathname.startsWith("/mantri/login");

  if (isMantriPortal) {
    return (
      <main className="flex-1 w-full min-h-screen bg-slate-50 text-slate-900">
        {children}
      </main>
    );
  }

  // Public educational platform layout
  return (
    <>
      <DisclaimerBanner />
      <Navbar />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        {children}
      </main>
      <Footer />
    </>
  );
}
