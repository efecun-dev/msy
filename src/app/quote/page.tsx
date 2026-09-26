"use client";

import { useCartStore } from "@/store/cartStore";
import { Button, Input, Textarea } from "@/components/ui";
import { CheckCircle2, ShoppingCart, Info } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useToast } from "@/components/ui/Toast";

export default function QuotePage() {
  const { items, getTotalPrice, clearCart } = useCartStore();
  const totalPrice = getTotalPrice();
  const { toast } = useToast();

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [quoteNumber, setQuoteNumber] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    note: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    setLoading(true);
    try {
      const res = await fetch("/api/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: formData.name,
          customerPhone: formData.phone,
          customerEmail: formData.email,
          note: formData.note,
          items: items.map((i) => ({
            productId: i.id,
            quantity: i.quantity,
            unitPrice: i.price,
          })),
          totalAmount: Math.round(totalPrice * 1.2), // with KDV
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setQuoteNumber(data.quoteNumber);
        setSuccess(true);
        clearCart();
        toast({
          type: "success",
          title: "Başarılı",
          description: "Teklifiniz başarıyla oluşturuldu.",
        });
      } else {
        toast({
          type: "error",
          title: "Hata",
          description: data.error || "Bir hata oluştu.",
        });
      }
    } catch (err) {
      toast({
        type: "error",
        title: "Hata",
        description: "Bağlantı hatası oluştu. Lütfen tekrar deneyin.",
      });
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <div className="bg-[#0a0a0a]">
          <Navbar />
        </div>
        <main className="flex-1 max-w-2xl w-full mx-auto px-4 py-32 text-center flex flex-col items-center justify-center">
          <div className="bg-white p-12 rounded-3xl shadow-sm border border-gray-200 text-center w-full">
            <CheckCircle2 className="w-20 h-20 text-emerald-500 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Teklif Talebiniz Alındı!
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Teklif numaranız:{" "}
              <span className="text-blue-600 font-mono font-bold bg-blue-50 px-3 py-1 rounded-md">
                {quoteNumber}
              </span>
            </p>
            <p className="text-gray-500 mb-10">
              Müşteri temsilcilerimiz detayları görüşmek için en kısa sürede
              sizinle iletişime geçecektir. Bizi tercih ettiğiniz için teşekkür
              ederiz.
            </p>
            <Link href="/">
              <Button size="lg" className="w-full sm:w-auto">
                Anasayfaya Dön
              </Button>
            </Link>
          </div>
        </main>
        <div className="bg-[#0a0a0a]">
          <Footer />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="bg-[#0a0a0a]">
        <Navbar />
      </div>

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
            Teklif İsteği
          </h1>
          <p className="text-gray-500 mt-3 text-lg max-w-2xl">
            Lütfen iletişim bilgilerinizi girin. İlgili temsilcimiz size en kısa
            sürede dönüş yapacaktır.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-10">
          {/* Form */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 md:p-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  İletişim Bilgileri
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <Input
                      label="Adınız Soyadınız"
                      required
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                    />
                    <Input
                      label="Telefon Numaranız"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                    />
                  </div>

                  <Input
                    label="E-posta Adresiniz (Opsiyonel)"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />

                  <Textarea
                    label="Eklemek İstediğiniz Notlar (Opsiyonel)"
                    rows={4}
                    value={formData.note}
                    onChange={(e) =>
                      setFormData({ ...formData, note: e.target.value })
                    }
                    placeholder="Teklifinizle ilgili özel isteklerinizi belirtebilirsiniz..."
                  />

                  <div className="pt-4">
                    <Button
                      type="submit"
                      size="lg"
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-xl text-lg transition-all shadow-md shadow-blue-500/20"
                      loading={loading}
                      disabled={items.length === 0}
                    >
                      Teklif Talebini Gönder
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 sticky top-28 overflow-hidden">
              <div className="p-6 md:p-8 bg-gray-50/50 border-b border-gray-100 flex items-center gap-3">
                <ShoppingCart className="w-6 h-6 text-blue-600" />
                <h3 className="text-lg font-bold text-gray-900">Sepet Özeti</h3>
              </div>

              <div className="p-6 md:p-8">
                {items.length === 0 ? (
                  <div className="text-center py-10 text-gray-500">
                    <p>Sepetinizde ürün bulunmuyor.</p>
                    <Link
                      href="/"
                      className="text-blue-600 hover:underline mt-2 inline-block"
                    >
                      Ürünlere Göz At
                    </Link>
                  </div>
                ) : (
                  <>
                    <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 mb-6 scrollbar-thin scrollbar-thumb-gray-200">
                      {items.map((item) => (
                        <div
                          key={item.id}
                          className="flex justify-between items-start gap-4 text-sm group"
                        >
                          <div className="flex items-start gap-3 flex-1">
                            <span className="bg-gray-100 text-gray-700 font-semibold px-2 py-0.5 rounded text-xs min-w-[28px] text-center">
                              {item.quantity}x
                            </span>
                            <span className="font-medium text-gray-800 line-clamp-2">
                              {item.name}
                            </span>
                          </div>
                          <span className="text-gray-900 font-medium whitespace-nowrap">
                            ₺
                            {(item.price * item.quantity).toLocaleString(
                              "tr-TR",
                            )}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-gray-100 pt-6 space-y-3">
                      <div className="flex justify-between text-gray-500 text-sm">
                        <span>Ara Toplam</span>
                        <span>₺{totalPrice.toLocaleString("tr-TR")}</span>
                      </div>
                      <div className="flex justify-between text-gray-500 text-sm">
                        <span>KDV (%20)</span>
                        <span>
                          ₺
                          {Math.round(totalPrice * 0.2).toLocaleString("tr-TR")}
                        </span>
                      </div>

                      <div className="h-px bg-gray-200 my-4" />

                      <div className="flex justify-between items-end">
                        <span className="text-base font-bold text-gray-900">
                          Tahmini Toplam
                        </span>
                        <span className="text-2xl font-black text-blue-600">
                          ₺
                          {Math.round(totalPrice * 1.2).toLocaleString("tr-TR")}
                        </span>
                      </div>

                      <div className="flex items-start gap-2 mt-4 text-xs text-amber-700 bg-amber-50 p-3 rounded-lg border border-amber-200">
                        <Info className="w-4 h-4 shrink-0 mt-0.5" />
                        <p>
                          Fiyatlara KDV dahildir. Nihai fiyat, ürün montajı ve
                          ek hizmetler değerlendirildikten sonra görüşmede
                          netleştirilecektir.
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <div className="bg-[#0a0a0a]">
        <Footer />
      </div>
    </div>
  );
}
