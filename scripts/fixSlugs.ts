import prisma from '../src/lib/prisma';

async function main() {
  const projects = await prisma.project.findMany({
    where: {
      slug: null
    }
  });

  for (const project of projects) {
    const newSlug = project.title
      .toLowerCase()
      .trim()
      .replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    await prisma.project.update({
      where: { id: project.id },
      data: { slug: newSlug }
    });
    console.log(`Updated project "${project.title}" with slug: ${newSlug}`);
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
