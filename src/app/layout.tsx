import type { Metadata } from "next";
import "./globals.css";
import { AppLayout } from "@/components/layout/AppLayout";
import { LanguageProvider } from "@/context/LanguageContext";

export const metadata: Metadata = {
  title: "Usaha Qita — by MAXI Team | Asisten Perencanaan Usaha",
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
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-brand-light selection:text-brand-primary antialiased">
        <LanguageProvider>
          <AppLayout>{children}</AppLayout>
        </LanguageProvider>
      </body>
    </html>
  );
}
