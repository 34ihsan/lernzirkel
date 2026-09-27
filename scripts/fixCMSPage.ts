import prisma from '../src/lib/prisma';
import fs from 'fs';
import path from 'path';

async function main() {
  const pageId = 'd4768567-7ed7-4373-abb6-81cf38a7071f';
  
  // 1. Delete existing sections for this page
  await prisma.section.deleteMany({
    where: { pageId }
  });

  // 2. Add HERO section
  await prisma.section.create({
    data: {
      pageId,
      type: 'HERO',
      order: 0,
      content: {
        title: 'ESF+ Alpha- und Grundbildungskurse',
        subtitle: 'Der Lernzirkel Ludwigshafen e.V. bietet im Jahr 2026 Alpha- und Grundbildungskurse für Anfänger und Fortgeschrittene an.',
        eyebrow: 'Kostenlos & Jederzeit möglich',
        imageUrl: 'https://lernzirkel-online.de/wp-content/uploads/2016/09/pexels-ivan-samkov-8962373-scaled.jpg',
      },
      design: {
        backgroundColor: '#0F4761',
        textColor: '#ffffff',
        textAlign: 'text-center',
        overlayOpacity: 'bg-primary/80 mix-blend-multiply',
      }
    }
  });

  // 3. Add TEXT section
  await prisma.section.create({
    data: {
      pageId,
      type: 'TEXT',
      order: 1,
      content: {
        title: 'Kostenlose Bildung für alle',
        text: '<p>Die Kurse sind <strong>kostenlos</strong> und ein Einstieg ist <strong>jederzeit</strong> möglich. Nutzen Sie diese Chance, um Ihre Grundkenntnisse zu verbessern oder neu zu erlernen.</p>'
      },
      design: {
        backgroundColor: 'bg-white',
        padding: 'py-12'
      }
    }
  });

  // 4. Add CARD_GRID for links
  await prisma.section.create({
    data: {
      pageId,
      type: 'CARD_GRID',
      order: 2,
      content: {
        columns: 2,
        items: [
          {
            title: 'Für die Anmeldung',
            description: 'ESF+ Alpha-Kurse kontaktieren',
            linkUrl: '/kontakt',
            linkText: 'Zur Anmeldung',
            icon: 'award'
          },
          {
            title: 'Wir suchen Lehrkräfte!',
            description: 'Bewerben Sie sich jetzt.',
            linkUrl: '/kontakt',
            linkText: 'Jetzt bewerben',
            icon: 'users'
          }
        ]
      },
      design: {
        backgroundColor: 'bg-white',
        padding: 'py-8'
      }
    }
  });

  // 5. Add HTML block for funding logos and PDF download
  const htmlContent = `
    <div class="bg-gray-50 rounded-2xl p-6 md:p-8 mb-10 border border-gray-100 mt-8">
      <h3 class="font-bold text-gray-900 mb-4 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check-circle-2 text-green-500"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
        Staatliche Förderung
      </h3>
      <p class="text-sm md:text-base leading-relaxed mb-6">
        Die Alpha- und Grundbildungskurse des Europäischen Sozialfonds Plus (ESF+) werden kofinanziert durch das Ministerium für Arbeit, Soziales, Transformation und Digitalisierung Rheinland-Pfalz.
      </p>
      
      <div class="flex flex-wrap items-center gap-8 md:gap-12 justify-center py-4 bg-white rounded-xl border border-gray-100 p-6">
        <a href="https://ec.europa.eu/european-social-fund-plus/de" target="_blank" rel="noopener noreferrer" class="hover:opacity-80 transition-opacity">
          <img 
            src="https://andereslernen.de/wp-content/uploads/2023/01/DE_V_Kofinanziert_von_der_Europaeischen_Union_POS_klein.png" 
            alt="Kofinanziert von der Europäischen Union" 
            class="h-24 md:h-32 object-contain"
          />
        </a>
        <a href="https://masffj.rlp.de/" target="_blank" rel="noopener noreferrer" class="hover:opacity-80 transition-opacity">
          <img 
            src="https://lernzirkel-online.de/wp-content/uploads/2022/02/RP_farbig_MASFFJ-300x188.jpg" 
            alt="Ministerium für Arbeit, Soziales, Frauen, Familien und Jugend Rheinland-Pfalz" 
            class="h-20 md:h-28 object-contain"
          />
        </a>
      </div>
    </div>

    <div class="mt-12 text-center pb-12">
      <h3 class="text-xl font-bold text-primary mb-6">Informationsmaterial</h3>
      <a 
        href="https://lernzirkel-online.de/wp-content/uploads/2022/02/Eindruckplakat-2026-final-1.pdf" 
        target="_blank" 
        rel="noopener noreferrer"
        class="inline-flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white font-medium px-6 py-3 rounded-xl transition-colors shadow-sm"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-download"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
        <span>Eindruckplakat 2026 herunterladen (PDF)</span>
      </a>
    </div>
  `;

  await prisma.section.create({
    data: {
      pageId,
      type: 'HTML',
      order: 3,
      content: {
        code: htmlContent
      },
      design: {
        backgroundColor: 'bg-white',
        padding: 'py-4'
      }
    }
  });

  console.log('Database page updated with sections!');
  
  // 6. Delete the hardcoded file
  const pageDir = path.join(process.cwd(), 'src', 'app', '(site)', 'kurse', 'esfplusalpha');
  if (fs.existsSync(pageDir)) {
    fs.rmSync(pageDir, { recursive: true, force: true });
    console.log('Deleted hardcoded directory:', pageDir);
  }
}

main().catch(e => {
  console.error(e);
}).finally(async () => {
  await prisma.$disconnect();
});
