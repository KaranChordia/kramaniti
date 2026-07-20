'use client';
import React, { useState } from 'react';
import styles from './Workflows.module.css';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';
import { AnimatedHeading } from '../ui/AnimatedHeading';

const steps = [
  {
    title: 'Understand',
    copy: 'See how the work currently gets done.'
  },
  {
    title: 'Prioritise',
    copy: 'Choose the problem worth solving first.'
  },
  {
    title: 'Design',
    copy: 'Plan the simplest useful system.'
  },
  {
    title: 'Build',
    copy: 'Create the workflow, tool, or supporting documents.'
  },
  {
    title: 'Train',
    copy: 'Help the team use it with confidence.'
  },
  {
    title: 'Communicate',
    copy: 'Turn the new clarity into a stronger message.'
  },
  {
    title: 'Improve',
    copy: 'Review what works and remove what does not.'
  }
];

export function Workflows() {
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.1 });
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <section className={styles.workflows} id="workflows" ref={ref as React.RefObject<HTMLDivElement>}>
      <div className={styles.atmosphere} aria-hidden="true">
        <span className={`${styles.atmosWord} ${styles.atmosWordOne}`}>Flow</span>
        <span className={`${styles.atmosWord} ${styles.atmosWordTwo}`}>Run</span>
      </div>
      <div className={styles.container}>
        <div className={`${styles.header} ${isVisible ? styles.visible : ''}`}>
          <span className="micro-label">Process</span>
          <AnimatedHeading isVisible={isVisible}>A simple path from problem to working system.</AnimatedHeading>
          <p className="text-secondary">Every engagement starts with the way your business works today—not with a tool.</p>
        </div>

        <div className={`${styles.flowShell} ${isVisible ? styles.visible : ''}`}>
          <div className={styles.flowSummary}>
            <div className={styles.summaryItem}>
              <span className="micro-label">Input</span>
              <span className={styles.summaryValue}>Current Workflow</span>
            </div>
            <div className={styles.summaryDivider}></div>
            <div className={styles.summaryItem}>
              <span className="micro-label">Process</span>
              <span className={styles.summaryValue}>Practical Build</span>
            </div>
            <div className={styles.summaryDivider}></div>
            <div className={styles.summaryItem}>
              <span className="micro-label">Output</span>
              <span className={styles.summaryValue}>Clearer Work</span>
            </div>
          </div>

          <div className={styles.pipelineRailSequence}>
            <div className={styles.railLine}></div>
            {steps.map((step, index) => {
              const isHidden = index >= 3 && !isExpanded;
              const isBlurred = index === 2 && !isExpanded;

              return (
                <div 
                  className={`${styles.railNodeRow} ${index === 2 ? styles.activeNodeRow : ''} ${isVisible ? styles.visible : ''} ${isHidden ? styles.hiddenStep : ''} ${isBlurred ? styles.blurred : ''}`} 
                  key={step.title}
                  style={{ 
                    transitionDelay: isVisible 
                      ? (isExpanded && index >= 3 
                          ? `${(index - 3) * 120}ms` 
                          : (index < 3 ? `${index * 80}ms` : '0ms'))
                      : '0ms'
                  }}
                >
                  <div className={styles.nodePointContainer}>
                    <div className={styles.nodePoint}>
                      <span className={styles.nodeNumber}>{String(index + 1).padStart(2, '0')}</span>
                      <div className={styles.nodeGlowRing}></div>
                    </div>
                  </div>
                  <div className={styles.nodeContent}>
                    <h4>{step.title}</h4>
                    <p className="text-secondary caption">{step.copy}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {!isExpanded && (
            <div className={styles.revealButtonContainer}>
              <button 
                className={styles.revealButton} 
                onClick={() => setIsExpanded(true)}
                aria-label="Reveal full process steps"
              >
                <span>See the Full Process</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.chevronIcon}>
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
