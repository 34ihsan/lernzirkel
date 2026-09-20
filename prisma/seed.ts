import 'dotenv/config'
import prisma from '../src/lib/prisma'

async function main() {
  console.log(`Start seeding ...`)

  // 1. Abteilungen (Departments)
  const deptBildung = await prisma.department.create({
    data: {
      name: 'Bildung & Nachhilfe',
      description: 'Nachhilfeunterricht, Prüfungsvorbereitung und Lernförderung.',
      email: 'bildung@lernzirkel-online.de',
      phone: '0621 12345678',
      openingHours: {
        create: [
          { dayOfWeek: 1, openTime: '14:00', closeTime: '19:00', isClosed: false },
          { dayOfWeek: 2, openTime: '14:00', closeTime: '19:00', isClosed: false },
          { dayOfWeek: 3, openTime: '14:00', closeTime: '19:00', isClosed: false },
          { dayOfWeek: 4, openTime: '14:00', closeTime: '19:00', isClosed: false },
          { dayOfWeek: 5, openTime: '14:00', closeTime: '19:00', isClosed: false },
          { dayOfWeek: 6, openTime: '10:00', closeTime: '14:00', isClosed: false },
          { dayOfWeek: 7, isClosed: true },
        ],
      },
    },
  })

  const deptSprache = await prisma.department.create({
    data: {
      name: 'Sprache & Integration',
      description: 'Integrationskurse, Sprachkurse und telc-Prüfungen.',
      email: 'sprache@lernzirkel-online.de',
      phone: '0621 87654321',
      openingHours: {
        create: [
          { dayOfWeek: 1, openTime: '08:00', closeTime: '16:00', isClosed: false },
          { dayOfWeek: 2, openTime: '08:00', closeTime: '16:00', isClosed: false },
          { dayOfWeek: 3, openTime: '08:00', closeTime: '16:00', isClosed: false },
          { dayOfWeek: 4, openTime: '08:00', closeTime: '16:00', isClosed: false },
          { dayOfWeek: 5, openTime: '08:00', closeTime: '14:00', isClosed: false },
          { dayOfWeek: 6, isClosed: true },
          { dayOfWeek: 7, isClosed: true },
        ],
      },
    },
  })

  // 2. Projekte (Projects)
  await prisma.project.create({
    data: {
      title: 'ESF+ Alpha',
      status: 'AKTIV',
      description: 'Alphabetisierung und Grundbildung für Erwachsene.',
      goals: 'Stärkung der Lese- und Schreibkompetenz.',
      targetGroup: 'Erwachsene mit Grundbildungsbedarf',
    },
  })

  await prisma.project.create({
    data: {
      title: 'DSEE Projekt',
      status: 'AKTIV',
      description: 'Engagement-Förderung und Digitalisierung.',
      goals: 'Aufbau von ehrenamtlichen Strukturen.',
    },
  })

  // 3. Galerie (Gallery Images)
  await prisma.galleryImage.create({
    data: {
      title: 'Unser Team',
      imageUrl: '/images/gallery/team.jpg',
      category: 'Allgemein',
    },
  })
  
  await prisma.galleryImage.create({
    data: {
      title: 'Unterrichtsraum',
      imageUrl: '/images/gallery/raum.jpg',
      category: 'Räumlichkeiten',
    },
  })

  console.log(`Seeding finished.`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
