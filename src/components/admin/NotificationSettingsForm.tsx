"use client";

import { useState } from "react";
import { Button, Switch } from "@/components/ui";
import { useToast } from "@/components/ui/Toast";
import { saveSettings } from "@/app/actions/settings";
import { Bell, Mail, Smartphone } from "lucide-react";

export default function NotificationSettingsForm({
  settings,
}: {
  settings: Record<string, string>;
}) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const [notifyNewQuote, setNotifyNewQuote] = useState(
    settings["notify_new_quote"] === "true",
  );
  const [notifyNewMessage, setNotifyNewMessage] = useState(
    settings["notify_new_message"] === "true",
  );
  const [notifyDailySummary, setNotifyDailySummary] = useState(
    settings["notify_daily_summary"] === "true",
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("notify_new_quote", notifyNewQuote.toString());
      formData.append("notify_new_message", notifyNewMessage.toString());
      formData.append("notify_daily_summary", notifyDailySummary.toString());

      await saveSettings(formData);
      toast({
        type: "success",
        title: "Başarılı",
        description: "Bildirim ayarları kaydedildi.",
      });
    } catch (error) {
      toast({
        type: "error",
        title: "Hata",
        description: "Ayarlar kaydedilirken bir hata oluştu.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <div>
        <h3 className="text-lg font-bold text-panel-12 mb-1">
          Bildirim Ayarları
        </h3>
        <p className="text-sm text-panel-11 mb-6">
          Sistemdeki önemli olaylar için nasıl bildirim alacağınızı yönetin.
        </p>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-panel-1 border border-panel-6 rounded-xl">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-brand-3 text-brand-11 rounded-lg">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-panel-12">
                  Yeni Teklif Bildirimleri
                </h4>
                <p className="text-xs text-panel-11 mt-1">
                  Müşteri yeni bir teklif talebi oluşturduğunda e-posta
                  alırsınız.
                </p>
              </div>
            </div>
            <Switch checked={notifyNewQuote} onChange={setNotifyNewQuote} />
          </div>

          <div className="flex items-center justify-between p-4 bg-panel-1 border border-panel-6 rounded-xl">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-brand-3 text-brand-11 rounded-lg">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-panel-12">
                  İletişim Mesajı Bildirimleri
                </h4>
                <p className="text-xs text-panel-11 mt-1">
                  İletişim formundan yeni bir mesaj geldiğinde e-posta
                  alırsınız.
                </p>
              </div>
            </div>
            <Switch checked={notifyNewMessage} onChange={setNotifyNewMessage} />
          </div>

          <div className="flex items-center justify-between p-4 bg-panel-1 border border-panel-6 rounded-xl">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-brand-3 text-brand-11 rounded-lg">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-panel-12">
                  Günlük Özet Raporu
                </h4>
                <p className="text-xs text-panel-11 mt-1">
                  Her günün sonunda bekleyen teklifleri ve istatistikleri özet
                  olarak alırsınız.
                </p>
              </div>
            </div>
            <Switch
              checked={notifyDailySummary}
              onChange={setNotifyDailySummary}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t border-panel-6">
        <Button type="submit" loading={loading} className="w-full sm:w-auto">
          Ayarları Kaydet
        </Button>
      </div>
    </form>
  );
}
