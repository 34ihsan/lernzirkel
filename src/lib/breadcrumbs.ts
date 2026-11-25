import { getCachedPageById } from '@/lib/cached-content';
import type { BreadcrumbItem } from '@/components/common/Breadcrumbs';

type PageWithParent = {
  title: string;
  slug: string;
  parent?: { id: string; title: string; slug: string; parentId?: string | null } | null;
};

// Üst sayfa zincirini DB'den yürüyerek breadcrumb dizisi kurar.
// [...slug]/page.tsx (CMS catch-all) ile aynı mantık — tüm sayfalarda tutarlı olsun diye tek yerde.
export async function buildBreadcrumbTrail(page: PageWithParent): Promise<BreadcrumbItem[]> {
  const breadcrumbs: BreadcrumbItem[] = [];
  let currentParent = page.parent;

  while (currentParent) {
    breadcrumbs.unshift({ label: currentParent.title, url: `/${currentParent.slug}` });
    if (currentParent.parentId) {
      currentParent = await getCachedPageById(currentParent.parentId);
    } else {
      break;
    }
  }

  breadcrumbs.push({ label: page.title, url: `/${page.slug}`, isCurrent: true });
  return breadcrumbs;
}

// Parent'ı olmayan sabit route'lar için (ör. /kontakt, /karriere) basit 1 seviyeli breadcrumb.
export function staticBreadcrumb(label: string, url: string): BreadcrumbItem[] {
  return [{ label, url, isCurrent: true }];
}
