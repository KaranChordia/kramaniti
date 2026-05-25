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
              <h4>Input & Vision</h4>
              <p className="text-secondary caption">Capturing the raw data—whether through cinematic interviews, voice notes, or API streams.</p>
            </Card>
          </div>

          <div className={styles.connector}></div>

          <div className={styles.pipelineNode}>
            <div className={styles.nodeIconWrapper}>
              <span className={styles.nodeIcon}>02</span>
            </div>
            <Card className={`${styles.nodeCard} ${styles.primaryCard}`}>
              <div className={styles.glowOverlay}></div>
              <h4>Agentic Architecture</h4>
              <p className="text-secondary caption">Custom AI models process, route, and transform inputs based on strict computational logic.</p>
            </Card>
          </div>

          <div className={styles.connector}></div>

          <div className={styles.pipelineNode}>
            <div className={styles.nodeIconWrapper}>
              <span className={styles.nodeIcon}>03</span>
            </div>
            <Card className={styles.nodeCard}>
              <h4>Output & Scale</h4>
              <p className="text-secondary caption">Deploying polished assets across distribution channels or internal ops dashboards.</p>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
