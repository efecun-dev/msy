import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding started...');

  // Admin User
  const adminPassword = await bcrypt.hash('Mehmet55!', 10);
  const admin = await prisma.admin.upsert({
    where: { username: 'mehmet' },
    update: {},
    create: {
      username: 'mehmet',
      name: 'Mehmet Yılmaz',
      password: adminPassword,
    },
  });

  console.log('Admin user ensured:', admin.username);

  // Clear existing products to prevent duplicates on re-seed
  await prisma.product.deleteMany({});
  
  // Sample Products
  const products = [
    {
      name: '4K Dome Kamera',
      description: 'Ultra HD çözünürlüklü, gece görüşlü güvenlik kamerası.',
      price: 2499.00,
      category: 'Güvenlik',
      badge: 'Çok Satan',
      badgeColor: 'bg-blue-500',
      inStock: true,
      stockCount: 48,
    },
    {
      name: 'Motorize Anten',
      description: 'Yüksek kazançlı, otomatik yönlendirilebilir uydu anteni.',
      price: 1850.00,
      category: 'Uydu',
      inStock: true,
      stockCount: 12,
    },
    {
      name: '16 Kanal NVR',
      description: '4K destekli, H.265+ sıkıştırmalı ağ kayıt cihazı.',
      price: 4200.00,
      category: 'Kayıt',
      badge: 'Yeni',
      badgeColor: 'bg-emerald-500',
      inStock: true,
      stockCount: 5,
    },
    {
      name: 'Video Kapı Zili',
      description: 'Wi-Fi bağlantılı, çift yönlü sesli akıllı kapı zili.',
      price: 1290.00,
      category: 'Güvenlik',
      inStock: false,
      stockCount: 0,
    },
    {
      name: 'Kablosuz Alarm Seti',
      description: 'Mobil uygulama kontrollü tam kapsamlı alarm sistemi.',
      price: 3100.00,
      category: 'Alarm',
      badge: 'İndirim',
      badgeColor: 'bg-red-500',
      inStock: true,
      stockCount: 23,
    },
  ];

  for (const p of products) {
    await prisma.product.create({
      data: p,
    });
  }

  console.log(`Seeded ${products.length} products.`);
  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

