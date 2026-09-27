"use client";

import { useState } from "react";
import { LogOut } from "lucide-react";
import { Modal, Button } from "@/components/ui";
import { signOut } from "next-auth/react";

export default function SignOutButton() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await signOut({ redirect: false });
      window.location.href = "/dashboard/login";
    } catch (error) {
      console.error("Sign out error:", error);
      window.location.href = "/dashboard/login";
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="text-gray-400 hover:text-red-500 transition-colors"
        title="Çıkış Yap"
      >
        <LogOut className="w-5 h-5" />
      </button>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Oturumu Kapat"
        footer={
          <>
            <Button
              variant="ghost"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              İptal
            </Button>
            <Button variant="danger" onClick={handleSignOut} loading={loading}>
              Evet, Çıkış Yap
            </Button>
          </>
        }
      >
        <div className="text-gray-600 text-sm">
          Oturumunuzu kapatmak istediğinize emin misiniz? Tekrar giriş yapmanız
          gerekecek.
        </div>
      </Modal>
    </>
  );
}
