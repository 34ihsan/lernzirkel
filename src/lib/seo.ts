import type { Metadata } from 'next';

export const siteConfig = {
  name: 'Lernzirkel Ludwigshafen e.V.',
  description: 'Bildung, Beratung und soziale Projekte in Ludwigshafen am Rhein. Wir unterstützen Kinder, Jugendliche und Erwachsene auf ihrem Bildungsweg.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://www.lernzirkel-ludwigshafen.de',
  ogImage: '/logo.png', // Fallback, usually overwritten per page
  links: {
    twitter: 'https://twitter.com/lernzirkel', // example, can be updated
    facebook: 'https://facebook.com/lernzirkel',
    instagram: 'https://instagram.com/lernzirkel',
  },
};

/**
 * Helper to generate SEO metadata per page.
 */
export function constructMetadata({
  title,
  description = siteConfig.description,
  image = siteConfig.ogImage,
  noIndex = false,
  url = siteConfig.url,
}: {
  title?: string;
  description?: string;
  image?: string;
  noIndex?: boolean;
  url?: string;
} = {}): Metadata {
  return {
    metadataBase: new URL(siteConfig.url),
    title: title ? `${title} | ${siteConfig.name}` : siteConfig.name,
    description,
    openGraph: {
      title: title ? `${title} | ${siteConfig.name}` : siteConfig.name,
      description,
      url,
      siteName: siteConfig.name,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title ? title : siteConfig.name,
        },
      ],
      locale: 'de_DE',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: title ? `${title} | ${siteConfig.name}` : siteConfig.name,
      description,
      images: [image],
      creator: '@lernzirkel',
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    alternates: {
      canonical: url,
    },
  };
}

/**
 * Generate Organization JSON-LD Schema
 */
export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'NGO',
    name: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}/logo.png`,
    description: siteConfig.description,
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Mundenheimer Str. 239', // update with actual if known
      addressLocality: 'Ludwigshafen am Rhein',
      postalCode: '67061',
      addressCountry: 'DE',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+49-621-123456', // dummy, should be configured
      contactType: 'customer service',
      email: 'info@lernzirkel-ludwigshafen.de',
      areaServed: 'DE',
      availableLanguage: ['German', 'Turkish'],
    },
    sameAs: Object.values(siteConfig.links),
  };
}

/**
 * Generate BreadcrumbList JSON-LD Schema
 */
export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${siteConfig.url}${item.url}`,
    })),
  };
}

/**
 * Generate Course JSON-LD Schema
 */
export function generateCourseSchema(course: {
  id: string;
  title: string;
  description: string;
  providerName?: string;
  url: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: course.title,
    description: course.description,
    url: `${siteConfig.url}${course.url}`,
    provider: {
      '@type': 'Organization',
      name: course.providerName || siteConfig.name,
      sameAs: siteConfig.url,
    },
  };
}
