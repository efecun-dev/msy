import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { FileText } from "lucide-react";

export default async function QuotesPage() {
  const quotes = await prisma.quote.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-panel-12">Teklifler</h1>
          <p className="text-panel-11 text-xs mt-1">
            Tüm müşteri tekliflerini buradan yönetebilirsiniz.
          </p>
        </div>
      </div>

      <div className="bg-panel-1 border border-panel-6 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap min-w-[800px]">
            <thead className="bg-panel-2 text-panel-11 border-b border-panel-6">
              <tr>
                <th className="px-6 py-4 font-medium">Teklif No</th>
                <th className="px-6 py-4 font-medium">Müşteri</th>
                <th className="px-6 py-4 font-medium">Telefon</th>
                <th className="px-6 py-4 font-medium">Tutar</th>
                <th className="px-6 py-4 font-medium">Durum</th>
                <th className="px-6 py-4 font-medium text-right">Tarih</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-panel-6 text-panel-12">
              {quotes.map((quote) => (
                <tr
                  key={quote.id}
                  className="hover:bg-panel-3 transition-colors"
                >
                  <td className="px-6 py-4">
                    <Link
                      href={`/dashboard/quotes/${quote.id}`}
                      className="font-semibold text-brand-11 hover:text-brand-12"
                    >
                      {quote.quoteNumber}
                    </Link>
                  </td>
                  <td className="px-6 py-4">{quote.customerName}</td>
                  <td className="px-6 py-4">{quote.customerPhone}</td>
                  <td className="px-6 py-4 font-semibold">
                    ₺{Number(quote.totalAmount).toLocaleString("tr-TR")}
                  </td>
                  <td className="px-6 py-4">
                    {quote.status === "PENDING" && (
                      <span className="px-2 py-1 bg-brand-3 text-brand-11 rounded text-xs font-semibold">
                        Beklemede
                      </span>
                    )}
                    {quote.status === "CONTACTED" && (
                      <span className="px-2 py-1 bg-amber-500/20 text-amber-500 rounded text-xs font-semibold">
                        Arandı
                      </span>
                    )}
                    {quote.status === "NEGOTIATING" && (
                      <span className="px-2 py-1 bg-orange-500/20 text-orange-500 rounded text-xs font-semibold">
                        Görüşülüyor
                      </span>
                    )}
                    {quote.status === "ACCEPTED" && (
                      <span className="px-2 py-1 bg-green-500/20 text-green-500 rounded text-xs font-semibold">
                        Kabul
                      </span>
                    )}
                    {quote.status === "REJECTED" && (
                      <span className="px-2 py-1 bg-red-500/20 text-red-500 rounded text-xs font-semibold">
                        Red
                      </span>
                    )}
                    {quote.status === "CANCELLED" && (
                      <span className="px-2 py-1 bg-panel-4 text-panel-11 rounded text-xs font-semibold">
                        İptal
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right text-panel-11">
                    {new Date(quote.createdAt).toLocaleDateString("tr-TR")}
                  </td>
                </tr>
              ))}
              {quotes.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-panel-11"
                  >
                    <div className="flex flex-col items-center justify-center">
                      <FileText className="w-8 h-8 mb-2 text-panel-8" />
                      <p>Kayıtlı teklif bulunamadı.</p>
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
