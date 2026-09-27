"use client";

import { useState } from "react";
import SettingsForm from "@/components/admin/SettingsForm";
import ProfileForm from "@/components/admin/ProfileForm";
import NotificationSettingsForm from "@/components/admin/NotificationSettingsForm";
import SystemInfoTab from "@/components/admin/SystemInfoTab";
import { Settings, User, Bell, Database } from "lucide-react";

export default function SettingsTabs({
  settings,
}: {
  settings: Record<string, string>;
}) {
  const [activeTab, setActiveTab] = useState("general");

  return (
    <div className="flex flex-col md:flex-row">
      <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-panel-6 bg-panel-2 p-4">
        <nav className="space-y-1">
          <button
            onClick={() => setActiveTab("general")}
            className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors cursor-pointer ${
              activeTab === "general"
                ? "bg-brand-3 text-brand-11"
                : "text-panel-11 hover:bg-panel-3 hover:text-panel-12"
            }`}
          >
            <Settings className="w-4 h-4" />
            Genel Ayarlar
          </button>
          <button
            onClick={() => setActiveTab("profile")}
            className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors cursor-pointer ${
              activeTab === "profile"
                ? "bg-brand-3 text-brand-11"
                : "text-panel-11 hover:bg-panel-3 hover:text-panel-12"
            }`}
          >
            <User className="w-4 h-4" />
            Profil
          </button>
          <button
            onClick={() => setActiveTab("notifications")}
            className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors cursor-pointer ${
              activeTab === "notifications"
                ? "bg-brand-3 text-brand-11"
                : "text-panel-11 hover:bg-panel-3 hover:text-panel-12"
            }`}
          >
            <Bell className="w-4 h-4" />
            Bildirimler
          </button>
          <button
            onClick={() => setActiveTab("system")}
            className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors cursor-pointer ${
              activeTab === "system"
                ? "bg-brand-3 text-brand-11"
                : "text-panel-11 hover:bg-panel-3 hover:text-panel-12"
            }`}
          >
            <Database className="w-4 h-4" />
            Sistem
          </button>
        </nav>
      </div>

      <div className="flex-1 p-6">
        {activeTab === "general" && <SettingsForm settings={settings} />}
        {activeTab === "profile" && <ProfileForm />}
        {activeTab === "notifications" && (
          <NotificationSettingsForm settings={settings} />
        )}
        {activeTab === "system" && <SystemInfoTab />}
      </div>
    </div>
  );
}
