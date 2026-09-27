
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function run() {
  const page = await prisma.page.findUnique({
    where: { slug: 'deutsch-grundbildung/integrationskurse-alpha' },
    include: { sections: true }
  });
  console.log(JSON.stringify(page, null, 2));
}
run().finally(() => prisma.$disconnect());

