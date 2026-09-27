"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { navLinks } from "@/lib/data";
import { ShoppingCart, User } from "lucide-react";
import { useCartStore } from "@/store/cartStore";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const totalItems = useCartStore((state) => state.getTotalItems());

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
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
          <Link href="/#hero" className="flex items-center gap-3">
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
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-gray-300 hover:text-blue-400 transition-colors duration-200 relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 group-hover:w-full transition-all duration-300" />
              </Link>
            ))}

            <Link
              href="/cart"
              className="relative text-gray-300 hover:text-white transition-colors duration-200"
            >
              <ShoppingCart className="w-5 h-5" />
              {mounted && totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>

            <Link
              href="/#contact"
              className="ml-2 px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-colors duration-200 shadow-lg shadow-blue-900/30"
            >
              İletişim
            </Link>
            <Link
              href="/dashboard"
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-colors duration-200"
              title="Yönetim Paneli"
            >
              <User className="w-5 h-5" />
            </Link>
          </nav>

          {/* Mobile Right Icons */}
          <div className="flex items-center gap-4 md:hidden">
            <Link
              href="/cart"
              className="relative text-gray-300 hover:text-white transition-colors duration-200"
            >
              <ShoppingCart className="w-5 h-5" />
              {mounted && totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-1 rounded-md text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Menüyü aç"
            >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {menuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-black/90 border-t border-white/10 px-4 py-4 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="block px-4 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-colors text-sm font-medium"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-2 flex flex-col gap-2">
            <Link
              href="/#contact"
              onClick={() => setMenuOpen(false)}
              className="block px-4 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-semibold text-center"
            >
              Teklif Al
            </Link>
            <Link
              href="/dashboard"
              onClick={() => setMenuOpen(false)}
              className="flex justify-center items-center px-4 py-2.5 rounded-lg bg-white/10 border border-white/20 text-white transition-colors"
              title="Yönetim Paneli"
            >
              <User className="w-5 h-5" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
