import { Loader2 } from "lucide-react";

export default function DashboardLoading() {
  return (
    <div className="w-full h-[60vh] flex flex-col items-center justify-center space-y-4">
      <Loader2 className="w-10 h-10 text-brand-9 animate-spin" />
      <p className="text-panel-11 text-sm animate-pulse">
        Sayfa yükleniyor, lütfen bekleyin...
      </p>
    </div>
  );
}
