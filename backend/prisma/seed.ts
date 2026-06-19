import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.user.upsert({
    where: { email: 'eric@nong.dev' },
    update: {},
    create: {
      lastName: 'Nong',
      firstName: 'Eric',
      email: 'eric@nong.dev',
      password: 'test1234',
    },
  });
}

main()
  .then(() => {
    console.log('Seed data has been inserted successfully.');
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
