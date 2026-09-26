import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, User, Phone, Mail, Calendar } from "lucide-react";
import { Badge } from "@/components/ui";
import QuoteDetailClient from "@/components/admin/QuoteDetailClient";
import PrintButton from "@/components/admin/PrintButton";

export default async function QuoteDetailPage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const quote = await prisma.quote.findUnique({
    where: { id: parseInt(params.id) },
    include: {
      items: {
        include: { product: true },
      },
    },
  });

  if (!quote) return notFound();

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-panel-6">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/quotes"
            className="p-1.5 rounded bg-panel-2 hover:bg-panel-3 border border-panel-6 text-panel-11 hover:text-panel-12 transition-colors print:hidden"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-sm font-bold flex items-center gap-2 text-panel-12">
              Teklif #{quote.quoteNumber}
              {quote.status === "PENDING" && (
                <span className="px-1.5 py-0.5 bg-brand-3 text-brand-11 rounded text-[10px] font-bold uppercase tracking-wider">
                  Beklemede
                </span>
              )}
              {quote.status === "CONTACTED" && (
                <span className="px-1.5 py-0.5 bg-amber-500/20 text-amber-500 rounded text-[10px] font-bold uppercase tracking-wider">
                  Arandı
                </span>
              )}
              {quote.status === "NEGOTIATING" && (
                <span className="px-1.5 py-0.5 bg-orange-500/20 text-orange-500 rounded text-[10px] font-bold uppercase tracking-wider">
                  Görüşülüyor
                </span>
              )}
              {quote.status === "ACCEPTED" && (
                <span className="px-1.5 py-0.5 bg-green-500/20 text-green-500 rounded text-[10px] font-bold uppercase tracking-wider">
                  Kabul
                </span>
              )}
              {quote.status === "REJECTED" && (
                <span className="px-1.5 py-0.5 bg-red-500/20 text-red-500 rounded text-[10px] font-bold uppercase tracking-wider">
                  Reddedildi
                </span>
              )}
              {quote.status === "CANCELLED" && (
                <span className="px-1.5 py-0.5 bg-panel-4 text-panel-11 rounded text-[10px] font-bold uppercase tracking-wider">
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
        <div className="flex items-center gap-6 text-right">
          <PrintButton />
          <div>
            <p className="text-[10px] text-panel-11 uppercase font-semibold">
              Toplam Tutar
            </p>
            <p className="text-base font-bold text-panel-12">
              ₺{Number(quote.totalAmount).toLocaleString("tr-TR")}
            </p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-4 print:block">
        {/* Sol Kolon: Ürünler ve Not */}
        <div className="lg:col-span-3 space-y-4 print:w-full min-w-0">
          <div className="bg-panel-1 border border-panel-6 rounded">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs whitespace-nowrap min-w-[500px]">
                <thead className="bg-panel-2 border-b border-panel-6 text-panel-11">
                  <tr>
                    <th className="px-3 py-2 font-medium">Ürün</th>
                    <th className="px-3 py-2 font-medium">Birim Fiyat</th>
                    <th className="px-3 py-2 font-medium text-center">
                      Miktar
                    </th>
                    <th className="px-3 py-2 font-medium text-right">Toplam</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-panel-6 text-panel-12">
                  {quote.items.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-panel-2/50 transition-colors"
                    >
                      <td className="px-3 py-2 font-medium">
                        {item.product.name}
                      </td>
                      <td className="px-3 py-2">
                        ₺{Number(item.unitPrice).toLocaleString("tr-TR")}
                      </td>
                      <td className="px-3 py-2 text-center font-bold">
                        {item.quantity}x
                      </td>
                      <td className="px-3 py-2 text-right font-bold">
                        ₺
                        {(
                          Number(item.unitPrice) * item.quantity
                        ).toLocaleString("tr-TR")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {quote.note && (
            <div className="bg-panel-1 border border-panel-6 rounded p-3">
              <h3 className="font-bold text-panel-12 text-[11px] uppercase tracking-wider mb-1">
                Müşteri Notu
              </h3>
              <p className="text-panel-11 italic text-xs">"{quote.note}"</p>
            </div>
          )}
        </div>

        {/* Sağ Kolon: Bilgiler ve Form */}
        <div className="lg:col-span-1 space-y-4 min-w-0">
          <div className="bg-panel-1 border border-panel-6 rounded p-3">
            <h3 className="text-[11px] font-bold uppercase tracking-wider border-b border-panel-6 pb-2 mb-2 text-panel-12">
              Müşteri Bilgileri
            </h3>
            <div className="space-y-2.5 text-xs text-panel-12">
              <div className="flex items-center gap-2">
                <User className="w-3.5 h-3.5 text-panel-11" />
                <span className="font-medium">{quote.customerName}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-panel-11" />
                <a
                  href={`tel:${quote.customerPhone}`}
                  className="text-brand-11 hover:underline"
                >
                  {quote.customerPhone}
                </a>
              </div>
              {quote.customerPhone && (
                <div className="flex items-center gap-2 ml-5.5">
                  <a
                    href={`https://wa.me/${quote.customerPhone.replace(/[^0-9]/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-2 py-0.5 bg-green-500/10 border border-green-500/20 text-green-600 rounded text-[10px] font-semibold hover:bg-green-500/20 transition-colors"
                  >
                    WhatsApp'tan Yaz
                  </a>
                </div>
              )}
              {quote.customerEmail && (
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-panel-11" />
                  <a
                    href={`mailto:${quote.customerEmail}`}
                    className="text-brand-11 hover:underline"
                  >
                    {quote.customerEmail}
                  </a>
                </div>
              )}
            </div>
          </div>

          <div className="print:hidden">
            <QuoteDetailClient
              quoteId={quote.id}
              initialStatus={quote.status}
              initialAdminNote={quote.adminNote}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
