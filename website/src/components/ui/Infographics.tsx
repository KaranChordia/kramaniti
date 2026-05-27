import React from 'react';
import styles from './Infographics.module.css';

export function TechStackInfographic() {
  return (
    <div className={styles.infographicWrapper}>
      <div className={styles.infographicTitle}>The Integration Paradigm</div>
      <div className={styles.comparisonGrid}>
        
        <div className={styles.wrongWay}>
          <div className={styles.wayLabel}>The Trap</div>
          <div className={styles.flow}>
            <div className={`${styles.node} ${styles.nodeDanger}`}>Shiny AI Tool</div>
            <div className={styles.arrow}>↓</div>
            <div className={`${styles.node} ${styles.nodeWeak}`}>Searching for Use Case</div>
            <div className={styles.arrow}>↓</div>
            <div className={`${styles.node} ${styles.nodeBroken}`}>Forced Implementation</div>
          </div>
        </div>

        <div className={styles.rightWay}>
          <div className={styles.wayLabel}>The Pipeline</div>
          <div className={styles.flow}>
            <div className={`${styles.node} ${styles.nodeGold}`}>Map Core Strategy</div>
            <div className={styles.arrowGold}>↓</div>
            <div className={`${styles.node} ${styles.nodeGold}`}>Identify Bottlenecks</div>
            <div className={styles.arrowGold}>↓</div>
            <div className={`${styles.node} ${styles.nodeSolid}`}>Deploy Agentic Stack</div>
          </div>
        </div>

      </div>
    </div>
  );
}
