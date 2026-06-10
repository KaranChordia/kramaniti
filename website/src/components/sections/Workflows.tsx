'use client';
import React from 'react';
import styles from './Workflows.module.css';
import { Card } from '../ui/Card';
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
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.1, freezeOnceVisible: true });

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

          <div className={styles.pipelineContainer}>
            {steps.map((step, index) => (
              <div className={styles.pipelineNode} key={step.title}>
                <div className={styles.nodeIconWrapper}>
                  <span className={styles.nodeIcon}>{String(index + 1).padStart(2, '0')}</span>
                </div>
                <Card className={`glass-border-layer ${styles.nodeCard} ${styles.workflowGlass} ${index === 2 ? styles.primaryCard : ''}`}>
                  {index === 2 && <div className={styles.glowOverlay}></div>}
                  <div className={styles.nodeBar}></div>
                  <h4>{step.title}</h4>
                  <p className="text-secondary caption">{step.copy}</p>
                </Card>
              </div>
            ))}
          </div>

          <div className={styles.outputStrip}>
            <span className={styles.outputLabel}>Engagement outcome</span>
            <div className={styles.outputPills}>
              <span className={styles.outputPill}>Operational clarity</span>
              <span className={styles.outputPill}>Aligned systems</span>
              <span className={styles.outputPill}>Coherent presence</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
