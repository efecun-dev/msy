"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { productCategories } from "@/lib/data";
import { useCartStore } from "@/store/cartStore";
import { useToast } from "@/components/ui/Toast";

// Temporary interface until we use Prisma's generated type directly
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number; // or Decimal converted to number
  category: string;
  badge?: string | null;
  badgeColor?: string | null;
  imageUrl?: string | null;
  images?: any[];
}

export default function ProductsSection({
  products,
  categories = [],
}: {
  products: Product[];
  categories?: string[];
}) {
  const [activeCategory, setActiveCategory] = useState("Tümü");
  const [searchQuery, setSearchQuery] = useState("");
  const addItem = useCartStore((state) => state.addItem);
  const { toast } = useToast();

  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      activeCategory === "Tümü" || product.category === activeCategory;
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleAddToCart = (product: Product) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      imageUrl:
        product.images?.[0]?.url || product.imageUrl || "/placeholder.jpg",
    });
    toast({
      type: "success",
      title: "Listeye Eklendi",
      description: `${product.name} teklif listesine eklendi.`,
    });
  };

  const displayCategories = ["Tümü", ...categories];

  return (
    <section id="products" className="py-24 relative">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
        <div className="absolute -top-40 right-0 w-96 h-96 rounded-full bg-blue-900/10 blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-xs font-semibold tracking-widest uppercase mb-4">
            Ürün Kataloğu
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Öne Çıkan Ürünler
          </h2>
          <p className="text-gray-400 text-lg max-w-xl mx-auto mb-8">
            En son teknoloji ile donatılmış güvenlik ve otomasyon ürünleri.
          </p>

          {/* Search Bar */}
          <div className="max-w-md mx-auto mb-8 relative">
            <input
              type="text"
              placeholder="Ürün ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-5 py-3 rounded-full bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-inner"
            />
            <svg
              className="w-5 h-5 absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 justify-center mb-10">
          {displayCategories.map((cat) => {
            const count =
              cat === "Tümü"
                ? products.length
                : products.filter((p) => p.category === cat).length;

            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border ${
                  activeCategory === cat
                    ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-900/30"
                    : "border-white/15 text-gray-400 hover:text-white hover:border-white/30 bg-white/5"
                }`}
              >
                {cat} <span className="opacity-70 text-xs ml-1">({count})</span>
              </button>
            );
          })}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
          {filteredProducts.map((product) => (
            <Link
              href={`/products/${product.id}`}
              key={product.id}
              className="product-card group relative rounded-2xl border border-white/10 bg-[#0a0a0a] hover:bg-white/5 overflow-hidden cursor-pointer flex flex-col transition-colors duration-200"
            >
              {/* Image Container */}
              <div className="relative w-full aspect-square bg-[#0f0f0f] border-b border-white/5 overflow-hidden">
                {product.imageUrl ? (
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    className="object-cover transition-opacity duration-300 group-hover:opacity-90"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center opacity-30 group-hover:opacity-40 transition-opacity">
                    <svg
                      className="w-12 h-12 text-blue-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  </div>
                )}

                {/* Badge */}
                {product.badge && (
                  <div
                    className={`absolute top-3 left-3 px-2 py-0.5 rounded text-[10px] font-bold text-white shadow-sm ${
                      {
                        blue: "bg-blue-600",
                        red: "bg-red-600",
                        green: "bg-green-600",
                        yellow: "bg-yellow-600 text-black",
                      }[product.badgeColor || "blue"] || "bg-blue-600"
                    }`}
                  >
                    {product.badge}
                  </div>
                )}
              </div>

              {/* Content Container */}
              <div className="p-4 flex flex-col flex-grow">
                <div className="text-blue-400/80 text-[10px] font-bold uppercase tracking-wider mb-1.5">
                  {product.category}
                </div>

                <h3 className="text-white font-medium text-sm mb-1.5 leading-snug line-clamp-2 group-hover:text-blue-200 transition-colors">
                  {product.name}
                </h3>

                <p className="text-gray-500 text-xs leading-relaxed mb-4 line-clamp-2 flex-grow">
                  {product.description}
                </p>

                <div className="flex items-end justify-between mt-auto">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-gray-500 mb-0.5">
                      Fiyat
                    </span>
                    <span className="text-lg font-bold text-white tracking-tight">
                      ₺{product.price.toLocaleString("tr-TR")}
                    </span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      addItem({
                        id: product.id,
                        name: product.name,
                        price: product.price,
                        quantity: 1,
                        category: product.category,
                        imageUrl: product.imageUrl || undefined,
                      });
                      toast({
                        type: "success",
                        title: "Sepete Eklendi",
                        description: `${product.name} başarıyla eklendi.`,
                      });
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600/10 hover:bg-blue-600 text-blue-500 hover:text-white transition-all duration-200 font-semibold text-xs"
                    title="Teklif Listesine Ekle"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    Listeye Ekle
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
