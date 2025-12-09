import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

console.log('DB URL:', process.env.DATABASE_URL ? 'Defined' : 'Undefined');

const prisma = new PrismaClient();

async function main() {
  console.log('Test connection...');
  try {
    const count = await prisma.user.count();
    console.log('User count:', count);
  } catch (e) {
    console.error('Error:', e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
