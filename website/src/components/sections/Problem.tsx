'use client';
import React from 'react';
import styles from './Problem.module.css';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';

const signals = [
  {
    title: 'Tools are scattered',
    copy: 'Teams experiment with AI, forms, documents, and content tools without one operating rhythm.'
  },
  {
    title: 'Workflows are unclear',
    copy: 'The highest-impact processes stay hidden inside inboxes, meetings, and manual handoffs.'
  },
  {
    title: 'Content loses the plot',
    copy: 'Marketing output grows, but the brand message does not stay connected to how the business works.'
  }
];

export function Problem() {
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.1, freezeOnceVisible: true });

  return (
    <section className={styles.problem} id="problem" ref={ref as React.RefObject<HTMLDivElement>}>
      <div className={styles.atmosphere} aria-hidden="true">
        <span className={`${styles.atmosWord} ${styles.atmosWordOne}`}>Clarity</span>
        <span className={`${styles.atmosWord} ${styles.atmosWordTwo}`}>Focus</span>
      </div>

      <div className={styles.container}>
        <div className={`${styles.header} ${isVisible ? styles.visible : ''}`}>
          <span className="micro-label">The problem</span>
          <h2>Most brands do not have an AI problem. They have a workflow clarity problem.</h2>
          <p className="text-secondary">
            Strategy, operations, and content often grow in separate directions. Kramaniti helps fix the foundation first, so every system you build has a clear business reason.
          </p>
        </div>

        <div className={styles.grid}>
          {signals.map((signal, index) => (
            <article
              key={signal.title}
              className={`${styles.signal} ${isVisible ? styles.visible : ''}`}
              style={{ transitionDelay: `${index * 140}ms` }}
            >
              <span className={styles.index}>{`0${index + 1}`}</span>
              <h3>{signal.title}</h3>
              <p className="text-secondary caption">{signal.copy}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
