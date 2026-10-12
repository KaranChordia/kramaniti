import type { MetadataRoute } from 'next';
import { libraryItems } from '@/lib/library/libraryData';
import { insights } from '@/data/insights';
import { absoluteUrl, getInsightPublishedDate } from '@/lib/seo';

// lastModified uses the date the page's content last changed (from git history),
// not the build time. Update the date when a page's content changes.
const STATIC_ROUTES: Array<{
  path: string;
  lastModified: string;
  changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'];
  priority: number;
}> = [
  { path: '/', lastModified: '2026-08-29', changeFrequency: 'weekly', priority: 1 },
  { path: '/audit/', lastModified: '2026-10-12', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/build/', lastModified: '2026-10-12', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/retainer/', lastModified: '2026-10-12', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/experience/', lastModified: '2026-08-29', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/founder/', lastModified: '2026-08-29', changeFrequency: 'monthly', priority: 0.6 },
  { path: '/clarity-engine/', lastModified: '2026-08-29', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/kosh/', lastModified: '2026-10-12', changeFrequency: 'weekly', priority: 0.7 },
  { path: '/clarity-square/', lastModified: '2026-08-17', changeFrequency: 'weekly', priority: 0.75 },
  { path: '/work/', lastModified: '2026-08-29', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/work/nexocean/', lastModified: '2026-08-29', changeFrequency: 'monthly', priority: 0.6 },
  { path: '/work/maitri/', lastModified: '2026-08-29', changeFrequency: 'monthly', priority: 0.6 },
  { path: '/kosh/collections/research-a-decision/', lastModified: '2026-09-07', changeFrequency: 'monthly', priority: 0.6 },
  { path: '/kosh/standards/', lastModified: '2026-09-07', changeFrequency: 'monthly', priority: 0.4 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const insightDates = insights.map((insight) => new Date(getInsightPublishedDate(insight)).getTime());
  const latestInsight = new Date(Math.max(...insightDates));

  const staticRoutes: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: absoluteUrl(route.path),
    lastModified: new Date(route.lastModified),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  const insightsIndex: MetadataRoute.Sitemap = [
    { url: absoluteUrl('/insights/'), lastModified: latestInsight, changeFrequency: 'daily', priority: 0.9 },
  ];

  const insightRoutes: MetadataRoute.Sitemap = insights.map((insight) => ({
    url: absoluteUrl(`/insights/${insight.slug}/`),
    lastModified: new Date(getInsightPublishedDate(insight)),
    changeFrequency: 'monthly',
    priority: 0.75,
  }));

  const libraryRoutes: MetadataRoute.Sitemap = libraryItems.map((item) => ({
    url: absoluteUrl(`/kosh/${item.id}/`),
    lastModified: new Date(item.created),
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  return [...staticRoutes, ...insightsIndex, ...insightRoutes, ...libraryRoutes];
}
