"use client";

import Image from "next/image";

interface QuotePrintTemplateProps {
  quote: {
    id: number;
    quoteNumber: string;
    customerName: string;
    customerPhone: string;
    customerEmail?: string | null;
    customerAddress?: string | null;
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
  isPreview?: boolean;
}

export default function QuotePrintTemplate({ quote, isPreview = false }: QuotePrintTemplateProps) {
  const formattedDate = new Date(quote.createdAt).toLocaleDateString("tr-TR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  const itemsSubtotal = quote.items.reduce(
    (sum, item) => sum + Number(item.unitPrice) * item.quantity,
    0
  );

  const generalTotal = Number(quote.totalAmount);
  const kdvAmount = generalTotal - itemsSubtotal;
  const hasKdv = kdvAmount > 0;

  // İlk kelimeyi kırmızı yapmak için yardımcı fonksiyon
  const renderProductName = (name: string) => {
    const parts = name.split(" ");
    if (parts.length > 1) {
      return (
        <>
          <span className="text-red-600 font-bold">{parts[0]}</span>{" "}
          <span className="text-slate-800 font-semibold">{parts.slice(1).join(" ")}</span>
        </>
      );
    }
    return <span className="text-red-600 font-bold">{name}</span>;
  };

  return (
    <>
      {!isPreview && (
        <style
          dangerouslySetInnerHTML={{
            __html: `
            @media print {
              @page { 
                size: A4 portrait; 
                margin: 8mm 10mm 8mm 10mm; 
              }

              html, body { 
                margin: 0 !important;
                padding: 0 !important;
                background: #ffffff !important;
                color: #0f172a !important;
                -webkit-print-color-adjust: exact !important; 
                print-color-adjust: exact !important; 
                width: 100% !important;
                min-height: auto !important;
                height: auto !important;
              }

              /* Ekrandaki admin arayüzünü, modalleri ve bildirimleri tamamen gizle */
              header, nav, aside, footer,
              [role="dialog"],
              [role="alert"],
              .toast,
              .radix-toast-viewport,
              #nprogress,
              .print\\:hidden,
              .print-hidden {
                display: none !important;
              }

              #quote-print-template {
                display: block !important;
                visibility: visible !important;
                position: relative !important;
                width: 100% !important;
                max-width: 100% !important;
                margin: 0 !important;
                padding: 0 !important;
                background: #ffffff !important;
                box-shadow: none !important;
                border: none !important;
              }

              #quote-print-template * {
                -webkit-print-color-adjust: exact !important; 
                print-color-adjust: exact !important; 
              }

              .print-break-inside-avoid {
                page-break-inside: avoid !important;
                break-inside: avoid !important;
              }

              table {
                width: 100% !important;
                border-collapse: collapse !important;
                page-break-inside: auto !important;
              }

              thead {
                display: table-header-group !important;
              }

              tfoot {
                display: table-footer-group !important;
              }

              tr {
                page-break-inside: avoid !important;
                break-inside: avoid !important;
              }

              /* Watermark (Filigran) arka planda hafif */
              .watermark-container {
                position: fixed !important;
                top: 25% !important;
                left: 0 !important;
                width: 100% !important;
                height: 50% !important;
                z-index: 0 !important;
                pointer-events: none !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                opacity: 0.08 !important;
              }
              
              .watermark-image {
                width: 85% !important;
                max-width: 480px !important;
                height: auto !important;
                transform: rotate(-30deg) !important;
              }
            }
          `,
          }}
        />
      )}

      <div
        id={isPreview ? "quote-print-preview" : "quote-print-template"}
        className={`bg-white text-slate-900 font-sans w-full max-w-[210mm] mx-auto p-4 print:p-0 print:max-w-none ${
          isPreview ? "print:hidden" : ""
        }`}
      >
        {/* Filigran (Watermark) */}
        <div className="watermark-container hidden print:flex pointer-events-none items-center justify-center">
          <img src="/logo.png" alt="watermark" className="watermark-image object-contain" />
        </div>

        <div className="relative z-10">
          {/* ─── ÜST BİLGİLER (HEADER) ─── */}
          <div className="flex justify-between items-start mb-3 pb-2 border-b border-slate-200">
            <div className="flex flex-col">
              <div className="w-[160px] h-[45px] relative mb-1">
                <Image
                  src="/logo.png"
                  alt="MSY Elektronik"
                  fill
                  className="object-contain object-left"
                  priority
                />
              </div>
              <div className="text-[10px] font-medium text-slate-600 leading-snug border-l-2 border-red-600 pl-2">
                <p>Cumhuriyet Mahallesi 99. Sokak No:17 A</p>
                <p className="font-semibold text-slate-700">0545 685 5136 • msyelektronik55@gmail.com</p>
              </div>
            </div>

            <div className="text-right flex flex-col items-end">
              <h1 className="text-2xl font-black tracking-wider text-slate-800 mb-1.5 uppercase">
                SİPARİŞ FORMU
              </h1>
              <div className="flex items-center gap-2 text-[11px] bg-slate-50 border border-slate-200 rounded px-2.5 py-1">
                <span className="font-bold text-slate-800">Tarih:</span>
                <span className="font-medium text-slate-600">{formattedDate}</span>
                <span className="text-slate-300">|</span>
                <span className="font-bold text-slate-800">Teklif No:</span>
                <span className="font-mono font-bold text-red-600">#{quote.quoteNumber}</span>
              </div>
            </div>
          </div>

          {/* ─── MÜŞTERİ BİLGİLERİ (KOMPAKT) ─── */}
          <div className="border border-slate-300 rounded-lg mb-3 bg-white overflow-hidden text-[11px]">
            <div className="font-bold text-[11px] border-b border-slate-300 py-1 px-3 bg-slate-100 text-slate-800 flex items-center justify-between">
              <span>MÜŞTERİ BİLGİLERİ</span>
              <span className="text-[10px] text-slate-500 font-normal">Samsun / Atakum</span>
            </div>
            <div className="flex justify-between items-center px-3 py-2 bg-white">
              <div className="leading-tight space-y-1 text-slate-700 flex-1">
                <div className="flex items-baseline">
                  <span className="w-28 font-bold text-slate-900 shrink-0">Adı Soyadı / Ünvan:</span>
                  <span className="font-bold text-slate-900">{quote.customerName}</span>
                </div>
                <div className="flex items-baseline">
                  <span className="w-28 font-semibold text-slate-700 shrink-0">Adres:</span>
                  <span className="text-slate-700">{quote.customerAddress || "-"}</span>
                </div>
                <div className="flex items-baseline">
                  <span className="w-28 font-semibold text-slate-700 shrink-0">Telefon:</span>
                  <span className="font-medium text-slate-800">{quote.customerPhone}</span>
                </div>
              </div>

              {/* Marka Logoları (Sağ Bölüm) */}
              <div className="flex items-center gap-3 pl-4 border-l border-slate-100 shrink-0">
                <div className="w-20 h-7 relative">
                  <Image src="/audio.png" alt="Audio Diafon" fill className="object-contain object-right" priority />
                </div>
                <div className="w-20 h-6 relative">
                  <Image src="/dahua.jpg" alt="Dahua Technology" fill className="object-contain object-right" priority />
                </div>
              </div>
            </div>
          </div>

          {/* ─── ÜRÜNLER TABLOSU (DAR VE DÜZENLİ) ─── */}
          <div className="w-full mb-3 rounded-lg overflow-hidden border border-slate-300 bg-white">
            <table className="w-full border-collapse text-[10.5px]">
              <thead className="bg-[#f1f5f9] border-b border-slate-300 text-slate-700">
                <tr>
                  <th className="py-1.5 px-2 font-bold w-9 text-center border-r border-slate-300">
                    No
                  </th>
                  <th className="py-1.5 px-2 font-bold w-12 text-center border-r border-slate-300">
                    Görsel
                  </th>
                  <th className="py-1.5 px-3 font-bold text-left border-r border-slate-300">
                    Ürün Tanımı
                  </th>
                  <th className="py-1.5 px-2 font-bold w-14 text-center border-r border-slate-300">
                    Miktar
                  </th>
                  <th className="py-1.5 px-3 font-bold w-24 text-right border-r border-slate-300">
                    Birim Fiyat
                  </th>
                  <th className="py-1.5 px-3 font-bold w-28 text-right">
                    Toplam Tutar
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {quote.items.map((item, idx) => {
                  const imageSrc =
                    item.product.imageUrl ||
                    (item.product.images && item.product.images.length > 0
                      ? item.product.images[0].url
                      : null);

                  const lineTotal = Number(item.unitPrice) * item.quantity;

                  return (
                    <tr
                      key={item.id}
                      className="print-break-inside-avoid h-[36px] bg-white even:bg-slate-50/40 hover:bg-slate-50 transition-colors"
                    >
                      {/* Sıra No */}
                      <td className="py-1 px-1 text-center font-semibold text-slate-500 border-r border-slate-200">
                        {idx + 1}
                      </td>

                      {/* Görsel (Kompakt 28x28px) */}
                      <td className="py-1 px-1 text-center border-r border-slate-200 align-middle">
                        {imageSrc ? (
                          <div className="w-7 h-7 mx-auto relative flex items-center justify-center bg-white rounded border border-slate-200 p-0.5">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={imageSrc}
                              alt={item.product.name}
                              className="max-w-full max-h-full object-contain mix-blend-multiply"
                            />
                          </div>
                        ) : (
                          <div className="w-7 h-7 mx-auto bg-slate-100 rounded flex items-center justify-center text-slate-400 text-[10px]">
                            -
                          </div>
                        )}
                      </td>

                      {/* Ürün Adı */}
                      <td className="py-1 px-3 text-left align-middle leading-tight border-r border-slate-200">
                        <div className="flex flex-col">
                          <div>{renderProductName(item.product.name)}</div>
                          {item.product.category && (
                            <span className="text-[9px] text-slate-400 leading-none mt-0.5">
                              {item.product.category}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Miktar */}
                      <td className="py-1 px-1 font-bold text-center align-middle bg-slate-50/50 border-r border-slate-200 text-slate-800">
                        {item.quantity} Adet
                      </td>

                      {/* Birim Fiyat */}
                      <td className="py-1 px-3 font-semibold text-right align-middle font-mono border-r border-slate-200 text-slate-700">
                        {Number(item.unitPrice).toLocaleString("tr-TR", {
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0,
                        })}{" "}
                        TL
                      </td>

                      {/* Toplam Fiyat */}
                      <td className="py-1 px-3 font-bold text-right align-middle font-mono bg-slate-50/50 text-slate-900">
                        {lineTotal.toLocaleString("tr-TR", {
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0,
                        })}{" "}
                        TL
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* ─── ALT KISIM (NOTLAR VE TOPLAMLAR - KOMPAKT) ─── */}
          <div className="flex justify-between items-start print-break-inside-avoid gap-3 text-[11px]">
            {/* Sol Kısım: Notlar */}
            <div className="border border-slate-300 rounded-lg p-2.5 flex-1 min-h-[64px] flex flex-col bg-slate-50/70 relative overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-600" />
              {quote.note ? (
                <>
                  <p className="text-red-600 font-bold text-[10px] mb-1 pl-1.5 uppercase tracking-wide">
                    Teklif Notu
                  </p>
                  <p className="text-slate-700 font-medium pl-1.5 whitespace-pre-wrap leading-snug">
                    {quote.note}
                  </p>
                </>
              ) : (
                <div className="flex flex-1 items-center justify-center h-full text-slate-400 text-[10px] italic">
                  Bu teklife ait ek not bulunmamaktadır.
                </div>
              )}
            </div>

            {/* Sağ Kısım: Toplamlar */}
            <div className="border border-slate-300 rounded-lg p-2.5 w-[220px] bg-white shrink-0">
              <div
                className={`flex justify-between text-slate-600 text-[10.5px] ${
                  hasKdv ? "mb-1" : "mb-1.5 pb-1.5 border-b border-slate-200"
                }`}
              >
                <span>Malzeme Toplamı</span>
                <span className="font-semibold text-slate-800 font-mono">
                  {itemsSubtotal.toLocaleString("tr-TR", { minimumFractionDigits: 0 })} TL
                </span>
              </div>

              {hasKdv && (
                <div className="flex justify-between text-slate-600 text-[10.5px] mb-1.5 pb-1.5 border-b border-slate-200">
                  <span>+ %20 KDV</span>
                  <span className="font-semibold text-slate-800 font-mono">
                    {kdvAmount.toLocaleString("tr-TR", { minimumFractionDigits: 0 })} TL
                  </span>
                </div>
              )}

              <div className="flex justify-between items-baseline font-black text-slate-900 pt-0.5">
                <span className="text-[12px]">Genel Toplam</span>
                <span className="text-red-600 text-[14px] font-mono font-black">
                  {generalTotal.toLocaleString("tr-TR", { minimumFractionDigits: 0 })} TL
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
