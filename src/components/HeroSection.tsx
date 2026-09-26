import Image from "next/image";
import Link from "next/link";
import { stats } from "@/lib/data";

export default function HeroSection() {
  return (
    <section
      id="hero"
      className="relative flex flex-col justify-center overflow-hidden"
      style={{ minHeight: "100svh" }}
    >
      {/* Background */}
      <div className="absolute inset-0 z-0">
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

        {/* Scan line */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="scan-line absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/40 to-transparent"
            style={{ top: 0 }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center pt-28 pb-20">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/40 bg-blue-500/10 text-blue-400 text-[10px] sm:text-xs font-semibold tracking-widest uppercase mb-5 fade-in-up fade-in-up-delay-1">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse shrink-0" />
          <span>Türkiye&apos;nin Güvenilir Elektronik Partneri</span>
        </div>

        {/* Logo */}
        <div className="relative mb-5 fade-in-up fade-in-up-delay-1">
          <Image
            src="/logo.png"
            alt="MSY Elektronik"
            width={200}
            height={200}
            className="relative rounded-2xl object-contain h-auto w-[140px] sm:w-[160px] lg:w-[200px]"
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
          <Link
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
          </Link>
          <Link
            href="/#contact"
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
          </Link>
        </div>

        {/* Stats */}
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

      {/* Scroll indicator */}
      <div className="hidden sm:flex absolute bottom-5 left-1/2 -translate-x-1/2 flex-col items-center gap-1.5 text-gray-500 z-10">
        <span className="text-[9px] tracking-widest uppercase">Keşfet</span>
        <div className="w-5 h-7 border-2 border-gray-600 rounded-full flex justify-center pt-1">
          <div className="w-1 h-1.5 bg-blue-400 rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  );
}
