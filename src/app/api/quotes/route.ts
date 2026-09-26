import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";
import { NewQuoteEmail } from "@/emails/NewQuoteEmail";
import { render } from "@react-email/render";
import * as React from "react";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { customerName, customerPhone, customerEmail, note, items } = body;

    if (!customerName || !customerPhone || !items || items.length === 0) {
      return NextResponse.json({ error: "Eksik bilgi" }, { status: 400 });
    }

    // SERVER-SIDE PRICE VALIDATION
    const productIds = items.map((i: any) => i.productId);
    const dbProducts = await prisma.product.findMany({
      where: { id: { in: productIds } }
    });

    if (dbProducts.length !== items.length) {
      return NextResponse.json({ error: "Geçersiz ürünler bulundu" }, { status: 400 });
    }

    let calculatedSubTotal = 0;
    const validatedItems = items.map((i: any) => {
      const dbProduct = dbProducts.find((p) => p.id === i.productId);
      if (!dbProduct) throw new Error("Ürün bulunamadı");
      
      const price = Number(dbProduct.price);
      calculatedSubTotal += price * i.quantity;
      
      return {
        productId: i.productId,
        quantity: i.quantity,
        unitPrice: price,
        name: dbProduct.name
      };
    });

    const calculatedTotalAmount = Math.round(calculatedSubTotal * 1.2); // Apply KDV

    // Generate Quote Number
    const count = await prisma.quote.count();
    const quoteNumber = `MSY-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`;

    const quote = await prisma.quote.create({
      data: {
        quoteNumber,
        customerName,
        customerPhone,
        customerEmail,
        note,
        totalAmount: calculatedTotalAmount,
        items: {
          create: validatedItems.map((i: any) => ({
            productId: i.productId,
            quantity: i.quantity,
            unitPrice: i.unitPrice
          }))
        }
      }
    });

    // Send Email Notification if Resend is configured
    if (resend) {
      try {
        const emailItems = validatedItems.map((i: any) => ({
          name: i.name,
          quantity: i.quantity,
          price: i.unitPrice,
        }));

        const htmlContent = await render(
          React.createElement(NewQuoteEmail, {
            quoteNumber,
            customerName,
            customerPhone,
            customerEmail,
            totalAmount: calculatedTotalAmount,
            items: emailItems,
          })
        );

        await resend.emails.send({
          from: process.env.EMAIL_FROM || "MSY Elektronik <efe@efecun.dev>",
          to: process.env.ADMIN_EMAIL || "msyelektronik55@gmail.com",
          subject: `Yeni Teklif: ${quoteNumber} - ${customerName}`,
          html: htmlContent,
        });
      } catch (emailError) {
        console.error("Failed to send email notification:", emailError);
      }
    } else {
      console.log("RESEND_API_KEY is not set. Skipping email notification.");
    }

    return NextResponse.json(quote, { status: 201 });
  } catch (error) {
    console.error("Quote creation error:", error);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}

