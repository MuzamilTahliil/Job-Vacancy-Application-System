import 'dotenv/config';
import {
  PrismaClient,
  UserRole,
  JobType,
  ApplicationStatus,
  User,
  Company,
} from '@prisma/client';
import * as bcrypt from 'bcrypt';

import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const connectionString = `${process.env.DATABASE_URL}`;

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// --- Helpers ---
const randomInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;
const randomElement = <T>(arr: T[]): T =>
  arr[Math.floor(Math.random() * arr.length)];

const firstNames = [
  'James',
  'Mary',
  'John',
  'Patricia',
  'Robert',
  'Jennifer',
  'Michael',
  'Linda',
  'William',
  'Elizabeth',
  'Ahmed',
  'Fatima',
  'Mohamed',
  'Aisha',
  'Chen',
  'Wei',
];
const lastNames = [
  'Smith',
  'Johnson',
  'Williams',
  'Brown',
  'Jones',
  'Garcia',
  'Miller',
  'Davis',
  'Rodriguez',
  'Martinez',
  'Ali',
  'Khan',
  'Wang',
  'Li',
];
const companies = [
  'Tech Corp',
  'Soft Solutions',
  'Innovate LLC',
  'Global Systems',
  'NextGen AI',
  'Future Works',
  'Data Dynamics',
  'Cloud Nine',
  'Security Plus',
  'Web Wizards',
];
const jobTitles = [
  'Frontend Developer',
  'Backend Engineer',
  'Full Stack Developer',
  'Data Scientist',
  'DevOps Engineer',
  'Product Manager',
  'UX Designer',
  'System Admin',
  'QA Engineer',
  'Sales Representative',
];
const techSkills = [
  'JavaScript',
  'TypeScript',
  'React',
  'NestJS',
  'Node.js',
  'Python',
  'Java',
  'Docker',
  'AWS',
  'SQL',
];
const cities = [
  'New York',
  'London',
  'Berlin',
  'Tokyo',
  'San Francisco',
  'Dubai',
  'Cairo',
  'Singapore',
  'Toronto',
  'Sydney',
];

const generateName = () =>
  `${randomElement(firstNames)} ${randomElement(lastNames)}`;
const generateEmail = (name: string, idx: number) =>
  `${name.toLowerCase().replace(/\s+/g, '.')}${idx}@example.com`;

async function main() {
  console.log('🌱 Starting seed...');

  // 1. Clean Database
  console.log('🧹 Cleaning database...');
  await prisma.application.deleteMany();
  await prisma.job.deleteMany();
  await prisma.jobSeekerProfile.deleteMany();
  await prisma.jobSeekerProfile.deleteMany();
  await prisma.user.deleteMany();
  await prisma.company.deleteMany();

  // Reset all sequences to start from 1
  await prisma.$executeRawUnsafe('ALTER SEQUENCE users_id_seq RESTART WITH 1');
  await prisma.$executeRawUnsafe('ALTER SEQUENCE companies_id_seq RESTART WITH 1');
  await prisma.$executeRawUnsafe('ALTER SEQUENCE jobs_id_seq RESTART WITH 1');
  await prisma.$executeRawUnsafe(
    'ALTER SEQUENCE applications_id_seq RESTART WITH 1',
  );
  await prisma.$executeRawUnsafe(
    'ALTER SEQUENCE job_seeker_profiles_id_seq RESTART WITH 1',
  );

  const password = await bcrypt.hash('password123', 10);

  // 2. Create Super Admin
  console.log('👤 Creating Super Admin...');
  await prisma.user.create({
    data: {
      fullName: 'Super Admin',
      email: 'admin@admin.com',
      password,
      role: UserRole.SUPER_ADMIN,
    },
  });

  // 3. Create Employers & Jobs
  console.log('🏢 Creating Employers & Jobs...');
  const employers: User[] = [];

  // Create 10 employers
  for (let i = 0; i < 10; i++) {
    const name = generateName();
    const companyName = randomElement(companies) + ` ${i}`;

    // Create Company
    const company = await prisma.company.create({
      data: {
        name: companyName,
        description: 'A great place to work.',
        location: randomElement(cities),
        website: `https://${companyName.replace(/\s/g, '').toLowerCase()}.com`,
      },
    });

    // Create Employer User
    const employer = await prisma.user.create({
      data: {
        fullName: name,
        email: generateEmail(name, i),
        password,
        role: UserRole.EMPLOYER,
        companyId: company.id,
      },
    });
    employers.push(employer);

    // Create 2 jobs per employer
    for (let j = 0; j < 2; j++) {
      await prisma.job.create({
        data: {
          title: randomElement(jobTitles),
          description: `We are looking for a ${randomElement(jobTitles)} to join our team at ${companyName}.`,
          requirements: `Must know ${randomElement(techSkills)}`,
          responsibilities: 'Build stuff.',
          location: randomElement(cities),
          salary: `$${randomInt(50, 150)}k`,
          jobType: randomElement(Object.values(JobType)),
          deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), // 30 days
          employerId: employer.id,
        },
      });
    }
  }

  // 4. Create Job Seekers
  console.log('👨‍💼 Creating Job Seekers...');
  const seekers: User[] = [];
  for (let i = 0; i < 15; i++) {
    const name = generateName();
    const seeker = await prisma.user.create({
      data: {
        fullName: name,
        email: generateEmail(name, i + 100),
        password,
        role: UserRole.JOB_SEEKER,
      },
    });
    seekers.push(seeker);

    // Create Profile
    await prisma.jobSeekerProfile.create({
      data: {
        userId: seeker.id,
        bio: `Experienced professional in ${randomElement(techSkills)}`,
        skills: [
          randomElement(techSkills),
          randomElement(techSkills),
          randomElement(techSkills),
        ],
        experience: `${randomInt(1, 10)} years`,
        education: 'Bachelor of Science',
      },
    });
  }

  // 5. Create Applications
  console.log('📝 Creating Applications...');
  // Fetch all jobs to apply to
  const allJobs = await prisma.job.findMany();

  for (const seeker of seekers) {
    // Each seeker applies to 2 random jobs
    for (let k = 0; k < 2; k++) {
      const randomJob = randomElement(allJobs);

      // Prevent duplicates (unique constraint on jobId + applicantId)
      // Simple try/catch for seed
      try {
        await prisma.application.create({
          data: {
            coverLetter: 'I am very interested in this role.',
            jobId: (randomJob as any).id,
            applicantId: seeker.id,
            status: randomElement(Object.values(ApplicationStatus)),
          },
        });
      } catch (e) {
        // Ignore duplicate key errors
      }
    }
  }

  console.log('✅ Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
