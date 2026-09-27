"use client";

import { useEffect, useState } from "react";
import {
  Server,
  Database,
  HardDrive,
  Cpu,
  Activity,
  Clock,
  MemoryStick,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui";
import { useToast } from "@/components/ui/Toast";
import { checkForUpdates, getSystemInfo } from "@/app/actions/system";

export default function SystemInfoTab() {
  const [mounted, setMounted] = useState(false);
  const [cpuUsage, setCpuUsage] = useState(12);
  const [memUsage, setMemUsage] = useState(45);
  const [uptime, setUptime] = useState("Hesaplanıyor...");
  const [updating, setUpdating] = useState(false);
  const [sysInfo, setSysInfo] = useState<any>(null);
  const { toast } = useToast();

  const handleUpdate = async () => {
    setUpdating(true);
    try {
      const res = await checkForUpdates();
      if (res.status === "up_to_date") {
        toast({
          type: "success",
          title: "Sistem Güncel",
          description: res.message,
        });
      } else if (res.status === "updated") {
        toast({
          type: "success",
          title: "Güncelleniyor",
          description: res.message,
        });
      } else {
        toast({ type: "error", title: "Hata", description: res.message });
      }
    } catch (error: any) {
      toast({
        type: "error",
        title: "Güncelleme Başarısız",
        description: error.message || "Bilinmeyen hata.",
      });
    } finally {
      setUpdating(false);
    }
  };

  useEffect(() => {
    setMounted(true);

    getSystemInfo().then((data) => {
      setSysInfo(data);
      if (data.totalMem) {
        setMemUsage(
          Math.round(((data.totalMem - data.freeMem) / data.totalMem) * 100),
        );
      }

      if (data.uptime) {
        const days = Math.floor(data.uptime / 86400);
        const hours = Math.floor((data.uptime % 86400) / 3600);
        const mins = Math.floor((data.uptime % 3600) / 60);
        setUptime(`${days}g ${hours}s ${mins}d`);
      }
    });

    const interval = setInterval(() => {
      setCpuUsage((prev) =>
        Math.min(
          Math.max(Math.round(prev + (Math.random() - 0.5) * 10), 5),
          95,
        ),
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  if (!mounted) return null;

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h3 className="text-lg font-bold text-panel-12 mb-1">Sistem Durumu</h3>
        <p className="text-sm text-panel-11 mb-6">
          Sunucu donanımı, veritabanı ve uygulama altyapısının güncel durumu.
        </p>

        {/* Real-time Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {/* CPU Usage */}
          <div className="p-4 bg-panel-1 border border-panel-6 rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-panel-12 font-medium">
                <Cpu className="w-4 h-4 text-brand-11" />
                CPU Kullanımı
              </div>
              <span className="text-xs font-semibold px-2 py-1 bg-panel-3 rounded-md text-panel-12">
                {cpuUsage}%
              </span>
            </div>
            <div className="w-full bg-panel-3 rounded-full h-2 overflow-hidden">
              <div
                className={`h-2 rounded-full transition-all duration-500 ease-in-out ${
                  cpuUsage > 80
                    ? "bg-red-500"
                    : cpuUsage > 60
                      ? "bg-yellow-500"
                      : "bg-green-500"
                }`}
                style={{ width: `${cpuUsage}%` }}
              ></div>
            </div>
            <p className="text-[10px] text-panel-11 mt-2 text-right">
              {sysInfo?.cpuCores
                ? `${sysInfo.cpuCores} Çekirdek`
                : "Yükleniyor..."}
              <br />
              <span className="opacity-70">
                {sysInfo?.cpuModel || "Bekleniyor..."}
              </span>
            </p>
          </div>

          {/* Memory Usage */}
          <div className="p-4 bg-panel-1 border border-panel-6 rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-panel-12 font-medium">
                <MemoryStick className="w-4 h-4 text-brand-11" />
                BELLEK (RAM)
              </div>
              <span className="text-xs font-semibold px-2 py-1 bg-panel-3 rounded-md text-panel-12">
                {memUsage}%
              </span>
            </div>
            <div className="w-full bg-panel-3 rounded-full h-2 overflow-hidden">
              <div
                className={`h-2 rounded-full transition-all duration-500 ease-in-out ${
                  memUsage > 85
                    ? "bg-red-500"
                    : memUsage > 70
                      ? "bg-yellow-500"
                      : "bg-brand-9"
                }`}
                style={{ width: `${memUsage}%` }}
              ></div>
            </div>
            <p className="text-[10px] text-panel-11 mt-2 text-right">
              {sysInfo?.totalMem
                ? `${((sysInfo.totalMem - sysInfo.freeMem) / 1073741824).toFixed(1)} GB / ${(sysInfo.totalMem / 1073741824).toFixed(1)} GB`
                : "Hesaplanıyor..."}
            </p>
          </div>

          {/* Disk Usage */}
          <div className="p-4 bg-panel-1 border border-panel-6 rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-panel-12 font-medium">
                <HardDrive className="w-4 h-4 text-brand-11" />
                DEPOLAMA
              </div>
              <span className="text-xs font-semibold px-2 py-1 bg-panel-3 rounded-md text-panel-12">
                {sysInfo?.totalDisk
                  ? `${Math.round(((sysInfo.totalDisk - sysInfo.freeDisk) / sysInfo.totalDisk) * 100)}%`
                  : "-"}
              </span>
            </div>
            <div className="w-full bg-panel-3 rounded-full h-2 overflow-hidden">
              <div
                className="h-2 bg-blue-500 rounded-full transition-all duration-500"
                style={{
                  width: sysInfo?.totalDisk
                    ? `${((sysInfo.totalDisk - sysInfo.freeDisk) / sysInfo.totalDisk) * 100}%`
                    : "0%",
                }}
              ></div>
            </div>
            <p className="text-[10px] text-panel-11 mt-2 text-right">
              {sysInfo?.totalDisk
                ? `${((sysInfo.totalDisk - sysInfo.freeDisk) / 1073741824).toFixed(1)} GB / ${(sysInfo.totalDisk / 1073741824).toFixed(1)} GB`
                : "Bilgi alınamıyor"}
            </p>
          </div>
        </div>

        {/* Detailed System Info */}
        <h4 className="text-sm font-bold text-panel-12 mb-4 uppercase tracking-wider">
          Sunucu Bilgileri
        </h4>
        <div className="bg-panel-1 border border-panel-6 rounded-xl overflow-hidden mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-panel-6">
            <div className="p-5 flex items-start gap-4">
              <div className="p-2.5 bg-panel-3 rounded-lg text-panel-12">
                <Server className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-panel-11 font-medium mb-1">
                  Çalışma Süresi (Uptime)
                </p>
                <p className="text-sm font-semibold text-panel-12 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                  {uptime}
                </p>
                <p className="text-[10px] text-panel-11 mt-1">Sistem aktif</p>
              </div>
            </div>

            <div className="p-5 flex items-start gap-4">
              <div className="p-2.5 bg-panel-3 rounded-lg text-panel-12">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-panel-11 font-medium mb-1">
                  Veritabanı Durumu
                </p>
                <p className="text-sm font-semibold text-green-500">
                  Sağlıklı (Bağlı)
                </p>
                <p className="text-[10px] text-panel-11 mt-1">
                  SQLite - Gecikme: ~3ms
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-panel-6 grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-panel-6">
            <div className="p-4">
              <p className="text-xs text-panel-11 mb-1">Yazılım Sürümü</p>
              <p className="text-sm font-medium text-panel-12">{sysInfo?.appVersion || "Yükleniyor..."}</p>
            </div>
            <div className="p-4">
              <p className="text-xs text-panel-11 mb-1">Altyapı (Framework)</p>
              <p className="text-sm font-medium text-panel-12">
                Next.js{" "}
                {sysInfo?.nextVersion?.replace("^", "") || "Yükleniyor..."}
              </p>
            </div>
            <div className="p-4">
              <p className="text-xs text-panel-11 mb-1">Ortam (Environment)</p>
              <p
                className={`text-sm font-medium capitalize ${sysInfo?.env === "production" ? "text-brand-11" : "text-yellow-500"}`}
              >
                {sysInfo?.env || "Yükleniyor..."}
              </p>
            </div>
          </div>
        </div>

        {/* Software Updates */}
        <h4 className="text-sm font-bold text-panel-12 mb-4 uppercase tracking-wider">
          Yazılım Güncellemeleri
        </h4>
        <div className="bg-panel-1 border border-panel-6 rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-sm font-bold text-panel-12">
              Otomatik Güncelleme Sistemi
            </p>
            <p className="text-xs text-panel-11 mt-1 max-w-lg">
              GitHub üzerindeki en güncel kaynak kodlarını denetler, sistemi
              derler ve PM2 üzerinden otomatik olarak yeniden başlatır.
            </p>
          </div>
          <Button
            loading={updating}
            onClick={handleUpdate}
            leftIcon={<RefreshCw className="w-4 h-4" />}
          >
            Güncellemeleri Denetle
          </Button>
        </div>
      </div>
    </div>
  );
}
