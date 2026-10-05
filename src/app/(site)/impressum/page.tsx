import LegalPage from "@/components/common/LegalPage";
import { LEGAL } from "@/lib/legal-data";
import { constructMetadata } from "@/lib/seo";

export const metadata = constructMetadata({
  title: "Impressum",
  description: "Anbieterkennzeichnung und rechtliche Hinweise des Lernzirkel Ludwigshafen e.V.",
  url: "https://www.lernzirkel-online.de/impressum",
});

export default function ImpressumPage() {
  return (
    <LegalPage
      slug="impressum"
      title="Impressum"
      subtitle="Anbieterkennzeichnung gemäß § 5 DDG und Haftungshinweise."
      lastUpdated={LEGAL.lastUpdated}
      sections={[
        {
          id: "anbieter",
          title: "Angaben gemäß § 5 DDG",
          content: (
            <>
              <p>
                <strong>{LEGAL.name}</strong>
                <br />
                {LEGAL.subtitle}
                <br />
                {LEGAL.street}
                <br />
                {LEGAL.city}
              </p>
              <p>
                <strong>Vertreten durch den Vorstandsvorsitzenden:</strong> {LEGAL.chair}
              </p>
              <p>
                <strong>Vereinsregister:</strong> {LEGAL.register}
                <br />
                <strong>Steuernummer:</strong> {LEGAL.taxNumber}
              </p>
            </>
          ),
        },
        {
          id: "kontakt",
          title: "Kontakt",
          content: (
            <p>
              <strong>Telefon:</strong> <a href="tel:062130737271">{LEGAL.phone}</a>
              <br />
              <strong>Telefax:</strong> {LEGAL.fax}
              <br />
              <strong>E-Mail:</strong> <a href={`mailto:${LEGAL.email}`}>{LEGAL.email}</a>
              <br />
              <strong>Web:</strong> {LEGAL.web}
            </p>
          ),
        },
        {
          id: "verantwortlich",
          title: "Verantwortlich für den Inhalt (§ 18 Abs. 2 MStV)",
          content: (
            <p>
              {LEGAL.chair}, {LEGAL.name}, {LEGAL.street}, {LEGAL.city}
            </p>
          ),
        },
        {
          id: "streitbeilegung",
          title: "Verbraucherstreitbeilegung",
          content: (
            <p>
              Wir sind weder bereit noch verpflichtet, an Streitbeilegungsverfahren vor einer
              Verbraucherschlichtungsstelle teilzunehmen (§ 36 VSBG).
            </p>
          ),
        },
        {
          id: "haftung-inhalte",
          title: "Haftung für Inhalte",
          content: (
            <>
              <p>
                Die Inhalte unserer Seiten wurden mit größter Sorgfalt erstellt. Für die Richtigkeit,
                Vollständigkeit und Aktualität der Inhalte können wir jedoch keine Gewähr übernehmen.
                Als Diensteanbieter sind wir gemäß § 7 Abs. 1 DDG für eigene Inhalte auf diesen
                Seiten nach den allgemeinen Gesetzen verantwortlich.
              </p>
              <p>
                Nach §§ 8 bis 10 DDG sind wir als Diensteanbieter jedoch nicht verpflichtet,
                übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen
                zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen. Verpflichtungen zur
                Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen Gesetzen
                bleiben hiervon unberührt. Eine diesbezügliche Haftung ist erst ab dem Zeitpunkt der
                Kenntnis einer konkreten Rechtsverletzung möglich. Bei Bekanntwerden entsprechender
                Rechtsverletzungen werden wir diese Inhalte umgehend entfernen.
              </p>
            </>
          ),
        },
        {
          id: "haftung-links",
          title: "Haftung für Links",
          content: (
            <p>
              Unser Angebot enthält Links zu externen Webseiten Dritter, auf deren Inhalte wir keinen
              Einfluss haben. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter
              oder Betreiber verantwortlich. Die verlinkten Seiten wurden zum Zeitpunkt der
              Verlinkung auf mögliche Rechtsverstöße überprüft; rechtswidrige Inhalte waren nicht
              erkennbar. Eine permanente inhaltliche Kontrolle ohne konkrete Anhaltspunkte einer
              Rechtsverletzung ist nicht zumutbar. Bei Bekanntwerden von Rechtsverletzungen werden
              wir derartige Links umgehend entfernen.
            </p>
          ),
        },
        {
          id: "urheberrecht",
          title: "Urheberrecht",
          content: (
            <p>
              Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen
              dem deutschen Urheberrecht. Vervielfältigung, Bearbeitung, Verbreitung und jede Art der
              Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen
              Zustimmung des jeweiligen Autors bzw. Erstellers. Downloads und Kopien dieser Seite
              sind nur für den privaten, nicht kommerziellen Gebrauch gestattet. Soweit Inhalte auf
              dieser Seite nicht vom Betreiber erstellt wurden, werden die Urheberrechte Dritter
              beachtet. Sollten Sie dennoch auf eine Urheberrechtsverletzung aufmerksam werden,
              bitten wir um einen entsprechenden Hinweis.
            </p>
          ),
        },
        {
          id: "werbung",
          title: "Widerspruch gegen Werbe-Mails",
          content: (
            <p>
              Der Nutzung von im Rahmen der Impressumspflicht veröffentlichten Kontaktdaten zur
              Übersendung von nicht ausdrücklich angeforderter Werbung und Informationsmaterialien
              wird hiermit widersprochen. Die Betreiber der Seiten behalten sich ausdrücklich
              rechtliche Schritte im Falle der unverlangten Zusendung von Werbeinformationen, etwa
              durch Spam-Mails, vor.
            </p>
          ),
        },
        {
          id: "wirksamkeit",
          title: "Rechtswirksamkeit dieses Haftungsausschlusses",
          content: (
            <p>
              Sollten einzelne Regelungen oder Formulierungen dieses Haftungsausschlusses unwirksam
              sein oder werden, bleiben die übrigen Regelungen in ihrem Inhalt und ihrer Gültigkeit
              hiervon unberührt.
            </p>
          ),
        },
      ]}
    />
  );
}
