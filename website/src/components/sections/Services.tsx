'use client';
import React from 'react';
import styles from './Services.module.css';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';

const tiers = [
  {
    id: 1,
    title: 'Foundation Strategy',
    price: '₹75K - ₹1.5L',
    label: 'DEEP ANALYSIS',
    deliverables: ['Business deep-dive', 'AI implementation roadmap', 'Brand vision alignment'],
    ctaText: 'Book an Audit',
    isPopular: false
  },
  {
    id: 2,
    title: 'Systems Engineering',
    price: '₹3L - ₹6L',
    label: 'AGENTIC BUILD',
    deliverables: ['Custom workflow creation', 'Agentic tool deployment', 'Operational tech integration'],
    ctaText: 'Scope the Build',
    isPopular: true
  },
  {
    id: 3,
    title: 'The Complete Lifecycle',
    price: '₹1.2L - ₹2.5L/mo',
    label: 'UNIFIED PIPELINE',
    deliverables: ['Strategy & Systems maintenance', 'Cinematic content production', 'Coherent brand presence'],
    ctaText: 'Explore Retainer',
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
          <span className="micro-label">Offer Ladder</span>
          <h2>Engaging the Pipeline</h2>
          <p className="text-secondary">Enter the pipeline at the stage your brand needs most.</p>
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
