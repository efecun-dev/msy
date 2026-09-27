"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Select, Button, Textarea } from "@/components/ui";
import { useToast } from "@/components/ui/Toast";
import { Trash2, Edit } from "lucide-react";
import { deleteQuote } from "@/app/actions/quote";
import ManualQuoteModal from "@/components/admin/ManualQuoteModal";

interface QuoteDetailClientProps {
  quoteId: number;
  initialStatus: string;
  initialAdminNote: string | null;
  quote?: any;
  products?: any[];
}

export default function QuoteDetailClient({
  quoteId,
  initialStatus,
  initialAdminNote,
  quote,
  products = [],
}: QuoteDetailClientProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [status, setStatus] = useState(initialStatus);
  const [adminNote, setAdminNote] = useState(initialAdminNote || "");
  const [loading, setLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

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
          className="w-full bg-brand-9 hover:bg-brand-10 text-white"
          size="sm"
        >
          Durumu ve Notu Kaydet
        </Button>

        {quote && products && (
          <div className="pt-3 border-t border-panel-6 flex flex-col gap-2">
            <ManualQuoteModal
              products={products}
              quoteToEdit={quote}
              triggerButton={
                <Button
                  variant="ghost"
                  className="w-full bg-panel-2 border border-panel-6 hover:bg-panel-3 text-panel-12 hover:text-panel-12 shadow-sm"
                  size="sm"
                  leftIcon={<Edit className="w-4 h-4" />}
                >
                  Tüm Teklifi Düzenle
                </Button>
              }
            />

            <Button
              onClick={async () => {
                if (!confirm("Bu teklifi silmek istediğinize emin misiniz? Bu işlem geri alınamaz.")) return;
                setIsDeleting(true);
                try {
                  const res = await deleteQuote(quoteId);
                  if (res.success) {
                    toast({ type: "success", title: "Başarılı", description: "Teklif başarıyla silindi." });
                    router.push("/dashboard/quotes");
                    router.refresh();
                  }
                } catch (error: any) {
                  toast({ type: "error", title: "Hata", description: error.message || "Silinirken hata oluştu." });
                } finally {
                  setIsDeleting(false);
                }
              }}
              loading={isDeleting}
              variant="ghost"
              className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-600 hover:text-red-700 border border-red-500/20"
              size="sm"
              leftIcon={<Trash2 className="w-4 h-4" />}
            >
              Teklifi Sil
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
