import { absoluteUrl, DEFAULT_OG_IMAGE, SITE_NAME } from '@/lib/seo';
import { HomepageSequence } from '../components/home/HomepageSequence';

export default function Home() {
  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: absoluteUrl('/'),
    logo: absoluteUrl(DEFAULT_OG_IMAGE),
    email: 'ask@kramaniti.com',
    description:
      'Kramaniti is a first-principles AI systems partner connecting strategy, operational infrastructure, and cinematic content into one brand growth pipeline.',
    founder: {
      '@type': 'Person',
      name: 'Karan Chordia',
    },
    knowsAbout: [
      'AI workflow audits',
      'practical AI systems',
      'workflow strategy',
      'business operations',
      'brand presence',
      'cinematic content',
    ],
  };
  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: absoluteUrl('/'),
    description:
      'Strategy-first AI systems, operating infrastructure, and cinematic content for brand growth.',
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationJsonLd).replace(/</g, '\\u003c'),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteJsonLd).replace(/</g, '\\u003c'),
        }}
      />
      <HomepageSequence />
    </>
  );
}
