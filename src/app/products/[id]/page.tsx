import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductDetailClient from "./ProductDetailClient";

export default async function ProductPage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const productId = parseInt(params.id);

  if (isNaN(productId)) {
    notFound();
  }

  const product = await prisma.product.findUnique({
    where: { id: productId, isActive: true },
    include: { images: { orderBy: { order: "asc" } } },
  });

  if (!product) {
    notFound();
  }

  const relatedProducts = await prisma.product.findMany({
    where: {
      isActive: true,
      category: product.category,
      id: { not: product.id },
    },
    include: { images: true },
    take: 4,
  });

  return (
    <div className="dark min-h-screen bg-[#0a0a0a] text-white overflow-x-hidden flex flex-col">
      <Navbar />

      <main className="flex-1 pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ProductDetailClient
            product={{ ...product, price: Number(product.price) }}
            relatedProducts={relatedProducts.map((p) => ({
              ...p,
              price: Number(p.price),
            }))}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}
