import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, User, Phone, Mail, Calendar, Package } from "lucide-react";
import QuoteDetailClient from "@/components/admin/QuoteDetailClient";
import QuoteViewActions from "@/components/admin/QuoteViewActions";
import QuotePrintTemplate from "@/components/admin/QuotePrintTemplate";

export default async function QuoteDetailPage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const [quote, products] = await Promise.all([
    prisma.quote.findUnique({
      where: { id: parseInt(params.id) },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: true,
              },
            },
          },
        },
      },
    }),
    prisma.product.findMany({
      where: { isActive: true },
      select: {
        id: true,
        name: true,
        category: true,
        price: true,
        imageUrl: true,
        inStock: true,
        stockCount: true,
        images: {
          select: { url: true },
        },
      },
      orderBy: { name: "asc" },
    }),
  ]);

  if (!quote) return notFound();

  // Convert decimal values to numbers for serialization
  const serializedQuote = {
    ...quote,
    totalAmount: Number(quote.totalAmount),
    items: quote.items.map((item) => ({
      ...item,
      unitPrice: Number(item.unitPrice),
      product: {
        ...item.product,
        price: Number(item.product.price),
      },
    })),
  };

  const serializedProducts = products.map((p) => ({
    ...p,
    price: Number(p.price),
  }));

  return (
    <>
      {/* ─── YALNIZCA YAZDIRMADA / PDF ÇIKTISINDA GÖRÜNEN ŞABLON ─────────────── */}
      <div className="hidden print:block print:w-full print:m-0">
        <QuotePrintTemplate quote={serializedQuote} />
      </div>

      {/* ─── EKRANDA GÖRÜNEN YÖNETİCİ PANELİ GÖRÜNÜMÜ ───────────────────────── */}
      <div className="space-y-4 print:hidden">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-panel-6">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/quotes"
              className="p-1.5 rounded bg-panel-2 hover:bg-panel-3 border border-panel-6 text-panel-11 hover:text-panel-12 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <h1 className="text-sm font-bold flex items-center gap-2 text-panel-12">
                Teklif #{quote.quoteNumber}
                {quote.status === "PENDING" && (
                  <span className="px-1.5 py-0.5 bg-brand-3 text-brand-11 border border-brand-6 rounded text-[10px] font-bold uppercase tracking-wider">
                    Beklemede
                  </span>
                )}
                {quote.status === "CONTACTED" && (
                  <span className="px-1.5 py-0.5 bg-amber-500/20 text-amber-500 border border-amber-500/30 rounded text-[10px] font-bold uppercase tracking-wider">
                    Arandı
                  </span>
                )}
                {quote.status === "NEGOTIATING" && (
                  <span className="px-1.5 py-0.5 bg-orange-500/20 text-orange-500 border border-orange-500/30 rounded text-[10px] font-bold uppercase tracking-wider">
                    Görüşülüyor
                  </span>
                )}
                {quote.status === "ACCEPTED" && (
                  <span className="px-1.5 py-0.5 bg-emerald-500/20 text-emerald-500 border border-emerald-500/30 rounded text-[10px] font-bold uppercase tracking-wider">
                    Kabul Edildi
                  </span>
                )}
                {quote.status === "REJECTED" && (
                  <span className="px-1.5 py-0.5 bg-rose-500/20 text-rose-500 border border-rose-500/30 rounded text-[10px] font-bold uppercase tracking-wider">
                    Reddedildi
                  </span>
                )}
                {quote.status === "CANCELLED" && (
                  <span className="px-1.5 py-0.5 bg-panel-4 text-panel-11 border border-panel-6 rounded text-[10px] font-bold uppercase tracking-wider">
                    İptal
                  </span>
                )}
              </h1>
              <p className="text-panel-11 text-[11px] mt-0.5 flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {new Date(quote.createdAt).toLocaleString("tr-TR")}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 self-end sm:self-auto">
            <QuoteViewActions quote={serializedQuote} />
            <div className="text-right pl-3 border-l border-panel-6">
              <p className="text-[10px] text-panel-11 uppercase font-semibold">
                Toplam Tutar
              </p>
              <p className="text-base font-bold font-mono text-panel-12">
                ₺{Number(quote.totalAmount).toLocaleString("tr-TR", { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-4">
          {/* Sol Kolon: Ürünler Tablosu (Resimli) ve Müşteri Notu */}
          <div className="lg:col-span-3 space-y-4 min-w-0">
            <div className="bg-panel-1 border border-panel-6 rounded-lg overflow-hidden shadow-sm">
              <div className="px-4 py-3 border-b border-panel-6 bg-panel-2 flex items-center justify-between">
                <h3 className="text-xs font-bold text-panel-12 uppercase tracking-wider flex items-center gap-1.5">
                  <Package className="w-3.5 h-3.5 text-brand-11" />
                  Teklif Edilen Ürünler ({quote.items.length})
                </h3>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs whitespace-nowrap min-w-[550px]">
                  <thead className="bg-panel-2/50 border-b border-panel-6 text-panel-11 font-medium">
                    <tr>
                      <th className="py-2.5 px-3 w-12 text-center">Görsel</th>
                      <th className="py-2.5 px-3">Ürün</th>
                      <th className="py-2.5 px-3 text-right">Birim Fiyat</th>
                      <th className="py-2.5 px-3 text-center">Miktar</th>
                      <th className="py-2.5 px-3 text-right">Toplam</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-panel-6 text-panel-12">
                    {quote.items.map((item) => {
                      const imageSrc =
                        item.product.imageUrl ||
                        (item.product.images && item.product.images.length > 0
                          ? item.product.images[0].url
                          : null);

                      const lineTotal = Number(item.unitPrice) * item.quantity;

                      return (
                        <tr
                          key={item.id}
                          className="hover:bg-panel-2/50 transition-colors"
                        >
                          {/* Ürün Görseli */}
                          <td className="py-2.5 px-3 text-center">
                            <div className="w-9 h-9 rounded bg-panel-3 border border-panel-6 overflow-hidden flex items-center justify-center mx-auto shrink-0">
                              {imageSrc ? (
                                <img
                                  src={imageSrc}
                                  alt={item.product.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <Package className="w-4 h-4 text-panel-10" />
                              )}
                            </div>
                          </td>

                          {/* Ürün Adı & Kategori */}
                          <td className="py-2.5 px-3">
                            <p className="font-semibold text-panel-12">
                              {item.product.name}
                            </p>
                            {item.product.category && (
                              <span className="text-[10px] text-panel-11">
                                {item.product.category}
                              </span>
                            )}
                          </td>

                          {/* Birim Fiyat */}
                          <td className="py-2.5 px-3 text-right font-mono">
                            ₺{Number(item.unitPrice).toLocaleString("tr-TR", { minimumFractionDigits: 2 })}
                          </td>

                          {/* Miktar */}
                          <td className="py-2.5 px-3 text-center font-bold">
                            {item.quantity} Adet
                          </td>

                          {/* Satır Toplamı */}
                          <td className="py-2.5 px-3 text-right font-bold font-mono text-panel-12">
                            ₺{lineTotal.toLocaleString("tr-TR", { minimumFractionDigits: 2 })}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {quote.note && (
              <div className="bg-panel-1 border border-panel-6 rounded-lg p-3.5">
                <h3 className="font-bold text-panel-12 text-[11px] uppercase tracking-wider mb-1">
                  Müşteri Notu
                </h3>
                <p className="text-panel-11 italic text-xs">"{quote.note}"</p>
              </div>
            )}
          </div>

          {/* Sağ Kolon: Bilgiler ve Durum Güncelleme Formu */}
          <div className="lg:col-span-1 space-y-4 min-w-0">
            <div className="bg-panel-1 border border-panel-6 rounded-lg p-3.5 shadow-sm">
              <h3 className="text-[11px] font-bold uppercase tracking-wider border-b border-panel-6 pb-2 mb-2.5 text-panel-12">
                Müşteri Bilgileri
              </h3>
              <div className="space-y-2.5 text-xs text-panel-12">
                <div className="flex items-center gap-2">
                  <User className="w-3.5 h-3.5 text-panel-11 shrink-0" />
                  <span className="font-medium truncate">{quote.customerName}</span>
                </div>

                {quote.customerPhone && quote.customerPhone !== "-" && (
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-panel-11 shrink-0" />
                      <a
                        href={`tel:${quote.customerPhone}`}
                        className="text-brand-11 hover:underline truncate"
                      >
                        {quote.customerPhone}
                      </a>
                    </div>
                    <div className="ml-5.5">
                      <a
                        href={`https://wa.me/${quote.customerPhone.replace(/[^0-9]/g, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-2 py-0.5 bg-green-500/10 border border-green-500/20 text-green-600 rounded text-[10px] font-semibold hover:bg-green-500/20 transition-colors"
                      >
                        WhatsApp Mesajı
                      </a>
                    </div>
                  </div>
                )}

                {quote.customerEmail && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-panel-11 shrink-0" />
                    <a
                      href={`mailto:${quote.customerEmail}`}
                      className="text-brand-11 hover:underline truncate"
                    >
                      {quote.customerEmail}
                    </a>
                  </div>
                )}
              </div>
            </div>

            <div>
              <QuoteDetailClient
                quoteId={quote.id}
                initialStatus={quote.status}
                initialAdminNote={quote.adminNote}
                quote={serializedQuote}
                products={serializedProducts}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
