'use client';
import React from 'react';
import styles from './Workflows.module.css';
import { Card } from '../ui/Card';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';
import { AnimatedHeading } from '../ui/AnimatedHeading';

const steps = [
  {
    title: 'Diagnose',
    copy: 'Find the workflow, handoff, or decision loop creating the most friction.'
  },
  {
    title: 'Design',
    copy: 'Map the simplest operating path before choosing tools or integrations.'
  },
  {
    title: 'Build',
    copy: 'Create practical AI support around the processes that clearly matter.'
  },
  {
    title: 'Train',
    copy: 'Document usage, edge cases, and handoff notes so the team can adopt it.'
  },
  {
    title: 'Communicate',
    copy: 'Turn the new clarity into brand content that explains the value well.'
  },
  {
    title: 'Improve',
    copy: 'Review what is working, refine the workflow, and keep the system useful.'
  }
];

export function Workflows() {
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.1, freezeOnceVisible: true });

  return (
    <section className={styles.workflows} id="workflows" ref={ref as React.RefObject<HTMLDivElement>}>
      <div className={styles.atmosphere} aria-hidden="true">
        <span className={`${styles.atmosWord} ${styles.atmosWordOne}`}>Flow</span>
        <span className={`${styles.atmosWord} ${styles.atmosWordTwo}`}>Run</span>
      </div>
      <div className={styles.container}>
        <div className={`${styles.header} ${isVisible ? styles.visible : ''}`}>
          <span className="micro-label">How it works</span>
          <AnimatedHeading isVisible={isVisible}>A clear path from business problem to working system.</AnimatedHeading>
          <p className="text-secondary">The engagement is designed to reduce confusion, build trust, and keep every output connected to the work your brand actually does.</p>
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
              <span className={styles.summaryValue}>Focused Workflow</span>
            </div>
            <div className={styles.summaryDivider}></div>
            <div className={styles.summaryItem}>
              <span className="micro-label">Output</span>
              <span className={styles.summaryValue}>Useful Growth System</span>
            </div>
          </div>

          <div className={styles.pipelineContainer}>
            {steps.map((step, index) => (
              <div className={styles.pipelineNode} key={step.title}>
                <div className={styles.nodeIconWrapper}>
                  <span className={styles.nodeIcon}>{String(index + 1).padStart(2, '0')}</span>
                </div>
                <Card className={`${styles.nodeCard} ${index === 2 ? styles.primaryCard : ''}`}>
                  {index === 2 && <div className={styles.glowOverlay}></div>}
                  <div className={styles.nodeBar}></div>
                  <h4>{step.title}</h4>
                  <p className="text-secondary caption">{step.copy}</p>
                </Card>
              </div>
            ))}
          </div>

          <div className={styles.outputStrip}>
            <span className={styles.outputLabel}>Audit outcome</span>
            <div className={styles.outputPills}>
              <span className={styles.outputPill}>Workflow clarity</span>
              <span className={styles.outputPill}>Build roadmap</span>
              <span className={styles.outputPill}>Practical next step</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
