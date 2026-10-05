import LegalPage from "@/components/common/LegalPage";
import { LEGAL } from "@/lib/legal-data";
import { constructMetadata } from "@/lib/seo";

export const metadata = constructMetadata({
  title: "Datenschutzerklärung",
  description: "Informationen zur Verarbeitung personenbezogener Daten beim Lernzirkel Ludwigshafen e.V. gemäß DSGVO.",
  url: "https://www.lernzirkel-online.de/datenschutz",
});

export default function DatenschutzPage() {
  return (
    <LegalPage
      slug="datenschutz"
      title="Datenschutzerklärung"
      subtitle="Transparente Informationen darüber, welche Daten wir verarbeiten und welche Rechte Sie haben."
      lastUpdated={LEGAL.lastUpdated}
      sections={[
        {
          id: "verantwortlicher",
          title: "Verantwortlicher",
          content: (
            <p>
              Verantwortlich im Sinne der DSGVO ist: <strong>{LEGAL.name}</strong>, {LEGAL.street},{" "}
              {LEGAL.city}, Telefon {LEGAL.phone}, E-Mail{" "}
              <a href={`mailto:${LEGAL.email}`}>{LEGAL.email}</a>. Vertreten durch den
              Vorstandsvorsitzenden {LEGAL.chair}.
            </p>
          ),
        },
        {
          id: "hosting",
          title: "Hosting und Server-Logfiles",
          content: (
            <>
              <p>
                Beim Aufruf unserer Website werden technisch notwendige Daten (IP-Adresse, Datum und
                Uhrzeit, aufgerufene Seite, Browsertyp, Betriebssystem, Referrer-URL) in Server-Logfiles
                verarbeitet, um die Website auszuliefern und die Sicherheit und Stabilität zu
                gewährleisten.
              </p>
              <p>
                Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse am sicheren
                und fehlerfreien Betrieb). Logfiles werden nach kurzer Zeit automatisch gelöscht.
              </p>
            </>
          ),
        },
        {
          id: "kontakt",
          title: "Kontaktaufnahme (Formulare, E-Mail, Telefon, WhatsApp)",
          content: (
            <>
              <p>
                Wenn Sie uns über das Kontaktformular, den Förderungs-Rechner, per E-Mail, Telefon
                oder WhatsApp kontaktieren, verarbeiten wir die von Ihnen mitgeteilten Daten (z. B.
                Name, E-Mail, Telefonnummer, Wohnort, gewünschter Kurs, Nachricht), um Ihre Anfrage
                zu bearbeiten und Sie zu beraten.
              </p>
              <p>
                Rechtsgrundlagen sind Art. 6 Abs. 1 lit. b DSGVO (vorvertragliche Maßnahmen) sowie
                Art. 6 Abs. 1 lit. a DSGVO (Einwilligung). Beim Klick auf den WhatsApp-Link wird
                eine Verbindung zu WhatsApp (Meta) hergestellt; es gelten deren Datenschutzhinweise.
              </p>
            </>
          ),
        },
        {
          id: "foerderrechner",
          title: "Förderungs-Rechner und Dokumenten-Upload",
          content: (
            <>
              <p>
                Im Förderungs-Rechner können Sie freiwillig Unterlagen (z. B. Bescheid,
                Berechtigungsschein) hochladen. Diese Dokumente und Ihre Angaben werden
                ausschließlich zur Prüfung Ihres Förderanspruchs und zur Antragstellung verarbeitet.
              </p>
              <p>
                <strong>
                  Alle personenbezogenen Daten und hochgeladenen Dateien werden nach spätestens{" "}
                  {LEGAL.dataRetentionDays} Tagen automatisch und unwiderruflich gelöscht.
                </strong>{" "}
                Die Verarbeitung erfolgt auf Grundlage Ihrer ausdrücklichen Einwilligung (Art. 6
                Abs. 1 lit. a, ggf. Art. 9 Abs. 2 lit. a DSGVO). Sie können die Einwilligung jederzeit
                mit Wirkung für die Zukunft widerrufen.
              </p>
            </>
          ),
        },
        {
          id: "anmeldung",
          title: "Kurs- und Prüfungsanmeldung, Teilnehmerverwaltung",
          content: (
            <p>
              Bei Anmeldungen zu Integrationskursen, Sprachkursen, Nachhilfe oder telc-Prüfungen
              verarbeiten wir die zur Durchführung erforderlichen Daten. Soweit Kurse vom
              Bundesamt für Migration und Flüchtlinge (BAMF), dem Jobcenter oder anderen Stellen
              gefördert werden, übermitteln wir die gesetzlich vorgeschriebenen Daten an diese
              Stellen (Art. 6 Abs. 1 lit. b, c DSGVO). Gesetzliche Aufbewahrungsfristen bleiben
              unberührt.
            </p>
          ),
        },
        {
          id: "analyse",
          title: "Reichweitenmessung",
          content: (
            <p>
              Wir nutzen eine datenschutzfreundliche, eigene Reichweitenmessung. Dabei werden
              keine Cookies gesetzt und keine IP-Adressen oder andere direkt personenbezogene Daten
              gespeichert; es werden lediglich anonyme Ereignisse (z. B. aufgerufene Seite,
              Abschluss des Förderungs-Rechners) gezählt. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f
              DSGVO. Wir setzen derzeit kein Google Analytics ein; sollte sich dies ändern, holen
              wir vorab Ihre Einwilligung ein und aktualisieren diese Erklärung.
            </p>
          ),
        },
        {
          id: "cookies",
          title: "Cookies und lokale Speicherung",
          content: (
            <p>
              Informationen zu Cookies und Browser-Speicher finden Sie in unserer{" "}
              <a href="/cookies">Cookie-Richtlinie</a>.
            </p>
          ),
        },
        {
          id: "ki",
          title: "KI-Assistent",
          content: (
            <p>
              Sofern Sie den KI-Assistenten auf unserer Website nutzen, werden Ihre Eingaben zur
              Beantwortung an einen Anbieter von KI-Diensten übermittelt. Bitte geben Sie dort keine
              sensiblen personenbezogenen Daten ein. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f
              DSGVO bzw. Ihre Einwilligung durch die Nutzung.
            </p>
          ),
        },
        {
          id: "empfaenger",
          title: "Empfänger und Drittlandübermittlung",
          content: (
            <p>
              Empfänger Ihrer Daten sind unsere IT-Dienstleister (Hosting, Datenbank, E-Mail) als
              Auftragsverarbeiter nach Art. 28 DSGVO sowie, soweit erforderlich, Fördergeber und
              Behörden. Eine Übermittlung in Drittländer erfolgt nur, wenn ein Angemessenheitsbeschluss
              oder geeignete Garantien (z. B. Standardvertragsklauseln) vorliegen.
            </p>
          ),
        },
        {
          id: "speicherdauer",
          title: "Speicherdauer",
          content: (
            <ul>
              <li>Anfragen und Förderrechner-Daten: höchstens {LEGAL.dataRetentionDays} Tage.</li>
              <li>Teilnehmerdaten: bis zum Ablauf gesetzlicher bzw. förderrechtlicher Aufbewahrungsfristen.</li>
              <li>Server-Logfiles: kurzzeitig, danach automatische Löschung.</li>
            </ul>
          ),
        },
        {
          id: "rechte",
          title: "Ihre Rechte",
          content: (
            <>
              <p>Sie haben gegenüber uns folgende Rechte hinsichtlich Ihrer personenbezogenen Daten:</p>
              <ul>
                <li>Auskunft (Art. 15 DSGVO)</li>
                <li>Berichtigung (Art. 16 DSGVO)</li>
                <li>Löschung (Art. 17 DSGVO)</li>
                <li>Einschränkung der Verarbeitung (Art. 18 DSGVO)</li>
                <li>Datenübertragbarkeit (Art. 20 DSGVO)</li>
                <li>Widerspruch gegen die Verarbeitung (Art. 21 DSGVO)</li>
                <li>Widerruf erteilter Einwilligungen (Art. 7 Abs. 3 DSGVO)</li>
              </ul>
              <p>
                Zur Ausübung Ihrer Rechte genügt eine E-Mail an{" "}
                <a href={`mailto:${LEGAL.email}`}>{LEGAL.email}</a>.
              </p>
            </>
          ),
        },
        {
          id: "beschwerde",
          title: "Beschwerderecht bei der Aufsichtsbehörde",
          content: (
            <p>
              Sie haben das Recht, sich bei einer Datenschutzaufsichtsbehörde zu beschweren.
              Zuständig ist der Landesbeauftragte für den Datenschutz und die Informationsfreiheit
              Rheinland-Pfalz, Hintere Bleiche 34, 55116 Mainz,{" "}
              <a href="https://www.datenschutz.rlp.de" target="_blank" rel="noreferrer">
                www.datenschutz.rlp.de
              </a>
              .
            </p>
          ),
        },
        {
          id: "sicherheit",
          title: "Datensicherheit und Änderungen",
          content: (
            <p>
              Diese Website nutzt aus Sicherheitsgründen eine SSL/TLS-Verschlüsselung. Wir passen
              diese Datenschutzerklärung an, sobald Änderungen der Datenverarbeitung dies
              erforderlich machen.
            </p>
          ),
        },
      ]}
    />
  );
}
