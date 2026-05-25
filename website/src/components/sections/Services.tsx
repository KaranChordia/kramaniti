'use client';
import React from 'react';
import styles from './Services.module.css';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';

const tiers = [
  {
    id: 1,
    title: 'AI Strategy Consulting',
    price: '35,000/-',
    label: 'PER PROJECT',
    deliverables: ['Strategic Architecture', 'AI Stack Audit', 'Implementation Roadmap'],
    ctaText: 'Book Consulting',
    isPopular: false
  },
  {
    id: 2,
    title: 'AI Integration',
    price: '35,000/-',
    label: 'PER PROJECT',
    deliverables: ['Custom AI Agent Build', 'Workflow Automation', 'API Pipeline Integration'],
    ctaText: 'Scope Integration',
    isPopular: true
  },
  {
    id: 3,
    title: 'Creative Brand Kit',
    price: '45,000/-',
    label: 'PER PROJECT',
    deliverables: ['Visual Identity System', 'Design Tokens', 'Master Guidelines'],
    ctaText: 'Discuss Brand Kit',
    isPopular: false
  },
  {
    id: 4,
    title: 'Content Alignment / Branding',
    price: '25,000/-',
    label: 'PER PROJECT',
    deliverables: ['Narrative Positioning', 'Platform Strategy', 'Core Messaging'],
    ctaText: 'Align Content',
    isPopular: false
  },
  {
    id: 5,
    title: 'Content Director',
    price: '50,000/-',
    label: 'PER PROJECT',
    deliverables: ['End-to-End Direction', 'Team Orchestration', 'Production Oversight'],
    ctaText: 'Hire Director',
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
          <h2>Pricing & Services</h2>
          <p className="text-secondary">Transparent project rates. No hidden fees.</p>
        </div>

        <div className={styles.grid}>
          {tiers.map((tier, index) => (
            <Card 
              key={tier.id} 
              className={`${styles.tierCard} ${tier.isPopular ? styles.popularCard : ''} ${isVisible ? styles.visible : ''}`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              {tier.isPopular && <div className={styles.popularBadge}>RECOMMENDED</div>}
              
              <div className={styles.cardHeader}>
                <span className="micro-label">{tier.label}</span>
                <h4>{tier.title}</h4>
                <div className={styles.price}>{tier.price}</div>
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
