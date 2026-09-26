"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import bcrypt from "bcryptjs";

async function checkAuth() {
  const session = await getServerSession(authOptions);
  if (!session) {
    throw new Error("Yetkisiz erişim");
  }
  return session;
}

export async function saveSettings(formData: FormData) {
  await checkAuth();

  const entries = Array.from(formData.entries());
  
  for (const [key, value] of entries) {
    if (typeof value === "string") {
      await prisma.setting.upsert({
        where: { key },
        update: { value },
        create: { key, value }
      });
    }
  }

  revalidatePath("/dashboard/settings");
  revalidatePath("/");
}

export async function updateProfile(formData: FormData) {
  const session = await checkAuth();

  const currentPassword = formData.get("currentPassword") as string;
  const newPassword = formData.get("newPassword") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!currentPassword || !newPassword || !confirmPassword) {
    throw new Error("Tüm şifre alanlarını doldurunuz.");
  }

  if (newPassword !== confirmPassword) {
    throw new Error("Yeni şifreler eşleşmiyor.");
  }

  if (newPassword.length < 6) {
    throw new Error("Yeni şifre en az 6 karakter olmalıdır.");
  }

  const admin = await prisma.admin.findUnique({
    where: { id: parseInt((session.user as any).id) }
  });

  if (!admin) {
    throw new Error("Kullanıcı bulunamadı.");
  }

  const isPasswordValid = await bcrypt.compare(currentPassword, admin.password);
  
  if (!isPasswordValid) {
    throw new Error("Mevcut şifreniz yanlış.");
  }

  const hashedNewPassword = await bcrypt.hash(newPassword, 10);

  await prisma.admin.update({
    where: { id: admin.id },
    data: { password: hashedNewPassword }
  });

  return { success: true };
}

export async function saveCategories(categories: string[]) {
  await checkAuth();
  await prisma.setting.upsert({
    where: { key: "product_categories" },
    update: { value: JSON.stringify(categories) },
    create: { key: "product_categories", value: JSON.stringify(categories) }
  });
  revalidatePath("/dashboard/products");
}

