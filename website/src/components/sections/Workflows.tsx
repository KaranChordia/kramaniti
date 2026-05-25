'use client';
import React from 'react';
import styles from './Workflows.module.css';
import { Card } from '../ui/Card';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';

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
          <span className="micro-label">Delivery System</span>
          <h2>How the Model Works</h2>
          <p className="text-secondary">A short flow with visible inputs, process, and outputs.</p>
        </div>

        <div className={`${styles.flowShell} ${isVisible ? styles.visible : ''}`}>
          <div className={styles.flowSummary}>
            <div className={styles.summaryItem}>
              <span className="micro-label">Input</span>
              <span className={styles.summaryValue}>Workflow audit</span>
            </div>
            <div className={styles.summaryDivider}></div>
            <div className={styles.summaryItem}>
              <span className="micro-label">Process</span>
              <span className={styles.summaryValue}>Automation build</span>
            </div>
            <div className={styles.summaryDivider}></div>
            <div className={styles.summaryItem}>
              <span className="micro-label">Output</span>
              <span className={styles.summaryValue}>Running system</span>
            </div>
          </div>

          <div className={styles.pipelineContainer}>
            <div className={styles.pipelineNode}>
              <div className={styles.nodeIconWrapper}>
                <span className={styles.nodeIcon}>01</span>
              </div>
              <Card className={styles.nodeCard}>
                <div className={styles.nodeBar}></div>
                <h4>Diagnose</h4>
                <p className="text-secondary caption">Map the current workflow, identify bottlenecks, and define the first high-impact automation.</p>
              </Card>
            </div>

            <div className={styles.connector}></div>

            <div className={styles.pipelineNode}>
              <div className={styles.nodeIconWrapper}>
                <span className={styles.nodeIcon}>02</span>
              </div>
              <Card className={`${styles.nodeCard} ${styles.primaryCard}`}>
                <div className={styles.glowOverlay}></div>
                <div className={styles.nodeBar}></div>
                <h4>Build</h4>
                <p className="text-secondary caption">Create the agent, automation, or content pipeline and connect it to the tools the team already uses.</p>
              </Card>
            </div>

            <div className={styles.connector}></div>

            <div className={styles.pipelineNode}>
              <div className={styles.nodeIconWrapper}>
                <span className={styles.nodeIcon}>03</span>
              </div>
              <Card className={styles.nodeCard}>
                <div className={styles.nodeBar}></div>
                <h4>Run</h4>
                <p className="text-secondary caption">Keep the system live with iteration, reporting, and monthly optimization support.</p>
              </Card>
            </div>
          </div>

          <div className={styles.outputStrip}>
            <span className={styles.outputLabel}>System Output</span>
            <div className={styles.outputPills}>
              <span className={styles.outputPill}>Internal agent</span>
              <span className={styles.outputPill}>Workflow automation</span>
              <span className={styles.outputPill}>Content engine</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
