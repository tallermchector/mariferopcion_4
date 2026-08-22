// ./src/lib/prisma.ts
import { PrismaClient } from '@prisma/client';
import path from 'path';

const getDatabaseUrl = () => {
  if (process.env.DATABASE_URL && process.env.DATABASE_URL.startsWith('file:')) {
    return process.env.DATABASE_URL;
  }
  const dbPath = path.join(process.cwd(), 'prisma', 'dev.db');
  return `file:${dbPath}`;
};

if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = getDatabaseUrl();
}

/**
 * Cliente Singleton de Prisma para evitar el agotamiento de conexiones
 * durante el Fast Refresh en entornos de desarrollo de Next.js.
 */

const prismaClientSingleton = () => {
  return new PrismaClient({
    datasources: {
      db: {
        url: getDatabaseUrl(),
      },
    },
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });
};

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton> | undefined;
} & typeof global;

export const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') {
  globalThis.prismaGlobal = prisma;
}

export default prisma;
