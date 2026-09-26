const fs = require("fs");
let content = fs.readFileSync("src/app/actions/product.ts", "utf-8");

// 1. Fix deleteProductImage
const oldDeleteFunc = `export async function deleteProductImage(id: number) {
  await checkAuth();
  const img = await prisma.productImage.findUnique({ where: { id } });
  if (img) {
    await deleteFile(img.url);
    await prisma.productImage.delete({ where: { id } });
  }
  revalidatePath("/dashboard/products");
  revalidatePath("/");
}`;

const newDeleteFunc = `export async function deleteProductImage(id: number) {
  await checkAuth();
  const img = await prisma.productImage.findUnique({ where: { id }, include: { product: { include: { images: true } } } });
  if (img) {
    await deleteFile(img.url);
    await prisma.productImage.delete({ where: { id } });
    
    // Eğer silinen fotoğraf, ürünün "ana kapak" fotoğrafıysa (imageUrl)
    if (img.product.imageUrl === img.url) {
      // Kalan fotoğraflardan ilkini bul
      const remainingImage = img.product.images.find(i => i.id !== id);
      await prisma.product.update({
        where: { id: img.productId },
        data: { imageUrl: remainingImage ? remainingImage.url : null }
      });
    }
  }
  revalidatePath("/dashboard/products");
  revalidatePath("/");
}`;

content = content.replace(oldDeleteFunc, newDeleteFunc);

// 2. Fix updateProduct to ALWAYS set the first newly uploaded image as the main image
// IF they uploaded a new image, it's highly likely they want it to be the main image,
// OR at least if the old image is null. I will set it to always update the main image if they upload a new one,
// since there's no UI to select the main image and users intuitively expect the new upload to be main.

const oldUpdateLogic = `    if (imageUrls.length > 0) {
      // If it's the first time uploading images, set main imageUrl
      if (!oldProduct?.imageUrl) {
        data.imageUrl = imageUrls[0];
      }`;

const newUpdateLogic = `    if (imageUrls.length > 0) {
      // Eğer kullanıcı yeni bir fotoğraf yüklediyse ve ürünün kapak fotoğrafı yoksa, 
      // YADA direkt olarak yeni fotoğrafı kapak fotoğrafı yapmak istiyorsak:
      // (Kullanıcı yeni fotoğraf yüklediğinde bunu direkt ana resim yapıyoruz)
      data.imageUrl = imageUrls[0];`;

content = content.replace(oldUpdateLogic, newUpdateLogic);

fs.writeFileSync("src/app/actions/product.ts", content, "utf-8");
