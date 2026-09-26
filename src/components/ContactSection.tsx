"use client";

import Link from "next/link";
import { useState } from "react";
import { submitContactMessage } from "@/app/actions/contact";



export default function ContactSection({ phone = '+90 500 123 45 67', email = 'info@msyelektronik.com', address = 'Örnek Mah. Elektronik Cad. No:1, İstanbul' }: { phone?: string; email?: string; address?: string }) {
  const formattedPhoneForHref = phone.replace(/[^0-9+]/g, '');

  const contactItems = [
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
    value: phone,
    href: `tel:${formattedPhoneForHref}`,
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
    value: email,
    href: `mailto:${email}`,
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
    value: address,
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
];
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const formData = new FormData(e.currentTarget);
      await submitContactMessage(formData);
      setSuccess(true);
      (e.target as HTMLFormElement).reset();
    } catch (err: any) {
      setError(err.message || "Bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-24 relative">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
        <div className="absolute bottom-1/3 right-0 w-72 h-72 rounded-full bg-blue-700/10 blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
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
            {contactItems.map((item) => (
              <Link
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
              </Link>
            ))}
          </div>

          {/* Contact Form */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-8">
            {success ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12">
                <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 mb-2">
                  <svg
                    className="w-8 h-8"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white">
                  Mesajınız Alındı!
                </h3>
                <p className="text-gray-400">
                  Size en kısa sürede dönüş yapacağız. İlginiz için teşekkür
                  ederiz.
                </p>
                <button
                  onClick={() => setSuccess(false)}
                  className="mt-6 px-6 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium transition-colors"
                >
                  Yeni Mesaj Gönder
                </button>
              </div>
            ) : (
              <form className="space-y-5" onSubmit={handleSubmit}>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Ad Soyad
                    </label>
                    <input
                      name="name"
                      type="text"
                      required
                      placeholder="Adınızı girin"
                      className="w-full px-4 py-3 rounded-lg bg-white/8 border border-white/15 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Telefon
                    </label>
                    <input
                      name="phone"
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
                    name="email"
                    type="email"
                    required
                    placeholder="ornek@email.com"
                    className="w-full px-4 py-3 rounded-lg bg-white/8 border border-white/15 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Konu
                  </label>
                  <select
                    name="subject"
                    className="w-full px-4 py-3 rounded-lg bg-[#0d1117] border border-white/15 text-white text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-colors appearance-none"
                  >
                    <option value="">Konu seçin</option>
                    <option value="Güvenlik Kamerası">Güvenlik Kamerası</option>
                    <option value="Uydu Sistemi">Uydu Sistemi</option>
                    <option value="Otomasyon">Otomasyon</option>
                    <option value="Teknik Destek">Teknik Destek</option>
                    <option value="Genel Bilgi">Genel Bilgi</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Mesajınız
                  </label>
                  <textarea
                    name="message"
                    required
                    rows={4}
                    placeholder="Projenizi veya ihtiyacınızı kısaca açıklayın..."
                    className="w-full px-4 py-3 rounded-lg bg-white/8 border border-white/15 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-colors resize-none"
                  />
                </div>

                {error && (
                  <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-base transition-all duration-200 shadow-xl shadow-blue-900/40 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
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
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
