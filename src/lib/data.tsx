import { Wrench, Headset, Settings, Search } from "lucide-react";

// ─── Nav Links ────────────────────────────────────────────────────────────────

export const navLinks = [
  { label: "Anasayfa", href: "/#hero" },
  { label: "Ürünler", href: "/#products" },
  { label: "Hizmetler", href: "/#services" },
  { label: "Hakkımızda", href: "/#about" },
  { label: "İletişim", href: "/#contact" },
];

// ─── Stats ────────────────────────────────────────────────────────────────────

export const stats = [
  { value: "15+", label: "Yıl Deneyim" },
  { value: "5.000+", label: "Mutlu Müşteri" },
  { value: "200+", label: "Ürün Çeşidi" },
  { value: "7/24", label: "Teknik Destek" },
];

// ─── Products ─────────────────────────────────────────────────────────────────

export const products = [
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

export const productCategories = [
  "Tümü",
  "Güvenlik Kamerası",
  "Uydu Anteni",
  "NVR / DVR Kayıt Cihazı",
  "Kapı Güvenliği",
  "Alarm Sistemi",
  "Otomasyon",
];

// ─── Services ─────────────────────────────────────────────────────────────────

export const services = [
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
