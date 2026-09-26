"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Plus, Edit, Trash2, ImageIcon, X } from "lucide-react";
import {
  createProduct,
  updateProduct,
  deleteProduct,
  deleteProductImage,
} from "@/app/actions/product";
import {
  Button,
  Modal,
  Input,
  Select,
  Textarea,
  Switch,
  Badge,
} from "@/components/ui";
import { useToast } from "@/components/ui/Toast";
import { useRouter } from "next/navigation";

export default function ProductManager({
  initialProducts,
  initialCategories = [],
}: {
  initialProducts: any[];
  initialCategories?: string[];
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    badge: "",
    badgeColor: "blue",
    stockCount: "0",
    isActive: true,
  });
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [categories, setCategories] = useState<string[]>(initialCategories);
  const [catModalOpen, setCatModalOpen] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [savingCategories, setSavingCategories] = useState(false);

  const handleSaveCategories = async () => {
    setSavingCategories(true);
    try {
      const { saveCategories } = await import("@/app/actions/settings");
      await saveCategories(categories);
      toast({
        type: "success",
        title: "Başarılı",
        description: "Kategoriler kaydedildi.",
      });
      setCatModalOpen(false);
      router.refresh();
    } catch (e) {
      toast({
        type: "error",
        title: "Hata",
        description: "Kategoriler kaydedilirken hata oluştu.",
      });
    } finally {
      setSavingCategories(false);
    }
  };

  const removeCategory = (cat: string) => {
    setCategories(categories.filter((c) => c !== cat));
  };

  const addCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      setCategories([...categories, newCategory.trim()]);
      setNewCategory("");
    }
  };

  const openAdd = () => {
    setEditingId(null);
    setEditingProduct(null);
    setForm({
      name: "",
      description: "",
      price: "",
      category: "",
      badge: "",
      badgeColor: "blue",
      stockCount: "0",
      isActive: true,
    });
    setImageFiles([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
    setModalOpen(true);
  };

  const openEdit = (p: any) => {
    setEditingId(p.id);
    setEditingProduct(p);
    setForm({
      name: p.name,
      description: p.description,
      price: p.price.toString(),
      category: p.category,
      badge: p.badge || "",
      badgeColor: p.badgeColor || "blue",
      stockCount: p.stockCount.toString(),
      isActive: p.isActive,
    });
    setImageFiles([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
    setModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Bu ürünü silmek istediğinize emin misiniz?")) return;
    try {
      await deleteProduct(id);
      toast({
        type: "success",
        title: "Başarılı",
        description: "Ürün başarıyla silindi.",
      });
    } catch (err) {
      console.error(err);
      toast({
        type: "error",
        title: "Hata",
        description: "Ürün silinirken bir hata oluştu.",
      });
    }
  };

  const handleDeleteExistingImage = async (imageId: number) => {
    if (!confirm("Bu fotoğrafı silmek istediğinize emin misiniz?")) return;
    try {
      await deleteProductImage(imageId);
      // Remove it locally from state so it disappears instantly
      setEditingProduct((prev: any) => ({
        ...prev,
        images: prev.images.filter((img: any) => img.id !== imageId),
      }));
      router.refresh();
      toast({
        type: "success",
        title: "Başarılı",
        description: "Fotoğraf silindi.",
      });
    } catch (err) {
      console.error(err);
      toast({
        type: "error",
        title: "Hata",
        description: "Fotoğraf silinirken bir hata oluştu.",
      });
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("description", form.description);
    formData.append("price", form.price);
    formData.append("category", form.category);
    formData.append("badge", form.badge);
    formData.append("badgeColor", form.badgeColor);
    formData.append("stockCount", form.stockCount);
    formData.append("isActive", form.isActive.toString());

    imageFiles.forEach((file) => {
      formData.append("images", file);
    });

    try {
      if (editingId) {
        await updateProduct(editingId, formData);
        toast({
          type: "success",
          title: "Başarılı",
          description: "Ürün başarıyla güncellendi.",
        });
      } else {
        await createProduct(formData);
        toast({
          type: "success",
          title: "Başarılı",
          description: "Ürün başarıyla eklendi.",
        });
      }
      setModalOpen(false);
    } catch (err) {
      console.error(err);
      toast({
        type: "error",
        title: "Hata",
        description: "İşlem sırasında bir hata oluştu.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-panel-12">Ürün Yönetimi</h1>
          <p className="text-panel-11 text-xs mt-1">
            Kataloğunuzdaki ürünleri düzenleyin.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setCatModalOpen(true)}
            leftIcon={<Edit className="w-4 h-4" />}
          >
            Kategoriler
          </Button>
          <Button onClick={openAdd} leftIcon={<Plus className="w-4 h-4" />}>
            Yeni Ürün
          </Button>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
        {categories.map((cat) => {
          const count = initialProducts.filter(
            (p) => p.category === cat,
          ).length;
          return (
            <div
              key={cat}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-panel-2 border border-panel-6 rounded-full whitespace-nowrap shrink-0"
            >
              <span className="text-xs font-medium text-panel-12">{cat}</span>
              <span className="text-[10px] font-bold text-brand-11 bg-brand-3/20 px-1.5 py-0.5 rounded-full">
                {count}
              </span>
            </div>
          );
        })}
      </div>

      <div className="bg-panel-1 border border-panel-6 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap min-w-[800px]">
            <thead className="bg-panel-2 border-b border-panel-6 text-panel-11">
              <tr>
                <th className="px-6 py-4 font-medium w-16">Fotoğraf</th>
                <th className="px-6 py-4 font-medium">Ürün Adı</th>
                <th className="px-6 py-4 font-medium">Kategori</th>
                <th className="px-6 py-4 font-medium">Fiyat</th>
                <th className="px-6 py-4 font-medium">Stok</th>
                <th className="px-6 py-4 font-medium">Durum</th>
                <th className="px-6 py-4 font-medium text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-panel-6 text-panel-12">
              {initialProducts.map((p) => (
                <tr key={p.id} className="hover:bg-panel-3 transition-colors">
                  <td className="px-6 py-4">
                    {p.imageUrl || (p.images && p.images.length > 0) ? (
                      <div className="w-10 h-10 rounded overflow-hidden relative border border-panel-6">
                        <Image
                          src={p.imageUrl || p.images[0].url}
                          alt={p.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded bg-panel-4 border border-panel-6 flex items-center justify-center text-panel-11">
                        <ImageIcon className="w-4 h-4" />
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 font-semibold">{p.name}</td>
                  <td className="px-6 py-4">{p.category}</td>
                  <td className="px-6 py-4 font-medium">
                    ₺{Number(p.price).toLocaleString("tr-TR")}
                  </td>
                  <td className="px-6 py-4">
                    {p.inStock ? (
                      <span className="text-green-500 font-bold">
                        {p.stockCount}
                      </span>
                    ) : (
                      <span className="text-red-500 font-bold">Tükendi</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {p.isActive ? (
                      <Badge color="green">Aktif</Badge>
                    ) : (
                      <Badge color="gray">Pasif</Badge>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => openEdit(p)}
                        className="p-2 text-panel-11 hover:text-brand-11 transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="p-2 text-panel-11 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? "Ürünü Düzenle" : "Yeni Ürün Ekle"}
        size="lg"
      >
        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Ürün Adı"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <Input
              label="Fiyat (₺)"
              type="number"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Kategori"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              options={categories.map((cat) => ({ label: cat, value: cat }))}
            />
            <Input
              label="Stok Miktarı"
              type="number"
              value={form.stockCount}
              onChange={(e) => setForm({ ...form, stockCount: e.target.value })}
            />
          </div>

          <Textarea
            label="Açıklama"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={3}
          />

          <div className="border border-panel-6 p-4 rounded-lg bg-panel-2 space-y-3">
            <label className="text-sm font-medium text-panel-12">
              Ürün Görselleri
            </label>

            {editingProduct?.images && editingProduct.images.length > 0 && (
              <div className="flex flex-wrap gap-3 mb-4">
                {editingProduct.images.map((img: any) => (
                  <div
                    key={img.id}
                    className="relative group w-20 h-20 rounded border border-panel-6 overflow-hidden"
                  >
                    <Image
                      src={img.url}
                      alt="product image"
                      fill
                      className="object-cover"
                    />
                    <button
                      onClick={() => handleDeleteExistingImage(img.id)}
                      className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <input
              type="file"
              accept="image/*"
              multiple
              ref={fileInputRef}
              onChange={(e) => {
                if (e.target.files) {
                  setImageFiles(Array.from(e.target.files));
                }
              }}
              className="block w-full text-sm text-panel-11 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-brand-3 file:text-brand-11 hover:file:bg-brand-4"
            />
            <p className="text-xs text-panel-11">
              Birden fazla fotoğraf yükleyebilirsiniz. Fotoğraflar ürün
              sayfasına otomatik eklenecektir.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border border-panel-6 p-4 rounded-lg bg-panel-2">
            <Input
              label="Rozet (Örn: YENİ, %20 İNDİRİM)"
              value={form.badge}
              onChange={(e) => setForm({ ...form, badge: e.target.value })}
            />
            <Select
              label="Rozet Rengi"
              value={form.badgeColor}
              onChange={(e) => setForm({ ...form, badgeColor: e.target.value })}
              options={[
                { label: "Mavi", value: "blue" },
                { label: "Yeşil", value: "green" },
                { label: "Kırmızı", value: "red" },
                { label: "Sarı", value: "yellow" },
              ]}
            />
          </div>

          <div className="flex items-center justify-between p-4 border border-panel-6 rounded-lg bg-panel-2">
            <div>
              <p className="font-semibold text-panel-12">Aktif Ürün</p>
              <p className="text-xs text-panel-11">
                Müşteriler bu ürünü katalogda görebilir
              </p>
            </div>
            <Switch
              checked={form.isActive}
              onChange={(c) => setForm({ ...form, isActive: c })}
            />
          </div>

          <Button
            onClick={handleSubmit}
            loading={loading}
            className="w-full"
            size="lg"
          >
            {editingId ? "Değişiklikleri Kaydet" : "Ürünü Ekle"}
          </Button>
        </div>
      </Modal>

      <Modal
        open={catModalOpen}
        onClose={() => setCatModalOpen(false)}
        title="Kategorileri Düzenle"
      >
        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Yeni kategori adı..."
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addCategory()}
              className="flex-1"
            />
            <Button
              type="button"
              onClick={addCategory}
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Ekle
            </Button>
          </div>

          <div className="bg-panel-2 rounded-lg border border-panel-6 divide-y divide-panel-6 max-h-[300px] overflow-y-auto">
            {categories.map((cat) => (
              <div key={cat} className="flex justify-between items-center p-3">
                <span className="text-sm font-medium text-panel-12">{cat}</span>
                <button
                  type="button"
                  onClick={() => removeCategory(cat)}
                  className="text-red-500 hover:text-red-600 p-1 rounded-md hover:bg-red-500/10 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            {categories.length === 0 && (
              <div className="p-4 text-center text-sm text-panel-11">
                Hiç kategori yok.
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="ghost" onClick={() => setCatModalOpen(false)}>
              İptal
            </Button>
            <Button onClick={handleSaveCategories} loading={savingCategories}>
              Kategorileri Kaydet
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
