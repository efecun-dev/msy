"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FileText, Package, CheckCircle, ShieldAlert } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ username: "", password: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await signIn("credentials", {
      username: form.username,
      password: form.password,
      redirect: false,
    });

    if (res?.error) {
      setError(res.error);
      setLoading(false);
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#f8f9fa] text-gray-900 font-sans">
      {/* LEFT SIDE - BRANDING (Hidden on Mobile) */}
      <div className="hidden md:flex w-full md:w-[45%] lg:w-[40%] bg-gradient-to-br from-[#0f2027] via-[#203a43] to-[#2c5364] text-white p-8 lg:p-12 flex-col justify-between">
        {/* Header */}
        <div>
          <div className="flex items-center gap-3 mb-16">
            <div className="w-10 h-10 bg-white/10 rounded flex items-center justify-center font-bold text-white text-sm border border-white/20">
              MS
            </div>
            <div>
              <h2 className="font-bold tracking-wide text-sm">
                MSY Elektronik
              </h2>
              <p className="text-[10px] uppercase tracking-widest text-white/60">
                Yönetim Paneli
              </p>
            </div>
          </div>

          <div className="inline-block px-3 py-1 border border-white/20 rounded-full text-[10px] font-semibold tracking-wider mb-6 bg-white/5">
            YÖNETİCİ PORTALI
          </div>

          <h1 className="text-3xl lg:text-4xl font-bold mb-4">
            Sisteme Hoş Geldiniz
          </h1>
          <p className="text-white/70 text-sm leading-relaxed mb-12 max-w-sm">
            İşinize başlamadan önce panelinize göz atın.
            <br />
            <br />
            Günlük teklifleri, stok durumunu ve siparişleri tek ekrandan
            yönetin.
          </p>

          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-white/80 shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <p className="text-sm font-medium text-white/90">
                Gelen teklifleri inceleyin
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-white/80 shrink-0">
                <Package className="w-5 h-5" />
              </div>
              <p className="text-sm font-medium text-white/90">
                Stok ve ürün takibi yapın
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-white/80 shrink-0">
                <CheckCircle className="w-5 h-5" />
              </div>
              <p className="text-sm font-medium text-white/90">
                Tamamlanan siparişleri işaretleyin
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 text-xs text-white/40">
          © {new Date().getFullYear()} MSY Elektronik - Yalnızca yetkili
          personel içindir
        </div>
      </div>

      {/* RIGHT SIDE - LOGIN FORM */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-8 lg:p-12 relative min-h-screen md:min-h-0 bg-white md:bg-transparent">
        <div className="w-full max-w-md">
          {/* Mobile Only Header */}
          <div className="md:hidden flex items-center gap-3 mb-10 pb-6 border-b border-gray-100">
            <div className="w-10 h-10 bg-gray-900 rounded flex items-center justify-center font-bold text-white text-sm">
              MS
            </div>
            <div>
              <h2 className="font-bold tracking-wide text-sm text-gray-900">
                MSY Elektronik
              </h2>
              <p className="text-[10px] uppercase tracking-widest text-gray-500">
                Yönetim Paneli
              </p>
            </div>
          </div>

          <div className="mb-8 md:mb-10">
            <p className="text-blue-600 font-bold text-xs tracking-wider uppercase mb-2">
              Hoş Geldiniz
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              Yönetici Girişi
            </h2>
            <p className="text-sm text-gray-500">
              Devam etmek için size tanımlanan yönetici bilgileriyle giriş
              yapın.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700">
                Kullanıcı Adı
              </label>
              <input
                type="text"
                required
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                placeholder="Örn. mehmet"
                className="w-full px-4 py-3 sm:py-3.5 bg-[#f8f9fa] md:bg-white border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700">
                Şifre
              </label>
              <input
                type="password"
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••"
                className="w-full px-4 py-3 sm:py-3.5 bg-[#f8f9fa] md:bg-white border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-xs font-medium text-gray-700">
                  Beni hatırla
                </span>
              </label>
              <button
                type="button"
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
              >
                Şifremi unuttum
              </button>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-100 rounded-lg flex items-center gap-2 text-red-600 text-xs font-semibold mt-2">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 sm:py-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold rounded-lg text-sm transition-all flex items-center justify-center shadow-md disabled:opacity-70 disabled:cursor-not-allowed mt-6"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                "Giriş yap"
              )}
            </button>
          </form>

          <div className="mt-10 sm:mt-12 text-center text-xs text-gray-500">
            Hesap bilgilerinizle ilgili bir sorun mu var?
            <br className="hidden sm:block" />
            <span className="sm:hidden"> </span>Yöneticinizle ya da{" "}
            <span className="font-semibold text-blue-600 cursor-pointer hover:underline">
              IT destek
            </span>{" "}
            ile iletişime geçin.
          </div>
        </div>
      </div>
    </div>
  );
}
