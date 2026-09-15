import { PrismaClient } from '@prisma/client';

const getDatabaseUrl = () => {
  let url = process.env.DATABASE_URL || '';
  const isHostinger = typeof __dirname !== 'undefined' && (__dirname.includes('/domains/') || __dirname.includes('\\domains\\'));
  if (isHostinger && url.includes('srv1100.hstgr.io')) {
    url = url.replace(/srv1100\.hstgr\.io/g, '127.0.0.1');
  } else if (!isHostinger && url.includes('127.0.0.1:3306')) {
    url = url.replace('127.0.0.1:3306', 'srv1100.hstgr.io:3306');
  }
  return url;
};

const createPrismaClient = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
    datasourceUrl: getDatabaseUrl(),
  });
};

declare global {
  var prismaGlobal: PrismaClient | undefined;
}

const prisma = globalThis.prismaGlobal ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalThis.prismaGlobal = prisma;
}

export default prisma;

