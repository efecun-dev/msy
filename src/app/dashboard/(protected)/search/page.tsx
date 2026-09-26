import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Search, Package, FileText, Mail, ArrowRight } from "lucide-react";

export default async function SearchResultsPage(props: {
  searchParams: Promise<{ q?: string }>;
}) {
  const searchParams = await props.searchParams;
  const q = searchParams.q || "";

  if (!q) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-panel-11">
        <Search className="w-16 h-16 mb-4 opacity-50" />
        <h2 className="text-xl font-bold text-panel-12 mb-2">Arama Yapın</h2>
        <p>Müşteri, ürün veya teklif bulmak için arama çubuğunu kullanın.</p>
      </div>
    );
  }

  // Perform parallel searches
  const [products, quotes, messages] = await Promise.all([
    prisma.product.findMany({
      where: {
        OR: [
          { name: { contains: q } },
          { description: { contains: q } },
          { category: { contains: q } },
        ],
      },
      take: 10,
    }),
    prisma.quote.findMany({
      where: {
        OR: [
          { customerName: { contains: q } },
          { customerEmail: { contains: q } },
          { customerPhone: { contains: q } },
          { note: { contains: q } },
        ],
      },
      take: 10,
      orderBy: { createdAt: "desc" },
    }),
    prisma.contactMessage.findMany({
      where: {
        OR: [
          { name: { contains: q } },
          { email: { contains: q } },
          { subject: { contains: q } },
          { message: { contains: q } },
        ],
      },
      take: 10,
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const hasResults =
    products.length > 0 || quotes.length > 0 || messages.length > 0;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-panel-12 tracking-tight">
          Arama Sonuçları
        </h1>
        <p className="text-sm text-panel-11 mt-1">
          <span className="font-semibold text-brand-11">"{q}"</span> için
          bulunan sonuçlar
        </p>
      </div>

      {!hasResults ? (
        <div className="bg-panel-1 border border-panel-6 rounded-2xl p-12 text-center">
          <div className="w-16 h-16 bg-panel-3 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-panel-11" />
          </div>
          <h3 className="text-lg font-bold text-panel-12 mb-2">
            Sonuç Bulunamadı
          </h3>
          <p className="text-panel-11">
            Farklı anahtar kelimelerle tekrar aramayı deneyin.
          </p>
        </div>
      ) : (
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Quotes */}
          {quotes.length > 0 && (
            <div className="bg-panel-1 border border-panel-6 rounded-2xl p-6">
              <h2 className="flex items-center gap-2 font-bold text-panel-12 mb-4 pb-4 border-b border-panel-6">
                <FileText className="w-5 h-5 text-blue-500" />
                Teklifler ({quotes.length})
              </h2>
              <div className="space-y-3">
                {quotes.map((quote) => (
                  <Link
                    href={`/dashboard/quotes/${quote.id}`}
                    key={quote.id}
                    className="block bg-panel-2 hover:bg-panel-3 border border-panel-6 rounded-xl p-4 transition-colors group"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-semibold text-panel-12">
                          {quote.customerName}
                        </div>
                        <div className="text-sm text-panel-11 mt-1">
                          {quote.customerEmail}
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-panel-11 group-hover:text-brand-9 transition-colors" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Products */}
          {products.length > 0 && (
            <div className="bg-panel-1 border border-panel-6 rounded-2xl p-6">
              <h2 className="flex items-center gap-2 font-bold text-panel-12 mb-4 pb-4 border-b border-panel-6">
                <Package className="w-5 h-5 text-green-500" />
                Ürünler ({products.length})
              </h2>
              <div className="space-y-3">
                {products.map((product) => (
                  <Link
                    href={`/dashboard/products`}
                    key={product.id}
                    className="block bg-panel-2 hover:bg-panel-3 border border-panel-6 rounded-xl p-4 transition-colors group"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-semibold text-panel-12">
                          {product.name}
                        </div>
                        <div className="text-sm text-panel-11 mt-1">
                          {product.category} - ₺{product.price.toString()}
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-panel-11 group-hover:text-brand-9 transition-colors" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Messages */}
          {messages.length > 0 && (
            <div className="bg-panel-1 border border-panel-6 rounded-2xl p-6 lg:col-span-2">
              <h2 className="flex items-center gap-2 font-bold text-panel-12 mb-4 pb-4 border-b border-panel-6">
                <Mail className="w-5 h-5 text-purple-500" />
                Mesajlar ({messages.length})
              </h2>
              <div className="grid md:grid-cols-2 gap-3">
                {messages.map((msg) => (
                  <Link
                    href={`/dashboard/messages`}
                    key={msg.id}
                    className="block bg-panel-2 hover:bg-panel-3 border border-panel-6 rounded-xl p-4 transition-colors group"
                  >
                    <div className="font-semibold text-panel-12">
                      {msg.name}
                    </div>
                    <div className="text-sm text-brand-11 font-medium mt-1">
                      {msg.subject}
                    </div>
                    <div className="text-sm text-panel-11 mt-2 line-clamp-2">
                      {msg.message}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
