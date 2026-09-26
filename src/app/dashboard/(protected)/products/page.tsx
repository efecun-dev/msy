import { prisma } from "@/lib/prisma";
import ProductManager from "@/components/admin/ProductManager";

export default async function ProductsAdminPage() {
  const dbProducts = await prisma.product.findMany({
    orderBy: { id: "asc" },
    include: { images: true },
  });

  const products = dbProducts.map((p) => ({
    ...p,
    price: Number(p.price),
  }));

  const categoriesSetting = await prisma.setting.findUnique({
    where: { key: "product_categories" },
  });

  const defaultCategories = [
    "Güvenlik Kameraları",
    "Uydu Sistemleri",
    "Otomasyon",
    "Kablolar & Aksesuarlar",
  ];

  let categories = defaultCategories;
  if (categoriesSetting) {
    try {
      categories = JSON.parse(categoriesSetting.value);
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <ProductManager
      initialProducts={products as any}
      initialCategories={categories}
    />
  );
}
