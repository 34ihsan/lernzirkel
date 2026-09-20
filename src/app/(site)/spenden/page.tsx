import Link from 'next/link';
import { Heart, Users, Euro, ArrowRight, Phone } from 'lucide-react';
import EmailObfuscator from '@/components/common/EmailObfuscator';

export default function SpendenPage() {
  return (
    <div className="py-12 bg-gray-50/50 min-h-screen">
      <div className="container mx-auto px-4 max-w-5xl">
        
        {/* Main Header Area */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1 bg-red-100 text-red-700 font-bold rounded-full text-sm mb-6 uppercase tracking-wider">
            Unterstützen Sie uns
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6 leading-tight">
            Werden Sie Teil unserer Mission
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Wir, die Mitglieder des Lernzirkel Ludwigshafen e.V., fördern die Integration und Bildung.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content (Left) */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-xl shadow-sm p-8 md:p-12 border border-gray-100 flatsome-card">
              <h2 className="text-3xl font-bold text-primary mb-6 flex items-center">
                <Users className="w-8 h-8 mr-3 text-secondary" />
                Mitgliedschaft im Lernzirkel
              </h2>
              
              <div className="prose max-w-none text-gray-700 space-y-6 text-lg leading-relaxed">
                <p>
                  Unser Verein hat im Moment in der Region Rheinland-Pfalz viele Mitglieder und Fördermitglieder, die sich alle ehrenamtlich und unbezahlt für dieses Ziel einsetzen.
                </p>
                <p>
                  Wenn wir uns die Arbeit anschauen, die noch zu leisten ist, dann finden wir: <strong className="text-primary">Es müssen mehr Mitglieder werden.</strong> Deshalb fordern wir Sie auf: Unterstützen Sie unsere Idee einer Integration und Bildung durch Ihre Zugehörigkeit zu unserem Verein.
                </p>
                
                <div className="bg-blue-50 p-6 rounded-lg border border-blue-100 my-8">
                  <h3 className="text-xl font-bold text-primary mb-4">Wie Sie uns unterstützen können:</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <ArrowRight className="w-5 h-5 text-accent mr-3 mt-1 flex-shrink-0" />
                      <span>Durch Ihre ehrenamtliche Mitarbeit an unseren Veranstaltungen und Projekten</span>
                    </li>
                    <li className="flex items-start">
                      <ArrowRight className="w-5 h-5 text-accent mr-3 mt-1 flex-shrink-0" />
                      <span>Als Mitglied im Vorstand unseres Vereins</span>
                    </li>
                    <li className="flex items-start">
                      <ArrowRight className="w-5 h-5 text-accent mr-3 mt-1 flex-shrink-0" />
                      <span>Als Sponsor</span>
                    </li>
                    <li className="flex items-start">
                      <ArrowRight className="w-5 h-5 text-accent mr-3 mt-1 flex-shrink-0" />
                      <span>Durch Ihre Mitgliedschaft in unserem Verein</span>
                    </li>
                  </ul>
                </div>

                <p className="font-medium bg-gray-50 p-4 rounded-lg border border-gray-200">
                  Das geht ganz einfach und kostet Sie nur <strong className="text-accent text-xl">60 Euro jährlich</strong>, die Sie von Ihrer Steuer absetzen können.
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar (Right) */}
          <div className="space-y-8">
            
            {/* Contact Card */}
            <div className="bg-primary text-white rounded-xl shadow-lg p-8 transform transition-transform hover:-translate-y-1">
              <Heart className="w-12 h-12 text-accent mb-6" />
              <h3 className="text-2xl font-bold mb-4">Jetzt Mitmachen!</h3>
              <p className="mb-8 text-blue-100">
                Sie möchten Mitglied werden oder uns unterstützen? Kontaktieren Sie uns direkt:
              </p>
              
              <div className="space-y-6">
                <div className="flex items-center space-x-4 bg-white/10 p-4 rounded-lg">
                  <div className="bg-accent p-2 rounded-full">
                    <Phone className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-blue-200">Rufen Sie uns an</p>
                    <a href="tel:062130737271" className="text-lg font-bold hover:text-accent transition-colors">
                      0621 30 73 72 71
                    </a>
                  </div>
                </div>

                <div className="flex items-center space-x-4 bg-white/10 p-4 rounded-lg">
                  <div className="bg-accent p-2 rounded-full">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-blue-200">Schreiben Sie uns</p>
                    <div className="text-lg font-bold hover:text-accent transition-colors">
                       <EmailObfuscator user="info" domain="lernzirkel-online.de" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tax Info Card */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 flatsome-card">
              <div className="flex items-center mb-4">
                <div className="bg-green-100 p-3 rounded-full mr-4">
                  <Euro className="w-6 h-6 text-green-600" />
                </div>
                <h4 className="font-bold text-gray-800">Spendenquittung</h4>
              </div>
              <p className="text-sm text-gray-600">
                Als gemeinnütziger Verein sind wir berechtigt, Spendenbescheinigungen auszustellen. Ihre Mitgliedsbeiträge und Spenden sind steuerlich absetzbar.
              </p>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
