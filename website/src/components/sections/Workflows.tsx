'use client';
import React from 'react';
import styles from './Workflows.module.css';
import { Card } from '../ui/Card';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';

export function Workflows() {
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.1, freezeOnceVisible: true });

  return (
    <section className={styles.workflows} id="workflows" ref={ref as React.RefObject<HTMLDivElement>}>
      <div className={styles.container}>
        <div className={`${styles.header} ${isVisible ? styles.visible : ''}`}>
          <h2>The Kramaniti Pipeline</h2>
          <p className="text-secondary">A unified system. From founder intent to autonomous scale.</p>
        </div>

        <div className={`${styles.pipelineContainer} ${isVisible ? styles.visible : ''}`}>
          <div className={styles.pipelineNode}>
            <div className={styles.nodeIconWrapper}>
              <span className={styles.nodeIcon}>01</span>
            </div>
            <Card className={styles.nodeCard}>
              <h4>Data Ingestion</h4>
              <p className="text-secondary caption">Make.com webhooks capture raw input from Calendly, Typeform, or custom API streams instantly.</p>
            </Card>
          </div>

          <div className={styles.connector}></div>

          <div className={styles.pipelineNode}>
            <div className={styles.nodeIconWrapper}>
              <span className={styles.nodeIcon}>02</span>
            </div>
            <Card className={`${styles.nodeCard} ${styles.primaryCard}`}>
              <div className={styles.glowOverlay}></div>
              <h4>Claude Processing</h4>
              <p className="text-secondary caption">Anthropic's Claude 3 intelligently parses the payload, restructuring narratives and extracting actionable logic.</p>
            </Card>
          </div>

          <div className={styles.connector}></div>

          <div className={styles.pipelineNode}>
            <div className={styles.nodeIconWrapper}>
              <span className={styles.nodeIcon}>03</span>
            </div>
            <Card className={styles.nodeCard}>
              <h4>Autonomous Delivery</h4>
              <p className="text-secondary caption">The finalized assets are seamlessly distributed to your CRM, Webflow CMS, or internal Slack dashboards.</p>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
