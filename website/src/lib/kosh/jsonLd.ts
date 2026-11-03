import { absoluteUrl, KOSH_URL, productUrl, SITE_NAME } from '@/lib/seo';
import { libraryItems, kindLabels, type LibraryItem } from '@/lib/library/libraryData';

// Structured data for Kosh pages. Built only from data the pages already show.
// No ratings, reviews or licence claims: reuse terms are not yet published.

const publisher = {
  '@type': 'Organization',
  name: SITE_NAME,
  url: absoluteUrl('/'),
};

const koshCrumb = { '@type': 'ListItem', position: 1, name: 'Kosh', item: productUrl(KOSH_URL) };

function breadcrumb(name: string, path: string) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: [koshCrumb, { '@type': 'ListItem', position: 2, name, item: productUrl(KOSH_URL, path.replace(/^\/kosh/, '') || '/') }],
  };
}

export function resourcePath(id: string) {
  return `/kosh/${id}/`;
}

function resourceUrl(id: string) {
  return productUrl(KOSH_URL, `/${id}/`);
}

export function koshLandingJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Kramaniti Kosh',
    url: productUrl(KOSH_URL),
    description:
      'Practical templates and guides for research, workflows and accountable AI, with examples and setup guidance.',
    publisher,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: libraryItems.length,
      itemListElement: libraryItems.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.title,
        url: resourceUrl(item.id),
      })),
    },
  };
}

export function koshResourceJsonLd(item: LibraryItem) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CreativeWork',
        name: item.title,
        description: item.summary,
        url: resourceUrl(item.id),
        genre: kindLabels[item.kind],
        datePublished: item.created,
        isAccessibleForFree: true,
        inLanguage: 'en',
        publisher,
        isPartOf: { '@type': 'CollectionPage', name: 'Kramaniti Kosh', url: productUrl(KOSH_URL) },
      },
      breadcrumb(item.title, resourcePath(item.id)),
    ],
  };
}

export function koshPageJsonLd(name: string, path: string, description: string, type = 'WebPage') {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': type, name, description, url: productUrl(KOSH_URL, path.replace(/^\/kosh/, '') || '/'), publisher },
      breadcrumb(name, path),
    ],
  };
}
