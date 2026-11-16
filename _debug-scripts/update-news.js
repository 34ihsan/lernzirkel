const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const html = `
<h3>Neue Integrationskurse:</h3>
<br/>
<p><strong>Start:</strong> 15.09.2026</p>
<p><strong>Kursart:</strong> Integrationskurs mit Alphabetisierung Modul 7 Wiederholerkurs</p>
<p><strong>Kurszeiten:</strong> Montag bis Freitag, 13:00 Uhr bis 17:00 Uhr</p>
<br/>
<p><strong>Start:</strong> 05.10.2026</p>
<p><strong>Kursart:</strong> Zweitschriftlernerkurs Modul 1</p>
<p><strong>Kurszeiten:</strong> Montag bis Freitag, 09:00 Uhr bis 12:15 Uhr</p>
<br/>
<p><strong>Wir haben noch Plätze frei!</strong></p>
<p>Für Anmeldung oder Infos können Sie uns gerne kontaktieren.</p>
<br/>
<hr/>
<br/>
<h3>Landeskurse „Sprachziel Deutsch“</h3>
<br/>
<p><strong>Start:</strong> 21.09.2026</p>
<p><strong>Kursart:</strong> Allgemeiner B1-Kurs</p>
<p><strong>Kurszeiten:</strong> Montag bis Freitag, 08:45 Uhr bis 12:45 Uhr</p>
`;

async function main() {
  await prisma.news.update({
    where: { id: 'd80c77a5-d137-4a18-8e9c-2e4533aca5a6' },
    data: { content: html }
  });
  console.log('Updated successfully');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
