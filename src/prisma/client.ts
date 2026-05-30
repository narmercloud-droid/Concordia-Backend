import { PrismaClient } from "@prisma/client";

let _prisma: PrismaClient | null = null;

function getDatabaseUrlFallback() {
  // Prefer explicit DATABASE_URL, otherwise use a local file-based SQLite for safe builds
  return process.env.DATABASE_URL || `file:${process.cwd()}/dev.db`;
}

function ensurePrisma() {
  if (_prisma) return _prisma;

  const url = getDatabaseUrlFallback();
  // Construct PrismaClient with explicit datasource URL to avoid relying on generated client env during build
  _prisma = new PrismaClient({ datasources: { db: { url } } } as any);
  return _prisma;
}

export const prisma = new Proxy({} as any, {
  get(_target, prop) {
    const client = ensurePrisma();
    // @ts-ignore forward property access
    return (client as any)[prop];
  },
  set(_target, prop, value) {
    const client = ensurePrisma();
    // @ts-ignore forward set
    (client as any)[prop] = value;
    return true;
  }
});

async function connectWithRetry(retries = 10, delay = 500) {
  const client = ensurePrisma();
  for (let i = 0; i < retries; i++) {
    try {
      await client.$connect();
      console.log("Prisma connected");
      return;
    } catch (err) {
      console.log(`Prisma connection failed, retrying in ${delay}ms...`);
      await new Promise((res) => setTimeout(res, delay));
    }
  }
  throw new Error("Prisma failed to connect after retries");
}

export async function initPrisma() {
  // Allow build environments to opt out of DB initialization by setting SKIP_DB_INIT=true
  if (process.env.SKIP_DB_INIT === "true") {
    console.log("SKIP_DB_INIT=true, skipping Prisma connect");
    return;
  }
  await connectWithRetry();
}
