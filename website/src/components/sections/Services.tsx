'use client';
import React from 'react';
import styles from './Services.module.css';
import { Card } from '../ui/Card';
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
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.1, freezeOnceVisible: true });

  const handleCtaClick = () => {
    document.getElementById('contact')?.scrollIntoView();
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

        <div className={styles.grid}>
          {tiers.map((tier, index) => (
            <Card 
              key={tier.id} 
              className={`glass-border-layer ${styles.tierCard} ${styles.serviceGlass} ${tier.isPopular ? styles.popularCard : ''} ${isVisible ? styles.visible : ''}`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              {tier.isPopular && <div className={styles.popularBadge}>RECOMMENDED</div>}
              
              <div className={styles.cardHeader}>
                <span className="micro-label">{tier.label}</span>
                <h4>{tier.title}</h4>
                <p className={`${styles.summary} text-secondary caption`}>{tier.summary}</p>
              </div>
              
              <ul className={styles.deliverables}>
                {tier.deliverables.map((item, i) => (
                  <li key={i}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-burnished-gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    <span className="text-secondary caption">{item}</span>
                  </li>
                ))}
              </ul>
              
              <div className={styles.cardFooter}>
                <Button 
                  variant={tier.isPopular ? 'primary' : 'secondary'} 
                  className={styles.tierCta}
                  onClick={handleCtaClick}
                >
                  {tier.ctaText}
                </Button>
              </div>
            </Card>
          ))}
        </div>

        <div className={`glass-border-layer ${styles.enablementLayer} ${styles.serviceGlass} ${isVisible ? styles.visible : ''}`}>
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
