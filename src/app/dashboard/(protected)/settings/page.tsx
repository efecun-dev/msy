import { prisma } from "@/lib/prisma";
import SettingsTabs from "./SettingsTabs";

export default async function SettingsPage() {
  const dbSettings = await prisma.setting.findMany();

  // Convert array to object
  const settings = dbSettings.reduce(
    (acc, curr) => {
      acc[curr.key] = curr.value;
      return acc;
    },
    {} as Record<string, string>,
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-panel-12">Ayarlar</h1>
          <p className="text-panel-11 text-xs mt-1">
            Sistem ve profil ayarlarınızı buradan yapılandırabilirsiniz.
          </p>
        </div>
      </div>

      <div className="bg-panel-1 border border-panel-6 rounded-lg overflow-hidden">
        {/* Simple Tabs implementation right in the page or rely on components */}
        <SettingsTabs settings={settings} />
      </div>
    </div>
  );
}
