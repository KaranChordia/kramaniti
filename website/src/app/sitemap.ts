import type { MetadataRoute } from 'next';
import { libraryItems } from '@/lib/library/libraryData';
import { insights } from '@/data/insights';
import { absoluteUrl, getInsightPublishedDate } from '@/lib/seo';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: absoluteUrl('/'),
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: absoluteUrl('/insights/'),
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: absoluteUrl('/experience/'),
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: absoluteUrl('/founder/'),
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: absoluteUrl('/clarity-engine/'),
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: absoluteUrl('/library/'),
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: absoluteUrl('/clarity-square/'),
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.75,
    },
    {
      url: absoluteUrl('/work/'),
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: absoluteUrl('/work/nexocean/'),
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: absoluteUrl('/work/maitri/'),
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: absoluteUrl('/llms.txt'),
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.5,
    },
    {
      url: absoluteUrl('/llms-full.txt'),
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.5,
    },
  ];

  const insightRoutes: MetadataRoute.Sitemap = insights.map((insight) => ({
    url: absoluteUrl(`/insights/${insight.slug}/`),
    lastModified: new Date(getInsightPublishedDate(insight)),
    changeFrequency: 'monthly',
    priority: 0.75,
  }));

  return [...staticRoutes, ...insightRoutes, ...libraryItems.map(item => ({ url: absoluteUrl(`/library/resources/${item.id}`), changeFrequency: 'monthly' as const, priority: 0.6 })), { url: absoluteUrl('/library/collections/research-a-decision'), changeFrequency: 'monthly', priority: 0.6 }, { url: absoluteUrl('/library/standards'), changeFrequency: 'monthly', priority: 0.4 }];
}
