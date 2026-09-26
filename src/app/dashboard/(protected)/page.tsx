import { prisma } from "@/lib/prisma";
import {
  CheckCircle,
  Clock,
  CheckSquare,
  Calendar,
  FileText,
  Settings,
  Package,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import DashboardChart from "@/components/admin/DashboardChart";

export default async function DashboardPage() {
  const totalQuotes = await prisma.quote.count();
  const pendingQuotes = await prisma.quote.count({
    where: { status: "PENDING" },
  });
  const acceptedQuotes = await prisma.quote.count({
    where: { status: "ACCEPTED" },
  });

  const recentQuotes = await prisma.quote.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
  });

  const allAcceptedQuotes = await prisma.quote.findMany({
    where: { status: "ACCEPTED" },
  });

  // Calculate daily revenue
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dailyRevenue = allAcceptedQuotes
    .filter((q) => new Date(q.updatedAt) >= today)
    .reduce((sum, q) => sum + Number(q.totalAmount), 0);

  // Calculate monthly data for chart
  const months = [
    "Ocak",
    "Şubat",
    "Mart",
    "Nisan",
    "Mayıs",
    "Haziran",
    "Temmuz",
    "Ağustos",
    "Eylül",
    "Ekim",
    "Kasım",
    "Aralık",
  ];
  const monthlyData = months.map((month, index) => {
    const total = allAcceptedQuotes
      .filter((q) => new Date(q.createdAt).getMonth() === index)
      .reduce((sum, q) => sum + Number(q.totalAmount), 0);
    return { name: month, total };
  });

  // Only show months up to current month for the chart
  const currentMonthIndex = new Date().getMonth();
  const chartData = monthlyData.slice(0, currentMonthIndex + 1);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-panel-12">Genel Bakış</h1>
          <p className="text-panel-11 text-xs mt-1">
            İşletmenizin anlık durumu.
          </p>
        </div>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Stat 1 */}
        <div className="bg-panel-1 border border-panel-6 rounded-lg p-4">
          <div className="w-7 h-7 rounded bg-brand-3 text-brand-11 flex items-center justify-center mb-3">
            <FileText className="w-3.5 h-3.5" />
          </div>
          <div className="text-2xl font-bold text-panel-12 mb-0.5">
            {totalQuotes}
          </div>
          <div className="text-xs font-medium text-panel-11">Toplam Teklif</div>
          <div className="text-[10px] text-panel-9 mt-1.5">— Tüm zamanlar</div>
        </div>

        {/* Stat 2 */}
        <div className="bg-panel-1 border border-panel-6 rounded-lg p-4">
          <div className="w-7 h-7 rounded bg-green-500/20 text-green-500 flex items-center justify-center mb-3">
            <CheckCircle className="w-3.5 h-3.5" />
          </div>
          <div className="text-2xl font-bold text-panel-12 mb-0.5">
            ₺{dailyRevenue.toLocaleString("tr-TR")}
          </div>
          <div className="text-xs font-medium text-panel-11">Günlük Ciro</div>
          <div className="text-[10px] font-semibold text-green-500 mt-1.5 flex items-center gap-1">
            <span className="text-sm leading-none">—</span> Sadece Onaylı
          </div>
        </div>

        {/* Stat 3 */}
        <div className="bg-panel-1 border border-panel-6 rounded-lg p-4">
          <div className="w-7 h-7 rounded bg-amber-500/20 text-amber-500 flex items-center justify-center mb-3">
            <CheckSquare className="w-3.5 h-3.5" />
          </div>
          <div className="text-2xl font-bold text-panel-12 mb-0.5">
            {acceptedQuotes}
          </div>
          <div className="text-xs font-medium text-panel-11">Tamamlanan</div>
          <div className="text-[10px] text-panel-9 mt-1.5">— Onaylananlar</div>
        </div>

        {/* Stat 4 */}
        <div className="bg-panel-1 border border-panel-6 rounded-lg p-4">
          <div className="w-7 h-7 rounded bg-red-500/20 text-red-500 flex items-center justify-center mb-3">
            <Clock className="w-3.5 h-3.5" />
          </div>
          <div className="text-2xl font-bold text-panel-12 mb-0.5">
            {pendingQuotes}
          </div>
          <div className="text-xs font-medium text-panel-11">Bekleyen</div>
          <div className="text-[10px] text-panel-9 mt-1.5">— Onay bekliyor</div>
        </div>
      </div>

      {/* Main Content Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col (Chart + Table) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Chart Section */}
          <div className="bg-panel-1 border border-panel-6 rounded-lg p-5">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-brand-3 text-brand-11 flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-panel-12">
                  Gelir Analizi
                </h2>
                <p className="text-xs text-panel-11">
                  Aylık ciro değişimi (2026)
                </p>
              </div>
            </div>
            <DashboardChart data={chartData} />
          </div>

          {/* Recent Quotes Table */}
          <div className="bg-panel-1 border border-panel-6 rounded-lg overflow-hidden">
            <div className="px-5 py-4 border-b border-panel-6 flex items-center justify-between bg-panel-2">
              <h2 className="text-sm font-bold text-panel-12">Son Teklifler</h2>
              <Link
                href="/dashboard/quotes"
                className="text-xs font-semibold text-brand-11 hover:text-brand-12"
              >
                Tümünü Gör
              </Link>
            </div>
            {recentQuotes.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap min-w-[600px]">
                  <thead className="bg-panel-2 text-panel-11 border-b border-panel-6">
                    <tr>
                      <th className="px-5 py-3 font-medium">No</th>
                      <th className="px-5 py-3 font-medium">Müşteri</th>
                      <th className="px-5 py-3 font-medium">Tutar</th>
                      <th className="px-5 py-3 font-medium">Durum</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-panel-6 text-panel-12">
                    {recentQuotes.map((quote) => (
                      <tr
                        key={quote.id}
                        className="hover:bg-panel-3 transition-colors"
                      >
                        <td className="px-5 py-3">
                          <Link
                            href={`/dashboard/quotes/${quote.id}`}
                            className="font-semibold text-brand-11 hover:text-brand-12"
                          >
                            {quote.quoteNumber}
                          </Link>
                        </td>
                        <td className="px-5 py-3">{quote.customerName}</td>
                        <td className="px-5 py-3 font-semibold">
                          ₺{Number(quote.totalAmount).toLocaleString("tr-TR")}
                        </td>
                        <td className="px-5 py-3">
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
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-8 text-center text-sm text-panel-11">
                Kayıtlı teklif bulunmuyor.
              </div>
            )}
          </div>
        </div>

        {/* Hızlı İşlemler (Right: 1 col) */}
        <div className="space-y-6">
          <div className="bg-panel-1 border border-panel-6 rounded-lg p-5">
            <h2 className="text-sm font-bold text-panel-12 mb-4">
              Hızlı İşlemler
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Link
                href="/dashboard/products"
                className="flex flex-col items-center justify-center p-4 bg-panel-2 hover:bg-panel-3 border border-panel-6 rounded-lg text-panel-12 transition-colors"
              >
                <Package className="w-5 h-5 mb-2 text-panel-11" />
                <span className="text-xs font-semibold">Stok Girişi</span>
              </Link>
              <Link
                href="/dashboard/reports"
                className="flex flex-col items-center justify-center p-4 bg-panel-2 hover:bg-panel-3 border border-panel-6 rounded-lg text-panel-12 transition-colors"
              >
                <FileText className="w-5 h-5 mb-2 text-panel-11" />
                <span className="text-xs font-semibold">Raporlar</span>
              </Link>
              <Link
                href="/dashboard/settings"
                className="flex flex-col items-center justify-center p-4 bg-panel-2 hover:bg-panel-3 border border-panel-6 rounded-lg text-panel-12 transition-colors"
              >
                <Settings className="w-5 h-5 mb-2 text-panel-11" />
                <span className="text-xs font-semibold">Ayarlar</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
