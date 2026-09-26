"use client";

import { Printer } from "lucide-react";
import { Button } from "@/components/ui";

export default function PrintButton() {
  const handlePrint = () => {
    window.print();
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handlePrint}
      className="flex items-center gap-2 print:hidden"
    >
      <Printer className="w-4 h-4" />
      <span>Yazdır / PDF İndir</span>
    </Button>
  );
}
