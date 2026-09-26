import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  Tailwind,
  Hr,
  Button,
  Row,
  Column,
} from "@react-email/components";
import * as React from "react";

interface QuoteItem {
  name: string;
  quantity: number;
  price: number;
}

interface NewQuoteEmailProps {
  quoteNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string | null;
  totalAmount: number;
  items?: QuoteItem[];
}

export const NewQuoteEmail = ({
  quoteNumber = "MSY-2026-0001",
  customerName = "Test Müşterisi",
  customerPhone = "0532 000 00 00",
  customerEmail = "musteri@example.com",
  totalAmount = 15000,
  items = [
    { name: "IP Güvenlik Kamerası", quantity: 4, price: 2500 },
    { name: "Kayıt Cihazı (NVR)", quantity: 1, price: 5000 },
  ],
}: NewQuoteEmailProps) => {
  const previewText = `Yeni Teklif: ${quoteNumber} - ${customerName}`;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="bg-gray-50 font-sans m-0 p-0">
          <Container className="bg-white border border-gray-200 rounded-xl my-10 mx-auto w-full max-w-[600px] overflow-hidden shadow-sm">
            {/* Header / Logo Area */}
            <Section className="bg-white px-10 py-8 text-center border-b border-gray-100">
              <Text className="m-0 text-gray-900 text-2xl font-black tracking-tight">
                <span className="text-blue-600">MSY</span> Elektronik
              </Text>
              <Text className="m-0 text-gray-500 text-xs tracking-widest uppercase mt-1 font-medium">
                Uydu • Güvenlik • Otomasyon
              </Text>
            </Section>

            {/* Main Content */}
            <Section className="px-10 py-8">
              <Heading className="text-[24px] font-bold text-gray-900 text-center m-0 mb-6">
                Yeni Bir Teklif Talebi Alındı!
              </Heading>

              <Text className="text-gray-600 text-[15px] leading-[24px] m-0 mb-8 text-center">
                Sisteme web siteniz üzerinden yeni bir teklif talebi ulaştı.
                Aşağıdaki butona tıklayarak teklifin tüm detaylarını
                görüntüleyebilirsiniz.
              </Text>

              <Section className="text-center mb-8">
                <Button
                  href={`${appUrl}/dashboard/quotes`}
                  className="bg-blue-600 rounded-md text-white text-[15px] font-semibold px-8 py-3 no-underline inline-block"
                >
                  Teklifi Görüntüle
                </Button>
              </Section>

              <Hr className="border-gray-200 my-8" />

              {/* Details Box */}
              <Section className="bg-gray-50 rounded-lg p-6 border border-gray-200 mb-6">
                <Row>
                  <Column className="align-top w-[50%] pr-4">
                    <Text className="m-0 mb-2 text-blue-600 text-[12px] uppercase tracking-wider font-bold">
                      Müşteri Bilgileri
                    </Text>
                    <Text className="m-0 mb-1 text-gray-900 text-[14px] font-semibold">
                      {customerName}
                    </Text>
                    <Text className="m-0 mb-1 text-gray-600 text-[14px]">
                      {customerPhone}
                    </Text>
                    {customerEmail && (
                      <Text className="m-0 text-gray-600 text-[14px]">
                        {customerEmail}
                      </Text>
                    )}
                  </Column>
                  <Column className="align-top w-[50%] pl-4 border-l border-gray-200">
                    <Text className="m-0 mb-2 text-blue-600 text-[12px] uppercase tracking-wider font-bold">
                      Teklif Bilgisi
                    </Text>
                    <Text className="m-0 mb-1 text-gray-500 text-[14px]">
                      No:{" "}
                      <span className="text-gray-900 font-semibold">
                        {quoteNumber}
                      </span>
                    </Text>
                    <Text className="m-0 text-gray-500 text-[14px]">
                      Tutar:{" "}
                      <span className="text-blue-600 font-bold">
                        ₺{totalAmount.toLocaleString("tr-TR")}
                      </span>
                    </Text>
                  </Column>
                </Row>
              </Section>

              {/* Products Table */}
              <Text className="m-0 mb-3 text-gray-900 text-[16px] font-bold">
                İstenen Ürünler
              </Text>

              <Section className="border border-gray-200 rounded-lg overflow-hidden">
                {items &&
                  items.map((item, index) => (
                    <Row
                      key={index}
                      className={`p-3 ${index !== items.length - 1 ? "border-b border-gray-100" : ""}`}
                    >
                      <Column className="w-[15%] text-center">
                        <span className="bg-gray-100 text-gray-600 text-[12px] font-bold px-2 py-1 rounded">
                          {item.quantity}x
                        </span>
                      </Column>
                      <Column className="w-[55%] pl-2">
                        <Text className="m-0 text-[14px] text-gray-800 font-medium">
                          {item.name}
                        </Text>
                      </Column>
                      <Column className="w-[30%] text-right pr-3">
                        <Text className="m-0 text-[14px] text-gray-900 font-semibold">
                          ₺
                          {(item.price * item.quantity).toLocaleString("tr-TR")}
                        </Text>
                      </Column>
                    </Row>
                  ))}
                <Row className="bg-gray-50 p-3 border-t border-gray-200">
                  <Column className="w-[70%] pl-3">
                    <Text className="m-0 text-[13px] text-gray-500 font-medium uppercase">
                      KDV Dahil Toplam
                    </Text>
                  </Column>
                  <Column className="w-[30%] text-right pr-3">
                    <Text className="m-0 text-[16px] text-blue-600 font-bold">
                      ₺{totalAmount.toLocaleString("tr-TR")}
                    </Text>
                  </Column>
                </Row>
              </Section>
            </Section>

            {/* Footer */}
            <Section className="bg-gray-50 px-10 py-6 border-t border-gray-200 text-center">
              <Text className="m-0 text-gray-400 text-[12px] leading-[18px]">
                Bu otomatik bir bilgilendirme mesajıdır, lütfen cevaplamayınız.
                <br />© {new Date().getFullYear()} MSY Elektronik Tüm Hakları
                Saklıdır.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default NewQuoteEmail;
