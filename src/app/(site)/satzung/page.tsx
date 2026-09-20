import { FileText, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function SatzungPage() {
  return (
    <div className="py-12 bg-gray-50/50 min-h-screen">
      <div className="container mx-auto px-4 max-w-4xl">
        
        {/* Main Content Card */}
        <div className="bg-white rounded-xl shadow-sm p-8 md:p-14 border border-gray-100 flatsome-card">
          
          <span className="inline-block px-4 py-1 bg-blue-100 text-blue-700 font-bold rounded-full text-sm mb-6 uppercase tracking-wider">
            Rechtliches
          </span>
          
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-12 leading-tight">
            Satzung des Vereins Lernzirkel Ludwigshafen e.V.
          </h1>
          
          <div className="prose max-w-none text-gray-700 satzung-content">
            
            <h3 className="text-2xl font-bold text-foreground mt-8 mb-4 flex items-center">
              <FileText className="w-6 h-6 mr-3 text-accent" />
              § 1 Name und Sitz:
            </h3>
            <p>(1) Der Verein führt den Namen „Lernzirkel Ludwigshafen e.V.“</p>
            <p>(2) Der Verein hat seinen Sitz in Ludwigshafen.</p>
            <p>(3) Der Verein soll in das Vereinsregister beim Amtsgericht Ludwigshafen eingetragen werden.</p>

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
            <p>(3) Die Mitgliedschaft endet</p>
            <ul className="list-disc pl-6 mb-4 space-y-1">
              <li>a) durch den Tod – bei juristischen Personen – durch Auflösung</li>
              <li>b) durch Austritt</li>
              <li>c) durch Ausschluss</li>
            </ul>
            <p>Der Austritt aus dem Verein erfolgt durch schriftliche Erklärung gegenüber dem Vorstand mit einer Frist von drei Monaten. Das Schriftformerfordernis ist Voraussetzung für die Wirksamkeit der Austrittserklärung.</p>
            <p>Wenn ein Mitglied gegen die Ziele und Interessen des Vereins schwer verstoßen hat oder trotz Mahnung mit dem Beitrag für drei Monate im Rückstand bleibt, so kann es mit dem Beschluss vom Vorstand mit sofortiger Wirkung ausgeschlossen werden. Dem Mitglied muss vor Beschlussfassung Gelegenheit zur Rechtfertigung bzw. zur Stellungnahme gegeben werden.</p>
            <p>Bis zur Entscheidung der Mitgliederversammlung ruhen die Rechte des Mitgliedes.</p>

            <h3 className="text-2xl font-bold text-foreground mt-12 mb-4 flex items-center">
              <FileText className="w-6 h-6 mr-3 text-accent" />
              § 6 Organe des Vereins:
            </h3>
            <p>Die Organe des Vereins sind:</p>
            <ul className="list-disc pl-6 mb-4 space-y-1">
              <li>a) Mitgliederversammlung</li>
              <li>b) Der Vorstand</li>
            </ul>

            <h3 className="text-2xl font-bold text-foreground mt-12 mb-4 flex items-center">
              <FileText className="w-6 h-6 mr-3 text-accent" />
              § 7 Die Mitgliederversammlung:
            </h3>
            <p>(1) Einmal im Jahr findet mindestens eine ordentliche Mitgliederversammlung statt. Sie ist vom Vorsitzenden einzuberufen. Die Einberufung erfolgt mindestens vierzehn Tage zuvor, schriftlich unter Angabe der Tagesordnung</p>
            <p>(2) Die Aufgaben der Mitgliederversammlung sind insbesondere:</p>
            <ul className="list-disc pl-6 mb-4 space-y-1">
              <li>a) Die Wahl des Vorstandes</li>
              <li>b) Entgegennahme des Jahres- und Kassenberichtes</li>
              <li>c) Entlastung des Vorstandes</li>
              <li>d) Wahl der Rechnungsprüfer</li>
              <li>e) Beschlussfassung über Anträge</li>
              <li>f) Entscheidung über die Berufung eines ausgeschlossenen Mitgliedes</li>
              <li>g) Änderung der Satzung</li>
              <li>h) Auflösung des Vereines</li>
              <li>i) Festlegung des Mitgliedsbeitrages</li>
            </ul>
            <p>(3) Die Mitgliederversammlung wird von dem Vorsitzenden geleitet.</p>
            <p>(4) Die Beschlüsse werden mit einfacher Mehrheit gefasst. Für Satzungsänderungen ist eine Mehrheit von ¾ der erschienenen Mitglieder erforderlich.</p>
            <p>(5) Über den Ablauf der Versammlung ist ein Protokoll zu führen, das vom Schriftführer und dem Vorsitzenden zu unterschreiben ist.</p>
            <p>(6) Der Vorstand hat das Recht, bei Bedarf jederzeit eine Mitgliederversammlung einzuberufen, wenn er dies im Interesse des Vereins für erforderlich hält. Ferner ist eine Mitgliederversammlung einzuberufen, wenn 1/3 der Mitglieder die Einberufung schriftlich und unter Angabe des Zwecks und der Gründe verlangen.</p>

            <h3 className="text-2xl font-bold text-foreground mt-12 mb-4 flex items-center">
              <FileText className="w-6 h-6 mr-3 text-accent" />
              § 8 Der Vorstand:
            </h3>
            <p>(1) Der Vorstand wird von der Mitgliederversammlung auf die Dauer von zwei Jahren gewählt. Die Wahl ist nicht geheim. Auf Wunsch eines Mitgliedes kann die Wahl auch geheim durchgeführt werden. Gewählt ist, wer die einfache Mehrheit der Stimmen erhält.</p>
            <p>(2) Der Vorstand besteht aus dem ersten Vorsitzenden, seinem Stellvertreter, dem Schriftführer und dem Kassierer sowie weiteren nicht stimmberechtigten Beisitzern, deren Anzahl nach den Erfordernissen durch den Vorstand bestimmt werden.</p>
            <p>(3) Der Vorsitzende wird vom stellvertretenden Vorsitzenden vertreten.</p>
            <p>(4) Der Vorsitzende, der stellvertretende Vorsitzende, Schriftführer und der Kassierer sind Vorstand im Sinne § 26 BGB. Vertretungsberechtigt sind immer jeweils 2 Vorstandsmitglieder zusammen.</p>
            <p>(5) Die unbegrenzte Wiederwahl von Vorstandsmitgliedern ist zulässig. Nach Fristablauf bleiben die Vorstandsmitglieder bis zum Amtsantritt ihrer Nachfolger im Amt.</p>
            <p>(6) Scheidet ein Vorstandsmitglied vorzeitig aus dem Amt aus, ist der Restvorstand befugt, bis zur Neubestellung durch die nächste Mitgliederversammlung ein Ersatzmitglied zu bestellen.</p>
            <p>(7) Der Vorstand kann für die Geschäfte der laufenden Verwaltung einen Geschäftsführer bestellen. Dieser ist berechtigt, an den Sitzungen des Vorstandes mit beratender Stimme teilzunehmen.</p>
            <p>(8) Vorstandssitzungen finden jährlich zweimal alle sechs Monate statt gegebenenfalls auch öfters bei Bedarf. Die Einladung zur Vorstandssitzungen erfolgt durch den Vorsitzenden, bei dessen Verhinderung durch den stellvertretenden Vorsitzenden, schriftlich unter Einhaltung einer Einladungsfrist von 14 Tagen. Vorstandssitzungen sind beschlussfähig, wenn satzungsgemäß eingeladen wurde und mindestens drei Vorstandsmitglieder – darunter der Vorsitzende oder der stellvertretenden Vorsitzende – anwesend sind.</p>
            <p>(9) Beschlüsse des Vorstandes können bei Eilbedürftigkeit schriftlich oder fernmündlich gefasst werden, wenn alle Vorstandsmitglieder ihre Zustimmung zu diesem Verfahren schriftlich oder fernmündlich erklären. Schriftlich oder fernmündlich erfasste Vorstandsbeschlüsse sind schriftlich niederzulegen und vom Vorsitzenden zu unterzeichnen.</p>
            <p>(10) Der Vorstand fasst seine Beschlüsse mit einfacher Mehrheit.</p>

            <h3 className="text-2xl font-bold text-foreground mt-12 mb-4 flex items-center">
              <FileText className="w-6 h-6 mr-3 text-accent" />
              § 9 Der Kassenprüfer:
            </h3>
            <p>(1) Die Mitgliederversammlung wählt auf die Dauer von zwei Jahren zwei Kassenprüfer. Sie haben vor dem Rechnungsschluss eine ordentliche Kassenprüfung vorzunehmen und darüber in der Mitgliederversammlung Bericht zu erstatten.</p>
            <p>(2) Die Mitgliederversammlung kann auch einem Nichtmitglied, mit der notwendigen Sachkenntnis, die Kassenprüfung übertragen.</p>

            <h3 className="text-2xl font-bold text-foreground mt-12 mb-4 flex items-center">
              <FileText className="w-6 h-6 mr-3 text-accent" />
              § 10 Auflösung des Vereins
            </h3>
            <p>(1) Die Auflösung des Vereins kann nur in einer Mitgliederversammlung beschlossen werden, auf deren Tagesordnung die Beschlussfassung über die Vereinsauflösung den Mitgliedern angekündigt worden ist. Der Beschluss bedarf einer Mehrheit von ¾ der gesamten Mitglieder. Wird diese Mehrheit nicht erreicht, entscheidet in der 2. Sitzung ¾ der gesamten Mitglieder. Wird diese Mehrheit nicht erreicht, entscheidet in der 2. Sitzung ¾ der anwesenden Mitglieder über die Auflösung.</p>
            <p>(2) Für den Fall der Auflösung bestellt die Mitgliederversammlung zwei Liquidatoren, die die Geschäfte des Vereins abzuwickeln haben.</p>
            <p>(3) Bei Auflösung oder Aufhebung des Vereins oder bei Wegfall steuerbegünstigter Zwecke fällt das Vereinsvermögen an den Paritätischen Landesverband Rheinland Pfalz/ Saarland e.V., die es ausschließlich und unmittelbar für steuerbegünstigte Zwecke im Sinne des § 2 dieser Satzung zu verwenden hat.</p>
            
            <div className="mt-12 bg-gray-100 p-6 rounded-lg text-sm text-gray-600">
              <p className="mb-1"><strong>Ludwigshafen, den 01.01.2013</strong></p>
              <ul className="list-disc pl-5">
                <li>letzte geänderte Fassung vom 28.11.2014</li>
                <li>letzte geänderte Fassung vom 10.10.2015</li>
                <li>letzte geänderte Fassung vom 18.05.2017</li>
                <li>letzte geänderte Fassung vom 18.10.2018</li>
              </ul>
            </div>

          </div>

          <div className="mt-12 pt-8 border-t border-gray-100 text-center">
            <Link href="/ueber-uns" className="inline-flex items-center justify-center px-6 py-3 bg-secondary text-secondary-foreground font-bold rounded-lg hover:bg-secondary/90 transition-colors">
              Mehr über uns erfahren <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
