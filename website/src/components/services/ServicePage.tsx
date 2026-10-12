import type { Metadata } from 'next';
import Link from 'next/link';
import { Navbar } from '../layout/Navbar';
import { Footer } from '../layout/Footer';
import { DEFAULT_OG_IMAGE, SITE_NAME, absoluteUrl } from '../../lib/seo';
import { services, servicePath, type Service } from '../../data/services';
import styles from '../../app/founder/Founder.module.css';

export function getService(slug: Service['slug']) {
  return services.find((service) => service.slug === slug)!;
}

export function serviceMetadata(slug: Service['slug']): Metadata {
  const service = getService(slug);
  const url = absoluteUrl(servicePath(slug));
  const title = `${service.title} | Kramaniti`;
  return {
    title,
    description: `${service.summary} ${service.outputs}`,
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
      url,
      siteName: SITE_NAME,
      title,
      description: service.summary,
      images: [{ url: absoluteUrl(DEFAULT_OG_IMAGE), width: 512, height: 512, alt: `${SITE_NAME} mark` }],
    },
  };
}

export function ServicePage({ slug }: { slug: Service['slug'] }) {
  const service = getService(slug);
  const url = absoluteUrl(servicePath(slug));
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Service',
        name: service.title,
        description: service.summary,
        url,
        serviceType: service.title,
        provider: { '@type': 'Organization', name: SITE_NAME, url: absoluteUrl('/') },
        areaServed: 'Bengaluru',
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: SITE_NAME, item: absoluteUrl('/') },
          { '@type': 'ListItem', position: 2, name: service.title, item: url },
        ],
      },
    ],
  };
  const others = services.filter((other) => other.slug !== slug);

  return (
    <>
      <Navbar />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />
      <main className={styles.main}>
        <section className={styles.heroSection}>
          <div className={styles.container}>
            <div className={styles.heroIntro}>
              <span className={styles.eyebrow}>{service.coordinate} {service.label}</span>
              <h1>{service.title}</h1>
              <p className={styles.lead}>{service.summary}</p>
              <div className={styles.heroPills}>
                {service.deliverables.map((item) => (
                  <span key={item} className={styles.heroPill}>{item}</span>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className={styles.sectionBlock}>
          <div className={styles.container}>
            <div className={styles.sectionHeader}>
              <span className="micro-label">Services</span>
              <h2>Start with the problem in front of you.</h2>
              <p className={styles.sectionLead}>{service.outputs}</p>
            </div>
            <div className={styles.principleGrid}>
              {service.steps.map((step) => (
                <article key={step.index} className={styles.principleCard}>
                  <span className={styles.principleIndex}>{step.index}</span>
                  <h3>{step.title}</h3>
                  <p>{step.copy}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {service.extra && (
          <section className={styles.sectionBlock}>
            <div className={styles.container}>
              <div className={styles.sectionHeader}>
                <h2>{service.extra.heading}</h2>
                <p className={styles.sectionLead}>{service.extra.copy}</p>
              </div>
              <div className={styles.tagRow}>
                {service.extra.points.map((point) => (
                  <span key={point} className={styles.tag}>{point}</span>
                ))}
              </div>
            </div>
          </section>
        )}

        <section className={styles.sectionBlock}>
          <div className={styles.container}>
            <div className={styles.sectionHeader}>
              <span className="micro-label">People stay in control</span>
              <h2>Use AI where it helps. Keep judgment with people.</h2>
              <p className={styles.sectionLead}>
                Every system makes the boundary clear: what AI can prepare, what people should review, and who makes the final call.
              </p>
            </div>
            <article className={styles.summaryCard}>
              <Link href="/#contact" className={styles.summaryLink}>{service.ctaText}</Link>
            </article>
            <div className={styles.tagRow}>
              {others.map((other) => (
                <Link key={other.slug} href={servicePath(other.slug)} className={styles.tag}>{other.title}</Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
