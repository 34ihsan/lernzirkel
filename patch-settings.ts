import prisma from './src/lib/prisma';

async function main() {
  const settings = await prisma.siteSettings.findUnique({
    where: { id: 'global' },
  });

  if (!settings) {
    console.log('No global settings found');
    return;
  }

  const headerConfig = settings.headerConfig as any || { navLinks: [] };
  const footerConfig = settings.footerConfig as any || { quickLinks: { links: [] } };

  // Find if Blog is already in header
  const hasHeaderBlog = headerConfig.navLinks?.some((link: any) => link.url === '/blog');
  
  if (!hasHeaderBlog && headerConfig.navLinks) {
    headerConfig.navLinks.push({
      label: 'Blog & Wissen',
      url: '/blog',
    });
  }

  const hasFooterBlog = footerConfig.quickLinks?.links?.some((link: any) => link.url === '/blog');
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
