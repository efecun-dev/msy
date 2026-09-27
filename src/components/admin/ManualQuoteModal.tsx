"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Search,
  Trash2,
  Package,
  FileText,
  User,
  Phone,
  Mail,
  CheckCircle,
  AlertCircle,
  X,
  Layers,
  ArrowRight,
} from "lucide-react";
import { Modal, Button, Input, Textarea, Select, Badge } from "@/components/ui";
import { useToast } from "@/components/ui/Toast";
import { createManualQuote } from "@/app/actions/quote";
import Image from "next/image";

interface ProductItem {
  id: number;
  name: string;
  category: string;
  price: any;
  imageUrl?: string | null;
  images?: Array<{ url: string }>;
  inStock?: boolean;
  stockCount?: number;
}

interface SelectedItem {
  productId: number;
  product: ProductItem;
  quantity: number;
  unitPrice: number;
}

interface ManualQuoteModalProps {
  products: ProductItem[];
  categories?: string[];
}

export default function ManualQuoteModal({
  products = [],
  categories = [],
}: ManualQuoteModalProps) {
  const router = useRouter();
  const { toast } = useToast();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form State
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [note, setNote] = useState("");
  const [adminNote, setAdminNote] = useState("");
  const [status, setStatus] = useState<any>("PENDING");
  const [includeKdv, setIncludeKdv] = useState(true);

  // Selected Products State
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);

  // Product Search / Filter
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");

  // Filter products for the picker
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === "ALL" || p.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, selectedCategory]);

  // Derived unique categories
  const allCategories = useMemo(() => {
    if (categories && categories.length > 0) return categories;
    const cats = Array.from(new Set(products.map((p) => p.category)));
    return cats.filter(Boolean);
  }, [products, categories]);

  // Add Product to Selected List
  const handleAddProduct = (product: ProductItem) => {
    const existingIndex = selectedItems.findIndex(
      (item) => item.productId === product.id
    );

    if (existingIndex > -1) {
      // Increase quantity by 1
      const updated = [...selectedItems];
      updated[existingIndex].quantity += 1;
      setSelectedItems(updated);
    } else {
      // Add new item with current product price as initial unit price
      setSelectedItems([
        ...selectedItems,
        {
          productId: product.id,
          product,
          quantity: 1,
          unitPrice: Number(product.price) || 0,
        },
      ]);
    }
  };

  // Remove Item
  const handleRemoveItem = (index: number) => {
    setSelectedItems(selectedItems.filter((_, idx) => idx !== index));
  };

  // Change Quantity
  const handleQuantityChange = (index: number, newQty: number) => {
    const qty = Math.max(1, newQty || 1);
    const updated = [...selectedItems];
    updated[index].quantity = qty;
    setSelectedItems(updated);
  };

  // Change Unit Price
  const handlePriceChange = (index: number, newPrice: number) => {
    const price = Math.max(0, newPrice || 0);
    const updated = [...selectedItems];
    updated[index].unitPrice = price;
    setSelectedItems(updated);
  };

  // Totals
  const subTotal = useMemo(() => {
    return selectedItems.reduce(
      (sum, item) => sum + item.unitPrice * item.quantity,
      0
    );
  }, [selectedItems]);

  const kdvAmount = includeKdv ? subTotal * 0.2 : 0;
  const grandTotal = subTotal + kdvAmount;

  // Reset Form
  const resetForm = () => {
    setCustomerName("");
    setCustomerPhone("");
    setCustomerEmail("");
    setNote("");
    setAdminNote("");
    setStatus("PENDING");
    setIncludeKdv(true);
    setSelectedItems([]);
    setSearchQuery("");
  };

  // Submit Handler
  const handleSubmit = async () => {
    if (!customerName.trim()) {
      toast({
        type: "error",
        title: "Eksik Alan",
        description: "Lütfen müşteri adını girin.",
      });
      return;
    }

    if (selectedItems.length === 0) {
      toast({
        type: "error",
        title: "Ürün Eklenmedi",
        description: "Teklife en az bir ürün eklemelisiniz.",
      });
      return;
    }

    setLoading(true);
    try {
      const result = await createManualQuote({
        customerName,
        customerPhone,
        customerEmail,
        note,
        adminNote,
        status,
        includeKdv,
        items: selectedItems.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
        })),
      });

      if (result.success && result.quote) {
        toast({
          type: "success",
          title: "Teklif Oluşturuldu",
          description: `#${result.quote.quoteNumber} nolu teklif başarıyla oluşturuldu.`,
        });
        setOpen(false);
        resetForm();
        router.push(`/dashboard/quotes/${result.quote.id}`);
        router.refresh();
      }
    } catch (error: any) {
      toast({
        type: "error",
        title: "Hata",
        description: error.message || "Teklif oluşturulurken bir hata meydana geldi.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* ─── Modal Açma Butonu ────────────────────────────────────────────── */}
      <Button
        onClick={() => setOpen(true)}
        className="gap-2 bg-brand-9 hover:bg-brand-10 text-white font-semibold shadow-sm"
        size="sm"
        leftIcon={<Plus className="w-4 h-4" />}
      >
        Yeni Teklif Oluştur
      </Button>

      {/* ─── Manuel Teklif Modalı ─────────────────────────────────────────── */}
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-3 text-brand-11 flex items-center justify-center font-bold">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <span className="text-base font-bold text-panel-12">
                Manuel Teklif Oluştur
              </span>
              <p className="text-xs text-panel-11 font-normal">
                Müşteri bilgilerini girin, ürünleri seçip dilediğiniz özel birim fiyatı belirleyin.
              </p>
            </div>
          </div>
        }
        size="xl"
        footer={
          <div className="flex items-center justify-between w-full">
            <div className="text-left">
              <span className="text-xs text-panel-11">Genel Toplam:</span>
              <p className="text-lg font-black text-panel-12">
                ₺{grandTotal.toLocaleString("tr-TR", { minimumFractionDigits: 2 })}
                {includeKdv && (
                  <span className="text-[10px] font-normal text-panel-11 ml-1">
                    (KDV Dahil)
                  </span>
                )}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                onClick={() => setOpen(false)}
                disabled={loading}
              >
                İptal
              </Button>
              <Button
                variant="primary"
                onClick={handleSubmit}
                loading={loading}
                className="gap-2 bg-brand-9 hover:bg-brand-10 text-white"
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Teklifi Kaydet & Görüntüle
              </Button>
            </div>
          </div>
        }
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* ─── SOL KOLON: Müşteri Bilgileri & Seçilen Ürünler ─────────────── */}
          <div className="lg:col-span-7 space-y-5">
            {/* Müşteri Bilgileri Kartı */}
            <div className="bg-panel-2 border border-panel-6 rounded-xl p-4 space-y-3">
              <h3 className="text-xs font-bold text-panel-12 uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-panel-6">
                <User className="w-3.5 h-3.5 text-brand-11" />
                Müşteri & Teklif Detayları
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-panel-11">
                    Müşteri / Firma Adı <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Örn. Ahmet Yılmaz / ABC Ltd."
                    className="w-full px-3 py-2 text-xs bg-panel-1 border border-panel-6 rounded-lg text-panel-12 placeholder-panel-9 focus:outline-none focus:border-brand-9"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-panel-11">
                    Telefon Numarası
                  </label>
                  <input
                    type="text"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="05xx xxx xx xx"
                    className="w-full px-3 py-2 text-xs bg-panel-1 border border-panel-6 rounded-lg text-panel-12 placeholder-panel-9 focus:outline-none focus:border-brand-9"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-panel-11">
                    E-Posta Adresi
                  </label>
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="ornek@musteri.com"
                    className="w-full px-3 py-2 text-xs bg-panel-1 border border-panel-6 rounded-lg text-panel-12 placeholder-panel-9 focus:outline-none focus:border-brand-9"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-panel-11">
                    Başlangıç Durumu
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-panel-1 border border-panel-6 rounded-lg text-panel-12 focus:outline-none focus:border-brand-9"
                  >
                    <option value="PENDING">Beklemede</option>
                    <option value="CONTACTED">Arandı</option>
                    <option value="NEGOTIATING">Görüşülüyor</option>
                    <option value="ACCEPTED">Kabul Edildi</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-panel-11">
                  Teklif Notu (PDF'de Görünür)
                </label>
                <input
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Müşteriye iletilecek özel not veya şart..."
                  className="w-full px-3 py-2 text-xs bg-panel-1 border border-panel-6 rounded-lg text-panel-12 placeholder-panel-9 focus:outline-none focus:border-brand-9"
                />
              </div>
            </div>

            {/* Seçilen Ürünler Tablosu */}
            <div className="bg-panel-2 border border-panel-6 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-panel-6">
                <h3 className="text-xs font-bold text-panel-12 uppercase tracking-wider flex items-center gap-1.5">
                  <Package className="w-3.5 h-3.5 text-brand-11" />
                  Teklife Eklenen Ürünler ({selectedItems.length})
                </h3>
                <span className="text-[11px] text-panel-11">
                  * Birim fiyatları ve adetleri değiştirebilirsiniz
                </span>
              </div>

              {selectedItems.length === 0 ? (
                <div className="text-center py-8 border-2 border-dashed border-panel-6 rounded-lg text-panel-11">
                  <Package className="w-8 h-8 mx-auto mb-2 opacity-40" />
                  <p className="text-xs">Henüz teklife ürün eklenmedi.</p>
                  <p className="text-[11px] text-panel-10 mt-0.5">
                    Sağdaki ürün kataloğundan ürün seçerek ekleyebilirsiniz.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-panel-6 text-panel-11">
                        <th className="pb-2 w-10">Görsel</th>
                        <th className="pb-2">Ürün</th>
                        <th className="pb-2 w-28 text-right">Birim Fiyat (₺)</th>
                        <th className="pb-2 w-20 text-center">Adet</th>
                        <th className="pb-2 w-24 text-right">Tutar</th>
                        <th className="pb-2 w-8"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-panel-6">
                      {selectedItems.map((item, index) => {
                        const imageSrc =
                          item.product.imageUrl ||
                          (item.product.images && item.product.images.length > 0
                            ? item.product.images[0].url
                            : null);

                        return (
                          <tr key={item.productId} className="align-middle">
                            {/* Ürün Görseli */}
                            <td className="py-2.5">
                              <div className="w-9 h-9 rounded bg-panel-3 border border-panel-6 overflow-hidden flex items-center justify-center shrink-0">
                                {imageSrc ? (
                                  <img
                                    src={imageSrc}
                                    alt={item.product.name}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <Package className="w-4 h-4 text-panel-10" />
                                )}
                              </div>
                            </td>

                            {/* Ürün Adı */}
                            <td className="py-2.5 pr-2">
                              <p className="font-semibold text-panel-12 line-clamp-1">
                                {item.product.name}
                              </p>
                              <span className="text-[10px] text-panel-11">
                                {item.product.category}
                              </span>
                            </td>

                            {/* Birim Fiyat (Manuel Giriş) */}
                            <td className="py-2.5 text-right">
                              <input
                                type="number"
                                min="0"
                                step="any"
                                value={item.unitPrice}
                                onChange={(e) =>
                                  handlePriceChange(
                                    index,
                                    parseFloat(e.target.value) || 0
                                  )
                                }
                                className="w-24 px-2 py-1 text-right font-mono text-xs bg-panel-1 border border-panel-6 rounded text-panel-12 focus:outline-none focus:border-brand-9 font-semibold"
                              />
                            </td>

                            {/* Adet (Miktar Girişi) */}
                            <td className="py-2.5 text-center px-1">
                              <input
                                type="number"
                                min="1"
                                value={item.quantity}
                                onChange={(e) =>
                                  handleQuantityChange(
                                    index,
                                    parseInt(e.target.value) || 1
                                  )
                                }
                                className="w-14 px-1.5 py-1 text-center font-mono text-xs bg-panel-1 border border-panel-6 rounded text-panel-12 focus:outline-none focus:border-brand-9 font-bold"
                              />
                            </td>

                            {/* Satır Toplamı */}
                            <td className="py-2.5 text-right font-mono font-bold text-panel-12">
                              ₺
                              {(item.unitPrice * item.quantity).toLocaleString(
                                "tr-TR",
                                { minimumFractionDigits: 2 }
                              )}
                            </td>

                            {/* Silme */}
                            <td className="py-2.5 text-right pl-2">
                              <button
                                type="button"
                                onClick={() => handleRemoveItem(index)}
                                className="p-1 text-panel-11 hover:text-red-500 rounded transition-colors"
                                title="Kaldır"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Hesap Özeti Kutusu */}
              {selectedItems.length > 0 && (
                <div className="pt-3 border-t border-panel-6 space-y-1.5 text-xs">
                  <div className="flex justify-between text-panel-11">
                    <span>Ara Toplam:</span>
                    <span className="font-mono font-semibold text-panel-12">
                      ₺{subTotal.toLocaleString("tr-TR", { minimumFractionDigits: 2 })}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-panel-11">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={includeKdv}
                        onChange={(e) => setIncludeKdv(e.target.checked)}
                        className="rounded border-panel-6 text-brand-9 focus:ring-brand-9"
                      />
                      <span>KDV Ekle (%20):</span>
                    </label>
                    <span className="font-mono font-semibold text-panel-12">
                      {includeKdv
                        ? `₺${kdvAmount.toLocaleString("tr-TR", { minimumFractionDigits: 2 })}`
                        : "₺0,00"}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm font-bold text-panel-12 pt-1 border-t border-panel-6">
                    <span>Teklif Tutarı:</span>
                    <span className="font-mono text-brand-11">
                      ₺{grandTotal.toLocaleString("tr-TR", { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ─── SAĞ KOLON: Ürün Arama & Kataloğu ───────────────────────────── */}
          <div className="lg:col-span-5 flex flex-col space-y-3 bg-panel-2 border border-panel-6 rounded-xl p-4">
            <h3 className="text-xs font-bold text-panel-12 uppercase tracking-wider flex items-center justify-between pb-2 border-b border-panel-6">
              <span className="flex items-center gap-1.5">
                <Search className="w-3.5 h-3.5 text-brand-11" />
                Ürün Seçici
              </span>
              <span className="text-[10px] text-panel-11 font-normal">
                {filteredProducts.length} Ürün bulundu
              </span>
            </h3>

            {/* Arama Inputu */}
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-panel-10" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Ürün adı veya model ara..."
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-panel-1 border border-panel-6 rounded-lg text-panel-12 placeholder-panel-9 focus:outline-none focus:border-brand-9"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-2.5 text-panel-10 hover:text-panel-12 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Kategori Filtresi */}
            {allCategories.length > 0 && (
              <div className="flex gap-1 overflow-x-auto pb-1 text-[11px] scrollbar-none">
                <button
                  type="button"
                  onClick={() => setSelectedCategory("ALL")}
                  className={`px-2 py-0.5 rounded-full whitespace-nowrap transition-colors cursor-pointer ${selectedCategory === "ALL"
                    ? "bg-brand-9 text-white font-semibold"
                    : "bg-panel-3 text-panel-11 hover:text-panel-12"
                    }`}
                >
                  Tümü
                </button>
                {allCategories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-2 py-0.5 rounded-full whitespace-nowrap transition-colors cursor-pointer ${selectedCategory === cat
                      ? "bg-brand-9 text-white font-semibold"
                      : "bg-panel-3 text-panel-11 hover:text-panel-12"
                      }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}

            {/* Ürün Listesi (Scrollable) */}
            <div className="overflow-y-auto max-h-[380px] space-y-2 pr-1 divide-y divide-panel-6/50">
              {filteredProducts.length === 0 ? (
                <div className="text-center py-12 text-panel-11 text-xs">
                  Aramanıza uygun ürün bulunamadı.
                </div>
              ) : (
                filteredProducts.map((product) => {
                  const imageSrc =
                    product.imageUrl ||
                    (product.images && product.images.length > 0
                      ? product.images[0].url
                      : null);

                  const isAlreadyAdded = selectedItems.some(
                    (i) => i.productId === product.id
                  );

                  return (
                    <div
                      key={product.id}
                      className="pt-2 flex items-center justify-between gap-3 group"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-10 h-10 rounded bg-panel-3 border border-panel-6 overflow-hidden flex items-center justify-center shrink-0">
                          {imageSrc ? (
                            <img
                              src={imageSrc}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Package className="w-4 h-4 text-panel-10" />
                          )}
                        </div>

                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-panel-12 truncate group-hover:text-brand-11 transition-colors">
                            {product.name}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[10px] text-panel-11">
                              {product.category}
                            </span>
                            <span className="text-[11px] font-mono font-bold text-panel-12">
                              ₺{Number(product.price).toLocaleString("tr-TR")}
                            </span>
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleAddProduct(product)}
                        className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-all shrink-0 flex items-center gap-1 cursor-pointer ${isAlreadyAdded
                          ? "bg-brand-3 text-brand-11 border border-brand-7 hover:bg-brand-4"
                          : "bg-panel-1 border border-panel-6 text-panel-12 hover:bg-brand-9 hover:text-white hover:border-brand-9"
                          }`}
                      >
                        <Plus className="w-3 h-3" />
                        <span>{isAlreadyAdded ? "Adet Ekle" : "Ekle"}</span>
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}
