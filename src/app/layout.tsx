import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { DisclaimerBanner } from "@/components/layout/DisclaimerBanner";

export const metadata: Metadata = {
  title: "Usaha Qita — powered by BRI | Asisten Perencanaan Usaha",
  description:
    "Asisten digital perencanaan usaha mandiri bagi calon wirausaha dan UMKM Indonesia dengan simulasi peluang usaha terukur dan kalkulasi titik impas.",
  keywords: [
    "perencanaan usaha",
    "kalkulator BEP",
    "peluang usaha UMKM",
    "simulasi bisnis pemula",
    "Usaha Qita",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="scroll-smooth">
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-blue-100 selection:text-bri-blue antialiased">
        <DisclaimerBanner />
        <Navbar />
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}