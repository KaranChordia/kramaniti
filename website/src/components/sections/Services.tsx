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
    summary: 'For teams that need to see what is slowing the work before choosing a solution.',
    deliverables: ['Workflow audit', 'The bottleneck worth fixing', 'Where AI can genuinely help', 'What should stay human-led', 'A practical next-step plan'],
    ctaText: 'Start with an Audit',
    isPopular: true
  },
  {
    id: 2,
    title: 'Systems Engineering',
    label: 'BUILD',
    summary: 'For teams that know which workflow to improve and need practical support built around it.',
    deliverables: ['A clearer workflow', 'Practical internal tools', 'Useful AI support', 'Connections between existing tools', 'Simple handover and review rules'],
    ctaText: 'Discuss the Workflow',
    isPopular: false
  },
  {
    id: 3,
    title: 'Complete Lifecycle Retainer',
    label: 'KEEP IMPROVING',
    summary: 'For teams that want their systems, adoption, and communication to improve together.',
    deliverables: ['System care', 'Workflow improvements', 'Team support', 'Communication and content direction', 'Regular reviews'],
    ctaText: 'Explore Ongoing Work',
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
          <AnimatedHeading isVisible={isVisible}>Start with the problem in front of you.</AnimatedHeading>
          <p className="text-secondary">First understand the work. Then choose whether you need a clear plan, a practical build, or ongoing support.</p>
        </div>

        <div className={styles.servicesGrid}>
          {tiers.map((tier, index) => (
            <div 
              key={tier.id} 
              className={`${styles.tierColumn} ${tier.isPopular ? styles.popularTier : ''} ${isVisible ? styles.visible : ''}`}
              style={{ transitionDelay: isVisible ? `${index * 120}ms` : '0ms' }}
            >
              {tier.isPopular && <div className={styles.popularBadge}>START HERE</div>}
              
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
            <span className="micro-label">People stay in control</span>
            <h4>Use AI where it helps. Keep judgment with people.</h4>
            <p className="text-secondary caption">
              Every system makes the boundary clear: what AI can prepare, what people should review, and who makes the final call.
            </p>
          </div>
          <div className={styles.enablementPrinciples} aria-label="AI enablement principles">
            <span>Reduce repeated work</span>
            <span>Use AI to prepare and organize</span>
            <span>Keep people in charge of context and trust</span>
          </div>
        </div>
      </div>
    </section>
  );
}
