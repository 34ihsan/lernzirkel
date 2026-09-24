import prisma from '@/lib/prisma';
import SectionRenderer from '@/components/cms/SectionRenderer';
import Link from 'next/link';
import { ArrowRight, HeartHandshake, Coffee, Shield, Globe, Lightbulb, Users2, Sparkles, Trophy } from 'lucide-react';

const projects = [
  {
    id: 'future-connect',
    title: 'Future Connect',
    desc: 'Generationen vernetzen für morgen. Digitale Kompetenzen für Jugendliche stärken – Medienkompetenz, Bewerbungstraining 2.0 und Berufsorientierung.',
    link: '/projekte/future-connect',
    icon: <Globe className="w-12 h-12 text-blue-500" />,
    color: 'bg-blue-50'
  },
  {
    id: 'menschen-staerken',
    title: 'Menschen stärken Menschen',
    desc: 'Ein bundesweites Patenschaftsprojekt zur Förderung des gesellschaftlichen Zusammenhalts und zur Unterstützung benachteiligter Personen.',
    link: '/projekte/menschen-staerken',
    icon: <HeartHandshake className="w-12 h-12 text-green-500" />,
    color: 'bg-green-50'
  },
  {
    id: 'sprachcafe',
    title: 'Sprach Café',
    desc: 'Ein offener und ungezwungener Raum zum Deutsch sprechen, Leute kennenlernen und für den interkulturellen Austausch bei Kaffee und Tee.',
    link: '/projekte/sprach-cafe',
    icon: <Coffee className="w-12 h-12 text-yellow-600" />,
    color: 'bg-yellow-50'
  },
  {
    id: 'konfliktmanagement',
    title: 'Stark im Umgang mit Konflikten',
    desc: 'Kompetenzen für Engagierte – Workshops und Trainings zum Umgang mit Konflikten und Krisen in Ehrenamt und Alltag.',
    link: '/projekte/konfliktmanagement',
    icon: <Shield className="w-12 h-12 text-purple-500" />,
    color: 'bg-purple-50'
  },
  {
    id: 'wettbewerbe',
    title: 'Wettbewerbe & Schülerinitiativen',
    desc: 'Talente wecken, Forschergeist fördern und den Zusammenhalt stärken: Unsere beiden Wettbewerbe „Wir sind Vielfalt“ und die „Bildungsmesse“ im Überblick.',
    link: '/projekte/wettbewerbe',
    icon: <Trophy className="w-12 h-12 text-rose-600" />,
    color: 'bg-rose-50'
  },
  {
    id: 'wir-sind-vielfalt',
    title: 'Wir Sind Vielfalt',
    desc: 'Wettbewerbe und gesellschaftliches Engagement für ein vielfältiges Miteinander. Aktionen, Schülerwettbewerbe und Preise in Ludwigshafen.',
    link: '/projekte/wettbewerbe/wir-sind-vielfalt',
    icon: <Lightbulb className="w-12 h-12 text-orange-500" />,
    color: 'bg-orange-50'
  },
  {
    id: 'bildungsmesse',
    title: 'Bildungsmesse',
    desc: 'Lernen, Forschen & Experimentieren: Schülerteams präsentieren spannende Versuche an eigenen Messeständen mit anschließender Prämierung.',
    link: '/projekte/wettbewerbe/bildungsmesse',
    icon: <Sparkles className="w-12 h-12 text-amber-500" />,
    color: 'bg-amber-50'
  },
  {
    id: 'jugendbetreuung',
    title: 'Jugendbetreuung & Mentoring',
    desc: 'Individuelle Betreuung und Mentoring für Jugendliche. Freizeitangebote, Hausaufgabenhilfe und persönliche Förderung.',
    link: '/jugendbetreuung',
    icon: <Users2 className="w-12 h-12 text-teal-500" />,
    color: 'bg-teal-50'
  },
];

export default async function ProjektePage() {
  const cmsPage = await prisma.page.findUnique({
    where: { slug: 'projekte' },
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

  return <StaticProjekte />;
}

function StaticProjekte() {
  return (
    <div className="py-16 bg-background">
      <div className="container mx-auto px-4">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-accent font-bold uppercase tracking-wider text-sm mb-2 block">Gesellschaftliche Verantwortung</span>
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6">Projekte & Engagement</h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            Wir sehen unsere Aufgabe nicht nur darin, Menschen bei Bildungsfragen zu unterstützen, sondern engagieren uns auch aktiv im sozialen Bereich, um gesellschaftliche Teilhabe nachhaltig zu fördern.
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {projects.map((p) => (
            <Link href={p.link} key={p.id} className="flatsome-card flex flex-col group overflow-hidden bg-white border border-gray-100 h-full">
              {/* Icon / Image Placeholder Area */}
              <div className={`h-48 ${p.color} flex flex-col items-center justify-center transition-transform duration-500 group-hover:scale-105`}>
                {p.icon}
              </div>
              
              {/* Content Area */}
              <div className="p-8 flex flex-col flex-grow relative z-10 bg-white">
                <h3 className="text-2xl font-bold text-foreground mb-4">{p.title}</h3>
                <p className="text-gray-600 mb-8 flex-grow leading-relaxed">{p.desc}</p>
                <div className="mt-auto">
                  <span className="text-primary font-bold inline-flex items-center group-hover:text-primary-light transition-colors uppercase text-sm tracking-wider">
                    Details ansehen <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
        
      </div>
    </div>
  );
}
