import prisma from '../src/lib/prisma';

async function main() {
  const settings = await prisma.siteSettings.findUnique({ where: { id: 'global' } });
  console.log('--- headerConfig.topBar ---');
  console.log(JSON.stringify((settings?.headerConfig as any)?.topBar || null, null, 2));

  const slugsToCheck = [
    'esfplusalpha',
    'bildungswege-in-ludwigshafen-_b',
    'kinder-jugendliche/kostenlose-lernfoerderung_b',
    'kostenlose-lernfoerderung_b',
    'kinder-jugendliche/abiturvorbereitung',
    'abiturvorbereitung',
    'kinder-jugendliche/jugendbetreuung',
    'jugendbetreuung',
    'kinder-jugendliche/aol-yoes',
    'aol-yoes',
    'deutsch-grundbildung/kurse',
    'kurse/esfplusalpha',
    'integrationkurse',
    'deutsch-grundbildung/integrationskurse',
  ];

  const pages = await prisma.page.findMany({
    where: { slug: { in: slugsToCheck } },
    select: { slug: true, title: true, isPublished: true },
  });
  console.log('--- Matching Page rows (exact slug) ---');
  console.log(JSON.stringify(pages, null, 2));

  console.log('--- Checked, no exact match for: ---');
  const found = new Set(pages.map(p => p.slug));
  console.log(slugsToCheck.filter(s => !found.has(s)));
}

main().catch(console.error).finally(() => prisma.$disconnect());
