"use client";

import { useState } from "react";
import { Button, Input } from "@/components/ui";
import { useToast } from "@/components/ui/Toast";
import { updateProfile } from "@/app/actions/settings";
import { signOut } from "next-auth/react";

export default function ProfileForm() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      await updateProfile(formData);

      toast({
        title: "Başarılı",
        description: "Şifreniz güncellendi. Lütfen tekrar giriş yapın.",
        type: "success",
      });

      // Sign out after password change
      setTimeout(() => {
        signOut({ callbackUrl: "/dashboard/login" });
      }, 2000);
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
    <form onSubmit={handleSubmit} className="space-y-6 max-w-md">
      <h3 className="text-lg font-bold text-panel-12 mb-4">Şifre Değiştirme</h3>
      <p className="text-xs text-panel-11 mb-6">
        Yönetici paneli giriş şifrenizi buradan güncelleyebilirsiniz. Şifrenizi
        değiştirdiğinizde mevcut oturumunuz kapatılacaktır.
      </p>

      <div className="space-y-4">
        <Input
          label="Mevcut Şifre"
          name="currentPassword"
          type="password"
          required
        />
        <Input label="Yeni Şifre" name="newPassword" type="password" required />
        <Input
          label="Yeni Şifre (Tekrar)"
          name="confirmPassword"
          type="password"
          required
        />
      </div>

      <div className="flex justify-end pt-4">
        <Button type="submit" loading={loading} variant="primary">
          Şifreyi Güncelle
        </Button>
      </div>
    </form>
  );
}
