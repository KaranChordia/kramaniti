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
          <h2>Why A Single Pipeline?</h2>
          <p className="text-secondary">Ensuring your digital presence remains coherent, authentic, and impactful.</p>
        </div>

        <div className={`${styles.flowShell} ${isVisible ? styles.visible : ''}`}>
          <div className={styles.flowSummary}>
            <div className={styles.summaryItem}>
              <span className="micro-label">Input</span>
              <span className={styles.summaryValue}>Brand Vision</span>
            </div>
            <div className={styles.summaryDivider}></div>
            <div className={styles.summaryItem}>
              <span className="micro-label">Process</span>
              <span className={styles.summaryValue}>Unified Pipeline</span>
            </div>
            <div className={styles.summaryDivider}></div>
            <div className={styles.summaryItem}>
              <span className="micro-label">Output</span>
              <span className={styles.summaryValue}>Authentic Impact</span>
            </div>
          </div>

          <div className={styles.pipelineContainer}>
            <div className={styles.pipelineNode}>
              <div className={styles.nodeIconWrapper}>
                <span className={styles.nodeIcon}>01</span>
              </div>
              <Card className={styles.nodeCard}>
                <div className={styles.nodeBar}></div>
                <h4>Align Vision</h4>
                <p className="text-secondary caption">Map the core strategy so the technology serves the brand&apos;s unique identity, not the other way around.</p>
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
                <h4>Engineer Systems</h4>
                <p className="text-secondary caption">Deploy the exact agentic workflows needed to scale operations without losing the human touch.</p>
              </Card>
            </div>

            <div className={styles.connector}></div>

            <div className={styles.pipelineNode}>
              <div className={styles.nodeIconWrapper}>
                <span className={styles.nodeIcon}>03</span>
              </div>
              <Card className={styles.nodeCard}>
                <div className={styles.nodeBar}></div>
                <h4>Craft Content</h4>
                <p className="text-secondary caption">Transform the system&apos;s output into high-end, design-driven content that resonates with your audience.</p>
              </Card>
            </div>
          </div>

          <div className={styles.outputStrip}>
            <span className={styles.outputLabel}>System Output</span>
            <div className={styles.outputPills}>
              <span className={styles.outputPill}>Coherent Strategy</span>
              <span className={styles.outputPill}>Automated Operations</span>
              <span className={styles.outputPill}>Cinematic Content</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
