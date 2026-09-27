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
}

export default function QuotePrintTemplate({ quote }: QuotePrintTemplateProps) {
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
  
  // Tablonun dolu görünmesi için boş satırlar ekliyoruz (minimum 7 satır)
  const minRows = 7;
  const paddedItems = [...quote.items];
  while (paddedItems.length < minRows) {
    paddedItems.push({ id: -paddedItems.length, _isEmpty: true } as any);
  }

  // İlk kelimeyi kırmızı yapmak için yardımcı fonksiyon
  const renderProductName = (name: string) => {
    const parts = name.split(" ");
    if (parts.length > 1) {
      return (
        <>
          <span className="text-red-600 font-bold">{parts[0]}</span>{" "}
          <span className="text-slate-800">{parts.slice(1).join(" ")}</span>
        </>
      );
    }
    return <span className="text-red-600 font-bold">{name}</span>;
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          /* Ekrandaki diğer tüm ögeleri gizle (scrollbar, toast vb. için) */
          body * {
            visibility: hidden;
          }
          
          /* Sadece yazdırma şablonunu ve içeriğini görünür yap */
          #quote-print-template, #quote-print-template * {
            visibility: visible;
          }

          /* Toast ve modal bileşenlerini tamamen gizle */
          [role="alert"], .toast, .radix-toast-viewport, #nprogress {
            display: none !important;
          }

          #quote-print-template {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }

          @page { 
            size: A4; 
            margin: 12mm 15mm; 
          }
          
          body { 
            -webkit-print-color-adjust: exact !important; 
            print-color-adjust: exact !important; 
            background: white !important;
          }

          /* İkinci sayfada tablo taşmasını ve kırılmasını düzenlemek için */
          .print-break-inside-avoid {
            page-break-inside: avoid;
            break-inside: avoid;
          }

          thead {
            display: table-header-group;
          }

          tfoot {
            display: table-footer-group;
          }

          /* Watermark tüm sayfalarda ortalanmış şekilde görünsün */
          .watermark-container {
            position: fixed;
            top: 30%;
            left: 10%;
            width: 80%;
            height: 50%;
            z-index: -1;
            pointer-events: none;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0.1;
          }
          
          .watermark-image {
            width: 100%;
            height: auto;
            transform: rotate(-35deg);
          }
        }
      `}} />

      <div id="quote-print-template" className="bg-white text-slate-900 font-sans w-full max-w-[210mm] mx-auto p-6 print:p-0 print:max-w-none shadow-sm print:shadow-none">
        
        {/* Filigran (Watermark) */}
        <div className="watermark-container hidden print:flex absolute inset-0 opacity-10 pointer-events-none items-center justify-center rotate-[-35deg] scale-150 z-0">
          <img src="/logo.png" alt="watermark" className="w-2/3 h-auto grayscale object-contain opacity-50" />
        </div>

        <div className="relative z-10">
          {/* Üst Bilgiler (Header) */}
          <div className="flex justify-between items-start mb-6">
            <div className="flex flex-col">
              <div className="w-[200px] h-[60px] relative mb-2">
                <Image
                  src="/logo.png"
                  alt="MSY Elektronik"
                  fill
                  className="object-contain object-left"
                  priority
                />
              </div>
              <div className="text-[11px] font-medium text-slate-600 leading-relaxed border-l-2 border-brand-9 pl-3">
                <p>Cumhuriyet Mahallesi 99. Sokak No:17 A</p>
                <p>0545 685 5136</p>
                <p>msyelektronik55@gmail.com</p>
              </div>
            </div>
            <div className="text-right flex flex-col items-end pt-2">
              <h1 className="text-3xl font-extrabold mb-8 tracking-wider text-slate-800">SİPARİŞ FORMU</h1>
              <div className="bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
                <p className="text-[12px] font-bold text-slate-700">Tarih : <span className="font-medium text-slate-600 ml-1">{formattedDate}</span></p>
              </div>
            </div>
          </div>

          {/* Müşteri Bilgileri */}
          <div className="border border-slate-300 rounded-xl mb-6 bg-white overflow-hidden shadow-sm">
            <div className="font-bold text-[13px] border-b border-slate-300 p-2.5 px-4 bg-slate-50 text-slate-800 flex items-center justify-between">
              <span>MÜŞTERİ BİLGİLERİ</span>
              <span className="text-[10px] text-slate-400 font-normal">Teklif No: #{quote.quoteNumber}</span>
            </div>
            <div className="flex justify-between p-4 relative bg-white/90">
              <div className="text-[12px] leading-8 font-medium text-slate-700 z-10 flex-1">
                <div className="flex">
                  <span className="w-36 font-semibold text-slate-900">Adı Soyadı / Ünvanı</span>
                  <span className="font-bold text-slate-800">: {quote.customerName}</span>
                </div>
                <div className="flex">
                  <span className="w-36 font-semibold text-slate-900">Adres</span>
                  <span className="flex-1">: {quote.customerAddress || "-"}</span>
                </div>
                <div className="flex">
                  <span className="w-36 font-semibold text-slate-900">Telefon</span>
                  <span>: {quote.customerPhone}</span>
                </div>
              </div>
              {/* Marka Logoları (Sağ Üst Köşe) */}
              <div className="flex flex-col items-end justify-center gap-2 pr-2 z-10">
                 <div className="flex flex-col items-center border-b-2 border-red-600 pb-1 w-24">
                   <span className="text-[26px] tracking-tighter italic font-black text-[#D3122A] leading-none">AUDIO</span>
                   <span className="text-[7px] bg-[#D3122A] text-white px-1.5 py-0.5 rounded-sm font-bold mt-1">Görüntülü Diafonları</span>
                 </div>
                 <div className="flex items-center text-[#D3122A] mt-2">
                   <span className="text-[28px] font-black italic lowercase tracking-tighter leading-none">alhua</span>
                   <span className="text-[6px] ml-1.5 text-slate-800 font-extrabold leading-tight">DAHUA<br/>TECHNOLOGY</span>
                 </div>
              </div>
            </div>
          </div>

          {/* Tablo */}
          <div className="w-full mb-6 rounded-xl overflow-hidden border border-slate-300 shadow-sm bg-white">
            <table className="w-full border-collapse text-[11px] text-center">
              <thead className="bg-[#eaf4fb] border-b border-slate-300">
                <tr>
                  <th className="p-3 font-bold text-slate-700 w-28 border-r border-slate-200">Görsel</th>
                  <th className="p-3 font-bold text-slate-700 border-r border-slate-200">Ürün Adı</th>
                  <th className="p-3 font-bold text-slate-700 w-16 border-r border-slate-200">Adet</th>
                  <th className="p-3 font-bold text-slate-700 w-28 border-r border-slate-200">Birim Fiyatı</th>
                  <th className="p-3 font-bold text-slate-700 w-32">Toplam Fiyat</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {paddedItems.map((item: any, idx) => {
                  if (item._isEmpty) {
                    return (
                      <tr key={`empty-${idx}`} className="h-[60px] bg-white">
                        <td className="border-r border-slate-200"></td>
                        <td className="border-r border-slate-200"></td>
                        <td className="border-r border-slate-200 bg-slate-50/50"></td>
                        <td className="border-r border-slate-200"></td>
                        <td className="bg-slate-50/50"></td>
                      </tr>
                    );
                  }

                  const imageSrc =
                    item.product.imageUrl ||
                    (item.product.images && item.product.images.length > 0
                      ? item.product.images[0].url
                      : null);

                  const lineTotal = Number(item.unitPrice) * item.quantity;

                  return (
                    <tr key={item.id} className="print-break-inside-avoid h-[65px] bg-white hover:bg-slate-50 transition-colors">
                      <td className="p-2 align-middle border-r border-slate-200">
                        {imageSrc ? (
                          <div className="w-12 h-12 mx-auto relative flex items-center justify-center bg-white rounded-md border border-slate-100 p-1">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={imageSrc}
                              alt={item.product.name}
                              className="max-w-full max-h-full object-contain mix-blend-multiply"
                            />
                          </div>
                        ) : (
                          <div className="w-12 h-12 mx-auto bg-slate-100 rounded-md flex items-center justify-center text-slate-300">
                            -
                          </div>
                        )}
                      </td>
                      <td className="p-3 text-left align-middle text-[11px] font-medium border-r border-slate-200 leading-tight">
                        {renderProductName(item.product.name)}
                      </td>
                      <td className="p-2 font-bold align-middle text-[13px] bg-slate-50/50 border-r border-slate-200 text-slate-800">
                        {item.quantity}
                      </td>
                      <td className="p-2 font-semibold align-middle text-[12px] border-r border-slate-200 text-slate-700">
                        {Number(item.unitPrice).toLocaleString("tr-TR", { minimumFractionDigits: 0, maximumFractionDigits: 0 })} TL
                      </td>
                      <td className="p-2 font-bold align-middle text-[12px] bg-slate-50/50 text-slate-800">
                        {lineTotal.toLocaleString("tr-TR", { minimumFractionDigits: 0, maximumFractionDigits: 0 })} TL
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Alt Kısım (Notlar ve Toplamlar) */}
          <div className="flex flex-col sm:flex-row justify-between items-start print-break-inside-avoid gap-6">
            {/* Sol Kısım (Notlar) */}
            <div className="border border-slate-300 rounded-xl p-4 w-full sm:w-[55%] min-h-[160px] flex flex-col bg-slate-50 shadow-sm relative overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-red-600"></div>
              <p className="text-red-600 font-extrabold text-[12px] mb-4 pl-2">NOT: FİYATLARIMIZ KDV DAHİL DEĞİLDİR.</p>
              
              <ul className="list-disc pl-6 space-y-2 text-slate-600 font-medium text-[11px]">
                <li>Montaj ve kurulum hizmeti fiyata dahil değildir.</li>
                <li>Ürünlerimiz 2 yıl üretici garantisi altındadır.</li>
                <li>Teklif onayından itibaren 15 gün geçerlidir.</li>
                {quote.note && (
                   <li className="text-slate-800 mt-2 italic font-semibold">Özel Not: {quote.note}</li>
                )}
              </ul>
            </div>

            {/* Sağ Kısım (Toplamlar) */}
            <div className="border border-slate-300 rounded-xl p-5 w-full sm:w-[42%] text-[13px] shadow-sm bg-white">
              <div className="flex justify-between mb-4 font-medium text-slate-600">
                <span>Malzeme Toplamı</span>
                <span className="font-semibold text-slate-800">{itemsSubtotal.toLocaleString("tr-TR", { minimumFractionDigits: 0 })} TL</span>
              </div>
              <div className="flex justify-between mb-4 font-medium text-slate-600 pb-4 border-b border-slate-200">
                <span>İşçilik Toplamı</span>
                <span className="font-semibold text-slate-800">- TL</span>
              </div>
              <div className="flex justify-between mt-5 font-black text-[15px] text-slate-900">
                <span>Genel Toplam</span>
                <span className="text-brand-9 text-[17px]">{generalTotal.toLocaleString("tr-TR", { minimumFractionDigits: 0 })} TL</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
