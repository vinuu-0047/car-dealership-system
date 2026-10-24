import { prisma } from '../src/lib/prisma';

beforeAll(async () => {
  // Ensure DB connection for integration tests
  await prisma.$connect();
});

afterAll(async () => {
  await prisma.$disconnect();
});
