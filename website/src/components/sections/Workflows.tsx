'use client';
import React, { useState } from 'react';
import { ArrowDown, Cog, Download, Sparkles } from 'lucide-react';
import styles from './Workflows.module.css';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';
import { AnimatedHeading } from '../ui/AnimatedHeading';
import { IconMark } from '../ui/IconMark';
import { SectionKicker } from '../ui/SectionKicker';

const steps = [
  {
    title: 'Diagnose',
    copy: 'Map current-state workflows and identify operational friction.'
  },
  {
    title: 'Prioritize',
    copy: 'Select the highest-impact bottleneck to resolve first.'
  },
  {
    title: 'Architect',
    copy: 'Design the most effective, minimal-complexity system.'
  },
  {
    title: 'Implement',
    copy: 'Build the customized workflow, tools, and documentation.'
  },
  {
    title: 'Enable',
    copy: 'Guide the team through adoption with clear operating rules.'
  },
  {
    title: 'Articulate',
    copy: 'Translate the newfound clarity into a stronger market presence.'
  },
  {
    title: 'Iterate',
    copy: 'Monitor performance, refine processes, and eliminate inefficiencies.'
  }
];

const summaryItems = [
  { label: 'Input', value: 'Current Workflow', icon: Download },
  { label: 'Process', value: 'Practical Build', icon: Cog },
  { label: 'Output', value: 'Clearer Work', icon: Sparkles },
];

export function Workflows() {
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.1 });
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <section className={`${styles.workflows} home-section`} id="workflows" ref={ref as React.RefObject<HTMLDivElement>}>
      <div className={styles.atmosphere} aria-hidden="true">
        <span className={`${styles.atmosWord} ${styles.atmosWordOne}`}>Flow</span>
        <span className={`${styles.atmosWord} ${styles.atmosWordTwo}`}>Run</span>
      </div>
      <div className={`${styles.container} home-container`}>
        <div className={`${styles.header} home-header ${isVisible ? styles.visible : ''}`}>
          <SectionKicker>Process</SectionKicker>
          <AnimatedHeading isVisible={isVisible}>A first-principles approach to workflow design.</AnimatedHeading>
          <p className="home-lede">We start by analyzing your current operational realities—not by forcing a predefined toolset.</p>
        </div>

        <div className={`${styles.flowShell} ${isVisible ? styles.visible : ''}`}>
          <div className={styles.flowSummary}>
            {summaryItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <React.Fragment key={item.label}>
                  {index > 0 && <div className={styles.summaryDivider}></div>}
                  <div className={styles.summaryItem}>
                    <span className={styles.summarySignal}>
                      <IconMark>
                        <Icon strokeWidth={1.75} />
                      </IconMark>
                      <span className="micro-label">{item.label}</span>
                    </span>
                    <span className={styles.summaryValue}>{item.value}</span>
                  </div>
                </React.Fragment>
              );
            })}
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
                    <h3>{step.title}</h3>
                    <p>{step.copy}</p>
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
                <ArrowDown size={16} strokeWidth={1.75} className={styles.chevronIcon} aria-hidden="true" />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
