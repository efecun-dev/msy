"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/svg+xml"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

async function checkAuth() {
  const session = await getServerSession(authOptions);
  if (!session) {
    throw new Error("Yetkisiz eriÅŸim: Bu iÅŸlem iÃ§in yÃ¶netici giriÅŸi yapmalÄ±sÄ±nÄ±z.");
  }
}

async function saveFile(file: File | null): Promise<string | null> {
  if (!file || file.size === 0) return null;
  
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    throw new Error("GeÃ§ersiz dosya tÃ¼rÃ¼. YalnÄ±zca JPG, PNG, WEBP ve SVG kabul edilir.");
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error("Dosya boyutu Ã§ok bÃ¼yÃ¼k. Maksimum 5MB yÃ¼klenebilir.");
  }

  const ext = path.extname(file.name) || (file.type === "image/jpeg" ? ".jpg" : "");
  const fileName = `${crypto.randomUUID()}${ext}`;
  const uploadDir = path.join(process.cwd(), "public", "uploads");
  const filePath = path.join(uploadDir, fileName);
  
  // ensure directory exists
  await fs.mkdir(uploadDir, { recursive: true });
  
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  await fs.writeFile(filePath, buffer);
  
  return `/uploads/${fileName}`;
}

async function deleteFile(imageUrl: string | null) {
  if (!imageUrl) return;
  if (!imageUrl.startsWith("/uploads/")) return;
  const fileName = imageUrl.replace("/uploads/", "");
  const filePath = path.join(process.cwd(), "public", "uploads", fileName);
  try {
    await fs.unlink(filePath);
  } catch (err) {
    console.error("Error deleting file:", err);
  }
}

export async function createProduct(formData: FormData) {
  await checkAuth();

  // Legacy single image support + new multiple images support
  const files = formData.getAll("images") as File[];
  const imageUrls: string[] = [];
  
  for (const f of files) {
    if (f.size > 0) {
      const url = await saveFile(f);
      if (url) imageUrls.push(url);
    }
  }

  // If no "images" array was sent but an "image" was sent, fallback
  const singleFile = formData.get("image") as File | null;
  let mainImageUrl = null;
  
  if (imageUrls.length > 0) {
    mainImageUrl = imageUrls[0];
  } else if (singleFile && singleFile.size > 0) {
    const url = await saveFile(singleFile);
    if (url) {
      mainImageUrl = url;
      imageUrls.push(url);
    }
  }

  await prisma.product.create({
    data: {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      price: parseFloat(formData.get("price") as string),
      category: formData.get("category") as string,
      badge: (formData.get("badge") as string) || null,
      badgeColor: (formData.get("badgeColor") as string) || null,
      stockCount: parseInt(formData.get("stockCount") as string),
      isActive: formData.get("isActive") === "true",
      inStock: parseInt(formData.get("stockCount") as string) > 0,
      imageUrl: mainImageUrl,
      images: {
        create: imageUrls.map((url, index) => ({ url, order: index }))
      }
    }
  });
  
  revalidatePath("/dashboard/products");
  revalidatePath("/");
}

export async function updateProduct(id: number, formData: FormData) {
  await checkAuth();

  const data: any = {
    name: formData.get("name") as string,
    description: formData.get("description") as string,
    price: parseFloat(formData.get("price") as string),
    category: formData.get("category") as string,
    badge: (formData.get("badge") as string) || null,
    badgeColor: (formData.get("badgeColor") as string) || null,
    stockCount: parseInt(formData.get("stockCount") as string),
    isActive: formData.get("isActive") === "true",
    inStock: parseInt(formData.get("stockCount") as string) > 0,
  };

  // We fetch old product to keep old images intact if needed, or to know the max order
  const oldProduct = await prisma.product.findUnique({ 
    where: { id },
    include: { images: true } 
  });
  
  const files = formData.getAll("images") as File[];
  const imageUrls: string[] = [];
  
  for (const f of files) {
    if (f.size > 0) {
      const url = await saveFile(f);
      if (url) imageUrls.push(url);
    }
  }

  // Handle single fallback
  const singleFile = formData.get("image") as File | null;
  if (imageUrls.length === 0 && singleFile && singleFile.size > 0) {
    const url = await saveFile(singleFile);
    if (url) imageUrls.push(url);
  }

  if (imageUrls.length > 0) {
    // If it's the first time uploading images, set main imageUrl
    if (!oldProduct?.imageUrl) {
      data.imageUrl = imageUrls[0];
    }
    
    const currentMaxOrder = oldProduct?.images.reduce((max, img) => Math.max(max, img.order), -1) ?? -1;
    
    data.images = {
      create: imageUrls.map((url, index) => ({
        url,
        order: currentMaxOrder + 1 + index
      }))
    };
  }

  await prisma.product.update({
    where: { id },
    data
  });
  
  revalidatePath("/dashboard/products");
  revalidatePath("/");
}

export async function deleteProduct(id: number) {
  await checkAuth();

  const product = await prisma.product.findUnique({ 
    where: { id },
    include: { images: true }
  });
  
  if (product) {
    if (product.imageUrl) {
      await deleteFile(product.imageUrl);
    }
    for (const img of product.images) {
      await deleteFile(img.url);
    }
  }

  await prisma.product.delete({
    where: { id }
  });
  
  revalidatePath("/dashboard/products");
  revalidatePath("/");
}


export async function deleteProductImage(id: number) {
  await checkAuth();
  const img = await prisma.productImage.findUnique({ where: { id } });
  if (img) {
    await deleteFile(img.url);
    await prisma.productImage.delete({ where: { id } });
  }
  revalidatePath("/dashboard/products");
  revalidatePath("/");
}
