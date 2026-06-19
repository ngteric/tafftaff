import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.user.create({
    data: {
      name: 'Eric',
    },
  });

  console.log('Seed data has been inserted successfully.');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
