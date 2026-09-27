"use client";

import Image from "next/image";

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
          <span className="text-red-600 font-medium">{parts[0]}</span>{" "}
          {parts.slice(1).join(" ")}
        </>
      );
    }
    return <span className="text-red-600 font-medium">{name}</span>;
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          @page { size: A4; margin: 10mm; }
          body { 
            -webkit-print-color-adjust: exact !important; 
            print-color-adjust: exact !important; 
          }
          .print-break-inside-avoid {
            page-break-inside: avoid;
          }
        }
        
        /* Watermark */
        .watermark-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 0;
          pointer-events: none;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }
        
        .watermark-image {
          width: 120%;
          height: auto;
          opacity: 0.15;
          transform: rotate(-35deg);
        }
      `}} />

      <div className="bg-white text-black min-h-[297mm] relative font-sans w-full p-4 print:p-0 z-10 mx-auto max-w-[210mm]">
        {/* Filigran (Watermark) */}
        <div className="watermark-container">
          <img src="/logo.png" alt="watermark" className="watermark-image" />
        </div>

        <div className="relative z-10">
          {/* Üst Bilgiler (Header) */}
          <div className="flex justify-between items-start mb-4">
            <div className="flex flex-col">
              <div className="w-[220px] h-[70px] relative">
                <Image
                  src="/logo.png"
                  alt="MSY Elektronik"
                  fill
                  className="object-contain object-left"
                  priority
                />
              </div>
              <div className="text-[11px] mt-1 font-medium leading-tight">
                <p>cumhuriyet mahallesi 99.sokak no:17 A</p>
                <p>0545 685 5136</p>
                <p>msyelektronik55@gmail.com</p>
              </div>
            </div>
            <div className="text-right flex flex-col items-end pt-2">
              <h1 className="text-2xl font-bold mb-8 tracking-wide">SİPARİŞ FORMU</h1>
              <p className="text-[12px] font-medium">Tarih :{formattedDate}</p>
            </div>
          </div>

          {/* Müşteri Bilgileri */}
          <div className="border border-black mb-4 bg-white/60">
            <div className="font-bold text-[12px] border-b border-black p-1.5 px-3">
              MÜŞTERİ BİLGİLERİ
            </div>
            <div className="flex justify-between p-3 py-2 relative">
              <div className="text-[12px] leading-relaxed font-medium z-10">
                <div className="flex">
                  <span className="w-36">AdıSoyadı / Ünvanı</span>
                  <span>: {quote.customerName}</span>
                </div>
                <div className="flex">
                  <span className="w-36">Adres</span>
                  <span>: </span>
                </div>
                <div className="flex">
                  <span className="w-36">Telefon</span>
                  <span>: {quote.customerPhone}</span>
                </div>
              </div>
              {/* Marka Logoları (Sağ Üst Köşe) */}
              <div className="flex flex-col items-end justify-center gap-1.5 pr-2 z-10">
                 <div className="flex flex-col items-center border-b border-red-600 pb-0.5">
                   <span className="text-[22px] tracking-tighter italic font-black text-[#D3122A] leading-none">AUDIO</span>
                   <span className="text-[7px] bg-[#D3122A] text-white px-1 font-bold">Görüntülü Diafonları</span>
                 </div>
                 <div className="flex items-center text-[#D3122A]">
                   <span className="text-[24px] font-black italic lowercase tracking-tighter leading-none">alhua</span>
                   <span className="text-[5px] ml-1 text-black font-bold leading-tight">DAHUA<br/>TECHNOLOGY</span>
                 </div>
              </div>
            </div>
          </div>

          {/* Tablo */}
          <div className="w-full mb-4 bg-white/60">
            <table className="w-full border-collapse border border-black text-[11px] text-center">
              <thead>
                <tr className="bg-[#eaf4fb]">
                  <th className="border border-black p-2.5 font-bold w-32">Malzemenin Fotoğrafı</th>
                  <th className="border border-black p-2.5 font-bold">Malzemenin Adı</th>
                  <th className="border border-black p-2.5 font-bold w-16">Adet</th>
                  <th className="border border-black p-2.5 font-bold w-28">Birim Fiyatı</th>
                  <th className="border border-black p-2.5 font-bold w-28">Toplam Fiyat</th>
                </tr>
              </thead>
              <tbody>
                {paddedItems.map((item, idx) => {
                  if (item._isEmpty) {
                    return (
                      <tr key={\`empty-\${idx}\`} className="h-[60px]">
                        <td className="border border-black"></td>
                        <td className="border border-black"></td>
                        <td className="border border-black"></td>
                        <td className="border border-black"></td>
                        <td className="border border-black"></td>
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
                    <tr key={item.id} className="print-break-inside-avoid h-[60px]">
                      <td className="border border-black p-1 align-middle">
                        {imageSrc && (
                          <div className="w-14 h-14 mx-auto relative flex items-center justify-center">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={imageSrc}
                              alt={item.product.name}
                              className="max-w-full max-h-full object-contain"
                            />
                          </div>
                        )}
                      </td>
                      <td className="border border-black p-2 text-center align-middle text-[10px] font-medium px-4">
                        {renderProductName(item.product.name)}
                      </td>
                      <td className="border border-black p-2 font-bold align-middle text-[12px] bg-[#00000008]">
                        {item.quantity}
                      </td>
                      <td className="border border-black p-2 font-bold align-middle text-[11px]">
                        {Number(item.unitPrice).toLocaleString("tr-TR", { minimumFractionDigits: 0, maximumFractionDigits: 0 })} TL
                      </td>
                      <td className="border border-black p-2 font-bold align-middle text-[11px] bg-[#00000008]">
                        {lineTotal.toLocaleString("tr-TR", { minimumFractionDigits: 0, maximumFractionDigits: 0 })} TL
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Alt Kısım (Notlar ve Toplamlar) */}
          <div className="flex justify-between items-start print-break-inside-avoid bg-white/80">
            {/* Sol Kısım (Notlar) */}
            <div className="border border-black p-2 w-[55%] min-h-[140px] flex flex-col">
              <p className="text-red-600 font-bold text-[12px] mb-3">NOT: FİYATLARIMIZ KDV DAHİL DEĞİLDİR.</p>
              <div className="flex flex-col gap-4 pl-1">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-red-600 rounded-full"></div>
                  <span className="text-[11px]"></span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-red-600 rounded-full"></div>
                  <span className="text-[11px]"></span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-red-600 rounded-full"></div>
                  <span className="text-[11px]"></span>
                </div>
              </div>
            </div>

            {/* Sağ Kısım (Toplamlar) */}
            <div className="border border-black p-4 w-[42%] text-[12px]">
              <div className="flex justify-between mb-5 font-medium">
                <span>Malzeme Toplamı:</span>
                <span>{itemsSubtotal.toLocaleString("tr-TR", { minimumFractionDigits: 0 })} TL</span>
              </div>
              <div className="flex justify-between mb-5 font-medium">
                <span>İşçilik Toplamı</span>
                <span>: TL</span>
              </div>
              <div className="flex justify-between mb-5 font-medium">
                <span>KDV %20</span>
                <span>: TL</span>
              </div>
              <div className="flex justify-between mt-6 font-medium">
                <span>Genel Toplam</span>
                <span>: {generalTotal.toLocaleString("tr-TR", { minimumFractionDigits: 0 })} TL</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
