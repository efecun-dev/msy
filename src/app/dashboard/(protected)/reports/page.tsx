import { prisma } from "@/lib/prisma";
import { FileText, TrendingUp, Users, ShoppingBag } from "lucide-react";
import DashboardChart from "@/components/admin/DashboardChart";

export default async function ReportsPage() {
  const allQuotes = await prisma.quote.findMany({
    include: { items: { include: { product: true } } },
  });

  const totalRevenue = allQuotes
    .filter((q) => q.status === "ACCEPTED")
    .reduce((sum, q) => sum + Number(q.totalAmount), 0);

  const pendingRevenue = allQuotes
    .filter(
      (q) =>
        q.status === "PENDING" ||
        q.status === "NEGOTIATING" ||
        q.status === "CONTACTED",
    )
    .reduce((sum, q) => sum + Number(q.totalAmount), 0);

  const conversionRate =
    allQuotes.length > 0
      ? (
          (allQuotes.filter((q) => q.status === "ACCEPTED").length /
            allQuotes.length) *
          100
        ).toFixed(1)
      : "0.0";

  // Category Distribution
  const categoryCount: Record<string, number> = {};
  allQuotes.forEach((q) => {
    q.items.forEach((i) => {
      const cat = i.product.category;
      categoryCount[cat] = (categoryCount[cat] || 0) + i.quantity;
    });
  });

  const topCategories = Object.entries(categoryCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

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
    const total = allQuotes
      .filter(
        (q) =>
          q.status === "ACCEPTED" && new Date(q.createdAt).getMonth() === index,
      )
      .reduce((sum, q) => sum + Number(q.totalAmount), 0);
    return { name: month, total };
  });
  const currentMonthIndex = new Date().getMonth();
  const chartData = monthlyData.slice(0, currentMonthIndex + 1);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-panel-12">
            Raporlar ve İstatistikler
          </h1>
          <p className="text-panel-11 text-xs mt-1">
            İşletmenizle ilgili detaylı analizler ve performans metrikleri.
          </p>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-panel-1 border border-panel-6 rounded-lg p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-500/10 text-green-500 rounded-lg">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-semibold text-panel-11">
              Toplam Gerçekleşen Ciro
            </h3>
          </div>
          <p className="text-2xl font-bold text-panel-12">
            ₺{totalRevenue.toLocaleString("tr-TR")}
          </p>
        </div>
        <div className="bg-panel-1 border border-panel-6 rounded-lg p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-amber-500/10 text-amber-500 rounded-lg">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-semibold text-panel-11">
              Bekleyen Potansiyel Ciro
            </h3>
          </div>
          <p className="text-2xl font-bold text-panel-12">
            ₺{pendingRevenue.toLocaleString("tr-TR")}
          </p>
        </div>
        <div className="bg-panel-1 border border-panel-6 rounded-lg p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-brand-4 text-brand-11 rounded-lg">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-semibold text-panel-11">
              Teklif Dönüşüm Oranı
            </h3>
          </div>
          <p className="text-2xl font-bold text-panel-12">%{conversionRate}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="lg:col-span-2 bg-panel-1 border border-panel-6 rounded-lg p-5">
          <h2 className="text-sm font-bold text-panel-12 mb-6">
            Aylık Gerçekleşen Ciro Grafiği
          </h2>
          <DashboardChart data={chartData} />
        </div>

        {/* Category Stats */}
        <div className="bg-panel-1 border border-panel-6 rounded-lg p-5">
          <div className="flex items-center gap-2 mb-6">
            <ShoppingBag className="w-5 h-5 text-brand-11" />
            <h2 className="text-sm font-bold text-panel-12">
              En Çok İlgi Gören Kategoriler
            </h2>
          </div>
          <div className="space-y-4">
            {topCategories.map(([category, count], idx) => (
              <div key={idx}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-panel-12 font-medium">{category}</span>
                  <span className="text-panel-11">{count} Adet</span>
                </div>
                <div className="w-full bg-panel-3 rounded-full h-1.5">
                  <div
                    className="bg-brand-9 h-1.5 rounded-full"
                    style={{
                      width: `${Math.min((count / (topCategories[0][1] || 1)) * 100, 100)}%`,
                    }}
                  />
                </div>
              </div>
            ))}
            {topCategories.length === 0 && (
              <p className="text-xs text-panel-11 text-center py-4">
                Henüz veri yok.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
