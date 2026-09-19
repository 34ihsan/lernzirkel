# Design-Vorgaben & Spezifische Features

## 1. Flatsome Theme Nachbau (Tailwind CSS)
Das Flatsome Theme aus dem WordPress-Ökosystem zeichnet sich durch folgende Merkmale aus, die wir in Tailwind CSS nachbauen:
- **Header:** Sticky-Funktion beim Scrollen. Logo links, Navigation rechts. Ein "Top-Bar" für sekundäre Links.
- **Typografie:** Klare Sans-Serif Schriften (z.B. Lato oder Inter). Überschriften (`h1`, `h2`, `h3`) fett und gut lesbar.
- **Farben:** Basierend auf dem Corporate Design des Lernzirkel e.V. (primär Blau/Weiß/Grau).
- **Layout-Elemente:**
  - `Container`: Maximale Breite (meist ca. 1200px), zentriert.
  - `Cards`: Leichter Drop-Shadow (`shadow-md`), der beim Hovern stärker wird (`hover:shadow-xl`), Abrundungen (`rounded-lg`).
  - `Buttons`: Solide Farben, leichte Rundung (`rounded-md`), Uppercase-Text für primäre Aktionen, leichter Hover-Effekt (Helligkeit oder leichter Schatten).
  - `Akkordeon/F&A`: Für FAQs und Kursdetails (nutze z.B. Radix UI oder Headless UI für accessible Accordions).

## 2. Spamschutz für E-Mail (info@lernzirkel-online.de)
Da die E-Mail stark von Spam-Bots attackiert wird:
1. **Kein `mailto:`-Link im Quellcode.**
2. **React E-Mail Obfuscation Component:** Wir rendern die E-Mail client-seitig. Beispiel:
   ```jsx
   const user = 'info';
   const domain = 'lernzirkel-online.de';
   return <span onClick={() => window.location.href = `mailto:${user}@${domain}`}>{user}@{domain}</span>
   ```
3. **Kontaktformulare nutzen:** Wo immer möglich, Nutzer auf ein Kontaktformular leiten, das mit Cloudflare Turnstile oder reCAPTCHA v3 geschützt ist.

## 3. ESF+ Alpha & DSEE Projekt
- **ESF+ Alpha:** Bekommt einen direkten Link in der Top-Bar (farblich hervorgehoben) UND ist unter "Deutsch & Grundbildung" erreichbar.
- **DSEE Projekt:** Bekommt eine eigene Landingpage unter `/projekte/dsee` und wird im Hauptmenü unter "Projekte & Engagement" gelistet.

## 4. Bildergalerie
- Eine Seite `/ueber-uns/galerie`.
- Implementierung mit einer Lightbox-Bibliothek (z.B. `yet-another-react-lightbox`), um Bilder im Vollbildmodus (Flatsome-Style) zu betrachten.
- Grid-Layout (Masonry oder CSS Grid) mit Hover-Overlay (Zoom-Effekt auf dem Bild).

## 5. Abteilungs-Öffnungszeiten & Zertifikate (AZAV)
- **Footer-Design:** Im Footer werden die Öffnungszeiten dynamisch in Tabs oder kleinen Blöcken nach Abteilung (Verwaltung, Beratung, Kurse) dargestellt.
- **Zertifikate:** Unten im Footer oder über dem Footer ein durchgehender Balken ("Trusted by / Zertifiziert durch") mit dem AZAV Logo, BAMF Logo und ESF+ Logo.

## 6. Mehrsprachigkeit (i18n)
- Umsetzung mit `next-intl` oder `next-i18next`.
- Der Content für Türkisch, Arabisch und Englisch muss im CMS/JSON verwaltet werden. Sprachumschalter in der Top-Bar (Flaggensymbole oder Länderkürzel).
