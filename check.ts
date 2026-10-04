require('dotenv').config();
import prisma from './src/lib/prisma';

async function main() {
  const announcements = await prisma.announcement.findMany({
    where: { title: 'Erken Kayit' }
  });
  console.log(JSON.stringify(announcements, null, 2));
}

main().catch(console.error).finally(() => process.exit(0));
