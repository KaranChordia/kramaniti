'use client';
import React from 'react';
import styles from './Services.module.css';
import { Button } from '../ui/Button';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';
import { AnimatedHeading } from '../ui/AnimatedHeading';

const tiers = [
  {
    id: 1,
    title: 'Workflow Audit',
    label: 'CLARITY',
    summary: 'For businesses that need to decide what to improve first.',
    deliverables: ['Business and workflow review', 'Bottleneck and handoff mapping', 'AI and tool readiness check', 'Recommended first system', 'Practical action plan'],
    ctaText: 'Book a Workflow Audit',
    isPopular: false
  },
  {
    id: 2,
    title: 'System Build',
    label: 'PRACTICAL BUILD',
    summary: 'For businesses ready to improve a real workflow with practical tools and AI support.',
    deliverables: ['Workflow design', 'Internal tools and AI support', 'CRM and process connections', 'Documentation and team handover', 'Human review and override rules'],
    ctaText: 'Discuss a System Build',
    isPopular: true
  },
  {
    id: 3,
    title: 'Ongoing Partnership',
    label: 'CONTINUITY',
    summary: 'For businesses that want continued support across systems, adoption, and communication.',
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
          <AnimatedHeading isVisible={isVisible}>Start with what your business needs now.</AnimatedHeading>
          <p className="text-secondary">Begin with a clear problem. Build the right system. Continue improving it as the business grows.</p>
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
            <h4>AI should support your team, not replace its judgment.</h4>
            <p className="text-secondary caption">
              We show your team how to use each system, when AI can help, and when a person should make the final decision.
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
