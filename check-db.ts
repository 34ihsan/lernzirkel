import prisma from './src/lib/prisma';

async function main() {
  const count = await prisma.article.count();
  console.log('Article count:', count);
}

main().catch(console.error).finally(() => prisma.$disconnect());
