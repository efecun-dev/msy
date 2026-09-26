import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/Providers";

export const metadata: Metadata = {
  title: "MSY Elektronik | Uydu, Güvenlik & Otomasyon Sistemleri",
  description:
    "MSY Elektronik - Güvenlik kameraları, uydu sistemleri, anten ve otomasyon çözümlerinde Türkiye'nin güvenilir elektronik partneri.",
  keywords: [
    "güvenlik kamerası",
    "uydu sistemi",
    "anten",
    "CCTV",
    "IP kamera",
    "otomasyon",
    "MSY Elektronik",
  ],
  authors: [{ name: "MSY Elektronik" }],
  openGraph: {
    title: "MSY Elektronik | Profesyonel Güvenlik ve Uydu Sistemleri",
    description:
      "Eviniz ve iş yeriniz için profesyonel güvenlik kamerası ve uydu sistemleri kurulumu.",
    url: "https://msyelektronik.com",
    siteName: "MSY Elektronik",
    locale: "tr_TR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MSY Elektronik",
    description: "Profesyonel güvenlik kamerası ve uydu sistemleri çözümleri.",
  },
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className="scroll-smooth" suppressHydrationWarning>
      <body className="antialiased bg-panel-2 text-panel-12">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
