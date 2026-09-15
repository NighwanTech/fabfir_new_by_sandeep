import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Admin account setup...');

  const email = process.env.ADMIN_EMAIL || 'fabfitgym04@gmail.com';
  const password = process.env.ADMIN_PASSWORD || 'FabFit@2026';

  console.log(`Setting up Admin account for: ${email}...`);

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  const admin = await prisma.admin.upsert({
    where: { email },
    update: {
      passwordHash,
    },
    create: {
      email,
      passwordHash,
    },
  });

  console.log('\n=========================================');
  console.log('✅ Admin account seeded successfully!');
  console.log(`📧 Email:    ${admin.email}`);
  console.log(`🔑 Password: ${password}`);
  console.log('=========================================\n');
}

main()
  .catch((e) => {
    console.error('❌ An error occurred during Admin setup:');
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log('Database disconnected cleanly.');
  });
