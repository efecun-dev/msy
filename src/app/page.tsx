import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ProductsSection from "@/components/ProductsSection";
import ServicesSection from "@/components/ServicesSection";
import AboutSection from "@/components/AboutSection";
import CTABanner from "@/components/CTABanner";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import { prisma } from "@/lib/prisma";

export default async function Home() {
  const dbProducts = await prisma.product.findMany({
    where: { isActive: true },
    include: { images: true },
  });

  // Convert Decimal to number for the client component
  const products = dbProducts.map((p) => ({
    ...p,
    price: Number(p.price),
  }));

  const categoriesSetting = await prisma.setting.findUnique({
    where: { key: "product_categories" },
  });

  let categories = [
    "Güvenlik Kameraları",
    "Uydu Sistemleri",
    "Otomasyon",
    "Kablolar & Aksesuarlar",
  ];

  if (categoriesSetting) {
    try {
      categories = JSON.parse(categoriesSetting.value);
    } catch (e) {}
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "MSY Elektronik",
    image: "https://msyelektronik.com/logo.png",
    description:
      "Profesyonel güvenlik kamerası, uydu sistemleri ve otomasyon çözümleri.",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Örnek Mah. Elektronik Cad. No:1",
      addressLocality: "İstanbul",
      addressCountry: "TR",
    },
    telephone: "+905001234567",
    url: "https://msyelektronik.com",
  };

  return (
    <div className="dark min-h-screen bg-[#0a0a0a] text-white overflow-x-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <HeroSection />
      <ProductsSection products={products} categories={categories} />
      <ServicesSection />
      <AboutSection />
      <CTABanner />
      <ContactSection />
      <Footer />
    </div>
  );
}
