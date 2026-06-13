'use client';
import React from 'react';
import styles from './Services.module.css';
import { Button } from '../ui/Button';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';
import { AnimatedHeading } from '../ui/AnimatedHeading';

const tiers = [
  {
    id: 1,
    title: 'Foundation Alignment Audit',
    label: 'CLARITY',
    summary: 'For brands that need clarity before adding tools, AI, or content volume.',
    deliverables: ['Business and workflow deep-dive', 'Operational bottleneck mapping', 'AI and tool readiness review', 'Alignment gaps across operations, intelligence, and presence', 'Practical roadmap for the first system worth building'],
    ctaText: 'Book an Alignment Audit',
    isPopular: false
  },
  {
    id: 2,
    title: 'Intelligence System Build',
    label: 'PRACTICAL BUILD',
    summary: 'For brands ready to turn operational clarity into practical workflows, internal tools, and decision-support systems people can actually use.',
    deliverables: ['Workflow architecture', 'Practical AI-assisted systems', 'CRM, documentation, and process integrations', 'Internal tool design', 'Usage documentation, override rules, and human review checkpoints'],
    ctaText: 'Scope the First System',
    isPopular: true
  },
  {
    id: 3,
    title: 'Alignment Retainer',
    label: 'CONTINUITY',
    summary: 'For brands that want their systems, workflows, adoption habits, and brand communication to keep improving together.',
    deliverables: ['System refinement and maintenance', 'Workflow optimization', 'Adoption support and team enablement', 'Content and narrative direction', 'Monthly alignment review'],
    ctaText: 'Explore Ongoing Alignment',
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
          <AnimatedHeading isVisible={isVisible}>Choose the level of alignment your brand needs.</AnimatedHeading>
          <p className="text-secondary">Start by clarifying how the business works, then build the systems and communication layer that help it operate and grow with coherence.</p>
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
            <span className="micro-label">AI Enablement & Adoption</span>
            <h4>Human-collaborative, not fully automated.</h4>
            <p className="text-secondary caption">
              We help your team understand, adopt, and use the intelligent systems created for your brand. The work defines when AI should assist, when people should override it, and which decisions must remain human-led.
            </p>
          </div>
          <div className={styles.enablementPrinciples} aria-label="AI enablement principles">
            <span>Automated where useful</span>
            <span>AI-assisted where judgment needs support</span>
            <span>Human-led where trust, context, or taste matters</span>
          </div>
        </div>
      </div>
    </section>
  );
}

