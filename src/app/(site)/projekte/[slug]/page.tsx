import { getCachedProjectBySlug } from '@/lib/cached-content';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Target, Users, Calendar, Mail, User } from 'lucide-react';
import { Metadata } from 'next';
import { MagneticButton } from '@/components/ui/MagneticButton';
import { Reveal, FadeIn } from '@/components/ui/animations';
import { JsonLd } from '@/components/seo/JsonLd';

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await getCachedProjectBySlug(slug);
  
  if (!project) return { title: 'Projekt nicht gefunden | Lernzirkel' };

  // Use dynamic OG endpoint or fallback to project image
  const ogImageUrl = project.imageUrl || `/api/og?title=${encodeURIComponent(project.title)}&description=${encodeURIComponent(project.description.substring(0, 100))}&badge=Proje`;

  return {
    title: `${project.title} | Lernzirkel Projekte`,
    description: project.description.substring(0, 160),
    openGraph: {
      title: project.title,
      description: project.description.substring(0, 160),
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: project.title,
        }
      ],
    },
  };
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const project = await getCachedProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  // Generate JSON-LD Data for SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Project",
    "name": project.title,
    "description": project.description,
    "url": `https://lernzirkel-online.de/projekte/${project.id}`,
    ...(project.imageUrl && { "image": project.imageUrl }),
    ...(project.startDate && { "startDate": project.startDate.toISOString() }),
    ...(project.endDate && { "endDate": project.endDate.toISOString() }),
    "status": project.status,
    "funder": project.fundingSource ? {
      "@type": "Organization",
      "name": project.fundingSource
    } : undefined
  };

  return (
    <article className="min-h-screen bg-gray-50 dark:bg-gray-800 pb-20">
      <JsonLd data={jsonLd} />
      {/* Hero Section */}
      <div className="relative h-[40vh] md:h-[50vh] w-full bg-primary overflow-hidden">
        {project.imageUrl ? (
          <>
            <Image 
              src={project.imageUrl} 
              alt={project.title}
              fill
              className="object-cover"
              priority
            />
            {/* Gradient Overlay for better text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/50 to-transparent" />
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary-light" />
        )}

        <div className="absolute inset-0 flex items-end">
          <div className="container mx-auto px-4 pb-12">
            <Link href="/projekte" className="inline-flex items-center text-white/80 hover:text-white mb-6 text-sm font-medium transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" /> Zurück zur Übersicht
            </Link>
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-accent text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                {project.status}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white max-w-4xl leading-tight">
              {project.title}
            </h1>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 -mt-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Reveal delay={0.1} className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm dark:shadow-none border border-gray-100 dark:border-gray-800 p-8 md:p-12 mb-8">
              <h2 className="text-2xl font-bold text-primary mb-6">Über das Projekt</h2>
              <div className="prose prose-lg max-w-none text-gray-700 dark:text-gray-300 leading-relaxed mb-12">
                <p className="whitespace-pre-wrap">{project.description}</p>
              </div>

              {project.goals && (
                <>
                  <h3 className="text-xl font-bold text-primary flex items-center mb-4">
                    <Target className="w-6 h-6 text-accent mr-3" />
                    Projektziele
                  </h3>
                  <div className="bg-blue-50 rounded-xl p-6 text-gray-700 dark:text-gray-300">
                    <p className="whitespace-pre-wrap">{project.goals}</p>
                  </div>
                </>
              )}
            </Reveal>
          </div>



          {/* Sidebar */}
          <div className="space-y-8">
            
            {/* Action Button */}
            {project.actionText && project.actionUrl && (
              <FadeIn delay={0.2} className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm dark:shadow-none border border-gray-100 dark:border-gray-800 p-8 text-center flex justify-center">
                <MagneticButton strength={0.3} className="w-full">
                  <Link 
                    href={project.actionUrl}
                    target={project.actionUrl.startsWith('http') ? '_blank' : undefined}
                    rel={project.actionUrl.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="w-full flex items-center justify-center bg-accent hover:bg-accent-light text-white font-bold py-4 px-6 rounded-xl transition-all hover:-translate-y-1 hover:shadow-lg text-lg"
                  >
                    {project.actionText}
                  </Link>
                </MagneticButton>
              </FadeIn>
            )}

            {/* Project Details Card */}
            <FadeIn delay={0.3} className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm dark:shadow-none border border-gray-100 dark:border-gray-800 p-8">
              <h3 className="text-lg font-bold text-primary mb-6 border-b pb-4">Projekt Details</h3>
              <ul className="space-y-6">
                <li className="flex items-start">
                  <Calendar className="w-5 h-5 text-gray-400 mr-4 mt-1" />
                  <div>
                    <span className="block text-sm font-semibold text-gray-900 dark:text-gray-100">Erstellt am</span>
                    <span className="text-gray-600 dark:text-gray-400">{new Date(project.createdAt).toLocaleDateString('de-DE')}</span>
                  </div>
                </li>
                {project.targetGroup && (
                  <li className="flex items-start">
                    <Users className="w-5 h-5 text-gray-400 mr-4 mt-1" />
                    <div>
                      <span className="block text-sm font-semibold text-gray-900 dark:text-gray-100">Zielgruppe</span>
                      <span className="text-gray-600 dark:text-gray-400">{project.targetGroup}</span>
                    </div>
                  </li>
                )}
              </ul>
            </FadeIn>

            {/* Contact Person Card */}
            {project.contactPerson && (
              <FadeIn delay={0.4}>
                <div className="bg-primary text-white rounded-2xl shadow-md dark:shadow-none p-8 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-12 bg-white dark:bg-gray-900/10 rounded-bl-full w-32 h-32 -mr-8 -mt-8 transition-transform group-hover:scale-110" />
                  <h3 className="text-lg font-bold mb-6 relative z-10">Ansprechpartner/in</h3>
                  
                  <div className="flex items-center gap-4 mb-6 relative z-10">
                    <div className="w-16 h-16 bg-white dark:bg-gray-900/20 rounded-full flex items-center justify-center">
                      <User className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <div className="text-xl font-bold">{project.contactPerson.name}</div>
                      <div className="text-primary-light text-sm">{project.contactPerson.role}</div>
                    </div>
                  </div>

                  <MagneticButton strength={0.2} className="w-full">
                    <Link 
                      href="/kontakt" 
                      className="w-full bg-accent hover:bg-accent-light text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center transition-colors relative z-10"
                    >
                      <Mail className="w-4 h-4 mr-2" /> Kontakt aufnehmen
                    </Link>
                  </MagneticButton>
                </div>
              </FadeIn>
            )}
            
          </div>

        </div>
      </div>
    </article>
  );
}
