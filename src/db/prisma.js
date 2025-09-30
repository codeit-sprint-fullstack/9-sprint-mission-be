import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient({
  log: ['info', 'warn', 'error'],
});

export async function disconnectDB() {
  try {
    await prisma.$disconnect();
    console.log('📦 Disconnected from the database.');
  } catch (e) {
    console.error('❌ Error disconnecting from the database:', e);
    process.exit(1);
  }
}
