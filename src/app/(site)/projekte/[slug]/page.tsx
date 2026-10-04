import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Target, Users, Calendar, Mail, User } from 'lucide-react';
import { Metadata } from 'next';

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await prisma.project.findUnique({ where: { slug } });
  
  if (!project) return { title: 'Projekt nicht gefunden | Lernzirkel' };

  return {
    title: `${project.title} | Lernzirkel Projekte`,
    description: project.description.substring(0, 160),
    openGraph: {
      title: project.title,
      description: project.description.substring(0, 160),
      images: project.imageUrl ? [project.imageUrl] : [],
    },
  };
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const project = await prisma.project.findUnique({
    where: { slug },
    include: {
      contactPerson: true,
    }
  });

  if (!project) {
    notFound();
  }

  return (
    <article className="min-h-screen bg-gray-50 pb-20">
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
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12">
            <h2 className="text-2xl font-bold text-primary mb-6">Über das Projekt</h2>
            <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed mb-12">
              <p className="whitespace-pre-wrap">{project.description}</p>
            </div>

            {project.goals && (
              <>
                <h3 className="text-xl font-bold text-primary flex items-center mb-4">
                  <Target className="w-6 h-6 text-accent mr-3" />
                  Projektziele
                </h3>
                <div className="bg-blue-50 rounded-xl p-6 mb-8 text-gray-700">
                  <p className="whitespace-pre-wrap">{project.goals}</p>
                </div>
              </>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            
            {/* Action Button */}
            {project.actionText && project.actionUrl && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
                <Link 
                  href={project.actionUrl}
                  target={project.actionUrl.startsWith('http') ? '_blank' : undefined}
                  rel={project.actionUrl.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="w-full inline-flex items-center justify-center bg-accent hover:bg-accent-light text-white font-bold py-4 px-6 rounded-xl transition-all hover:-translate-y-1 hover:shadow-lg text-lg"
                >
                  {project.actionText}
                </Link>
              </div>
            )}

            {/* Project Details Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h3 className="text-lg font-bold text-primary mb-6 border-b pb-4">Projekt Details</h3>
              <ul className="space-y-6">
                <li className="flex items-start">
                  <Calendar className="w-5 h-5 text-gray-400 mr-4 mt-1" />
                  <div>
                    <span className="block text-sm font-semibold text-gray-900">Erstellt am</span>
                    <span className="text-gray-600">{new Date(project.createdAt).toLocaleDateString('de-DE')}</span>
                  </div>
                </li>
                {project.targetGroup && (
                  <li className="flex items-start">
                    <Users className="w-5 h-5 text-gray-400 mr-4 mt-1" />
                    <div>
                      <span className="block text-sm font-semibold text-gray-900">Zielgruppe</span>
                      <span className="text-gray-600">{project.targetGroup}</span>
                    </div>
                  </li>
                )}
              </ul>
            </div>

            {/* Contact Person Card */}
            {project.contactPerson && (
              <div className="bg-primary text-white rounded-2xl shadow-md p-8 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-12 bg-white/10 rounded-bl-full w-32 h-32 -mr-8 -mt-8 transition-transform group-hover:scale-110" />
                <h3 className="text-lg font-bold mb-6 relative z-10">Ansprechpartner/in</h3>
                
                <div className="flex items-center gap-4 mb-6 relative z-10">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                    <User className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <div className="text-xl font-bold">{project.contactPerson.name}</div>
                    <div className="text-primary-light text-sm">{project.contactPerson.role}</div>
                  </div>
                </div>

                <Link 
                  href="/kontakt" 
                  className="w-full bg-accent hover:bg-accent-light text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center transition-colors relative z-10"
                >
                  <Mail className="w-4 h-4 mr-2" /> Kontakt aufnehmen
                </Link>
              </div>
            )}
            
          </div>

        </div>
      </div>
    </article>
  );
}
