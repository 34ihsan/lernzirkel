import prisma from './src/lib/prisma';

async function main() {
  const settings = await prisma.siteSettings.findUnique({
    where: { id: 'global' }
  });
  console.log(JSON.stringify(settings?.headerConfig, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
