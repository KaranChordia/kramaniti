'use client';
import React from 'react';
import styles from './Problem.module.css';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';
import { AnimatedHeading } from '../ui/AnimatedHeading';
import { KramanitiOrb } from '../ui/KramanitiOrb';

const signals = [
  {
    title: 'Work is scattered',
    copy: 'Important details sit across inboxes, spreadsheets, meetings, and people’s memory.',
  },
  {
    title: 'Follow-ups get missed',
    copy: 'The next step is unclear, ownership moves between people, and decisions take longer.',
  },
  {
    title: 'More tools add noise',
    copy: 'AI subscriptions pile up without making the workflow simpler or the work easier to trust.',
  }
];

export function Problem() {
  const [intersectionRef, isVisible] = useIntersectionObserver({ threshold: 0.05 });
  const sectionRef = intersectionRef as React.RefObject<HTMLElement | null>;

  return (
    <section
      className={styles.problem}
      id="problem"
      ref={sectionRef}
    >
      <div className={styles.atmosphere} aria-hidden="true">
        <span className={`${styles.atmosWord} ${styles.atmosWordOne}`}>Clarity</span>
        <span className={`${styles.atmosWord} ${styles.atmosWordTwo}`}>Focus</span>
      </div>

      <div className={styles.container}>
        <div className={`${styles.header} ${isVisible ? styles.visible : ''}`}>
          <span className="micro-label">The problem</span>
          <AnimatedHeading isVisible={isVisible}>More AI will not fix a broken way of working.</AnimatedHeading>
          <p className="text-secondary">
            Important work is often spread across inboxes, spreadsheets, meetings, and people&apos;s memory. Decisions take longer. Follow-ups get missed. New tools add more noise. We first understand how the work really happens. Then we find the bottleneck worth fixing.
          </p>
        </div>

        {/* Diverging Paths — text flows directly from the lines */}
        <div className={`${styles.divergeStage} ${isVisible ? styles.stageVisible : ''}`} aria-hidden="false">
          <div className={styles.searchOrb} aria-hidden="true">
            <KramanitiOrb state="searching" size={64} paused={!isVisible} />
          </div>
          <svg
            className={styles.divergeSvg}
            viewBox="0 0 1000 400"
            preserveAspectRatio="xMidYMid meet"
          >
            {/* Origin label */}
            <text x="56" y="206" className={styles.originLabel} textAnchor="middle">Your work</text>

            {/* Origin dot */}
            <circle cx="56" cy="220" r="24" className={styles.originRing} />

            {/* Stem */}
            <line x1="56" y1="220" x2="180" y2="220" className={styles.stemLine} />

            {/* Fork point */}
            <circle cx="180" cy="220" r="3.5" className={styles.forkDot} />

            {/* Path 1 — up */}
            <path d="M 180 220 C 260 220, 280 60, 380 60 L 540 60" className={styles.branchPath} style={{ '--branch-delay': '0' } as React.CSSProperties} />
            <circle cx="540" cy="60" r="4" className={styles.terminalDot} style={{ '--dot-delay': '0' } as React.CSSProperties} />

            {/* Path 2 — straight */}
            <path d="M 180 220 L 540 220" className={styles.branchPath} style={{ '--branch-delay': '1' } as React.CSSProperties} />
            <circle cx="540" cy="220" r="4" className={styles.terminalDot} style={{ '--dot-delay': '1' } as React.CSSProperties} />

            {/* Path 3 — down */}
            <path d="M 180 220 C 260 220, 280 370, 380 370 L 540 370" className={styles.branchPath} style={{ '--branch-delay': '2' } as React.CSSProperties} />
            <circle cx="540" cy="370" r="4" className={styles.terminalDot} style={{ '--dot-delay': '2' } as React.CSSProperties} />

            {/* Traveling beams */}
            <path d="M 180 220 C 260 220, 280 60, 380 60 L 540 60" className={styles.beamPath} style={{ '--beam-delay': '0' } as React.CSSProperties} />
            <path d="M 180 220 L 540 220" className={styles.beamPath} style={{ '--beam-delay': '1' } as React.CSSProperties} />
            <path d="M 180 220 C 260 220, 280 370, 380 370 L 540 370" className={styles.beamPath} style={{ '--beam-delay': '2' } as React.CSSProperties} />
          </svg>

          {/* Text flows directly from terminal dots — no cards */}
          <div className={styles.textLayer}>
            {signals.map((signal, index) => (
              <div
                key={signal.title}
                className={`${styles.flowText} ${styles[`flowText${index + 1}` as keyof typeof styles] || ''} ${isVisible ? styles.flowTextVisible : ''}`}
                style={{ '--text-delay': index } as React.CSSProperties}
              >
                <span className={styles.flowTitle}>{signal.title}</span>
                <span className={styles.flowDesc}>{signal.copy}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
