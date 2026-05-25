'use client';
import React from 'react';
import styles from './Services.module.css';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';

const tiers = [
  {
    id: 1,
    title: 'AI Workflow Audit',
    label: 'ENTRY POINT',
    deliverables: ['AI Stack Map', '1 Prototype Spec', 'Strategy Blueprint PDF'],
    ctaText: 'Book a Discovery Call',
    isPopular: false
  },
  {
    id: 2,
    title: 'Founder Narrative Kit',
    label: 'CORE PROJECT',
    deliverables: ['1 Hero Video', '5 Social Shorts', 'Repurposing Kit (3 blogs, 1 newsletter, 5 threads)'],
    ctaText: 'Discuss Your Story',
    isPopular: false
  },
  {
    id: 3,
    title: 'Autonomous Agent Build',
    label: 'PREMIUM BUILD',
    deliverables: ['1 Custom AI Agent', '1 API Pipeline', 'Training & Handoff Playbook'],
    ctaText: 'Scope Your Build',
    isPopular: true
  },
  {
    id: 4,
    title: 'Content Engine Retainer',
    label: 'ONGOING',
    deliverables: ['Weekly content assets', 'Monthly analytics dashboard', 'Pipeline optimization'],
    ctaText: 'Explore the Retainer',
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
      <div className={styles.container}>
        <div className={`${styles.header} ${isVisible ? styles.visible : ''}`}>
          <h2>What We Build</h2>
          <p className="text-secondary">Four tiers of engagement. From a focused audit to a full-service content engine.</p>
        </div>

        <div className={styles.grid}>
          {tiers.map((tier, index) => (
            <Card 
              key={tier.id} 
              className={`${styles.tierCard} ${tier.isPopular ? styles.popularCard : ''} ${isVisible ? styles.visible : ''}`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              {tier.isPopular && <div className={styles.popularBadge}>HIGH IMPACT</div>}
              
              <div className={styles.cardHeader}>
                <span className="micro-label">{tier.label}</span>
                <h4>{tier.title}</h4>
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
      </div>
    </section>
  );
}
