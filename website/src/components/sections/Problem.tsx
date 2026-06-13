'use client';
import React, { useEffect, useState } from 'react';
import styles from './Problem.module.css';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';
import { AnimatedHeading } from '../ui/AnimatedHeading';

const signals = [
  {
    title: 'Operations drift',
    copy: 'Important workflows live inside inboxes, meetings, memory, and manual handoffs.',
  },
  {
    title: 'Intelligence stays scattered',
    copy: 'Decisions, data, tools, and AI experiments do not connect to one clear operating rhythm.',
  },
  {
    title: 'Presence becomes disconnected',
    copy: 'Content keeps moving, but the message no longer reflects how the business actually creates value.',
  }
];

export function Problem() {
  const [intersectionRef, isVisible] = useIntersectionObserver({ threshold: 0.05 });
  const sectionRef = intersectionRef as React.RefObject<HTMLElement | null>;
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const update = () => {
      const rect = section.getBoundingClientRect();
      const viewH = window.innerHeight;
      const total = rect.height + viewH;
      const raw = (viewH - rect.top) / total;
      setScrollProgress(Math.min(Math.max(raw, 0), 1));
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [sectionRef]);

  return (
    <section
      className={styles.problem}
      id="problem"
      ref={sectionRef}
      style={{ '--problem-scroll': scrollProgress } as React.CSSProperties}
    >
      <div className={styles.atmosphere} aria-hidden="true">
        <span className={`${styles.atmosWord} ${styles.atmosWordOne}`}>Clarity</span>
        <span className={`${styles.atmosWord} ${styles.atmosWordTwo}`}>Focus</span>
      </div>

      <div className={styles.container}>
        <div className={`${styles.header} ${isVisible ? styles.visible : ''}`}>
          <span className="micro-label">The problem</span>
          <AnimatedHeading isVisible={isVisible}>Most brands do not have an AI problem. They have a workflow alignment problem.</AnimatedHeading>
          <p className="text-secondary">
            Operations evolve one way. Tools get added another way. Content starts saying something the business cannot consistently deliver. Kramaniti fixes the foundation first, so the way your brand works, thinks, and communicates comes from the same operating logic.
          </p>
        </div>

        {/* Diverging Paths — text flows directly from the lines */}
        <div className={`${styles.divergeStage} ${isVisible ? styles.stageVisible : ''}`} aria-hidden="false">
          <svg
            className={styles.divergeSvg}
            viewBox="0 0 1000 400"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <filter id="softGlow">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <filter id="dotGlow">
                <feGaussianBlur stdDeviation="5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Origin label */}
            <text x="56" y="206" className={styles.originLabel} textAnchor="middle">Your brand</text>

            {/* Origin dot */}
            <circle cx="56" cy="220" r="24" className={styles.originRing} />
            <circle cx="56" cy="220" r="5" className={styles.originDot} filter="url(#dotGlow)" />

            {/* Stem */}
            <line x1="56" y1="220" x2="180" y2="220" className={styles.stemLine} />

            {/* Fork point */}
            <circle cx="180" cy="220" r="3.5" className={styles.forkDot} filter="url(#dotGlow)" />

            {/* Path 1 — up */}
            <path d="M 180 220 C 260 220, 280 60, 380 60 L 540 60" className={styles.branchPath} style={{ '--branch-delay': '0' } as React.CSSProperties} filter="url(#softGlow)" />
            <circle cx="540" cy="60" r="4" className={styles.terminalDot} style={{ '--dot-delay': '0' } as React.CSSProperties} filter="url(#dotGlow)" />

            {/* Path 2 — straight */}
            <path d="M 180 220 L 540 220" className={styles.branchPath} style={{ '--branch-delay': '1' } as React.CSSProperties} filter="url(#softGlow)" />
            <circle cx="540" cy="220" r="4" className={styles.terminalDot} style={{ '--dot-delay': '1' } as React.CSSProperties} filter="url(#dotGlow)" />

            {/* Path 3 — down */}
            <path d="M 180 220 C 260 220, 280 370, 380 370 L 540 370" className={styles.branchPath} style={{ '--branch-delay': '2' } as React.CSSProperties} filter="url(#softGlow)" />
            <circle cx="540" cy="370" r="4" className={styles.terminalDot} style={{ '--dot-delay': '2' } as React.CSSProperties} filter="url(#dotGlow)" />

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
