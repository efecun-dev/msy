"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { QuoteStatus } from "@prisma/client";

async function checkAuth() {
  const session = await getServerSession(authOptions);
  if (!session) {
    throw new Error("Yetkisiz erişim: Bu işlem için yönetici girişi yapmalısınız.");
  }
  return session;
}

export interface ManualQuoteItemInput {
  productId: number;
  quantity: number;
  unitPrice: number;
}

export interface CreateManualQuoteInput {
  customerName: string;
  customerPhone?: string;
  customerEmail?: string;
  customerAddress?: string;
  note?: string;
  adminNote?: string;
  status?: QuoteStatus;
  items: ManualQuoteItemInput[];
  includeKdv?: boolean;
}

export async function createManualQuote(data: CreateManualQuoteInput) {
  await checkAuth();

  if (!data.customerName || data.customerName.trim() === "") {
    throw new Error("Müşteri adı alanı zorunludur.");
  }

  if (!data.items || data.items.length === 0) {
    throw new Error("Teklife en az bir ürün eklemelisiniz.");
  }

  // Validate items
  for (const item of data.items) {
    if (!item.productId) {
      throw new Error("Geçersiz ürün seçimi.");
    }
    if (item.quantity <= 0) {
      throw new Error("Ürün adedi 0'dan büyük olmalıdır.");
    }
    if (item.unitPrice < 0 || isNaN(Number(item.unitPrice))) {
      throw new Error("Geçerli bir birim fiyat girilmelidir.");
    }
  }

  // Calculate totals
  const subTotal = data.items.reduce(
    (sum, item) => sum + Number(item.unitPrice) * Number(item.quantity),
    0
  );

  const totalAmount = data.includeKdv !== false ? Math.round(subTotal * 1.2) : subTotal;

  // Generate unique quote number: MSY-YYYY-XXXX
  const year = new Date().getFullYear();
  const count = await prisma.quote.count();
  const quoteNumber = `MSY-${year}-${String(count + 1).padStart(4, "0")}`;

  const quote = await prisma.quote.create({
    data: {
      quoteNumber,
      customerName: data.customerName.trim(),
      customerPhone: data.customerPhone?.trim() || "-",
      customerEmail: data.customerEmail?.trim() || null,
      customerAddress: data.customerAddress?.trim() || null,
      note: data.note?.trim() || null,
      adminNote: data.adminNote?.trim() || null,
      status: data.status || "PENDING",
      totalAmount,
      items: {
        create: data.items.map((item) => ({
          productId: item.productId,
          quantity: Number(item.quantity),
          unitPrice: Number(item.unitPrice),
        })),
      },
    },
    include: {
      items: {
        include: {
          product: {
            include: {
              images: true,
            },
          },
        },
      },
    },
  });

  revalidatePath("/dashboard/quotes");
  revalidatePath("/dashboard");

  return { success: true, quote };
}

export async function updateManualQuote(id: number, data: CreateManualQuoteInput) {
  await checkAuth();

  if (!data.customerName || data.customerName.trim() === "") {
    throw new Error("Müşteri adı alanı zorunludur.");
  }
  if (!data.items || data.items.length === 0) {
    throw new Error("Teklife en az bir ürün eklemelisiniz.");
  }
  for (const item of data.items) {
    if (!item.productId) throw new Error("Geçersiz ürün seçimi.");
    if (item.quantity <= 0) throw new Error("Ürün adedi 0'dan büyük olmalıdır.");
    if (item.unitPrice < 0 || isNaN(Number(item.unitPrice))) {
      throw new Error("Geçerli bir birim fiyat girilmelidir.");
    }
  }

  const subTotal = data.items.reduce((sum, item) => sum + Number(item.unitPrice) * Number(item.quantity), 0);
  const totalAmount = data.includeKdv !== false ? Math.round(subTotal * 1.2) : subTotal;

  // Transaction for safe update
  const quote = await prisma.$transaction(async (tx) => {
    // 1. Delete all existing items
    await tx.quoteItem.deleteMany({ where: { quoteId: id } });

    // 2. Update quote and create new items
    return tx.quote.update({
      where: { id },
      data: {
        customerName: data.customerName.trim(),
        customerPhone: data.customerPhone?.trim() || "-",
        customerEmail: data.customerEmail?.trim() || null,
        customerAddress: data.customerAddress?.trim() || null,
        note: data.note?.trim() || null,
        adminNote: data.adminNote?.trim() || null,
        status: data.status,
        totalAmount,
        items: {
          create: data.items.map((item) => ({
            productId: item.productId,
            quantity: Number(item.quantity),
            unitPrice: Number(item.unitPrice),
          })),
        },
      },
    });
  });

  revalidatePath("/dashboard/quotes");
  revalidatePath(`/dashboard/quotes/${id}`);
  return { success: true, quote };
}

export async function deleteQuote(id: number) {
  await checkAuth();
  
  await prisma.quote.delete({
    where: { id }
  });

  revalidatePath("/dashboard/quotes");
  return { success: true };
}
