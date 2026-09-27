import prisma from '../src/lib/prisma';

async function updateAGB() {
  const page = await prisma.page.findUnique({ where: { slug: 'agb' }, include: { sections: true } });
  const textSection = page?.sections.find(s => s.type === 'TEXT');
  if (textSection) {
    let newHtml = textSection.content.text;
    newHtml = newHtml.replace(/https:\/\/lernzirkel-online\.de\/wp-content\/uploads\/2025\/01\/AGB-Integrationskurse\.pdf/g, '/uploads/AGB-Integrationskurse.pdf');
    newHtml = newHtml.replace(/https:\/\/lernzirkel-online\.de\/wp-content\/uploads\/2025\/01\/AGB-Nachhilfe\.pdf/g, '/uploads/AGB-Nachhilfe.pdf');
    newHtml = newHtml.replace(/https:\/\/lernzirkel-online\.de\/wp-content\/uploads\/2025\/07\/AGB-Pruefungen\.pdf/g, '/uploads/AGB-Pruefungen.pdf');

    await prisma.section.update({
      where: { id: textSection.id },
      data: { content: { text: newHtml } }
    });
    console.log('AGB updated');
  }
}

async function updateDatenschutz() {
  const page = await prisma.page.findUnique({ where: { slug: 'datenschutz' }, include: { sections: true } });
  const textSection = page?.sections.find(s => s.type === 'TEXT');
  if (textSection) {
    let newHtml = textSection.content.text;
    
    // Simplistic cleanup for WordPress plugins / forms text that might exist
    // Just ensuring we have local links and no explicit WP plugin shortcodes like [contact-form-7]
    newHtml = newHtml.replace(/\[contact-form-7[^\]]*\]/g, '');
    newHtml = newHtml.replace(/https:\/\/lernzirkel-online\.de\/wp-content\/uploads/g, '/uploads');
    newHtml = newHtml.replace(/https:\/\/lernzirkel-online\.de\//g, '/');

    await prisma.section.update({
      where: { id: textSection.id },
      data: { content: { text: newHtml } }
    });
    console.log('Datenschutz updated');
  }
}

async function updateImpressum() {
  const page = await prisma.page.findUnique({ where: { slug: 'impressum' }, include: { sections: true } });
  const textSection = page?.sections.find(s => s.type === 'TEXT');
  if (textSection) {
    let newHtml = textSection.content.text;
    
    // Replace old absolute links with local relative links
    newHtml = newHtml.replace(/https:\/\/lernzirkel-online\.de\//g, '/');

    await prisma.section.update({
      where: { id: textSection.id },
      data: { content: { text: newHtml } }
    });
    console.log('Impressum updated');
  }
}

async function main() {
  await updateAGB();
  await updateDatenschutz();
  await updateImpressum();
}

main().catch(console.error).finally(() => prisma.$disconnect());
