"use client";

import Image from "next/image";
import { useCartStore } from "@/store/cartStore";
import { Button } from "@/components/ui";
import { Trash2, ArrowRight, Minus, Plus } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function CartPage() {
  const { items, updateQuantity, removeItem, getTotalPrice } = useCartStore();
  const totalPrice = getTotalPrice();

  return (
    <div className="dark min-h-screen bg-[#0a0a0a] text-white flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Sepetim</h1>
          <p className="text-gray-400 mt-2">
            Teklif almak istediğiniz ürünleri gözden geçirin.
          </p>
        </div>

        {items.length === 0 ? (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center">
            <div className="w-20 h-20 bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-10 h-10 text-blue-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-bold mb-2">Sepetiniz boş</h2>
            <p className="text-gray-400 mb-8">
              Henüz teklif almak için ürün seçmediniz.
            </p>
            <Link href="/#products">
              <Button size="lg">Ürünlere Göz At</Button>
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl p-4"
                >
                  <div className="relative w-20 h-20 bg-gray-900 rounded-xl overflow-hidden shrink-0 border border-white/10">
                    {item.imageUrl ? (
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-gray-500 text-xs">
                        Fotoğraf Yok
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg leading-tight mb-1">
                      {item.name}
                    </h3>
                    <p className="text-sm text-gray-400">{item.category}</p>
                    <div className="text-blue-400 font-semibold mt-1">
                      ₺{item.price.toLocaleString("tr-TR")}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center bg-black/50 rounded-lg border border-white/10">
                      <button
                        onClick={() =>
                          item.quantity > 1 &&
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        className="p-2 text-gray-400 hover:text-white transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center text-sm font-semibold">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        className="p-2 text-gray-400 hover:text-white transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 sticky top-32">
                <h3 className="text-xl font-bold mb-6">Teklif Özeti</h3>

                <div className="space-y-3 text-sm text-gray-400 mb-6">
                  <div className="flex justify-between">
                    <span>Ara Toplam</span>
                    <span>₺{totalPrice.toLocaleString("tr-TR")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>KDV (%20)</span>
                    <span>
                      ₺{Math.round(totalPrice * 0.2).toLocaleString("tr-TR")}
                    </span>
                  </div>
                  <div className="h-px bg-white/10 my-4" />
                  <div className="flex justify-between text-lg font-bold text-white">
                    <span>Toplam</span>
                    <span className="text-blue-400">
                      ₺{Math.round(totalPrice * 1.2).toLocaleString("tr-TR")}
                    </span>
                  </div>
                </div>

                <Link href="/quote">
                  <Button
                    size="lg"
                    className="w-full"
                    rightIcon={<ArrowRight className="w-5 h-5" />}
                  >
                    Teklif İsteğine İlerle
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
