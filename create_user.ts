import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash('MsyMehmet55!', 10);
  await prisma.admin.upsert({
    where: { username: 'mehmet55' },
    update: { password, name: 'Mehmet MSY' },
    create: { username: 'mehmet55', password, name: 'Mehmet MSY' }
  });
  console.log('User created!');
}
main().catch(console.error).finally(() => prisma.$disconnect());
