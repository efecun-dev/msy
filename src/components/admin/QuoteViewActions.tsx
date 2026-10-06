"use client";

import { useState } from "react";
import { Printer, Eye, Download } from "lucide-react";
import { Button, Modal } from "@/components/ui";
import QuotePrintTemplate from "./QuotePrintTemplate";

interface QuoteViewActionsProps {
  quote: any;
}

export default function QuoteViewActions({ quote }: QuoteViewActionsProps) {
  const [previewOpen, setPreviewOpen] = useState(false);

  const doPrint = () => {
    const originalTitle = document.title;
    const safeCustomer = (quote.customerName || "Teklif").replace(/[\/\\:*?"<>|]/g, "_");
    document.title = `${safeCustomer}_Teklif_${quote.quoteNumber}`;
    window.print();
    // Revert title immediately after print dialog opens
    setTimeout(() => {
      document.title = originalTitle;
    }, 500);
  };

  const handlePrint = () => {
    doPrint();
  };

  return (
    <>
      <div className="flex items-center gap-2 print:hidden">
        {/* PDF Önizleme Butonu */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPreviewOpen(true)}
          className="text-xs text-panel-11 hover:text-panel-12"
          title="PDF Belgesini Önizle"
          leftIcon={<Eye className="w-4 h-4" />}
        >
          <span className="hidden sm:inline">PDF Önizle</span>
        </Button>

        {/* Direkt Yazdır / PDF İndir Butonu */}
        <Button
          variant="primary"
          size="sm"
          onClick={handlePrint}
          className="text-xs bg-brand-9 hover:bg-brand-10 text-white font-semibold"
          title="Yazdır veya PDF olarak kaydet"
          leftIcon={<Printer className="w-4 h-4" />}
        >
          <span>Yazdır / PDF İndir</span>
        </Button>
      </div>

      {/* PDF Önizleme Modalı */}
      <Modal
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        title={
          <div className="flex items-center gap-2 text-panel-12">
            <Eye className="w-4 h-4 text-brand-11" />
            <span className="text-sm font-bold">
              Resimli Teklif Formu Önizleme (PDF)
            </span>
          </div>
        }
        size="xl"
        footer={
          <div className="flex items-center justify-between w-full">
            <span className="text-xs text-panel-11">
              * Yazdırma ekranında "Hedef" kısmından "PDF Olarak Kaydet" seçebilirsiniz.
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setPreviewOpen(false)}
              >
                Kapat
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  setPreviewOpen(false);
                  setTimeout(() => doPrint(), 300);
                }}
                className="bg-brand-9 hover:bg-brand-10 text-white"
                leftIcon={<Printer className="w-4 h-4" />}
              >
                <span>Yazdır / PDF Olarak Kaydet</span>
              </Button>
            </div>
          </div>
        }
      >
        <div className="bg-slate-100 p-2 sm:p-4 rounded-xl overflow-x-auto max-h-[75vh]">
          <QuotePrintTemplate quote={quote} isPreview={true} />
        </div>
      </Modal>
    </>
  );
}
