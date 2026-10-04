import React from 'react';
import prisma from '@/lib/prisma';
import Link from 'next/link';
import { 
  Briefcase, 
  ChevronRight, 
  Heart, 
  Users, 
  GraduationCap,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import JobCard from '@/components/jobs/JobCard';

export const metadata = {
  title: 'Karriere | Lernzirkel Ludwigshafen e.V.',
  description: 'Werden Sie Teil unseres Teams. Sinnstiftende Arbeit, offene Kultur und starke Perspektiven für Lehrkräfte und Praktikanten.',
};

export default async function KarrierePage() {
  const jobs = await prisma.jobPosition.findMany({
    where: { isActive: true },
    orderBy: { createdAt: 'desc' }
  }).catch(() => []);

  const lehrerJobs = jobs.filter(j => j.type === 'LEHRER');
  const praktikantJobs = jobs.filter(j => j.type === 'PRAKTIKANT');
  const otherJobs = jobs.filter(j => j.type !== 'LEHRER' && j.type !== 'PRAKTIKANT');

  return (
    <main className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-blue-50/50 to-white -z-10" />
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/5 to-transparent -z-10 blur-3xl opacity-60 transform translate-x-1/4" />
        
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="max-w-3xl">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100/50 text-blue-800 text-sm font-semibold mb-6 border border-blue-200/50">
              <Sparkles className="w-4 h-4 mr-2 text-blue-600" />
              Gestalte die Zukunft mit uns
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight mb-6 leading-[1.15]">
              Arbeiten beim <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">Lernzirkel</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-10 leading-relaxed max-w-2xl">
              Wir suchen engagierte Lehrkräfte, motivierte Praktikanten und kluge Köpfe, die mit uns gemeinsam Bildungschancen schaffen und Integration in Ludwigshafen aktiv leben wollen.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <a href="#offene-stellen" className="inline-flex items-center justify-center bg-primary text-white px-8 py-3.5 rounded-xl font-bold hover:bg-primary-light transition-all shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-1">
                Zu den offenen Stellen <ChevronRight className="w-5 h-5 ml-1" />
              </a>
              <Link href="/kontakt?betreff=Initiativbewerbung" className="inline-flex items-center justify-center bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 px-8 py-3.5 rounded-xl font-bold hover:bg-gray-50 dark:bg-gray-800 hover:border-gray-300 transition-all">
                Initiativbewerbung
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800 border-y border-gray-100 dark:border-gray-800">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">Warum bei uns arbeiten?</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Als anerkannter Bildungsträger bieten wir mehr als nur einen Job. Wir bieten eine sinnstiftende Tätigkeit in einem dynamischen und familiären Umfeld.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Heart className="w-8 h-8 text-red-500" />,
                title: "Sinnstiftende Arbeit",
                desc: "Jeden Tag einen echten Unterschied machen – durch Bildung, Förderung und Integration von Menschen aus aller Welt."
              },
              {
                icon: <Users className="w-8 h-8 text-blue-500" />,
                title: "Vielfältiges Team",
                desc: "Ein familiäres, interkulturelles Arbeitsumfeld, in dem Zusammenhalt, Respekt und Wertschätzung an erster Stelle stehen."
              },
              {
                icon: <GraduationCap className="w-8 h-8 text-emerald-500" />,
                title: "Entwicklung & Perspektiven",
                desc: "Regelmäßige Weiterbildungen, Raum für eigene Ideen und die Möglichkeit, sich beruflich und persönlich weiterzuentwickeln."
              }
            ].map((benefit, idx) => (
              <div key={idx} className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-sm dark:shadow-none border border-gray-100 dark:border-gray-800 text-center hover:-translate-y-1 transition-transform duration-300">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-50 dark:bg-gray-800 mb-6 ring-8 ring-gray-50/50">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">{benefit.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Job Listings Section */}
      <section id="offene-stellen" className="py-24">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">Offene Stellenangebote</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
              Entdecken Sie unsere aktuellen Vakanzen und finden Sie die Position, die perfekt zu Ihnen passt.
            </p>
          </div>

          {jobs.length === 0 ? (
            <div className="text-center p-16 bg-gray-50 dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-800 border-dashed">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white dark:bg-gray-900 text-gray-400 mb-6 shadow-sm dark:shadow-none">
                <Briefcase size={40} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Aktuell keine offenen Stellen</h3>
              <p className="text-gray-500 dark:text-gray-400 text-lg max-w-md mx-auto mb-8">
                Derzeit haben wir leider keine spezifischen Vakanzen ausgeschrieben. Wir sind jedoch immer auf der Suche nach Talenten!
              </p>
              <Link href="/kontakt?betreff=Initiativbewerbung" className="inline-flex items-center justify-center bg-primary text-white px-6 py-3 rounded-xl font-medium hover:bg-primary-light transition-colors">
                <Users className="w-5 h-5 mr-2" />
                Initiativ bewerben
              </Link>
            </div>
          ) : (
            <div className="space-y-16">
              {lehrerJobs.length > 0 && (
                <div>
                  <div className="flex items-center gap-4 mb-8">
                    <div className="h-px bg-gray-200 flex-grow" />
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center">
                      <GraduationCap className="w-7 h-7 mr-3 text-blue-600" /> Lehrkräfte & Dozenten
                    </h3>
                    <div className="h-px bg-gray-200 flex-grow" />
                  </div>
                  <div className="grid md:grid-cols-2 gap-8">
                    {lehrerJobs.map((job: any) => <JobCard key={job.id} job={job} />)}
                  </div>
                </div>
              )}

              {praktikantJobs.length > 0 && (
                <div>
                  <div className="flex items-center gap-4 mb-8">
                    <div className="h-px bg-gray-200 flex-grow" />
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center">
                      <Briefcase className="w-7 h-7 mr-3 text-emerald-600" /> Praktika & Werkstudenten
                    </h3>
                    <div className="h-px bg-gray-200 flex-grow" />
                  </div>
                  <div className="grid md:grid-cols-2 gap-8">
                    {praktikantJobs.map((job: any) => <JobCard key={job.id} job={job} />)}
                  </div>
                </div>
              )}

              {otherJobs.length > 0 && (
                <div>
                  <div className="flex items-center gap-4 mb-8">
                    <div className="h-px bg-gray-200 flex-grow" />
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center">
                      <Sparkles className="w-7 h-7 mr-3 text-amber-600" /> Weitere Positionen
                    </h3>
                    <div className="h-px bg-gray-200 flex-grow" />
                  </div>
                  <div className="grid md:grid-cols-2 gap-8">
                    {otherJobs.map((job: any) => <JobCard key={job.id} job={job} />)}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-white">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-6">Nichts Passendes dabei?</h2>
          <p className="text-primary-light text-lg mb-10 max-w-2xl mx-auto">
            Wir freuen uns immer über Menschen, die unsere Vision teilen. Senden Sie uns gerne Ihre aussagekräftige Initiativbewerbung zu.
          </p>
          <Link 
            href="/kontakt?betreff=Initiativbewerbung" 
            className="inline-flex items-center justify-center bg-white dark:bg-gray-900 text-primary px-8 py-4 rounded-xl font-bold hover:bg-gray-100 dark:bg-gray-800/50 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
          >
            Zur Initiativbewerbung <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </div>
      </section>
    </main>
  );
}
