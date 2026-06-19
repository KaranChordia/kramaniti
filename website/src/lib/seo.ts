import type { Insight } from '@/data/insights';

export const SITE_URL = 'https://kramaniti.com';
export const SITE_NAME = 'Kramaniti';
export const DEFAULT_OG_IMAGE = '/assets/pwa/icon-512.png';

export function absoluteUrl(path: string) {
  return new URL(path, SITE_URL).toString();
}

export function stripInlineMarkup(value: string) {
  return value
    .replace(/<h3>|<\/h3>|<gold>|<\/gold>/g, '')
    .replace(/&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();
}

export function getInsightUrl(insight: Pick<Insight, 'slug'>) {
  return absoluteUrl(`/insights/${insight.slug}/`);
}

export function getInsightPublishedDate(insight: Pick<Insight, 'date' | 'publishedAt'>) {
  return insight.publishedAt ?? insight.date;
}

export function getInsightKeywords(insight: Pick<Insight, 'category' | 'focus' | 'title'>) {
  return [
    insight.category,
    insight.focus,
    'Kramaniti',
    'AI systems',
    'workflow strategy',
    'business operations',
    ...insight.title
      .split(/\s+/)
      .map((word) => word.replace(/[^\w-]/g, ''))
      .filter((word) => word.length > 4)
      .slice(0, 8),
  ];
}

export function getRelatedInsights(current: Insight, insights: Insight[], limit = 3) {
  return insights
    .filter((insight) => insight.slug !== current.slug)
    .map((insight) => {
      let score = 0;

      if (insight.category === current.category) {
        score += 3;
      }

      if (insight.focus === current.focus) {
        score += 2;
      }

      return { insight, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ insight }) => insight);
}

