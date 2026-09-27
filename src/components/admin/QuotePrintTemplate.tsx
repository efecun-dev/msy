"use client";

import Image from "next/image";
import { Package, Calendar, Phone, Mail, User, CheckCircle2 } from "lucide-react";

interface QuotePrintTemplateProps {
  quote: {
    id: number;
    quoteNumber: string;
    customerName: string;
    customerPhone: string;
    customerEmail?: string | null;
    note?: string | null;
    adminNote?: string | null;
    status: string;
    totalAmount: any;
    createdAt: string | Date;
    items: Array<{
      id: number;
      quantity: number;
      unitPrice: any;
      product: {
        id: number;
        name: string;
        category?: string;
        description?: string;
        imageUrl?: string | null;
        images?: Array<{ url: string }>;
      };
    }>;
  };
}

export default function QuotePrintTemplate({ quote }: QuotePrintTemplateProps) {
  const formattedDate = new Date(quote.createdAt).toLocaleDateString("tr-TR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const validUntilDate = new Date(
    new Date(quote.createdAt).getTime() + 15 * 24 * 60 * 60 * 1000
  ).toLocaleDateString("tr-TR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Calculate Subtotal & KDV
  const itemsSubtotal = quote.items.reduce(
    (sum, item) => sum + Number(item.unitPrice) * item.quantity,
    0
  );
  const totalAmountNum = Number(quote.totalAmount);
  // If totalAmount is approx subtotal * 1.2, calculate KDV
  const hasKdv = totalAmountNum > itemsSubtotal;
  const kdvAmount = hasKdv ? totalAmountNum - itemsSubtotal : 0;

  return (
    <div className="quote-print-document bg-white text-slate-900 p-8 sm:p-12 max-w-4xl mx-auto rounded-lg shadow-sm print:shadow-none print:p-0 print:max-w-none print:w-full print:bg-white print:text-black">
      {/* ─── Header: Firma & Teklif Bilgileri ─────────────────────────────────── */}
      <div className="flex justify-between items-start pb-6 border-b-2 border-slate-900/10">
        <div className="flex items-center gap-4">
          <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-slate-900 flex items-center justify-center text-white shrink-0 print:border print:border-slate-300">
            {/* Logo image or fallback */}
            <Image
              src="/logo.png"
              alt="MSY Elektronik"
              width={64}
              height={64}
              className="object-contain p-1"
              priority
            />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight text-slate-900 uppercase">
              MSY Elektronik
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Elektronik, Güvenlik & Otomasyon Sistemleri
            </p>
            <p className="text-[11px] text-slate-400 mt-1">
              Samsun, Türkiye • msyelektroniksamsun.com.tr
            </p>
          </div>
        </div>

        <div className="text-right">
          <div className="inline-block bg-blue-50 border border-blue-200 text-blue-800 text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-md mb-2 print:border-slate-300 print:text-slate-800 print:bg-slate-100">
            Fiyat Teklif Formu
          </div>
          <div className="text-sm font-bold text-slate-900">
            Teklif No: <span className="font-mono text-blue-700 print:text-black">#{quote.quoteNumber}</span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Tarih: {formattedDate}
          </p>
          <p className="text-[11px] text-slate-400">
            Geçerlilik: {validUntilDate} (15 Gün)
          </p>
        </div>
      </div>

      {/* ─── Müşteri Bilgileri Kutusu ────────────────────────────────────────── */}
      <div className="my-6 p-4 rounded-xl bg-slate-50 border border-slate-200/80 grid grid-cols-1 sm:grid-cols-2 gap-4 print:bg-slate-50/50 print:border-slate-300">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
            Sayın / Müşteri
          </p>
          <p className="text-base font-bold text-slate-900 flex items-center gap-1.5">
            <User className="w-4 h-4 text-blue-600 print:hidden" />
            {quote.customerName}
          </p>
          {quote.note && (
            <p className="text-xs text-slate-600 mt-2 italic bg-white p-2 rounded border border-slate-200 print:border-slate-300">
              <span className="font-semibold not-italic">Not:</span> "{quote.note}"
            </p>
          )}
        </div>

        <div className="sm:text-right space-y-1 text-xs text-slate-600">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 sm:text-right">
            İletişim Detayları
          </p>
          {quote.customerPhone && (
            <p className="flex items-center sm:justify-end gap-1.5 font-medium">
              <Phone className="w-3.5 h-3.5 text-slate-400 print:hidden" />
              {quote.customerPhone}
            </p>
          )}
          {quote.customerEmail && (
            <p className="flex items-center sm:justify-end gap-1.5 font-medium">
              <Mail className="w-3.5 h-3.5 text-slate-400 print:hidden" />
              {quote.customerEmail}
            </p>
          )}
        </div>
      </div>

      {/* ─── Ürünler Tablosu (Resimli) ─────────────────────────────────────────── */}
      <div className="overflow-hidden border border-slate-200 rounded-xl my-6 print:border-slate-300">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200 print:bg-slate-100 print:border-slate-300">
              <th className="py-3 px-4 w-16 text-center">Görsel</th>
              <th className="py-3 px-4">Ürün Adı & Açıklama</th>
              <th className="py-3 px-4 text-right">Birim Fiyat</th>
              <th className="py-3 px-4 text-center w-20">Miktar</th>
              <th className="py-3 px-4 text-right w-28">Toplam</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 print:divide-slate-200">
            {quote.items.map((item, idx) => {
              const imageSrc =
                item.product.imageUrl ||
                (item.product.images && item.product.images.length > 0
                  ? item.product.images[0].url
                  : null);

              const lineTotal = Number(item.unitPrice) * item.quantity;

              return (
                <tr
                  key={item.id || idx}
                  className="hover:bg-slate-50/50 transition-colors print:hover:bg-transparent page-break-inside-avoid"
                  style={{ pageBreakInside: "avoid" }}
                >
                  {/* Görsel Sütunu */}
                  <td className="py-3 px-4 text-center align-middle">
                    <div className="w-12 h-12 rounded-lg border border-slate-200 bg-white overflow-hidden flex items-center justify-center mx-auto shrink-0 print:border-slate-300">
                      {imageSrc ? (
                        <img
                          src={imageSrc}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                          loading="eager"
                        />
                      ) : (
                        <Package className="w-5 h-5 text-slate-300" />
                      )}
                    </div>
                  </td>

                  {/* Ürün Bilgisi */}
                  <td className="py-3 px-4 align-middle">
                    <p className="font-bold text-slate-900 text-sm">
                      {item.product.name}
                    </p>
                    {item.product.category && (
                      <span className="inline-block text-[10px] uppercase font-semibold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded mt-0.5 print:border print:border-slate-200">
                        {item.product.category}
                      </span>
                    )}
                    {item.product.description && (
                      <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                        {item.product.description}
                      </p>
                    )}
                  </td>

                  {/* Birim Fiyat */}
                  <td className="py-3 px-4 text-right font-medium text-slate-700 align-middle">
                    ₺{Number(item.unitPrice).toLocaleString("tr-TR", { minimumFractionDigits: 2 })}
                  </td>

                  {/* Miktar */}
                  <td className="py-3 px-4 text-center font-bold text-slate-900 align-middle">
                    {item.quantity} Adet
                  </td>

                  {/* Toplam */}
                  <td className="py-3 px-4 text-right font-bold text-slate-900 align-middle">
                    ₺{lineTotal.toLocaleString("tr-TR", { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ─── Finansal Özet & Şartlar ─────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 my-6 pt-2">
        {/* Sol: Şartlar ve Notlar */}
        <div className="space-y-3 text-xs text-slate-600 bg-slate-50/70 p-4 rounded-xl border border-slate-200/80 print:bg-transparent print:border-slate-300">
          <h4 className="font-bold text-slate-900 uppercase text-[11px] tracking-wider">
            Teklif Şartları & Bilgilendirme
          </h4>
          <ul className="space-y-1.5 text-[11px] text-slate-500 list-disc list-inside">
            <li>Bu teklif oluşturulduğu tarihten itibaren 15 gün geçerlidir.</li>
            <li>Teslimat ve montaj süreci teklif onayının ardından planlanır.</li>
            <li>Tüm ürünlerimiz 2 yıl resmi distribütör garantisi kapsamındadır.</li>
            <li>Ödeme şartları: Sipariş onayında %50, teslimatta bakiye.</li>
          </ul>
        </div>

        {/* Sağ: Tutar Tablosu */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-2 text-xs print:bg-slate-50/50 print:border-slate-300">
          <div className="flex justify-between items-center text-slate-600 pb-1.5 border-b border-slate-200/60">
            <span>Ara Toplam:</span>
            <span className="font-semibold text-slate-900">
              ₺{itemsSubtotal.toLocaleString("tr-TR", { minimumFractionDigits: 2 })}
            </span>
          </div>

          {hasKdv && (
            <div className="flex justify-between items-center text-slate-600 pb-1.5 border-b border-slate-200/60">
              <span>Hesaplanan KDV (%20):</span>
              <span className="font-semibold text-slate-900">
                ₺{kdvAmount.toLocaleString("tr-TR", { minimumFractionDigits: 2 })}
              </span>
            </div>
          )}

          <div className="flex justify-between items-center pt-1 text-sm font-black text-slate-900">
            <span>Genel Toplam:</span>
            <span className="text-base text-blue-700 print:text-black">
              ₺{totalAmountNum.toLocaleString("tr-TR", { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </div>

      {/* ─── İmza / Onay Bölümü ──────────────────────────────────────────────── */}
      <div className="mt-12 pt-6 border-t border-slate-200 grid grid-cols-2 gap-8 text-center text-xs print:mt-16 print:border-slate-300" style={{ pageBreakInside: "avoid" }}>
        <div>
          <p className="font-bold text-slate-900 mb-1">MSY Elektronik</p>
          <p className="text-[11px] text-slate-400 mb-12">Teklifi Hazırlayan / Kaşe - İmza</p>
          <div className="w-36 h-0.5 bg-slate-300 mx-auto" />
        </div>

        <div>
          <p className="font-bold text-slate-900 mb-1">{quote.customerName}</p>
          <p className="text-[11px] text-slate-400 mb-12">Müşteri Onayı / İmza</p>
          <div className="w-36 h-0.5 bg-slate-300 mx-auto" />
        </div>
      </div>

      {/* ─── Footer Notu ────────────────────────────────────────────────────── */}
      <div className="mt-8 text-center text-[10px] text-slate-400 border-t border-slate-100 pt-3 print:border-slate-200">
        Bu belge MSY Elektronik Otomasyon Sistemi tarafından dijital olarak oluşturulmuştur.
      </div>
    </div>
  );
}
