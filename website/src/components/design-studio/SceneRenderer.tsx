'use client';

import { useRef } from 'react';
import dynamic from 'next/dynamic';
import type { SceneConfig, SceneTemplate, SceneTemplateProps } from '../../lib/design-studio/types';
import styles from './SceneRenderer.module.css';

/* ── Lazy-load template components ─────────────────────────── */
import { TitleCard } from './templates/TitleCard';
import { ComparisonFlow } from './templates/ComparisonFlow';
import { ProcessPipeline } from './templates/ProcessPipeline';
import { MetricShowcase } from './templates/MetricShowcase';
import { CapabilityMatrix } from './templates/CapabilityMatrix';
import { PriorityPyramid } from './templates/PriorityPyramid';
import { ValueEquation } from './templates/ValueEquation';
import { QuoteHighlight } from './templates/QuoteHighlight';
import { Timeline } from './templates/Timeline';
import { DataBreakdown } from './templates/DataBreakdown';

const OrbitLayers = dynamic(() => import('./templates/OrbitLayers').then(m => m.OrbitLayers), { ssr: false });
const DivergingPaths = dynamic(() => import('./templates/DivergingPaths').then(m => m.DivergingPaths), { ssr: false });
const InsightGrid = dynamic(() => import('./templates/InsightGrid').then(m => m.InsightGrid), { ssr: false });
const AlignmentVisualization = dynamic(() => import('./templates/AlignmentVisualization').then(m => m.AlignmentVisualization), { ssr: false });
const WorkflowChaos = dynamic(() => import('./templates/WorkflowChaos').then(m => m.WorkflowChaos), { ssr: false });
const LogicFramework = dynamic(() => import('./templates/LogicFramework').then(m => m.LogicFramework), { ssr: false });
const SystemScaling = dynamic(() => import('./templates/SystemScaling').then(m => m.SystemScaling), { ssr: false });

/* ── Template registry ─────────────────────────────────────── */

type TemplateComponent = React.ComponentType<SceneTemplateProps<SceneTemplate>>;

const TEMPLATES: Record<SceneTemplate, TemplateComponent> = {
  'title-card': TitleCard as TemplateComponent,
  'comparison-flow': ComparisonFlow as TemplateComponent,
  'process-pipeline': ProcessPipeline as TemplateComponent,
  'metric-showcase': MetricShowcase as TemplateComponent,
  'capability-matrix': CapabilityMatrix as TemplateComponent,
  'priority-pyramid': PriorityPyramid as TemplateComponent,
  'value-equation': ValueEquation as TemplateComponent,
  'quote-highlight': QuoteHighlight as TemplateComponent,
  'timeline': Timeline as TemplateComponent,
  'data-breakdown': DataBreakdown as TemplateComponent,
  'orbit-layers': OrbitLayers as TemplateComponent,
  'diverging-paths': DivergingPaths as TemplateComponent,
  'insight-grid': InsightGrid as TemplateComponent,
  'alignment-visualization': AlignmentVisualization as TemplateComponent,
  'workflow-chaos': WorkflowChaos as TemplateComponent,
  'logic-framework': LogicFramework as TemplateComponent,
  'system-scaling': SystemScaling as TemplateComponent,
};

/* ── Props ─────────────────────────────────────────────────── */

interface SceneRendererProps {
  scene?: SceneConfig;
  isPlaying: boolean;
  /** 0.5 | 1 | 2 — animation speed multiplier */
  speed: number;
  /** Show the Kramaniti watermark */
  showWatermark?: boolean;
  onAnimationComplete?: () => void;
}

/* ── Component ─────────────────────────────────────────────── */

export function SceneRenderer({
  scene,
  isPlaying,
  speed,
  showWatermark = true,
  onAnimationComplete,
}: SceneRendererProps) {
  const canvasRef = useRef<HTMLDivElement>(null);

  if (!scene) {
    return (
      <div className={styles.canvas} ref={canvasRef}>
        <div className={styles.errorState}>
          <p style={{ color: 'var(--text-tertiary)', fontSize: '18px', textAlign: 'center' }}>
            Empty Canvas.<br/>
            Waiting for scene brief...
          </p>
        </div>
      </div>
    );
  }

  /* Scale animation durations by speed */
  const scaledAnimation = {
    ...scene.animation,
    duration: scene.animation.duration / speed,
    stagger: scene.animation.stagger / speed,
  };

  const TemplateComponent = TEMPLATES[scene.template];

  if (!TemplateComponent) {
    return (
      <div className={styles.canvas} ref={canvasRef}>
        <div className={styles.errorState}>
          <p>Unknown template: <code>{scene.template}</code></p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={styles.canvas}
      ref={canvasRef}
      style={{
        '--scene-speed': speed,
      } as React.CSSProperties}
    >
      {/* Ambient background effects */}
      <div className={styles.ambientGlow} />
      <div className={styles.gridOverlay} />

      {/* Scene content */}
      <div className={styles.sceneContent}>
        <TemplateComponent
          data={scene.data}
          animation={scaledAnimation}
          isPlaying={isPlaying}
          onAnimationComplete={onAnimationComplete}
        />
      </div>

      {/* Watermark */}
      {showWatermark && (
        <div className={styles.watermark}>
          <span className={styles.watermarkText}>KRAMANITI</span>
        </div>
      )}
    </div>
  );
}
