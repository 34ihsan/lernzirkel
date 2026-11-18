import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
  const connectionString = process.env.DATABASE_URL
  // `next build` imports every route module (including force-dynamic ones) to collect
  // their metadata, without ever calling them — DATABASE_URL is a runtime-only secret and
  // deliberately absent then. Use a placeholder so the import succeeds; no query runs
  // during the build phase, so this connection string is never actually dialed.
  if (!connectionString && process.env.NEXT_PHASE === 'phase-production-build') {
    const adapter = new PrismaPg('postgresql://build:build@localhost:5432/build')
    return new PrismaClient({ adapter })
  }
  if (!connectionString) {
    throw new Error('DATABASE_URL environment variable is not set')
  }
  const adapter = new PrismaPg(connectionString)
  return new PrismaClient({ adapter })
}

const SCHEMA_VERSION = 13 // bumped: removed LeadApplication, added Registration.assignedTo*/lastContactedAt

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
