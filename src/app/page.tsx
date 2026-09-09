"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { Wrench, Headset, Settings, Search } from "lucide-react";

// ─── Data ────────────────────────────────────────────────────────────────────

const navLinks = [
  { label: "Anasayfa", href: "#hero" },
  { label: "Ürünler", href: "#products" },
  { label: "Hizmetler", href: "#services" },
  { label: "Hakkımızda", href: "#about" },
  { label: "İletişim", href: "#contact" },
];

const products = [
  {
    id: 1,
    category: "Güvenlik Kamerası",
    name: "4K Ultra HD IP Dome Kamera",
    description:
      "Gece görüşlü, 30m IR mesafeli, H.265+ sıkıştırmalı profesyonel güvenlik kamerası.",
    price: "₺2.499",
    badge: "En Çok Satan",
    badgeColor: "bg-blue-600",
    icon: (
      <svg viewBox="0 0 64 64" fill="none" className="w-16 h-16">
        <circle cx="32" cy="32" r="20" stroke="#2d8de8" strokeWidth="2" />
        <circle cx="32" cy="32" r="12" fill="#1a6bc8" opacity="0.3" />
        <circle cx="32" cy="32" r="6" fill="#2d8de8" />
        <path d="M14 32 L4 28 L4 36 Z" fill="#2d8de8" />
        <path d="M50 32 L60 28 L60 36 Z" fill="#2d8de8" />
      </svg>
    ),
  },
  {
    id: 2,
    category: "Uydu Anteni",
    name: "Motorize Çanak Anten 90cm",
    description:
      "Otomatik yönlendirmeli, tüm uydu sistemleriyle uyumlu motorize çanak anten sistemi.",
    price: "₺1.850",
    badge: "Yeni",
    badgeColor: "bg-green-600",
    icon: (
      <svg viewBox="0 0 64 64" fill="none" className="w-16 h-16">
        <ellipse
          cx="32"
          cy="28"
          rx="20"
          ry="10"
          stroke="#2d8de8"
          strokeWidth="2"
          fill="#1a6bc8"
          opacity="0.2"
        />
        <line
          x1="32"
          y1="28"
          x2="32"
          y2="56"
          stroke="#2d8de8"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <line
          x1="20"
          y1="56"
          x2="44"
          y2="56"
          stroke="#2d8de8"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <circle cx="32" cy="20" r="4" fill="#2d8de8" />
        <path
          d="M28 20 L24 10"
          stroke="#2d8de8"
          strokeWidth="1.5"
          strokeDasharray="2,2"
        />
      </svg>
    ),
  },
  {
    id: 3,
    category: "NVR / DVR Kayıt Cihazı",
    name: "16 Kanal 4K NVR Sistem",
    description:
      "16 IP kamera desteği, 8TB HDD kapasiteli, uzaktan erişimli profesyonel NVR.",
    price: "₺4.200",
    badge: "Profesyonel",
    badgeColor: "bg-purple-600",
    icon: (
      <svg viewBox="0 0 64 64" fill="none" className="w-16 h-16">
        <rect
          x="8"
          y="18"
          width="48"
          height="28"
          rx="4"
          stroke="#2d8de8"
          strokeWidth="2"
          fill="#1a6bc8"
          opacity="0.15"
        />
        <rect
          x="14"
          y="24"
          width="8"
          height="6"
          rx="1"
          fill="#2d8de8"
          opacity="0.5"
        />
        <rect
          x="26"
          y="24"
          width="8"
          height="6"
          rx="1"
          fill="#2d8de8"
          opacity="0.5"
        />
        <rect
          x="38"
          y="24"
          width="8"
          height="6"
          rx="1"
          fill="#2d8de8"
          opacity="0.5"
        />
        <rect
          x="14"
          y="34"
          width="20"
          height="4"
          rx="1"
          fill="#2d8de8"
          opacity="0.3"
        />
        <circle cx="46" cy="36" r="3" fill="#2d8de8" />
      </svg>
    ),
  },
  {
    id: 4,
    category: "Kapı Güvenliği",
    name: "Akıllı Video Kapı Zili",
    description:
      "1080p kameralı, iki yönlü sesli, Wi-Fi bağlantılı akıllı kapı görüntüleme sistemi.",
    price: "₺1.290",
    badge: "İndirimde",
    badgeColor: "bg-orange-600",
    icon: (
      <svg viewBox="0 0 64 64" fill="none" className="w-16 h-16">
        <rect
          x="20"
          y="8"
          width="24"
          height="40"
          rx="4"
          stroke="#2d8de8"
          strokeWidth="2"
          fill="#1a6bc8"
          opacity="0.15"
        />
        <circle cx="32" cy="24" r="7" stroke="#2d8de8" strokeWidth="1.5" />
        <circle cx="32" cy="24" r="3" fill="#2d8de8" />
        <rect
          x="26"
          y="36"
          width="12"
          height="4"
          rx="2"
          fill="#2d8de8"
          opacity="0.5"
        />
        <circle cx="32" cy="52" r="3" stroke="#2d8de8" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    id: 5,
    category: "Alarm Sistemi",
    name: "Kablosuz Alarm Sistemi",
    description:
      "8 bölgeli, GSM + internet destekli, uygulama kontrolüyle yönetilebilen alarm paketi.",
    price: "₺3.100",
    badge: "Çok Satan",
    badgeColor: "bg-blue-600",
    icon: (
      <svg viewBox="0 0 64 64" fill="none" className="w-16 h-16">
        <path
          d="M32 8 L52 18 L52 36 C52 46 42 54 32 58 C22 54 12 46 12 36 L12 18 Z"
          stroke="#2d8de8"
          strokeWidth="2"
          fill="#1a6bc8"
          opacity="0.15"
        />
        <path
          d="M26 32 L30 36 L38 28"
          stroke="#2d8de8"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    id: 6,
    category: "Otomasyon",
    name: "Akıllı Ev Otomasyon Paketi",
    description:
      "Aydınlatma, perde, ısıtma ve güvenlik entegrasyonlu komple akıllı ev çözümü.",
    price: "₺8.500",
    badge: "Premium",
    badgeColor: "bg-yellow-600",
    icon: (
      <svg viewBox="0 0 64 64" fill="none" className="w-16 h-16">
        <path
          d="M32 10 L56 28 L56 54 L8 54 L8 28 Z"
          stroke="#2d8de8"
          strokeWidth="2"
          fill="#1a6bc8"
          opacity="0.15"
        />
        <rect
          x="24"
          y="38"
          width="16"
          height="16"
          rx="2"
          fill="#2d8de8"
          opacity="0.3"
        />
        <circle cx="32" cy="28" r="5" stroke="#2d8de8" strokeWidth="1.5" />
        <path
          d="M32 23 L32 20 M39 26 L42 24 M25 26 L22 24"
          stroke="#2d8de8"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
];

const services = [
  {
    title: "Montaj & Kurulum",
    description:
      "Uzman ekibimizle profesyonel montaj, kablolama ve devreye alma hizmetleri.",
    icon: <Wrench className="w-7 h-7 text-blue-400" />,
  },
  {
    title: "7/24 Teknik Destek",
    description:
      "Telefon, uzaktan bağlantı veya yerinde servis ile kesintisiz teknik destek.",
    icon: <Headset className="w-7 h-7 text-blue-400" />,
  },
  {
    title: "Bakım & Onarım",
    description:
      "Periyodik bakım sözleşmeleri ve arızalı cihazlar için hızlı onarım hizmeti.",
    icon: <Settings className="w-7 h-7 text-blue-400" />,
  },
  {
    title: "Ücretsiz Keşif",
    description:
      "Projeniz için yerinde inceleme, ihtiyaç analizi ve teklif hazırlama hizmeti.",
    icon: <Search className="w-7 h-7 text-blue-400" />,
  },
];

const stats = [
  { value: "15+", label: "Yıl Deneyim" },
  { value: "5.000+", label: "Mutlu Müşteri" },
  { value: "200+", label: "Ürün Çeşidi" },
  { value: "7/24", label: "Teknik Destek" },
];

// ─── Component ───────────────────────────────────────────────────────────────

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeCategory, setActiveCategory] = useState("Tümü");

  const categories = [
    "Tümü",
    "Güvenlik Kamerası",
    "Uydu Anteni",
    "NVR / DVR Kayıt Cihazı",
    "Kapı Güvenliği",
    "Alarm Sistemi",
    "Otomasyon",
  ];

  const filteredProducts =
    activeCategory === "Tümü"
      ? products
      : products.filter((p) => p.category === activeCategory);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-x-hidden">
      {/* ── Navbar ── */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 nav-blur [transition:background-color_300ms,box-shadow_300ms] ${
          scrolled
            ? "bg-black/70 border-b border-white/10 shadow-lg shadow-black/30"
            : "bg-transparent border-b border-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18 py-3">
            {/* Logo */}
            <a href="#hero" className="flex items-center gap-3">
              <Image
                src="/logo.png"
                alt="MSY Elektronik Logo"
                width={56}
                height={56}
                className="rounded-lg object-contain"
                priority
              />
              <div className="hidden sm:block">
                <div className="text-lg font-bold text-white leading-tight">
                  MSY Elektronik
                </div>
                <div className="text-xs text-blue-400 font-medium tracking-wider">
                  UYDU | GÜVENLİK | OTOMASYON
                </div>
              </div>
            </a>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-sm font-medium text-gray-300 hover:text-blue-400 transition-colors duration-200 relative group"
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 group-hover:w-full transition-all duration-300" />
                </a>
              ))}
              <a
                href="#contact"
                className="ml-2 px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-colors duration-200 shadow-lg shadow-blue-900/30"
              >
                Teklif Al
              </a>
            </nav>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 rounded-md text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Menüyü aç"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                {menuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden bg-black/90 border-t border-white/10 px-4 py-4 space-y-2">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="block px-4 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-colors text-sm font-medium"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#contact"
              onClick={() => setMenuOpen(false)}
              className="block mt-2 px-4 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-semibold text-center"
            >
              Teklif Al
            </a>
          </div>
        )}
      </header>

      {/* ── Hero Section ── */}
      <section
        id="hero"
        className="relative flex flex-col justify-center overflow-hidden"
        style={{ minHeight: "100svh" }}
      >
        {/* Background: dark grid + gradient */}
        <div className="absolute inset-0 z-0">
          {/* Dark base */}
          <div className="absolute inset-0 bg-[#080c14]" />

          {/* Grid overlay */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `linear-gradient(rgba(26,107,200,0.3) 1px, transparent 1px),
                                linear-gradient(90deg, rgba(26,107,200,0.3) 1px, transparent 1px)`,
              backgroundSize: "60px 60px",
            }}
          />

          {/* Blue glow blobs */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-blue-700/20 blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-blue-500/15 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-blue-900/10 blur-3xl" />

          {/* Scan line effect */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div
              className="scan-line absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/40 to-transparent"
              style={{ top: 0 }}
            />
          </div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center pt-28 pb-20">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/40 bg-blue-500/10 text-blue-400 text-[10px] sm:text-xs font-semibold tracking-widest uppercase mb-5 fade-in-up fade-in-up-delay-1">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse shrink-0" />
            <span>Türkiye&apos;nin Güvenilir Elektronik Partneri</span>
          </div>

          {/* Logo */}
          <div className="relative mb-5 fade-in-up fade-in-up-delay-1">
            <div className="absolute inset-0 rounded-2xl bg-blue-600/20 blur-xl scale-110" />
            <Image
              src="/logo.png"
              alt="MSY Elektronik"
              width={200}
              height={200}
              className="relative rounded-2xl object-contain h-auto
                         w-[140px]
                         sm:w-[160px]
                         lg:w-[200px]"
              priority
            />
          </div>

          {/* Headline */}
          <h1
            className="font-bold leading-[1.1] mb-4 fade-in-up fade-in-up-delay-2"
            style={{ fontSize: "clamp(1.9rem, 5vw, 3.75rem)" }}
          >
            <span className="text-white block">Güvenliğiniz</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-200 block">
              Bizim Önceliğimiz
            </span>
          </h1>

          {/* Subtitle */}
          <p
            className="text-gray-400 leading-relaxed mb-7 fade-in-up fade-in-up-delay-3 max-w-md mx-auto"
            style={{ fontSize: "clamp(0.85rem, 2vw, 1.05rem)" }}
          >
            Güvenlik kameraları, uydu sistemleri ve otomasyon çözümlerinde
            <span className="text-blue-400 font-semibold">
              {" "}
              15 yılı aşkın deneyim
            </span>{" "}
            ile evinizi ve işyerinizi koruyoruz.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto justify-center fade-in-up fade-in-up-delay-4">
            <a
              href="#products"
              className="inline-flex items-center justify-center gap-2
                         px-6 py-3 rounded-xl
                         bg-blue-600 hover:bg-blue-500
                         text-white font-semibold
                         transition-all duration-200
                         shadow-lg shadow-blue-900/40 hover:-translate-y-0.5
                         text-sm sm:text-base w-full sm:w-auto"
            >
              <svg
                className="w-4 h-4 shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              Ürünleri Keşfet
            </a>
            <a
              href="#contact"
              className="inline-flex items-center justify-center gap-2
                         px-6 py-3 rounded-xl
                         border border-white/20 hover:border-blue-500/50
                         text-white font-semibold
                         transition-all duration-200 hover:bg-white/5 hover:-translate-y-0.5
                         text-sm sm:text-base w-full sm:w-auto"
            >
              <svg
                className="w-4 h-4 shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 7V5z"
                />
              </svg>
              Bizi Arayın
            </a>
          </div>

          {/* Stats Bar */}
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 w-full max-w-sm sm:max-w-full mx-auto">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col items-center gap-0.5 p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm"
              >
                <div className="text-lg sm:text-xl font-bold text-blue-400 leading-tight">
                  {stat.value}
                </div>
                <div className="text-[9px] sm:text-[10px] text-gray-400 font-medium text-center leading-tight">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator — hidden on very short screens */}
        <div className="hidden sm:flex absolute bottom-5 left-1/2 -translate-x-1/2 flex-col items-center gap-1.5 text-gray-500 z-10">
          <span className="text-[9px] tracking-widest uppercase">Keşfet</span>
          <div className="w-5 h-7 border-2 border-gray-600 rounded-full flex justify-center pt-1">
            <div className="w-1 h-1.5 bg-blue-400 rounded-full animate-bounce" />
          </div>
        </div>
      </section>

      {/* ── Products Section ── */}
      <section id="products" className="py-24 relative">
        {/* Background decoration */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
          <div className="absolute -top-40 right-0 w-96 h-96 rounded-full bg-blue-900/10 blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Section Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-xs font-semibold tracking-widest uppercase mb-4">
              Ürün Kataloğu
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold text-white mb-4">
              Öne Çıkan{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-200">
                Ürünlerimiz
              </span>
            </h2>
            <p className="text-gray-400 text-lg max-w-xl mx-auto">
              En son teknoloji ile donatılmış güvenlik ve otomasyon ürünleri.
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 justify-center mb-10">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border ${
                  activeCategory === cat
                    ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-900/30"
                    : "border-white/15 text-gray-400 hover:text-white hover:border-white/30 bg-white/5"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="product-card group relative rounded-2xl border border-white/10 bg-white/5 overflow-hidden cursor-pointer"
              >
                {/* Card top glow line */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Badge */}
                <div
                  className={`absolute top-4 right-4 px-2.5 py-0.5 rounded-full text-xs font-bold text-white ${product.badgeColor}`}
                >
                  {product.badge}
                </div>

                <div className="p-6">
                  {/* Icon */}
                  <div className="w-20 h-20 rounded-xl bg-blue-900/30 border border-blue-500/20 flex items-center justify-center mb-5 group-hover:border-blue-500/50 transition-colors duration-300">
                    {product.icon}
                  </div>

                  {/* Category */}
                  <div className="text-blue-400 text-xs font-semibold uppercase tracking-wider mb-1">
                    {product.category}
                  </div>

                  {/* Name */}
                  <h3 className="text-white font-bold text-lg mb-2 leading-tight group-hover:text-blue-100 transition-colors duration-200">
                    {product.name}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-400 text-sm leading-relaxed mb-5">
                    {product.description}
                  </p>

                  {/* Price + Button */}
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs text-gray-500 mb-0.5">Fiyat</div>
                      <div className="text-2xl font-bold text-white">
                        {product.price}
                      </div>
                    </div>
                    <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-colors duration-200 shadow-lg shadow-blue-900/30">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                        />
                      </svg>
                      Sepete Ekle
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* View All CTA */}
          <div className="text-center mt-12">
            <a
              href="#contact"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl border border-blue-500/40 hover:border-blue-400 text-blue-400 hover:text-blue-300 font-semibold transition-all duration-200 hover:bg-blue-500/10"
            >
              Tüm Ürün Kataloğu
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* ── Services Section ── */}
      <section
        id="services"
        className="py-24 relative bg-gradient-to-b from-transparent via-blue-950/10 to-transparent"
      >
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-xs font-semibold tracking-widest uppercase mb-4">
              Hizmetlerimiz
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold text-white mb-4">
              Size Özel{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-200">
                Çözümler
              </span>
            </h2>
            <p className="text-gray-400 text-lg max-w-xl mx-auto">
              Satış sonrası destek dahil, uçtan uca hizmet anlayışıyla
              yanınızdayız.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, i) => (
              <div
                key={i}
                className="group p-6 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/8 hover:border-blue-500/30 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center mb-5 group-hover:bg-blue-600/30 group-hover:border-blue-400/50 transition-all duration-300">
                  {service.icon}
                </div>
                <h3 className="text-white font-bold text-lg mb-2 group-hover:text-blue-200 transition-colors">
                  {service.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── About Section ── */}
      <section id="about" className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 -translate-y-1/2 -left-32 w-96 h-96 rounded-full bg-blue-700/10 blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: Text */}
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-xs font-semibold tracking-widest uppercase mb-6">
                Hakkımızda
              </div>
              <h2 className="text-3xl sm:text-5xl font-bold text-white mb-6 leading-tight">
                15 Yıllık{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-200">
                  Güven ve Deneyim
                </span>
              </h2>
              <p className="text-gray-400 text-lg leading-relaxed mb-6">
                MSY Elektronik olarak, 2009 yılından bu yana uydu sistemleri,
                güvenlik kameraları ve ev/iş yeri otomasyon sistemleri alanında
                hizmet vermekteyiz.
              </p>
              <p className="text-gray-400 text-lg leading-relaxed mb-8">
                Deneyimli ekibimiz ve geniş ürün yelpazemizle hem bireysel hem
                de kurumsal müşterilerimize en iyi çözümleri sunmayı
                hedefliyoruz.
              </p>

              <div className="grid grid-cols-2 gap-4">
                {[
                  "Lisanslı Teknik Servis",
                  "Orijinal Ürün Garantisi",
                  "Ücretsiz Keşif & Teklif",
                  "Taksitli Ödeme İmkânı",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-2 text-sm text-gray-300"
                  >
                    <svg
                      className="w-4 h-4 text-blue-400 shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Visual */}
            <div className="relative">
              {/* Background card */}
              <div className="relative rounded-2xl border border-white/10 bg-gradient-to-br from-blue-900/20 to-transparent p-8 overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />

                {/* Logo center */}
                <div className="flex justify-center mb-8">
                  <div className="relative">
                    <div className="absolute inset-0 rounded-2xl bg-blue-500/20 blur-2xl" />
                    <Image
                      src="/logo.png"
                      alt="MSY Elektronik"
                      width={200}
                      height={200}
                      className="relative rounded-2xl object-contain"
                    />
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-3">
                  {stats.map((stat) => (
                    <div
                      key={stat.label}
                      className="rounded-xl bg-white/5 border border-white/10 p-4 text-center"
                    >
                      <div className="text-3xl font-bold text-blue-400 mb-1">
                        {stat.value}
                      </div>
                      <div className="text-xs text-gray-400">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/40 via-blue-800/30 to-blue-900/40" />
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                                linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
              backgroundSize: "40px 40px",
            }}
          />
        </div>
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-400/50 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-400/50 to-transparent" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-5xl font-bold text-white mb-4">
            Güvenliğiniz İçin{" "}
            <span className="text-blue-300">Bugün Başlayın</span>
          </h2>
          <p className="text-blue-200/80 text-lg mb-8 max-w-xl mx-auto">
            Ücretsiz keşif ve danışmanlık için hemen iletişime geçin.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:+905001234567"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-white text-blue-900 font-bold text-base hover:bg-blue-50 transition-colors duration-200 shadow-xl"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 7V5z"
                />
              </svg>
              Hemen Ara
            </a>
            <a
              href="#contact"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border-2 border-white/40 hover:border-white text-white font-bold text-base transition-colors duration-200 hover:bg-white/10"
            >
              Teklif Formu
            </a>
          </div>
        </div>
      </section>

      {/* ── Contact Section ── */}
      <section id="contact" className="py-24 relative">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
          <div className="absolute bottom-1/3 right-0 w-72 h-72 rounded-full bg-blue-700/10 blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-xs font-semibold tracking-widest uppercase mb-4">
              İletişim
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold text-white mb-4">
              Bizimle{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-200">
                İletişime Geçin
              </span>
            </h2>
            <p className="text-gray-400 text-lg max-w-xl mx-auto">
              Sorularınız veya teklifleriniz için aşağıdaki formu doldurun.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div className="space-y-6">
              {[
                {
                  icon: (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 7V5z"
                      />
                    </svg>
                  ),
                  label: "Telefon",
                  value: "+90 500 123 45 67",
                  href: "tel:+905001234567",
                },
                {
                  icon: (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  ),
                  label: "E-posta",
                  value: "info@msyelektronik.com",
                  href: "mailto:info@msyelektronik.com",
                },
                {
                  icon: (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  ),
                  label: "Adres",
                  value: "Örnek Mah. Elektronik Cad. No:1, İstanbul",
                  href: "#",
                },
                {
                  icon: (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  ),
                  label: "Çalışma Saatleri",
                  value: "Pzt–Cmt: 09:00 – 18:00",
                  href: "#",
                },
              ].map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="group flex items-start gap-4 p-5 rounded-xl border border-white/10 bg-white/5 hover:border-blue-500/30 hover:bg-white/8 transition-all duration-200"
                >
                  <div className="w-10 h-10 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0 group-hover:bg-blue-600/30 transition-colors">
                    {item.icon}
                  </div>
                  <div>
                    <div className="text-xs text-blue-400 font-semibold uppercase tracking-wider mb-0.5">
                      {item.label}
                    </div>
                    <div className="text-white font-medium">{item.value}</div>
                  </div>
                </a>
              ))}
            </div>

            {/* Contact Form */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-8">
              <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Ad Soyad
                    </label>
                    <input
                      type="text"
                      placeholder="Adınızı girin"
                      className="w-full px-4 py-3 rounded-lg bg-white/8 border border-white/15 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Telefon
                    </label>
                    <input
                      type="tel"
                      placeholder="0500 000 00 00"
                      className="w-full px-4 py-3 rounded-lg bg-white/8 border border-white/15 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    E-posta
                  </label>
                  <input
                    type="email"
                    placeholder="ornek@email.com"
                    className="w-full px-4 py-3 rounded-lg bg-white/8 border border-white/15 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Konu
                  </label>
                  <select className="w-full px-4 py-3 rounded-lg bg-[#0d1117] border border-white/15 text-white text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-colors appearance-none">
                    <option value="">Konu seçin</option>
                    <option>Güvenlik Kamerası</option>
                    <option>Uydu Sistemi</option>
                    <option>Otomasyon</option>
                    <option>Teknik Destek</option>
                    <option>Genel Bilgi</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Mesajınız
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Projenizi veya ihtiyacınızı kısaca açıklayın..."
                    className="w-full px-4 py-3 rounded-lg bg-white/8 border border-white/15 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-base transition-all duration-200 shadow-xl shadow-blue-900/40"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                    />
                  </svg>
                  Mesaj Gönder
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-white/10 bg-black/40 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
            {/* Brand */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <Image
                  src="/logo.png"
                  alt="MSY Elektronik"
                  width={48}
                  height={48}
                  className="rounded-lg object-contain"
                />
                <div>
                  <div className="font-bold text-white">MSY Elektronik</div>
                  <div className="text-xs text-blue-400 font-medium tracking-wider">
                    UYDU | GÜVENLİK | OTOMASYON
                  </div>
                </div>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
                2009&apos;dan bu yana güvenlik ve otomasyon sistemlerinde
                güvenilir çözümler sunuyoruz.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-white font-semibold mb-4">Hızlı Erişim</h4>
              <ul className="space-y-2">
                {navLinks.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-gray-400 hover:text-blue-400 text-sm transition-colors duration-200"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-white font-semibold mb-4">İletişim</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a
                    href="tel:+905001234567"
                    className="hover:text-blue-400 transition-colors"
                  >
                    +90 500 123 45 67
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:info@msyelektronik.com"
                    className="hover:text-blue-400 transition-colors"
                  >
                    info@msyelektronik.com
                  </a>
                </li>
                <li className="text-gray-500">Pzt–Cmt: 09:00 – 18:00</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 text-xs">
              © {new Date().getFullYear()} MSY Elektronik. Tüm hakları saklıdır.
            </p>
            <div className="flex items-center gap-1 text-gray-600 text-xs">
              <span>Uydu</span>
              <span className="text-blue-600 mx-1">|</span>
              <span>Güvenlik</span>
              <span className="text-blue-600 mx-1">|</span>
              <span>Otomasyon</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
