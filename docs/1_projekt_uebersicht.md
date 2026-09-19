# Projektübersicht: Lernzirkel Ludwigshafen e.V. (Relaunch)

## 1. Ziel des Projekts
Der Relaunch der Website `lernzirkel-online.de` zielt darauf ab, die Bildungs-, Beratungs- und sozialen Angebote des Vereins digital optimal zu präsentieren. Die neue Plattform soll nutzerfreundlich, modern und zielgruppenorientiert sein. 
Besonderer Wert wird auf die Darstellung der Werte (Leitbild), Barrierefreiheit und einfache Kontaktaufnahme gelegt.

## 2. Technologie-Stack
- **Frontend-Framework:** Next.js (App Router, React 18+)
- **Styling:** Tailwind CSS (angepasst an das WordPress "Flatsome" Theme Design)
- **Datenbank:** PostgreSQL (via Prisma ORM oder Drizzle für Typensicherheit)
- **Backend / API:** Next.js Server Actions & Route Handlers
- **CMS / Admin-Panel:** (Optional/Geplant) Eigenes einfaches Dashboard für Kursverwaltung, News und Öffnungszeiten.

## 3. Kernanforderungen
- **Design:** Exakte Nachbildung des UX/UI-Gefühls des "Flatsome" WordPress-Themes (klare Header, Sticky Navigation, Banner-Slider, Grid-Layouts, Hover-Effekte auf Karten).
- **Zweisprachigkeit/Mehrsprachigkeit:** Fokus auf einfache deutsche Sprache; Unterstützung für Türkisch, Arabisch, Englisch für Kernbereiche (Kursanmeldung, Beratung).
- **Spamschutz:** Die E-Mail `info@lernzirkel-online.de` wird nicht als Klartext-Link (`mailto:`) im HTML hinterlegt. Nutzung von Kontaktformularen und Obfuscation-Techniken für E-Mail-Adressen.
- **Abteilungs-Öffnungszeiten:** Keine generellen Öffnungszeiten, sondern abteilungsspezifische Zeiten (z.B. Verwaltung, Migrationsfachdienst, Nachhilfe).
- **Zertifikate & Partner:** Prominente Platzierung von AZAV-Zertifikaten und Partner-Logos im Footer und auf der "Über uns"-Seite.
- **Spezielles:**
  - ESF+ Alpha erhält besondere Sichtbarkeit (Top-Menu oder Main-Menu).
  - Einbindung des DSEE Projekts (eigene Landingpage).
  - Bildergalerie zur Darstellung des Vereinslebens.
  - Spenden (Donation) Call-to-Action.
