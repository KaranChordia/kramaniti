'use client';
import React, { useRef } from 'react';
import styles from './Credibility.module.css';
import { Card } from '../ui/Card';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';

const cases = [
  {
    client: 'WeWork India',
    type: 'Commercial Videography Vendor',
    summary: 'Directed cinematic inaugural coverage for WeWork Galaxy, Vaishnavi Signature, ITI Limited, and RMZ Latitude locations across Bengaluru. Produced aerial drone mapping and brand content during the 2017-2019 Indian co-working expansion.'
  },
  {
    client: 'Hyatt Centric',
    type: 'Commercial Content Production',
    summary: 'Produced cinematic brand content and drone footage for the Hyatt Centric property, translating luxury hospitality aesthetics into digital distribution-ready video assets.'
  },
  {
    client: 'Nexocean',
    type: 'Internal Automation & Content',
    summary: 'Built internal automation tools for the workforce consulting team and produced digital marketing assets over a 5-month contract engagement.'
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
          <h2>Trusted By</h2>
          <p className="text-secondary">Verified work across media, automation, and internal tooling.</p>
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
          <div className={styles.numberItem}>
            <span className={styles.number}>1,050+</span>
            <span className={styles.numberLabel}>YouTube subscribers</span>
          </div>
          <div className={styles.numberDivider}></div>
          <div className={styles.numberItem}>
            <span className={styles.number}>15K+</span>
            <span className={styles.numberLabel}>Instagram followers</span>
          </div>
          <div className={styles.numberDivider}></div>
          <div className={styles.numberItem}>
            <span className={styles.number}>4+</span>
            <span className={styles.numberLabel}>Years B2B media</span>
          </div>
          <div className={styles.numberDivider}></div>
          <div className={styles.numberItem}>
            <span className={styles.number}>3+</span>
            <span className={styles.numberLabel}>Years R&D</span>
          </div>
        </div>
      </div>
    </section>
  );
}
