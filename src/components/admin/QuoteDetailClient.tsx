"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Select, Button, Textarea } from "@/components/ui";
import { useToast } from "@/components/ui/Toast";

interface QuoteDetailClientProps {
  quoteId: number;
  initialStatus: string;
  initialAdminNote: string | null;
}

export default function QuoteDetailClient({
  quoteId,
  initialStatus,
  initialAdminNote,
}: QuoteDetailClientProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [status, setStatus] = useState(initialStatus);
  const [adminNote, setAdminNote] = useState(initialAdminNote || "");
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/quotes/${quoteId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, adminNote }),
      });

      if (res.ok) {
        toast({
          type: "success",
          title: "Başarılı",
          description: "Teklif başarıyla güncellendi.",
        });
        router.refresh();
      } else {
        toast({
          type: "error",
          title: "Hata",
          description: "Güncelleme sırasında bir hata oluştu.",
        });
      }
    } catch (err) {
      toast({
        type: "error",
        title: "Hata",
        description: "Bağlantı hatası oluştu.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-panel-1 border border-panel-6 rounded p-3 space-y-4">
      <h3 className="text-[11px] font-bold uppercase tracking-wider border-b border-panel-6 pb-2 text-panel-12">
        Yönetici İşlemleri
      </h3>

      <div className="space-y-3">
        <Select
          label="Durum"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          size="sm"
          options={[
            { label: "Beklemede", value: "PENDING" },
            { label: "Müşteri Arandı", value: "CONTACTED" },
            { label: "Görüşülüyor", value: "NEGOTIATING" },
            { label: "Kabul Edildi", value: "ACCEPTED" },
            { label: "Reddedildi", value: "REJECTED" },
            { label: "İptal Edildi", value: "CANCELLED" },
          ]}
        />

        <Textarea
          label="Not (Gizli)"
          value={adminNote}
          onChange={(e) => setAdminNote(e.target.value)}
          rows={3}
        />

        <Button
          onClick={handleUpdate}
          loading={loading}
          className="w-full"
          size="sm"
        >
          Kaydet
        </Button>
      </div>
    </div>
  );
}
