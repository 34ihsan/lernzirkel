import prisma from './src/lib/prisma';
import fs from 'fs';
import path from 'path';

async function main() {
  const slug = 'kinder-jugendliche/jugendbetreuung';
  const page = await prisma.page.findUnique({
    where: { slug }
  });

  if (!page) {
    console.error('Page not found!');
    return;
  }

  // Delete existing sections for this page just in case
  await prisma.section.deleteMany({
    where: { pageId: page.id }
  });

  const contentFile = 'C:/Users/sinan/.gemini/antigravity/brain/79e3804e-515a-433f-8eae-d6de4ccddccf/.system_generated/steps/356/extracted_content.html';
  let htmlContent = fs.readFileSync(contentFile, 'utf8');

  // Let's create an IMAGE_TEXT section for the top part and TEXT for the rest?
  // Actually, wait, let's just use the TEXT block for the whole thing to be perfectly safe,
  // since the editor handles standard HTML (like <p>, <img>, <ul>).
  
  await prisma.section.create({
    data: {
      pageId: page.id,
      type: 'TEXT',
      order: 0,
      content: {
        text: htmlContent
      },
      design: {
        bgColor: "bg-white",
        textColor: "text-gray-900"
      }
    }
  });

  console.log('Successfully added content to Jugendbetreuung page!');
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
