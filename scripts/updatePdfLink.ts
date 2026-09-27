import prisma from '../src/lib/prisma';

async function main() {
  const pageId = 'd4768567-7ed7-4373-abb6-81cf38a7071f';
  
  const sections = await prisma.section.findMany({
    where: { pageId, type: 'HTML' }
  });

  for (const section of sections) {
    if (section.content && (section.content as any).code) {
      const code = (section.content as any).code;
      if (code.includes('https://lernzirkel-online.de/wp-content/uploads/2022/02/Eindruckplakat-2026-final-1.pdf')) {
        const newCode = code.replace(
          /https:\/\/lernzirkel-online\.de\/wp-content\/uploads\/2022\/02\/Eindruckplakat-2026-final-1\.pdf/g,
          '/uploads/Eindruckplakat-2026-final-1.pdf'
        );
        
        await prisma.section.update({
          where: { id: section.id },
          data: {
            content: {
              code: newCode
            }
          }
        });
        console.log('Updated section', section.id);
      }
    }
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
