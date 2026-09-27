import prisma from '../src/lib/prisma';
async function run() {
  const page = await prisma.page.findUnique({where: {id: 'd4768567-7ed7-4373-abb6-81cf38a7071f'}, include: {sections: true}});
  const htmlSection = page?.sections.find(s => s.type === 'HTML');
  console.log(htmlSection?.content);
}
run().catch(console.error).finally(() => prisma.$disconnect());
