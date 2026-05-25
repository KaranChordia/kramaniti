'use client';
import React from 'react';
import styles from './Story.module.css';
import { Card } from '../ui/Card';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';

const epochs = [
  {
    number: '01',
    years: '2017 – 2019',
    title: 'Spatial Capture',
    description: 'Directing commercial cinematography and drone mapping for the rise of WeWork India and Hyatt Centric. Built distribution to 1,000+ YouTube subscribers and 15K Instagram followers documenting Bengaluru\'s co-working boom.',
    image: '/kramaniti/assets/epoch-1.png'
  },
  {
    number: '02',
    years: '2020 – 2023',
    title: 'Systems R&D',
    description: 'A deliberate withdrawal from public content to study the logic underneath. Three years deep inside backend systems, data architecture, and algorithmic environments — developing the systems-thinking that powers every workflow we build today.',
    image: '/kramaniti/assets/epoch-2.png'
  },
  {
    number: '03',
    years: '2023 – Present',
    title: 'Autonomous Architecture',
    description: 'Returned as an AI Architect — building custom GPTs, autonomous agent systems, and automated content engines for scaling startups and enterprise teams. From capturing reality with cameras to architecting it with code.',
    image: '/kramaniti/assets/epoch-3.png'
  }
];

export function Story() {
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.1, freezeOnceVisible: true });

  return (
    <section className={styles.story} id="story" ref={ref as React.RefObject<HTMLDivElement>}>
      <div className={styles.container}>
        <div className={`${styles.header} ${isVisible ? styles.visible : ''}`}>
          <h2>The System Behind the Story</h2>
          <p className="text-secondary">From physical capture to autonomous architecture.</p>
        </div>

        <div className={styles.timelineWrapper}>
          <div className={`${styles.timelineLine} ${isVisible ? styles.visibleLine : ''}`}></div>
          
          <div className={styles.epochsGrid}>
            {epochs.map((epoch, index) => (
              <div 
                key={epoch.number} 
                className={`${styles.epochColumn} ${isVisible ? styles.visible : ''}`} 
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                <div className={styles.epochNode}>
                  <span className={styles.epochNumber}>{epoch.number}</span>
                </div>
                
                <Card className={styles.epochCard}>
                  <div className={styles.epochImagePlaceholder}>
                    <img 
                      src={epoch.image} 
                      alt={epoch.title} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                  <div className={styles.epochMeta}>
                    <span className="micro-label">{epoch.years}</span>
                    <h4>{epoch.title}</h4>
                  </div>
                  <p className="text-secondary caption">{epoch.description}</p>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
