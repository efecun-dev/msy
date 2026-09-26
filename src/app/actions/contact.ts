"use server";

import { prisma } from "@/lib/prisma";

export async function submitContactMessage(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const subject = formData.get("subject") as string;
  const message = formData.get("message") as string;
  const phone = formData.get("phone") as string;

  if (!name || !email || !message) {
    throw new Error("Lütfen zorunlu alanları doldurun.");
  }

  // We map the "phone" into the message or subject since our schema is: name, email, subject, message
  const fullMessage = `Telefon: ${phone || "Belirtilmedi"}\n\nMesaj:\n${message}`;

  await prisma.contactMessage.create({
    data: {
      name,
      email,
      subject: subject || "Belirtilmedi",
      message: fullMessage,
    }
  });

  return { success: true };
}

export async function markMessageRead(id: number) {
  await prisma.contactMessage.update({
    where: { id },
    data: { isRead: true }
  });
  return { success: true };
}

