const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const pages = await prisma.page.findMany({
    select: { title: true, isPublished: true, showInHeader: true, showInFooter: true }
  });
  console.log(JSON.stringify(pages, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
