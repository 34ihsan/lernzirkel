require('dotenv').config();
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');

async function main() {
  const connectionString = process.env.DATABASE_URL;
  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  const announcements = await prisma.announcement.findMany({
    where: { title: 'Erken Kayit' }
  });
  console.log(JSON.stringify(announcements, null, 2));
}

main().catch(console.error).finally(() => process.exit(0));
