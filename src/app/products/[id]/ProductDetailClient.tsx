"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/store/cartStore";
import { useToast } from "@/components/ui/Toast";
import { ShoppingCart, Check, Shield, Truck, Zap } from "lucide-react";

export default function ProductDetailClient({
  product,
  relatedProducts,
}: {
  product: any;
  relatedProducts: any[];
}) {
  const { addItem } = useCartStore();
  const { toast } = useToast();

  const allImages = [];
  if (product.imageUrl) allImages.push(product.imageUrl);
  if (product.images) {
    product.images.forEach((img: any) => {
      if (img.url !== product.imageUrl) allImages.push(img.url);
    });
  }

  const [mainImage, setMainImage] = useState(
    allImages[0] || "/placeholder.jpg",
  );
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: quantity,
      category: product.category,
      imageUrl: product.imageUrl || undefined,
    });
    toast({
      title: "Sepete Eklendi",
      description: `${quantity} adet ${product.name} teklif listesine eklendi.`,
      type: "success",
    });
  };

  return (
    <div className="space-y-16">
      <div className="grid md:grid-cols-2 gap-10">
        {/* Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-square rounded-2xl overflow-hidden border border-white/10 bg-white/5">
            {product.badge && (
              <div
                className={`absolute top-4 left-4 z-10 px-3 py-1 text-xs font-bold uppercase rounded-full ${
                  product.badgeColor === "red"
                    ? "bg-red-500 text-white"
                    : product.badgeColor === "green"
                      ? "bg-green-500 text-white"
                      : product.badgeColor === "yellow"
                        ? "bg-yellow-500 text-black"
                        : "bg-blue-500 text-white"
                }`}
              >
                {product.badge}
              </div>
            )}
            <Image
              src={mainImage}
              alt={product.name}
              fill
              className="object-cover"
            />
          </div>

          {allImages.length > 1 && (
            <div className="flex gap-4 overflow-x-auto pb-2">
              {allImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setMainImage(img)}
                  className={`relative w-20 h-20 shrink-0 rounded-xl overflow-hidden border-2 transition-all ${
                    mainImage === img
                      ? "border-blue-500 opacity-100"
                      : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`Thumbnail ${idx + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col justify-center">
          <div className="text-sm text-blue-400 font-semibold uppercase tracking-wider mb-2">
            {product.category}
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            {product.name}
          </h1>
          <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-200 mb-6">
            ₺{product.price.toLocaleString("tr-TR")}
          </div>

          <p className="text-gray-400 text-lg leading-relaxed mb-8">
            {product.description}
          </p>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="flex items-center gap-3 text-sm text-gray-300 bg-white/5 p-3 rounded-xl border border-white/10">
              <Shield className="w-5 h-5 text-blue-400" />
              <span>2 Yıl Garanti</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-300 bg-white/5 p-3 rounded-xl border border-white/10">
              <Zap className="w-5 h-5 text-blue-400" />
              <span>Hızlı Kurulum</span>
            </div>
          </div>

          <div className="flex items-center gap-4 mb-8 pb-8 border-b border-white/10">
            <div className="flex items-center bg-white/5 rounded-xl border border-white/10 overflow-hidden">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
              >
                -
              </button>
              <div className="px-4 font-semibold text-white min-w-[3rem] text-center">
                {quantity}
              </div>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
              >
                +
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className="flex-1 flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 disabled:text-gray-400 text-white font-semibold transition-all duration-200 shadow-xl shadow-blue-900/40"
            >
              <ShoppingCart className="w-5 h-5" />
              {product.inStock ? "Teklif Listesine Ekle" : "Stokta Yok"}
            </button>
          </div>
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <div className="pt-16 border-t border-white/10">
          <h2 className="text-2xl font-bold text-white mb-8">Benzer Ürünler</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((rp) => (
              <Link
                key={rp.id}
                href={`/products/${rp.id}`}
                className="group block bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-blue-500/50 transition-colors"
              >
                <div className="relative aspect-square bg-gray-900">
                  <Image
                    src={
                      rp.imageUrl ||
                      (rp.images && rp.images[0]?.url) ||
                      "/placeholder.jpg"
                    }
                    alt={rp.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-5">
                  <div className="text-xs text-blue-400 font-semibold mb-1">
                    {rp.category}
                  </div>
                  <h3 className="font-bold text-white mb-2 line-clamp-1">
                    {rp.name}
                  </h3>
                  <div className="font-bold text-blue-400">
                    ₺{rp.price.toLocaleString("tr-TR")}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
