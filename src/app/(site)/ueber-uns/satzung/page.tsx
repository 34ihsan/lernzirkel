import { FileText, ArrowLeft, ShieldCheck, Scale, Users2 } from 'lucide-react';
import Link from 'next/link';
import Breadcrumbs, { BreadcrumbItem } from '@/components/common/Breadcrumbs';

export const metadata = {
  title: 'Satzung & Organisation | Lernzirkel Ludwigshafen e.V.',
  description: 'Rechtliche Grundlagen, Vereinsstruktur, Gemeinnützigkeit und Organisation des Lernzirkel Ludwigshafen e.V.',
};

export default function UeberUnsSatzungPage() {
  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Startseite', url: '/' },
    { label: 'Über uns', url: '/ueber-uns' },
    { label: 'Satzung & Organisation', url: '/ueber-uns/satzung', isCurrent: true },
  ];

  return (
    <div className="py-12 bg-gray-50/50 min-h-screen">
      <div className="container mx-auto px-4 max-w-4xl">
        <Breadcrumbs items={breadcrumbs} />

        {/* Back Link */}
        <Link 
          href="/ueber-uns" 
          className="inline-flex items-center text-sm text-gray-500 hover:text-primary mb-6 font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Zurück zur Über uns Übersicht
        </Link>
        
        {/* Main Content Card */}
        <div className="bg-white rounded-2xl shadow-sm p-8 md:p-14 border border-gray-100 flatsome-card">
          
          <div className="flex items-center gap-2 mb-4">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-sky-100 text-sky-800 font-bold rounded-full text-xs uppercase tracking-wider">
              <Scale className="w-3.5 h-3.5" /> Rechtliche Grundlagen
            </span>
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-emerald-100 text-emerald-800 font-semibold rounded-full text-xs">
              <ShieldCheck className="w-3.5 h-3.5" /> Gemeinnützig e.V.
            </span>
          </div>
          
          <h1 className="text-3xl md:text-5xl font-bold text-primary mb-4 leading-tight">
            Satzung des Vereins Lernzirkel Ludwigshafen e.V.
          </h1>
          <p className="text-gray-600 text-base mb-10 leading-relaxed">
            Eingetragen im Vereinsregister beim Amtsgericht Ludwigshafen am Rhein. Anerkannt gemeinnützig nach §§ 51 ff. AO.
          </p>
          
          <div className="prose max-w-none text-gray-700 satzung-content">
            
            <h3 className="text-2xl font-bold text-foreground mt-8 mb-4 flex items-center">
              <FileText className="w-6 h-6 mr-3 text-accent" />
              § 1 Name und Sitz:
            </h3>
            <p>(1) Der Verein führt den Namen „Lernzirkel Ludwigshafen e.V.“</p>
            <p>(2) Der Verein hat seinen Sitz in Ludwigshafen am Rhein.</p>
            <p>(3) Der Verein ist in das Vereinsregister beim Amtsgericht Ludwigshafen eingetragen.</p>

            <h3 className="text-2xl font-bold text-foreground mt-12 mb-4 flex items-center">
              <FileText className="w-6 h-6 mr-3 text-accent" />
              § 2 Zweck des Vereins:
            </h3>
            <p>(1) Der Zweck des Vereins ist nicht auf wirtschaftlichen Geschäftsbetrieb ausgerichtet. Der Verein hat sich zum Ziel gesetzt, Schülern und Eltern bei deren Bildungs-, Erziehungs- und sozialen Problemen zu helfen.</p>
            <p>(2) Um gegenseitige Vorurteile abzubauen, setzt sich der Verein für mehr Toleranz zwischen den Menschen untereinander ein. Ein weiteres Ziel ist die Förderung der Integration der in Deutschland lebender Mitbürger.</p>
            <p>(3) Der Verein verfolgt seine Vereinszwecke unter anderem dadurch, dass er</p>
            <ul className="list-disc pl-6 mb-4 space-y-1">
              <li>Gründung und Betrieb von Schulen und schulischen Einrichtungen in privater Trägerschaft</li>
              <li>Gründung und Betrieb von gemeinnützigen Bildungseinrichtungen</li>
              <li>Nachhilfe- und Stützkurse für Schüler und Erwachsene</li>
              <li>Seminare, Tagungen und sportliche Veranstaltungen</li>
              <li>Kultur-, Volks- und Elternabende</li>
              <li>Schüler- und Studentenaustauschprogramme</li>
              <li>Schüler- und Studienreisen</li>
              <li>Straßenfeste</li>
            </ul>
            <p>organisiert und durchführt.</p>
            <p>(4) Um die deutschen Sprachkenntnisse der Mitbürger und Bürger zu erweitern, bietet der Verein Sprachkurse an.</p>
            <p>(5) Der Verein kann im Rahmen der Möglichkeiten Stipendien an Schüler und Studenten vergeben.</p>
            <p>(6) Der Verein ist politisch ungebunden und neutral.</p>
            <p>(7) Für die Erfüllung dieser Zwecke sollen Beiträge/Umlagen, Spenden, Zuschüsse und sonstige Zuwendungen eingesetzt werden.</p>

            <h3 className="text-2xl font-bold text-foreground mt-12 mb-4 flex items-center">
              <FileText className="w-6 h-6 mr-3 text-accent" />
              § 3 Gemeinnützigkeit des Vereins:
            </h3>
            <p>(1) Der Verein ist gemeinnützig und verfolgt ausschließlich und unmittelbar gemeinnützige Zwecke im Sinne des Abschnitts „steuerbegünstigte Zwecke“ der Abgabenordnung (§§ 51 bis 68 AO) in der jeweils gültigen Fassung.</p>
            <p>(2) Der Verein ist selbstlos tätig; er verfolgt keine eigenwirtschaftlichen Zwecke. Die Mittel des Vereins dürfen nur für satzungsmäßige Zwecke verwendet werden. Mitglieder erhalten keine Zuwendungen aus Mitteln des Vereins. Es darf keine Person durch Ausgaben, die dem Zwecke des Vereins fremd sind oder durch unverhältnismäßig hohe Vergütung begünstigt werden.</p>

            <h3 className="text-2xl font-bold text-foreground mt-12 mb-4 flex items-center">
              <FileText className="w-6 h-6 mr-3 text-accent" />
              § 4 Geschäftsjahr:
            </h3>
            <p>Das Geschäftsjahr ist das Kalenderjahr.</p>

            <h3 className="text-2xl font-bold text-foreground mt-12 mb-4 flex items-center">
              <FileText className="w-6 h-6 mr-3 text-accent" />
              § 5 Mitgliedschaft:
            </h3>
            <p>(1) Mitglied des Vereins kann jede voll geschäftsfähige, natürliche Person und juristische Person werden. Der Antrag auf Aufnahme in den Verein ist schriftlich an den Vorstand zu richten, der über die Aufnahme entscheidet.</p>
            <p>Es gibt zwei Formen der Mitgliedschaft:</p>
            <ul className="list-disc pl-6 mb-4 space-y-1">
              <li>(a) Ordentliches Mitglied</li>
              <li>(b) Fördermitglied</li>
            </ul>
            <p>Der Antragsteller kann bei der Aufnahme zur Mitgliedschaft zwischen den beiden Formen wählen. Als Fördermitglied unterstützt er mit seinen Beiträgen die Aktivitäten des Vereins. Zur Mitgliederversammlung werden nur die ordentlichen Mitglieder eingeladen.</p>
            <p>(2) Der Mitgliedsbeitrag wird durch die Mitgliederversammlung festgesetzt.</p>
            <p>(3) Die Mitgliedschaft endet durch den Tod, Austritt oder Ausschluss.</p>
            <p>Der Austritt aus dem Verein erfolgt durch schriftliche Erklärung gegenüber dem Vorstand mit einer Frist von drei Monaten.</p>

            <h3 className="text-2xl font-bold text-foreground mt-12 mb-4 flex items-center">
              <FileText className="w-6 h-6 mr-3 text-accent" />
              § 6 Organe des Vereins:
            </h3>
            <p>Die Organe des Vereins sind:</p>
            <ul className="list-disc pl-6 mb-4 space-y-1">
              <li>a) Die Mitgliederversammlung</li>
              <li>b) Der Vorstand</li>
            </ul>

            <h3 className="text-2xl font-bold text-foreground mt-12 mb-4 flex items-center">
              <FileText className="w-6 h-6 mr-3 text-accent" />
              § 7 Die Mitgliederversammlung:
            </h3>
            <p>(1) Einmal im Jahr findet mindestens eine ordentliche Mitgliederversammlung statt. Sie ist vom Vorsitzenden einzuberufen. Die Einberufung erfolgt mindestens vierzehn Tage zuvor, schriftlich unter Angabe der Tagesordnung.</p>
            <p>(2) Die Beschlüsse werden mit einfacher Mehrheit gefasst. Für Satzungsänderungen ist eine Mehrheit von ¾ der erschienenen Mitglieder erforderlich.</p>

            <h3 className="text-2xl font-bold text-foreground mt-12 mb-4 flex items-center">
              <FileText className="w-6 h-6 mr-3 text-accent" />
              § 8 Der Vorstand:
            </h3>
            <p>(1) Der Vorstand wird von der Mitgliederversammlung auf die Dauer von zwei Jahren gewählt.</p>
            <p>(2) Der Vorstand besteht aus dem ersten Vorsitzenden, seinem Stellvertreter, dem Schriftführer und dem Kassierer sowie weiteren Beisitzern.</p>
            <p>(3) Vertretungsberechtigt im Sinne § 26 BGB sind immer jeweils 2 Vorstandsmitglieder zusammen.</p>

            <h3 className="text-2xl font-bold text-foreground mt-12 mb-4 flex items-center">
              <FileText className="w-6 h-6 mr-3 text-accent" />
              § 9 Kassenprüfer:
            </h3>
            <p>Die Mitgliederversammlung wählt auf die Dauer von zwei Jahren zwei Kassenprüfer. Sie haben vor dem Rechnungsschluss eine ordentliche Kassenprüfung vorzunehmen und darüber in der Mitgliederversammlung Bericht zu erstatten.</p>

            <h3 className="text-2xl font-bold text-foreground mt-12 mb-4 flex items-center">
              <FileText className="w-6 h-6 mr-3 text-accent" />
              § 10 Auflösung des Vereins:
            </h3>
            <p>Bei Auflösung oder Aufhebung des Vereins oder bei Wegfall steuerbegünstigter Zwecke fällt das Vereinsvermögen an den Paritätischen Landesverband Rheinland-Pfalz/Saarland e.V., die es ausschließlich und unmittelbar für steuerbegünstigte Bildungszwecke zu verwenden hat.</p>
            
            <div className="mt-12 bg-gray-50 border border-gray-200 p-6 rounded-xl text-xs text-gray-600">
              <p className="font-bold text-gray-800 mb-1">Stand der Satzung:</p>
              <p>Ludwigshafen am Rhein, Fassung vom 01.01.2013 (zuletzt geändert am 18.10.2018).</p>
            </div>

          </div>

          <div className="mt-12 pt-8 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <Link 
              href="/ueber-uns" 
              className="inline-flex items-center text-sm font-semibold text-primary hover:text-accent transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Zurück zu Über uns
            </Link>
            
            <Link 
              href="/spenden" 
              className="inline-flex items-center justify-center px-6 py-2.5 bg-primary text-white font-medium rounded-xl hover:bg-primary-light transition-colors text-sm shadow-sm"
            >
              Verein unterstützen / Fördermitglied werden
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
