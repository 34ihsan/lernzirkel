import prisma from './src/lib/prisma';

async function main() {
  console.log('🔄 Eski Sayfalar (Pages) SEO Açıklamaları Güncelleniyor...');
  const pages = await prisma.page.findMany({
    where: {
      OR: [
        { description: null },
        { description: '' },
        { description: 'Otomatik eklenen sayfa' }
      ]
    }
  });

  let pagesUpdated = 0;
  for (const page of pages) {
    const autoDesc = `${page.title} - Lernzirkel Ludwigshafen e.V. Eğitim, danışmanlık ve entegrasyon projelerimizle yanınızdayız. Detaylı bilgi için sayfamızı inceleyin.`;
    await prisma.page.update({
      where: { id: page.id },
      data: { description: autoDesc }
    });
    pagesUpdated++;
    console.log(`✅ Page güncellendi: ${page.title}`);
  }

  console.log('🔄 Eski Makaleler (Articles) SEO Açıklamaları Güncelleniyor...');
  const articles = await prisma.article.findMany({
    where: {
      OR: [
        { excerpt: null },
        { excerpt: '' }
      ]
    }
  });

  let articlesUpdated = 0;
  for (const article of articles) {
    const autoExcerpt = `${article.title} makalesi. Eğitim, danışmanlık ve entegrasyon hakkındaki en güncel yazılarımızı okumak için hemen tıklayın.`;
    await prisma.article.update({
      where: { id: article.id },
      data: { excerpt: autoExcerpt }
    });
    articlesUpdated++;
    console.log(`✅ Article güncellendi: ${article.title}`);
  }

  console.log(`\n🎉 İşlem Tamamlandı!`);
  console.log(`- ${pagesUpdated} Sayfa güncellendi.`);
  console.log(`- ${articlesUpdated} Makale güncellendi.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
