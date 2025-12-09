import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const connectionString = `${process.env.DIRECT_URL}`;

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🧹 Cleaning database...');
  // Delete in order to respect foreign keys (though deleteMany handles cascade if configured, safe order is better)
  // Applications depend on Jobs and Users
  await prisma.application.deleteMany();
  // Jobs depend on Users (Employers)
  await prisma.job.deleteMany();
  // Profiles depend on Users
  await prisma.jobSeekerProfile.deleteMany();
  // Users are the base
  await prisma.user.deleteMany();

  console.log('🔄 Resetting sequences...');
  try {
    await prisma.$executeRawUnsafe('ALTER SEQUENCE users_id_seq RESTART WITH 1');
    await prisma.$executeRawUnsafe('ALTER SEQUENCE jobs_id_seq RESTART WITH 1');
    await prisma.$executeRawUnsafe('ALTER SEQUENCE applications_id_seq RESTART WITH 1');
    await prisma.$executeRawUnsafe('ALTER SEQUENCE job_seeker_profiles_id_seq RESTART WITH 1');
  } catch (error) {
    console.warn('⚠️  Could not reset sequences (ignore if using a database without sequences like CockroachDB)');
  }

  console.log('✨ Database successfully cleaned!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
