
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function run() {
  const pages = await prisma.page.findMany({
    where: { slug: { contains: 'alphabetisierung' } },
    include: { sections: true }
  });
  console.log(JSON.stringify(pages, null, 2));
}
run().finally(() => process.exit(0));

