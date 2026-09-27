import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) {
    throw new Error('DATABASE_URL environment variable is not set')
  }
  const adapter = new PrismaPg(connectionString)
  return new PrismaClient({ adapter })
}

const SCHEMA_VERSION = 6 // bumped for Article

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
  prismaSchemaVersion: number;
} & typeof global;

// In dev, discard stale singleton if schema version changed or if it lacks fresh models
const existingClient = globalThis.prismaGlobal
const isStale = !existingClient || 
  globalThis.prismaSchemaVersion !== SCHEMA_VERSION ||
  !('page' in existingClient) || 
  !('announcement' in existingClient) ||
  !('jobPosition' in existingClient) ||
  !('article' in existingClient)

const prisma = (!isStale && existingClient) ? existingClient : prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') {
  globalThis.prismaGlobal = prisma
  globalThis.prismaSchemaVersion = SCHEMA_VERSION
}
