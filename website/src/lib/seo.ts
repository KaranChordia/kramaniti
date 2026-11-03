import type { Insight } from '@/data/insights';

export const SITE_URL = 'https://www.kramaniti.com';
export const SITE_NAME = 'Kramaniti';
export const DEFAULT_OG_IMAGE = '/assets/pwa/icon-512.png';
export const KOSH_URL = 'https://kosh.kramaniti.com';
export const SPASHT_URL = 'https://spasht.kramaniti.com';

// Shared Open Graph base, so page-level openGraph overrides keep the image.
export const OG_BASE = {
  type: 'website' as const,
  siteName: SITE_NAME,
  images: [{ url: new URL(DEFAULT_OG_IMAGE, SITE_URL).toString(), width: 512, height: 512, alt: `${SITE_NAME} mark` }],
};

// Rewrites root-relative links inside Kosh Markdown: old /kosh/<id>/ paths go to the
// clean Kosh path, and main-site paths become absolute www URLs with a trailing slash.
export function koshContentHref(href: string) {
  if (!href.startsWith('/') || href.startsWith('//')) return href;
  if (/^\/kosh(?=\/|$)/.test(href)) return koshUrl(href);
  const m = href.match(/^([^?#]*)(.*)$/);
  let path = m ? m[1] : href;
  const rest = m ? m[2] : '';
  if (path && !path.endsWith('/') && !/\.[a-z0-9]+$/i.test(path)) path += '/';
  return new URL(path + rest, SITE_URL).toString();
}

export function absoluteUrl(path: string) {
  return new URL(path, SITE_URL).toString();
}

export function productUrl(origin: string, path = '/') {
  return new URL(path, `${origin}/`).toString();
}

// Absolute URL on the Kosh host for a Kosh path. Accepts old /kosh/... paths and
// returns the clean path, so links never point at the /kosh prefix.
export function koshUrl(path = '/') {
  const clean = path.replace(/^\/kosh(?=\/|#|\?|$)/, '') || '/';
  return productUrl(KOSH_URL, clean.startsWith('/') ? clean : `/${clean}`);
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

