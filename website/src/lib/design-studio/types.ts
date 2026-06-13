/* Scene Builder – shared type definitions */

/* ── Animation ─────────────────────────────────────────────── */

export type EntranceAnimation =
  | 'fade-up'
  | 'blur-in'
  | 'slide-left'
  | 'scale-in'
  | 'stagger-words'
  | 'typewriter';

export interface AnimationConfig {
  entrance: EntranceAnimation;
  /** Total entrance duration per element in ms */
  duration: number;
  /** Delay between successive elements in ms */
  stagger: number;
  /** CSS easing function */
  easing: string;
  /** Start animation automatically on mount */
  autoPlay: boolean;
  /** Loop the entrance animation */
  loop: boolean;
}

/* ── Scene templates ───────────────────────────────────────── */

export type SceneTemplate =
  | 'title-card'
  | 'comparison-flow'
  | 'process-pipeline'
  | 'metric-showcase'
  | 'capability-matrix'
  | 'priority-pyramid'
  | 'value-equation'
  | 'quote-highlight'
  | 'timeline'
  | 'data-breakdown'
  | 'orbit-layers'
  | 'diverging-paths'
  | 'insight-grid'
  | 'alignment-visualization'
  | 'workflow-chaos'
  | 'logic-framework'
  | 'system-scaling';

/* ── Template-specific data shapes ─────────────────────────── */

export interface WorkflowChaosData {
  headline: string;
  subtitle: string;
  nodes: string[];
}

export interface LogicFrameworkData {
  headline: string;
  subtitle: string;
  nodes: string[];
}

export interface SystemScalingData {
  headline: string;
  subtitle: string;
  nodes: string[];
}

export interface AlignmentVisualizationData {
  operations: { title: string; description: string };
  intelligence: { title: string; description: string };
  presence: { title: string; description: string };
}

export interface TitleCardData {
  headline: string;
  subtitle?: string;
  /** Optional gold micro-label above the headline */
  label?: string;
  /** Optional decorative tagline below subtitle */
  tagline?: string;
}

export interface ComparisonFlowData {
  leftTitle: string;
  leftLabel: string;      // e.g. "The Problem"
  leftSteps: string[];
  rightTitle: string;
  rightLabel: string;     // e.g. "The Solution"
  rightSteps: string[];
}

export interface ProcessPipelineData {
  steps: Array<{
    number: string;        // e.g. "01"
    title: string;
    description: string;
  }>;
}

export interface MetricShowcaseData {
  metrics: Array<{
    value: string;         // e.g. "3×" or "87%"
    label: string;
    description?: string;
  }>;
}

export interface CapabilityMatrixData {
  columns: [string, string];   // e.g. ["Traditional", "Kramaniti"]
  rows: Array<{
    dimension: string;
    values: [string, string];
  }>;
  /** Which column index (0 or 1) to highlight */
  highlightColumn?: number;
}

export interface PriorityPyramidData {
  layers: Array<{
    number: string;        // e.g. "01"
    title: string;
    description: string;
  }>;
}

export interface ValueEquationData {
  termA: { title: string; points: string[] };
  termB: { title: string; points: string[] };
  result: { title: string; points: string[] };
}

export interface QuoteHighlightData {
  quote: string;
  attribution?: string;
  role?: string;
}

export interface TimelineData {
  events: Array<{
    marker: string;        // e.g. "Week 1" or "Phase 1"
    title: string;
    description: string;
  }>;
}

export interface DataBreakdownData {
  title?: string;
  segments: Array<{
    label: string;
    value: number;         // percentage (0–100)
    description?: string;
  }>;
}

export interface OrbitLayersData {
  title?: string;
  layers: Array<{
    number: string;
    title: string;
    description: string;
  }>;
}

export interface DivergingPathsData {
  originLabel: string;
  paths: Array<{
    title: string;
    description: string;
  }>;
}

export interface InsightGridData {
  atmosphereLeft?: string;
  atmosphereRight?: string;
  title?: string;
  subtitle?: string;
  insights: Array<{
    focus: string;
    date: string;
    title: string;
    summary: string;
    author?: string;
    readTime: string;
  }>;
}

/** Union of all possible data payloads keyed by template */
export type SceneDataMap = {
  'title-card': TitleCardData;
  'comparison-flow': ComparisonFlowData;
  'process-pipeline': ProcessPipelineData;
  'metric-showcase': MetricShowcaseData;
  'capability-matrix': CapabilityMatrixData;
  'priority-pyramid': PriorityPyramidData;
  'value-equation': ValueEquationData;
  'quote-highlight': QuoteHighlightData;
  'timeline': TimelineData;
  'data-breakdown': DataBreakdownData;
  'orbit-layers': OrbitLayersData;
  'diverging-paths': DivergingPathsData;
  'insight-grid': InsightGridData;
  'alignment-visualization': AlignmentVisualizationData;
  'workflow-chaos': WorkflowChaosData;
  'logic-framework': LogicFrameworkData;
  'system-scaling': SystemScalingData;
};

/* ── Scene configuration ───────────────────────────────────── */

export interface SceneConfig<T extends SceneTemplate = SceneTemplate> {
  id: string;
  title: string;
  description: string;
  template: T;
  data: SceneDataMap[T];
  animation: AnimationConfig;
}

/* ── Props that every template component receives ──────────── */

export interface SceneTemplateProps<T extends SceneTemplate = SceneTemplate> {
  data: SceneDataMap[T];
  animation: AnimationConfig;
  isPlaying: boolean;
  onAnimationComplete?: () => void;
}
