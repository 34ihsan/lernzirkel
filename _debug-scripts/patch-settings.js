const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const settings = await prisma.siteSettings.findUnique({
    where: { id: 'global' },
  });

  const headerConfig = settings?.headerConfig || {};
  const footerConfig = settings?.footerConfig || {};

  // Find if Blog is already in header
  const hasHeaderBlog = headerConfig.navLinks?.some(link => link.url === '/blog');
  
  if (!hasHeaderBlog && headerConfig.navLinks) {
    headerConfig.navLinks.push({
      label: 'Blog & Wissen',
      url: '/blog',
    });
  }

  const hasFooterBlog = footerConfig.quickLinks?.links?.some(link => link.url === '/blog');
  if (!hasFooterBlog && footerConfig.quickLinks?.links) {
    footerConfig.quickLinks.links.push({
      label: 'Blog & Wissen',
      url: '/blog',
    });
  }

  await prisma.siteSettings.update({
    where: { id: 'global' },
    data: {
      headerConfig,
      footerConfig
    }
  });

  console.log('Successfully updated DB site settings to include Blog in menus.');
}

main().catch(console.error).finally(() => prisma.$disconnect());
