"use client";

import { useState } from "react";
import { Button, Input, Textarea } from "@/components/ui";
import { useToast } from "@/components/ui/Toast";
import { saveSettings } from "@/app/actions/settings";

export default function SettingsForm({
  settings,
}: {
  settings: Record<string, string>;
}) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      await saveSettings(formData);
      toast({
        title: "Başarılı",
        description: "Ayarlar kaydedildi.",
        type: "success",
      });
    } catch (error: any) {
      toast({
        title: "Hata",
        description: error.message || "Bir hata oluştu",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <h3 className="text-lg font-bold text-panel-12 mb-4">Genel Ayarlar</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Firma Adı"
          name="companyName"
          defaultValue={settings.companyName || "MSY Elektronik"}
        />
        <Input
          label="Telefon Numarası"
          name="phoneNumber"
          defaultValue={settings.phoneNumber || "0555 555 55 55"}
        />
        <Input
          label="İletişim E-posta"
          name="contactEmail"
          type="email"
          defaultValue={settings.contactEmail || "info@msyelektronik.com"}
        />
        <Input
          label="KDV Oranı (%)"
          name="taxRate"
          type="number"
          defaultValue={settings.taxRate || "20"}
        />
      </div>

      <Textarea
        label="Adres"
        name="address"
        rows={3}
        defaultValue={settings.address || ""}
      />

      <div className="border-t border-panel-6 pt-6">
        <h4 className="text-sm font-bold text-panel-12 mb-4">Sosyal Medya</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Instagram URL"
            name="instagramUrl"
            defaultValue={settings.instagramUrl || ""}
          />
          <Input
            label="Facebook URL"
            name="facebookUrl"
            defaultValue={settings.facebookUrl || ""}
          />
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <Button type="submit" loading={loading}>
          Değişiklikleri Kaydet
        </Button>
      </div>
    </form>
  );
}
