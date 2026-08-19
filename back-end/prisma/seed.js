import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('password', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@school.com' },
    update: {},
    create: {
      email: 'admin@school.com',
      passwordHash,
      name: 'Admin',
      role: 'ADMIN',
    },
  });

  const teacher = await prisma.user.upsert({
    where: { email: 'teacher@school.com' },
    update: {},
    create: {
      email: 'teacher@school.com',
      passwordHash,
      name: 'Teacher',
      role: 'TEACHER',
    },
  });

  const profile = await prisma.schoolProfile.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      name: 'EduManage School',
      address: 'Local School Address',
      academicYear: '2026-2027',
    },
  });

  console.log('Seeded:');
  console.log(`  Admin   ${admin.email} / password`);
  console.log(`  Teacher ${teacher.email} / password`);
  console.log(`  School  ${profile.name}`);
}

main()
  .catch((err) => {
    console.error('Seed failed:', err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());