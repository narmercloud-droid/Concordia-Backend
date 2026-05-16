import { prisma } from '../src/prisma/client';

describe('Prisma Client', () => {
  describe('connect', () => {
    it('should connect to the database', async () => {
      await expect(prisma.$connect()).resolves.not.toThrow();
    });
  });

  describe('disconnect', () => {
    it('should disconnect from the database', async () => {
      await expect(prisma.$disconnect()).resolves.not.toThrow();
    });
  });

  describe('query execution', () => {
    it('should execute a simple query', async () => {
      const result = await prisma.$queryRaw`SELECT 1 + 1 as result`;
      expect(result).toEqual([{ result: 2 }]);
    });
  });
});
