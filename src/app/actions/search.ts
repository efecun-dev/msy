"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function globalSearch(query: string) {
  const session = await getServerSession(authOptions);
  if (!session) {
    throw new Error("Yetkisiz erişim");
  }

  if (!query || query.trim().length < 2) {
    return { products: [], quotes: [], messages: [] };
  }

  const search = query.trim();

  try {
    const products = await prisma.product.findMany({
      where: {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { category: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } },
        ],
      },
      take: 5,
      select: { id: true, name: true, category: true, price: true, imageUrl: true },
    });

    const quotes = await prisma.quote.findMany({
      where: {
        OR: [
          { customerName: { contains: search, mode: "insensitive" } },
          { quoteNumber: { contains: search, mode: "insensitive" } },
          { customerEmail: { contains: search, mode: "insensitive" } },
        ],
      },
      take: 5,
      select: { id: true, quoteNumber: true, customerName: true, status: true, totalAmount: true },
    });

    const messages = await prisma.contactMessage.findMany({
      where: {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
          { subject: { contains: search, mode: "insensitive" } },
        ],
      },
      take: 5,
      select: { id: true, name: true, subject: true, isRead: true, createdAt: true },
    });

    return { products, quotes, messages };
  } catch (error) {
    console.error("Global search error:", error);
    return { products: [], quotes: [], messages: [] };
  }
}
