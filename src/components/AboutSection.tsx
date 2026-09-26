import Image from "next/image";
import { stats } from "@/lib/data";

const features = [
  "Lisanslı Teknik Servis",
  "Orijinal Ürün Garantisi",
  "Ücretsiz Keşif & Teklif",
  "Taksitli Ödeme İmkânı",
];

export default function AboutSection() {
  return (
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
              Deneyimli ekibimiz ve geniş ürün yelpazemizle hem bireysel hem de
              kurumsal müşterilerimize en iyi çözümleri sunmayı hedefliyoruz.
            </p>

            <div className="grid grid-cols-2 gap-4">
              {features.map((item) => (
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
            <div className="relative rounded-2xl border border-white/10 bg-gradient-to-br from-blue-900/20 to-transparent p-8 overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />

              {/* Logo */}
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
  );
}
