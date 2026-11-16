
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function run() {
  const page = await prisma.page.findUnique({
    where: { slug: "kurse/integrationskurse-alpha" }
  });

  if (!page) {
    console.log("Page not found");
    return;
  }

  const htmlContent = `
    <h3 style="font-size: 1.5rem; font-weight: bold; color: #1a6d92; margin-top: 2rem; margin-bottom: 1rem;">Was ist ein Alphabetisierungskurs?</h3>
    <p style="margin-bottom: 1.5rem; line-height: 1.6;">Viele Erwachsene in Deutschland hatten nicht das Glück oder die Möglichkeit, Lesen und Schreiben zu lernen. Nicht nur in der deutschen Bevölkerung, sondern auch bei Zugewanderten gibt es Menschen, die nicht ausreichend lesen und schreiben können. Viele von ihnen müssen eine zusätzliche Hürde bewältigen: Sie sollen nicht nur Deutsch sprechen, sondern gleichzeitig in lateinischer Schrift lesen und schreiben lernen.</p>
    <p style="margin-bottom: 1.5rem; line-height: 1.6;">Die Alphabetisierungskurse helfen diesen Menschen dabei.</p>
    
    <div style="background-color: #f9fafb; padding: 1.5rem; border-radius: 0.75rem; border: 1px solid #e5e7eb; margin-bottom: 2.5rem;">
      <h4 style="font-weight: bold; color: #1a6d92; margin-bottom: 1rem;">Wenn Sie jemanden kennen, der...</h4>
      <ul style="margin-left: 1.5rem; list-style-type: disc; margin-bottom: 1rem; line-height: 1.8;">
        <li>zum ersten Mal überhaupt lesen und schreiben lernen möchte,</li>
        <li>zwar lesen und schreiben kann, aber nicht in ausreichendem Maße,</li>
        <li>gleichzeitig auch besser Deutsch sprechen und verstehen möchte und</li>
        <li>lernen möchte, wie er sich ohne Angst im deutschen Alltag bewegen kann,</li>
      </ul>
      <p style="font-weight: bold; color: #1f2937;">...dann könnte ein Alphabetisierungskurs das Richtige für diese Person sein.</p>
    </div>
    
    <hr style="margin-top: 2.5rem; margin-bottom: 2.5rem; border-top: 1px solid #e5e7eb;" />
    
    <h3 style="font-size: 1.5rem; font-weight: bold; color: #1a6d92; margin-bottom: 1rem;">Aufbau</h3>
    <p style="margin-bottom: 2.5rem; line-height: 1.6;">Jeder Integrationskurs besteht aus einem Sprachkurs und einem Orientierungskurs. Der Integrationskurs mit Alphabetisierung dauert <strong>1000 Unterrichtseinheiten (UE)</strong>.</p>
    
    <h3 style="font-size: 1.5rem; font-weight: bold; color: #1a6d92; margin-bottom: 1rem;">Einstufungstest</h3>
    <p style="margin-bottom: 2.5rem; line-height: 1.6;">Vor Beginn des Integrationskurses führen wir einen zweistufigen Einstufungstest (schriftlich und mündlich) durch. Das Ergebnis hilft uns zu entscheiden, mit welchem Kursabschnitt Sie beginnen sollten und ob ein spezieller Alphabetisierungskurs sinnvoll wäre.</p>
  `;

  await prisma.section.deleteMany({
    where: { pageId: page.id }
  });

  await prisma.section.create({
    data: {
      pageId: page.id,
      type: "TEXT",
      order: 0,
      content: {
        eyebrow: "Spezialkurse",
        title: "Integrationskurs mit Alphabetisierung",
        text: htmlContent
      },
      design: {}
    }
  });

  await prisma.section.create({
    data: {
      pageId: page.id,
      type: "BANNER",
      order: 1,
      content: {
        title: "Wir beraten Sie gerne!",
        subtitle: "Kommen Sie zu uns für eine persönliche Beratung oder zur Anmeldung.",
        buttonText: "Beratungstermin vereinbaren",
        buttonLink: "/kontakt"
      },
      design: {
        backgroundColor: "bg-secondary/30",
        textColor: "text-primary"
      }
    }
  });

  console.log("Sections created!");
}

run().catch(console.error).finally(() => process.exit(0));

