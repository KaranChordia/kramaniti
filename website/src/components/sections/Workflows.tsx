'use client';
import React, { useState } from 'react';
import styles from './Workflows.module.css';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';
import { AnimatedHeading } from '../ui/AnimatedHeading';

const steps = [
  {
    title: 'Diagnose reality',
    copy: 'Identify the workflow, handoff, decision loop, or message gap creating the most friction.'
  },
  {
    title: 'Define the operating logic',
    copy: 'Clarify what the business needs to do consistently before choosing tools or formats.'
  },
  {
    title: 'Design the system',
    copy: 'Map the simplest workflow, intelligence layer, and supporting process.'
  },
  {
    title: 'Build practical support',
    copy: 'Create the AI-assisted tools, documents, automations, or internal systems that make the workflow easier to run.'
  },
  {
    title: 'Enable adoption',
    copy: 'Train the team on usage, edge cases, override points, and handoffs so AI assists clearly while humans continue to lead the work.'
  },
  {
    title: 'Translate into presence',
    copy: 'Turn internal clarity into sharper brand communication, founder narrative, and useful content.'
  },
  {
    title: 'Refine continuously',
    copy: 'Review what is working, remove complexity, and keep the system aligned as the brand evolves.'
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
          <AnimatedHeading isVisible={isVisible}>From business reality to aligned growth system.</AnimatedHeading>
          <p className="text-secondary">Every engagement begins with how the business actually works. Only then do we design the systems, intelligence, and communication layer around it.</p>
        </div>

        <div className={`${styles.flowShell} ${isVisible ? styles.visible : ''}`}>
          <div className={styles.flowSummary}>
            <div className={styles.summaryItem}>
              <span className="micro-label">Input</span>
              <span className={styles.summaryValue}>Business Reality</span>
            </div>
            <div className={styles.summaryDivider}></div>
            <div className={styles.summaryItem}>
              <span className="micro-label">Process</span>
              <span className={styles.summaryValue}>Aligned Systems</span>
            </div>
            <div className={styles.summaryDivider}></div>
            <div className={styles.summaryItem}>
              <span className="micro-label">Output</span>
              <span className={styles.summaryValue}>Coherent Growth</span>
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
                <span>Reveal Full Process</span>
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
