'use client';
import React from 'react';
import styles from './Services.module.css';
import { Button } from '../ui/Button';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';
import { AnimatedHeading } from '../ui/AnimatedHeading';

const tiers = [
  {
    id: 1,
    title: 'Foundation Strategy',
    label: 'CLARITY',
    summary: 'For organizations requiring operational clarity before implementation.',
    deliverables: ['Business workflow audit', 'Bottleneck identification', 'AI readiness review', 'Recommended system architecture', 'Practical implementation roadmap'],
    ctaText: 'Book a Workflow Audit',
    isPopular: false
  },
  {
    id: 2,
    title: 'Systems Engineering',
    label: 'PRACTICAL BUILD',
    summary: 'For organizations ready to upgrade their workflows with practical infrastructure.',
    deliverables: ['Custom workflow design', 'Internal AI-assisted tools', 'CRM and process integrations', 'Team handoff documentation', 'Human-in-the-loop review protocols'],
    ctaText: 'Discuss a System Build',
    isPopular: true
  },
  {
    id: 3,
    title: 'Complete Lifecycle Retainer',
    label: 'CONTINUITY',
    summary: 'For brands seeking continuous alignment across systems, adoption, and content.',
    deliverables: ['System maintenance', 'Workflow improvements', 'Team support and training', 'Content and message direction', 'Regular progress reviews'],
    ctaText: 'Explore Ongoing Support',
    isPopular: false
  }
];

export function Services() {
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.1 });

  const handleCtaClick = () => {
    document.getElementById('contact')?.scrollIntoView();
  };

  const getCoordinate = (id: number) => {
    switch (id) {
      case 1: return '[01/CLARITY]';
      case 2: return '[02/BUILD]';
      case 3: return '[03/CONTINUITY]';
      default: return `[0${id}/SYSTEM]`;
    }
  };

  return (
    <section className={styles.services} id="services" ref={ref as React.RefObject<HTMLDivElement>}>
      <div className={styles.atmosphere} aria-hidden="true">
        <span className={`${styles.atmosWord} ${styles.atmosWordOne}`}>Offer</span>
        <span className={`${styles.atmosWord} ${styles.atmosWordTwo}`}>Build</span>
      </div>
      <div className={styles.container}>
        <div className={`${styles.header} ${isVisible ? styles.visible : ''}`}>
          <span className="micro-label">Services</span>
          <AnimatedHeading isVisible={isVisible}>Targeted solutions for your current stage of growth.</AnimatedHeading>
          <p className="text-secondary">Start with a strategic diagnosis, build the necessary infrastructure, and scale with an ongoing operational partnership.</p>
        </div>

        <div className={styles.servicesGrid}>
          {tiers.map((tier, index) => (
            <div 
              key={tier.id} 
              className={`${styles.tierColumn} ${tier.isPopular ? styles.popularTier : ''} ${isVisible ? styles.visible : ''}`}
              style={{ transitionDelay: isVisible ? `${index * 120}ms` : '0ms' }}
            >
              {tier.isPopular && <div className={styles.popularBadge}>RECOMMENDED</div>}
              
              <div className={styles.tierHeader}>
                <span className={styles.tierCoordinate}>{getCoordinate(tier.id)}</span>
                <span className="micro-label">{tier.label}</span>
                <h4>{tier.title}</h4>
                <p className={`${styles.summary} text-secondary caption`}>{tier.summary}</p>
              </div>
              
              <div className={styles.dividerLine}></div>
              
              <ul className={styles.deliverables}>
                {tier.deliverables.map((item, i) => (
                  <li key={i}>
                    <span className={styles.deliverableBullet}>+</span>
                    <span className="text-secondary caption">{item}</span>
                  </li>
                ))}
              </ul>
              
              <div className={styles.tierFooter}>
                <Button 
                  variant={tier.isPopular ? 'primary' : 'secondary'} 
                  className={styles.tierCta}
                  onClick={handleCtaClick}
                >
                  {tier.ctaText}
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className={`${styles.enablementPanel} ${isVisible ? styles.visible : ''}`}>
          <div className={styles.enablementCopy}>
            <span className="micro-label">AI Adoption</span>
            <h4>AI should empower your team, not replace human judgment.</h4>
            <p className="text-secondary caption">
              We guide your team through system adoption—defining where automation accelerates work and where human oversight remains essential.
            </p>
          </div>
          <div className={styles.enablementPrinciples} aria-label="AI enablement principles">
            <span>Automate repetitive work</span>
            <span>Use AI to support decisions</span>
            <span>Keep people in control where context and trust matter</span>
          </div>
        </div>
      </div>
    </section>
  );
}
