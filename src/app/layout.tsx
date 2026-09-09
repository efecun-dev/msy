import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MSY Elektronik | Uydu, Güvenlik & Otomasyon Sistemleri",
  description:
    "MSY Elektronik — Güvenlik kameraları, uydu sistemleri, anten ve otomasyon çözümlerinde Türkiye'nin güvenilir elektronik partneri.",
  keywords: [
    "güvenlik kamerası",
    "uydu sistemi",
    "anten",
    "CCTV",
    "IP kamera",
    "otomasyon",
    "MSY Elektronik",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" className="h-full">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
