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

export function DisconnectedOpsInfographic() {
  return (
    <div className={styles.infographicWrapper}>
      <div className={styles.infographicTitle}>Operational Architecture</div>
      <div className={styles.comparisonGrid}>
        
        <div className={styles.wrongWay}>
          <div className={styles.wayLabel}>The Assembly Line</div>
          <div className={styles.flow}>
            <div className={`${styles.node} ${styles.nodeBroken}`}>Siloed Boardroom Strategy</div>
            <div className={styles.arrow}>↓</div>
            <div className={`${styles.node} ${styles.nodeBroken}`}>Disconnected IT & Automation</div>
            <div className={styles.arrow}>↓</div>
            <div className={`${styles.node} ${styles.nodeDanger}`}>Generic Freelance Content</div>
          </div>
        </div>

        <div className={styles.rightWay}>
          <div className={styles.wayLabel}>The Unified Pipeline</div>
          <div className={styles.flow}>
            <div className={`${styles.node} ${styles.nodeGold}`}>Deep Strategy & Identity</div>
            <div className={styles.arrowGold}>↓</div>
            <div className={`${styles.node} ${styles.nodeGold}`}>Custom Agentic Infrastructure</div>
            <div className={styles.arrowGold}>↓</div>
            <div className={`${styles.node} ${styles.nodeSolid}`}>Cinematic Standard Output</div>
          </div>
        </div>

      </div>
    </div>
  );
}

export function AgenticWorkflowsInfographic() {
  return (
    <div className={styles.infographicWrapper}>
      <div className={styles.infographicTitle}>Automation vs Intelligence</div>
      <div className={styles.comparisonGrid}>
        
        <div className={styles.wrongWay}>
          <div className={styles.wayLabel}>Basic Automation (Zapier)</div>
          <div className={styles.flow}>
            <div className={`${styles.node} ${styles.nodeWeak}`}>Webhook Trigger</div>
            <div className={styles.arrow}>↓</div>
            <div className={`${styles.node} ${styles.nodeBroken}`}>If X, then Y (Rigid Logic)</div>
            <div className={styles.arrow}>↓</div>
            <div className={`${styles.node} ${styles.nodeDanger}`}>Breaks on Ambiguity</div>
          </div>
        </div>

        <div className={styles.rightWay}>
          <div className={styles.wayLabel}>Agentic Workflows</div>
          <div className={styles.flow}>
            <div className={`${styles.node} ${styles.nodeGold}`}>Context & Ambiguity</div>
            <div className={styles.arrowGold}>↓</div>
            <div className={`${styles.node} ${styles.nodeGold}`}>Autonomous Reasoning</div>
            <div className={styles.arrowGold}>↓</div>
            <div className={`${styles.node} ${styles.nodeSolid}`}>Scaled Human Decision-Making</div>
          </div>
        </div>

      </div>
    </div>
  );
}

export function CinematicStandardInfographic() {
  return (
    <div className={styles.infographicWrapper}>
      <div className={styles.infographicTitle}>The Value of Output</div>
      <div className={styles.comparisonGrid}>
        
        <div className={styles.wrongWay}>
          <div className={styles.wayLabel}>The AI Slop Era</div>
          <div className={styles.flow}>
            <div className={`${styles.node} ${styles.nodeWeak}`}>Zero-Cost Generation</div>
            <div className={styles.arrow}>↓</div>
            <div className={`${styles.node} ${styles.nodeBroken}`}>Aggressively Average Content</div>
            <div className={styles.arrow}>↓</div>
            <div className={`${styles.node} ${styles.nodeDanger}`}>Brand Dilution</div>
          </div>
        </div>

        <div className={styles.rightWay}>
          <div className={styles.wayLabel}>The Cinematic Standard</div>
          <div className={styles.flow}>
            <div className={`${styles.node} ${styles.nodeGold}`}>AI for Heavy Lifting (Scale)</div>
            <div className={styles.arrowGold}>+</div>
            <div className={`${styles.node} ${styles.nodeGold}`}>Human Taste & Curation</div>
            <div className={styles.arrowGold}>↓</div>
            <div className={`${styles.node} ${styles.nodeSolid}`}>Undeniably Premium Output</div>
          </div>
        </div>

      </div>
    </div>
  );
}
