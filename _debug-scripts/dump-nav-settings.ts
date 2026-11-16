import prisma from '../src/lib/prisma';

async function main() {
  const settings = await prisma.siteSettings.findUnique({
    where: { id: 'global' },
  });

  if (!settings) {
    console.log('No global settings found');
    return;
  }

  console.log('--- headerConfig.navLinks ---');
  console.log(JSON.stringify((settings.headerConfig as any)?.navLinks || null, null, 2));
  console.log('--- footerConfig.quickLinks ---');
  console.log(JSON.stringify((settings.footerConfig as any)?.quickLinks || null, null, 2));
  console.log('--- footerConfig.legalLinks ---');
  console.log(JSON.stringify((settings.footerConfig as any)?.legalLinks || null, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
