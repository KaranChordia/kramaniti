'use client';
import React from 'react';
import styles from './Problem.module.css';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';
import { AnimatedHeading } from '../ui/AnimatedHeading';

const signals = [
  {
    step: '01',
    label: 'A request',
    title: 'Work is scattered',
    copy: 'Important details sit across inboxes, spreadsheets, meetings, and people’s memory.',
  },
  {
    step: '02',
    label: 'A decision',
    title: 'Follow-ups get missed',
    copy: 'The next step is unclear, ownership moves between people, and decisions take longer.',
  },
  {
    step: '03',
    label: 'A next step',
    title: 'More tools add noise',
    copy: 'New software creates another place to look without making the workflow simpler.',
  }
];

export function Problem() {
  const [intersectionRef, isVisible] = useIntersectionObserver({ threshold: 0.1 });
  const sectionRef = intersectionRef as React.RefObject<HTMLElement | null>;

  return (
    <section className={styles.problem} id="problem" ref={sectionRef}>
      <div className={styles.container}>
        <div className={`${styles.header} ${isVisible ? styles.visible : ''}`}>
          <span className="micro-label">The problem</span>
          <AnimatedHeading isVisible={isVisible}>
            When work is unclear inside, the business cannot feel coherent outside.
          </AnimatedHeading>
          <p className="text-secondary">
            Important work gets split across conversations, spreadsheets, tools, and memory. Decisions slow down, follow-ups disappear, and new software often adds another place to look.
          </p>
          <p className={styles.signalNote}>More AI will not fix a broken way of working.</p>
        </div>

        <div className={`${styles.workTrail} ${isVisible ? styles.trailVisible : ''}`}>
          <p className={styles.trailLabel}>One piece of work, losing its way</p>
          <div className={styles.trailFragments}>
            {signals.map((signal, index) => (
              <React.Fragment key={signal.step}>
                <article className={`${styles.fragment} ${styles[`fragment${index + 1}` as keyof typeof styles] || ''}`}>
                  <div className={styles.fragmentMeta}>
                    <span>{signal.step}</span>
                    <span>{signal.label}</span>
                  </div>
                  <div className={styles.fragmentSurface} aria-hidden="true">
                    {index === 0 && <><span className={styles.requestLine} /><span className={`${styles.requestLine} ${styles.requestLineShort}`} /></>}
                    {index === 1 && <><span className={styles.decisionWord}>Decided</span><span className={styles.ownerLine}>Owner</span></>}
                    {index === 2 && <><span className={styles.toolChip}>Tool</span><span className={`${styles.toolChip} ${styles.toolChipOffset}`}>Tool</span><span className={`${styles.toolChip} ${styles.toolChipFaint}`}>Tool</span></>}
                  </div>
                  <h3>{signal.title}</h3>
                  <p>{signal.copy}</p>
                </article>
                {index < signals.length - 1 && <div className={styles.trailBreak} aria-hidden="true"><span /></div>}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
