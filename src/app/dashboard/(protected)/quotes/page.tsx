import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { FileText, Printer, ArrowRight } from "lucide-react";
import ManualQuoteModal from "@/components/admin/ManualQuoteModal";

export default async function QuotesPage() {
  const [quotes, products] = await Promise.all([
    prisma.quote.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: { items: true },
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

  // Convert Decimal prices to plain numbers for client component props
  const serializedProducts = products.map((p) => ({
    ...p,
    price: Number(p.price),
  }));

  return (
    <div className="space-y-6">
      {/* ─── Header ───────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-panel-12">Teklifler</h1>
          <p className="text-panel-11 text-xs mt-1">
            Gelen müşteri tekliflerini inceleyin veya anında yeni manuel teklif oluşturun.
          </p>
        </div>
        <ManualQuoteModal products={serializedProducts} />
      </div>

      {/* ─── Teklifler Listesi Tablosu ───────────────────────────────────── */}
      <div className="bg-panel-1 border border-panel-6 rounded-lg overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap min-w-[850px]">
            <thead className="bg-panel-2 text-panel-11 border-b border-panel-6">
              <tr>
                <th className="px-6 py-3.5 font-medium">Teklif No</th>
                <th className="px-6 py-3.5 font-medium">Müşteri</th>
                <th className="px-6 py-3.5 font-medium">İletişim</th>
                <th className="px-6 py-3.5 font-medium">Kalem</th>
                <th className="px-6 py-3.5 font-medium">Tutar</th>
                <th className="px-6 py-3.5 font-medium">Durum</th>
                <th className="px-6 py-3.5 font-medium text-right">Tarih</th>
                <th className="px-6 py-3.5 font-medium text-right">Aksiyon</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-panel-6 text-panel-12">
              {quotes.map((quote) => (
                <tr
                  key={quote.id}
                  className="hover:bg-panel-3/70 transition-colors group"
                >
                  {/* Teklif No */}
                  <td className="px-6 py-4">
                    <Link
                      href={`/dashboard/quotes/${quote.id}`}
                      className="font-bold text-brand-11 hover:text-brand-12 font-mono flex items-center gap-1.5"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>{quote.quoteNumber}</span>
                    </Link>
                  </td>

                  {/* Müşteri */}
                  <td className="px-6 py-4 font-medium">
                    {quote.customerName}
                  </td>

                  {/* İletişim */}
                  <td className="px-6 py-4 text-xs text-panel-11">
                    <p>{quote.customerPhone}</p>
                    {quote.customerEmail && (
                      <p className="text-[11px] opacity-75">{quote.customerEmail}</p>
                    )}
                  </td>

                  {/* Kalem Sayısı */}
                  <td className="px-6 py-4 text-xs text-panel-11">
                    <span className="font-semibold text-panel-12">
                      {quote._count.items}
                    </span>{" "}
                    ürün
                  </td>

                  {/* Tutar */}
                  <td className="px-6 py-4 font-mono font-bold text-panel-12">
                    ₺{Number(quote.totalAmount).toLocaleString("tr-TR", { minimumFractionDigits: 2 })}
                  </td>

                  {/* Durum */}
                  <td className="px-6 py-4">
                    {quote.status === "PENDING" && (
                      <span className="px-2 py-1 bg-brand-3 text-brand-11 border border-brand-6 rounded text-xs font-semibold">
                        Beklemede
                      </span>
                    )}
                    {quote.status === "CONTACTED" && (
                      <span className="px-2 py-1 bg-amber-500/15 text-amber-500 border border-amber-500/30 rounded text-xs font-semibold">
                        Arandı
                      </span>
                    )}
                    {quote.status === "NEGOTIATING" && (
                      <span className="px-2 py-1 bg-orange-500/15 text-orange-500 border border-orange-500/30 rounded text-xs font-semibold">
                        Görüşülüyor
                      </span>
                    )}
                    {quote.status === "ACCEPTED" && (
                      <span className="px-2 py-1 bg-emerald-500/15 text-emerald-500 border border-emerald-500/30 rounded text-xs font-semibold">
                        Kabul Edildi
                      </span>
                    )}
                    {quote.status === "REJECTED" && (
                      <span className="px-2 py-1 bg-rose-500/15 text-rose-500 border border-rose-500/30 rounded text-xs font-semibold">
                        Reddedildi
                      </span>
                    )}
                    {quote.status === "CANCELLED" && (
                      <span className="px-2 py-1 bg-panel-4 text-panel-11 border border-panel-6 rounded text-xs font-semibold">
                        İptal
                      </span>
                    )}
                  </td>

                  {/* Tarih */}
                  <td className="px-6 py-4 text-right text-xs text-panel-11">
                    {new Date(quote.createdAt).toLocaleDateString("tr-TR")}
                  </td>

                  {/* Aksiyon */}
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/dashboard/quotes/${quote.id}`}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded bg-panel-2 hover:bg-panel-4 border border-panel-6 text-panel-12 transition-colors"
                        title="Detay & PDF Yazdır"
                      >
                        <Printer className="w-3.5 h-3.5 text-panel-11" />
                        <span>Detay / PDF</span>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}

              {quotes.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="px-6 py-12 text-center text-panel-11"
                  >
                    <div className="flex flex-col items-center justify-center">
                      <FileText className="w-10 h-10 mb-2 text-panel-8" />
                      <p className="font-medium text-panel-12">Kayıtlı teklif bulunamadı.</p>
                      <p className="text-xs text-panel-11 mt-1">
                        Yukarıdaki "Yeni Teklif Oluştur" butonunu kullanarak ilk teklifi oluşturabilirsiniz.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
