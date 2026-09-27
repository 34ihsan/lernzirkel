import prisma from '../src/lib/prisma';

async function fetchContent(url: string) {
  const res = await fetch(url);
  const text = await res.text();
  
  const startMarker = '<div class="entry-content" itemprop="text">';
  const endMarker = '</div><!-- .entry-content -->';
  
  const startIndex = text.indexOf(startMarker);
  const endIndex = text.indexOf(endMarker, startIndex);
  
  if (startIndex !== -1 && endIndex !== -1) {
    let content = text.substring(startIndex + startMarker.length, endIndex).trim();
    // Some pages might have a nested <article> or just standard elements, but this is safe enough.
    return content;
  }
  return '';
}

async function upsertLegalPage(slug: string, title: string, url: string) {
  console.log(`Processing ${slug}...`);
  const contentHtml = await fetchContent(url);
  
  if (!contentHtml) {
    console.error(`Could not extract content for ${slug}`);
    return;
  }

  let page = await prisma.page.findUnique({ where: { slug } });
  
  if (!page) {
    page = await prisma.page.create({
      data: {
        title,
        slug,
        isPublished: true,
        // Assume fields from schema
        description: `${title} - Lernzirkel Ludwigshafen e.V.`
      }
    });
  } else {
    // Delete existing sections
    await prisma.section.deleteMany({ where: { pageId: page.id } });
  }

  // Create HERO
  await prisma.section.create({
    data: {
      pageId: page.id,
      type: 'HERO',
      order: 0,
      content: {
        title,
      },
      design: {
        backgroundColor: '#0F4761',
        textColor: '#ffffff',
        textAlign: 'text-center',
        minHeight: 'min-h-[200px]',
      }
    }
  });

  // Create HTML/TEXT block
  await prisma.section.create({
    data: {
      pageId: page.id,
      type: 'TEXT',
      order: 1,
      content: {
        text: contentHtml
      },
      design: {
        backgroundColor: 'bg-white',
        padding: 'py-12'
      }
    }
  });
  
  console.log(`Finished ${slug}`);
}

async function main() {
  await upsertLegalPage('agb', 'Allgemeine Geschäftsbedingungen (AGB)', 'https://lernzirkel-online.de/agbs');
  await upsertLegalPage('datenschutz', 'Datenschutzerklärung', 'https://lernzirkel-online.de/datenschutzerklaerung');
  await upsertLegalPage('impressum', 'Impressum', 'https://lernzirkel-online.de/impressum');
}

main().catch(console.error).finally(() => prisma.$disconnect());
