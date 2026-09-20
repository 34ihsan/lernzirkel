import prisma from '@/lib/prisma';
import SectionRenderer from '@/components/cms/SectionRenderer';
import Link from 'next/link';
import { LifeBuoy, Clock, MapPin, CheckCircle2 } from 'lucide-react';
import EmailObfuscator from '@/components/common/EmailObfuscator';

export default async function BeratungPage() {
  const cmsPage = await prisma.page.findUnique({
    where: { slug: 'beratung' },
    include: {
      sections: {
        orderBy: { order: 'asc' }
      }
    }
  });

  if (cmsPage && cmsPage.isPublished && cmsPage.sections.length > 0) {
    return (
      <article className="min-h-screen bg-background">
        {cmsPage.sections.map((section: any) => (
          <SectionRenderer key={section.id} section={section} />
        ))}
      </article>
    );
  }

  return <StaticBeratung />;
}

function StaticBeratung() {
  return (
    <div className="py-16 bg-gray-50/50 min-h-screen">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="bg-white rounded-xl shadow-sm p-8 md:p-14 border border-gray-100 flatsome-card">
          
          <div className="flex items-center space-x-4 mb-6">
            <LifeBuoy className="w-10 h-10 text-accent" />
            <span className="text-accent font-bold uppercase tracking-wider text-sm">Beratung</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6 leading-tight">
            Migrationsfachdienst (MFD)
          </h1>
          
          <p className="text-xl text-gray-600 mb-10 leading-relaxed font-light">
            Unser Migrationsfachdienst bietet individuelle, vertrauliche und <strong>kostenfreie</strong> Beratung für Menschen mit Migrationshintergrund. Wir unterstützen Sie bei der Integration und Bewältigung des Alltags in Deutschland.
          </p>

          <div className="grid md:grid-cols-2 gap-12 mb-12">
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-6">Unsere Unterstützung</h3>
              <ul className="space-y-4">
                {[
                  'Fragen zu Aufenthalts- und Sozialrecht',
                  'Unterstützung bei Anträgen und Behördenbriefen',
                  'Vermittlung in Sprach- und Integrationskurse',
                  'Hilfe bei der Anerkennung ausländischer Zeugnisse',
                  'Beratung in familiären und persönlichen Konflikten'
                ].map((item, i) => (
                  <li key={i} className="flex items-start">
                    <CheckCircle2 className="w-6 h-6 text-primary-light mr-3 shrink-0" />
                    <span className="text-gray-700 leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="bg-secondary/50 p-8 rounded-lg border border-secondary">
              <h3 className="text-xl font-bold text-primary mb-6">Wichtige Informationen</h3>
              
              <div className="space-y-6">
                <div>
                  <div className="flex items-center text-foreground font-bold mb-2">
                    <Clock className="w-5 h-5 mr-2 text-primary" /> Öffnungszeiten MFD
                  </div>
                  <p className="text-gray-600 pl-7 text-sm">Dienstag & Donnerstag: 10:00 - 15:00 Uhr<br/>
                  <span className="text-accent font-bold mt-1 inline-block bg-accent/10 px-2 py-1 rounded">Nur nach Terminvereinbarung</span></p>
                </div>

                <div>
                  <div className="flex items-center text-foreground font-bold mb-2">
                    <MapPin className="w-5 h-5 mr-2 text-primary" /> Ort
                  </div>
                  <p className="text-gray-600 pl-7 text-sm">Musterstraße 123, 67061 Ludwigshafen</p>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600 mb-3">Termin anfragen via E-Mail:</p>
                  <EmailObfuscator user="beratung" domain="lernzirkel-online.de" className="text-primary font-bold text-lg" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
