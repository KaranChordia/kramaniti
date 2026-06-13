/**
 * Scene Library
 * ─────────────
 * Define your infographic scenes here.
 * Each scene maps to a visual template and is rendered by the Scene Builder.
 *
 * To add a new scene:
 *  1. Pick a template from the SceneTemplate union type
 *  2. Fill in the data shape that matches the template
 *  3. Tune the animation config (entrance, duration, stagger)
 *  4. Open /design-studio in your browser to preview
 */

import type { SceneConfig } from '../lib/design-studio/types';

const scenes: SceneConfig[] = [
  {
    id: 'scene-01-chaos',
    title: 'Scene 01: The Workflow Trap',
    description: 'Visualizing scattered tools and broken workflows without a foundation.',
    template: 'workflow-chaos',
    animation: { duration: 1000, stagger: 200, entrance: 'fade-up', easing: 'ease', autoPlay: true, loop: false },
    data: {
      headline: 'Workflows fail without foundations.',
      subtitle: 'Scattered tools cannot replace operating logic.',
      nodes: ['PDF Resumes', 'Spreadsheets', 'Email Chains', 'Siloed CRMs', 'Slack Notes'],
    },
  },
  {
    id: 'scene-02-clarity',
    title: 'Scene 02: Clarity First',
    description: 'Visualizing clarity organizing the chaos into a logical framework.',
    template: 'logic-framework',
    animation: { duration: 1000, stagger: 400, entrance: 'fade-up', easing: 'ease', autoPlay: true, loop: false },
    data: {
      headline: 'Clarity maps the logic.',
      subtitle: 'Identify bottlenecks before building automation.',
      nodes: ['Intake', 'Scoring', 'Approval', 'Outreach'],
    },
  },
  {
    id: 'scene-03-system',
    title: 'Scene 03: The Design System',
    description: 'Visualizing the design system turning logic into a unified, scalable presence.',
    template: 'system-scaling',
    animation: { duration: 1000, stagger: 300, entrance: 'fade-up', easing: 'ease', autoPlay: true, loop: false },
    data: {
      headline: 'Design structures the output.',
      subtitle: 'A unified operating system for brand growth.',
      nodes: ['Data Layer', 'Logic Engine', 'Brand Presence'],
    },
  }
];

export default scenes;
