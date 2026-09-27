import prisma from '../src/lib/prisma';

async function main() {
  const page = await prisma.page.findUnique({
    where: { id: 'd4768567-7ed7-4373-abb6-81cf38a7071f' },
    include: { sections: true }
  });
  console.log(JSON.stringify(page, null, 2));
}

main().catch(e => {
  console.error(e);
}).finally(async () => {
  await prisma.$disconnect();
});
