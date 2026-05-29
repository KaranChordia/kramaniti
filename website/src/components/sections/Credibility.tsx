'use client';
import React, { useRef } from 'react';
import styles from './Credibility.module.css';
import { Card } from '../ui/Card';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';
import { AnimatedHeading } from '../ui/AnimatedHeading';

const cases = [
  {
    client: 'WeWork India',
    type: 'Selected experience',
    summary: 'Commercial media and spatial coverage connected to Bengaluru co-working expansion work, including inauguration and location-focused storytelling.'
  },
  {
    client: 'Hyatt Centric',
    type: 'Selected experience',
    summary: 'Hospitality content production experience shaped around premium space, visual clarity, and distribution-ready brand assets.'
  },
  {
    client: 'Nexocean',
    type: 'Selected experience',
    summary: 'Five-month contract support across internal workflow tools and brand content for a workforce consulting environment.'
  }
];

const ecosystems = [
  {
    category: 'Co-working',
    detail: 'Space-led storytelling and operational context'
  },
  {
    category: 'Hospitality',
    detail: 'Premium content standards and customer-facing communication'
  },
  {
    category: 'Education',
    detail: 'Clear knowledge packaging and digital communication'
  },
  {
    category: 'Startup & B2B tech',
    detail: 'Workflow clarity, internal tools, and founder-led messaging'
  }
];

export function Credibility() {
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.1, freezeOnceVisible: true });
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -400, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 400, behavior: 'smooth' });
    }
  };

  return (
    <section className={styles.credibility} id="credibility" ref={ref as React.RefObject<HTMLDivElement>}>
      <div className={styles.atmosphere} aria-hidden="true">
        <span className={`${styles.atmosWord} ${styles.atmosWordOne}`}>Proof</span>
        <span className={`${styles.atmosWord} ${styles.atmosWordTwo}`}>Trust</span>
      </div>
      <div className={styles.container}>
        <div className={`${styles.header} ${isVisible ? styles.visible : ''}`}>
          <span className="micro-label">Proof</span>
          <AnimatedHeading isVisible={isVisible}>Credibility without inflated claims.</AnimatedHeading>
          <p className="text-secondary">Experience across co-working, hospitality, education, startup, and B2B technology ecosystems.</p>
        </div>

        <div className={`${styles.carouselWrapper} ${isVisible ? styles.visible : ''}`}>
          <button className={`${styles.scrollBtn} ${styles.leftBtn}`} onClick={scrollLeft} aria-label="Scroll left">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
          </button>
          
          <div className={styles.carousel} ref={scrollRef}>
            {cases.map((study, index) => (
              <Card key={index} className={styles.caseCard}>
                <div className={styles.caseHeader}>
                  <h3>{study.client}</h3>
                  <span className="micro-label">{study.type}</span>
                </div>
                <p className="text-secondary caption">{study.summary}</p>
              </Card>
            ))}
          </div>

          <button className={`${styles.scrollBtn} ${styles.rightBtn}`} onClick={scrollRight} aria-label="Scroll right">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </button>
        </div>
      </div>

      <div className={`${styles.numbersStrip} ${isVisible ? styles.visible : ''}`}>
        <div className={styles.numbersContainer}>
          {ecosystems.map((item, index) => (
            <React.Fragment key={item.category}>
              <div className={styles.numberItem}>
                <span className={styles.number}>{item.category}</span>
                <span className={styles.numberLabel}>{item.detail}</span>
              </div>
              {index < ecosystems.length - 1 && <div className={styles.numberDivider}></div>}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}
