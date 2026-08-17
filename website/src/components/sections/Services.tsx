'use client';
import React from 'react';
import { Check, Repeat, Search, Wrench } from 'lucide-react';
import styles from './Services.module.css';
import { BrandButton } from '../ui/BrandButton';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';
import { AnimatedHeading } from '../ui/AnimatedHeading';
import { IconMark } from '../ui/IconMark';
import { SectionKicker } from '../ui/SectionKicker';

const tiers = [
  {
    id: 1,
    title: 'Foundation Strategy',
    label: 'Clarity',
    summary: 'For organizations requiring operational clarity before implementation.',
    deliverables: ['Business workflow audit', 'Bottleneck identification', 'AI readiness review', 'Recommended system architecture', 'Practical implementation roadmap'],
    ctaText: 'Book a Workflow Audit',
    isPopular: false,
    icon: Search,
  },
  {
    id: 2,
    title: 'Systems Engineering',
    label: 'Practical build',
    summary: 'For organizations ready to upgrade their workflows with practical infrastructure.',
    deliverables: ['Custom workflow design', 'Internal AI-assisted tools', 'CRM and process integrations', 'Team handoff documentation', 'Human-in-the-loop review protocols'],
    ctaText: 'Discuss a System Build',
    isPopular: true,
    icon: Wrench,
  },
  {
    id: 3,
    title: 'Complete Lifecycle Retainer',
    label: 'Continuity',
    summary: 'For brands seeking continuous alignment across systems, adoption, and content.',
    deliverables: ['System maintenance', 'Workflow improvements', 'Team support and training', 'Content and message direction', 'Regular progress reviews'],
    ctaText: 'Explore Ongoing Support',
    isPopular: false,
    icon: Repeat,
  }
];

const enablementPrinciples = [
  'Automate repetitive work',
  'Use AI to support decisions',
  'Keep people in control where context and trust matter',
];

export function Services() {
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.1 });

  return (
    <section className={`${styles.services} home-section`} id="services" ref={ref as React.RefObject<HTMLDivElement>}>
      <div className={styles.atmosphere} aria-hidden="true">
        <span className={`${styles.atmosWord} ${styles.atmosWordOne}`}>Offer</span>
        <span className={`${styles.atmosWord} ${styles.atmosWordTwo}`}>Build</span>
      </div>
      <div className={`${styles.container} home-container`}>
        <div className={`${styles.header} home-header ${isVisible ? styles.visible : ''}`}>
          <SectionKicker>Services</SectionKicker>
          <AnimatedHeading isVisible={isVisible}>Targeted solutions for your current stage of growth.</AnimatedHeading>
          <p className="home-lede">Start with a strategic diagnosis, build the necessary infrastructure, and scale with an ongoing operational partnership.</p>
        </div>

        <div className={styles.servicesGrid}>
          {tiers.map((tier, index) => {
            const Icon = tier.icon;
            return (
            <div
              key={tier.id}
              className={`${styles.tierColumn} ${tier.isPopular ? styles.popularTier : ''} ${isVisible ? styles.visible : ''}`}
              style={{ transitionDelay: isVisible ? `${index * 120}ms` : '0ms' }}
            >
              {tier.isPopular && <div className={styles.popularBadge}>Recommended</div>}

              <div className={styles.tierHeader}>
                <div className={styles.tierMeta}>
                  <IconMark>
                    <Icon strokeWidth={1.75} />
                  </IconMark>
                  <span className={styles.tierCoordinate}>{String(tier.id).padStart(2, '0')}</span>
                </div>
                <span className="micro-label">{tier.label}</span>
                <h3 className={styles.tierTitle}>{tier.title}</h3>
                <p className={styles.summary}>{tier.summary}</p>
              </div>

              <div className={styles.dividerLine}></div>

              <ul className={styles.deliverables}>
                {tier.deliverables.map((item) => (
                  <li key={item}>
                    <Check className={styles.deliverableIcon} size={15} strokeWidth={1.75} aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <div className={styles.tierFooter}>
                <BrandButton
                  variant={tier.isPopular ? 'primary' : 'secondary'}
                  className={styles.tierCta}
                  onClick={() => document.getElementById('contact')?.scrollIntoView()}
                >
                  {tier.ctaText}
                </BrandButton>
              </div>
            </div>
            );
          })}
        </div>

        <div className={`${styles.enablementPanel} ${isVisible ? styles.visible : ''}`}>
          <div className={styles.enablementCopy}>
            <SectionKicker>AI Adoption</SectionKicker>
            <h3>AI should empower your team, not replace human judgment.</h3>
            <p className="home-lede">
              We guide your team through system adoption—defining where automation accelerates work and where human oversight remains essential.
            </p>
          </div>
          <div className={styles.enablementPrinciples} aria-label="AI enablement principles">
            {enablementPrinciples.map((principle) => (
              <span key={principle}>
                <Check size={15} strokeWidth={1.75} aria-hidden="true" />
                {principle}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
