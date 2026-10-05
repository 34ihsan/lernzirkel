import LegalPage from "@/components/common/LegalPage";
import { LEGAL } from "@/lib/legal-data";
import { constructMetadata } from "@/lib/seo";

export const metadata = constructMetadata({
  title: "Allgemeine Geschäftsbedingungen (AGB)",
  description: "Allgemeine Geschäftsbedingungen des Lernzirkel Ludwigshafen e.V. für Kurse, Nachhilfe und Prüfungen.",
  url: "https://www.lernzirkel-online.de/agb",
});

export default function AgbPage() {
  return (
    <LegalPage
      slug="agb"
      title="Allgemeine Geschäftsbedingungen"
      subtitle="Bedingungen für die Teilnahme an Kursen, Nachhilfe, Prüfungen und Beratungsangeboten."
      lastUpdated={LEGAL.lastUpdated}
      sections={[
        {
          id: "geltung",
          title: "Geltungsbereich",
          content: (
            <p>
              Diese AGB gelten für alle Verträge zwischen dem {LEGAL.name}, {LEGAL.street},{" "}
              {LEGAL.city} (nachfolgend „Lernzirkel“) und Teilnehmenden bzw. Auftraggebern über
              Kurse, Nachhilfe, Prüfungen (z. B. telc) und sonstige Bildungs- und
              Beratungsangebote. Für staatlich geförderte Kurse (z. B. Integrationskurse des BAMF)
              gehen die jeweiligen gesetzlichen und förderrechtlichen Regelungen diesen AGB vor.
            </p>
          ),
        },
        {
          id: "vertragsschluss",
          title: "Anmeldung und Vertragsschluss",
          content: (
            <p>
              Die Darstellung der Angebote auf der Website ist unverbindlich. Mit Ihrer Anmeldung
              (online, schriftlich oder persönlich) geben Sie ein Angebot zum Vertragsschluss ab.
              Der Vertrag kommt mit unserer Bestätigung in Textform oder mit Kursbeginn zustande.
              Voranmeldungen über den Förderungs-Rechner sind unverbindlich und begründen noch
              keinen Anspruch auf einen Kursplatz oder eine Förderung.
            </p>
          ),
        },
        {
          id: "foerderung",
          title: "Geförderte Angebote",
          content: (
            <>
              <p>
                Angebote wie Integrationskurse oder Nachhilfe über das Bildungs- und Teilhabepaket
                (BuT) sind für Berechtigte kostenfrei oder vergünstigt, sofern die zuständige Stelle
                (BAMF, Jobcenter, Kommune) die Förderung bewilligt. Der Lernzirkel unterstützt bei
                der Antragstellung, hat jedoch keinen Einfluss auf die Bewilligung.
              </p>
              <p>
                Wird eine Förderung nicht oder nicht in voller Höhe bewilligt, informieren wir Sie
                vor Kursbeginn; Sie können dann kostenfrei von der Anmeldung zurücktreten.
              </p>
            </>
          ),
        },
        {
          id: "preise",
          title: "Preise und Zahlung",
          content: (
            <p>
              Es gelten die zum Zeitpunkt der Anmeldung veröffentlichten bzw. schriftlich
              mitgeteilten Preise. Als gemeinnütziger Verein erheben wir für Selbstzahler faire
              Gebühren; Ratenzahlung ist nach Absprache möglich. Rechnungen sind, sofern nicht
              anders vereinbart, innerhalb von 14 Tagen ohne Abzug zu zahlen. Bei Zahlungsverzug
              gelten die gesetzlichen Regelungen.
            </p>
          ),
        },
        {
          id: "widerruf",
          title: "Widerrufsrecht für Verbraucher",
          content: (
            <>
              <p>
                Verbraucher haben bei Fernabsatzverträgen ein gesetzliches Widerrufsrecht von 14
                Tagen ohne Angabe von Gründen. Die Frist beginnt mit Vertragsschluss. Zur Ausübung
                genügt eine eindeutige Erklärung (z. B. per E-Mail an{" "}
                <a href={`mailto:${LEGAL.email}`}>{LEGAL.email}</a>).
              </p>
              <p>
                Beginnt der Kurs auf Ihren ausdrücklichen Wunsch vor Ablauf der Widerrufsfrist, haben
                Sie im Fall des Widerrufs den Wert der bis dahin erbrachten Leistungen anteilig zu
                vergüten (§ 357a BGB).
              </p>
            </>
          ),
        },
        {
          id: "ruecktritt",
          title: "Rücktritt und Kündigung",
          content: (
            <ul>
              <li>Ein Rücktritt vor Kursbeginn ist in Textform möglich.</li>
              <li>Bei Selbstzahlern kann bei späterem Rücktritt eine angemessene Bearbeitungsgebühr anfallen.</li>
              <li>Das Recht zur Kündigung aus wichtigem Grund bleibt unberührt.</li>
              <li>Bei unentschuldigtem Fehlen besteht kein Anspruch auf Erstattung von Kursgebühren.</li>
            </ul>
          ),
        },
        {
          id: "durchfuehrung",
          title: "Durchführung und Ausfall",
          content: (
            <p>
              Wir behalten uns vor, Kurse bei zu geringer Teilnehmerzahl, Erkrankung der
              Lehrkraft oder aus anderen wichtigen Gründen zu verschieben, zusammenzulegen oder
              abzusagen. Bereits gezahlte Gebühren für nicht erbrachte Leistungen erstatten wir
              unverzüglich oder rechnen sie auf einen Ersatztermin an. Darüber hinausgehende
              Ansprüche bestehen nicht, soweit gesetzlich zulässig.
            </p>
          ),
        },
        {
          id: "pruefungen",
          title: "Prüfungen (telc)",
          content: (
            <p>
              Für Prüfungen gelten zusätzlich die Prüfungsordnung und die Teilnahmebedingungen des
              jeweiligen Prüfungsanbieters (z. B. telc gGmbH). Die Anmeldung zur Prüfung ist
              verbindlich; Rücktritts- und Stornofristen werden mit der Anmeldebestätigung
              mitgeteilt. Ein Anspruch auf Bestehen oder ein bestimmtes Ergebnis besteht nicht.
            </p>
          ),
        },
        {
          id: "pflichten",
          title: "Pflichten der Teilnehmenden und Hausordnung",
          content: (
            <p>
              Teilnehmende sind zu regelmäßiger Teilnahme und rücksichtsvollem Verhalten
              verpflichtet. Unterrichtsmaterialien und Räumlichkeiten sind pfleglich zu behandeln.
              Bei erheblichen Störungen kann der Lernzirkel Teilnehmende vom Unterricht
              ausschließen. Unterrichtsmaterialien sind urheberrechtlich geschützt und dürfen nicht
              ohne Zustimmung vervielfältigt oder weitergegeben werden.
            </p>
          ),
        },
        {
          id: "haftung",
          title: "Haftung",
          content: (
            <p>
              Wir haften unbeschränkt bei Vorsatz und grober Fahrlässigkeit sowie bei Verletzung von
              Leben, Körper und Gesundheit. Bei leicht fahrlässiger Verletzung wesentlicher
              Vertragspflichten ist die Haftung auf den vorhersehbaren, vertragstypischen Schaden
              begrenzt. Im Übrigen ist die Haftung ausgeschlossen. Für mitgebrachte Gegenstände wird
              keine Haftung übernommen. Die Haftung nach dem Produkthaftungsgesetz bleibt unberührt.
            </p>
          ),
        },
        {
          id: "datenschutz",
          title: "Datenschutz",
          content: (
            <p>
              Informationen zur Verarbeitung personenbezogener Daten finden Sie in unserer{" "}
              <a href="/datenschutz">Datenschutzerklärung</a>.
            </p>
          ),
        },
        {
          id: "schluss",
          title: "Schlussbestimmungen",
          content: (
            <p>
              Es gilt deutsches Recht unter Ausschluss des UN-Kaufrechts. Gerichtsstand ist, soweit
              zulässig, Ludwigshafen am Rhein. Sollten einzelne Bestimmungen unwirksam sein, bleibt
              die Wirksamkeit der übrigen Bestimmungen unberührt. Änderungen und Ergänzungen
              bedürfen der Textform.
            </p>
          ),
        },
      ]}
    />
  );
}
