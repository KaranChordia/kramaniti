'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Code2,
  Copy,
  FileText,
  Layers3,
  MonitorPlay,
  Settings2,
  Video,
} from 'lucide-react';
import scenes from '../../data/scenes';
import type { SceneConfig, SceneTemplate } from '../../lib/design-studio/types';
import { SceneRenderer } from '../../components/design-studio/SceneRenderer';
import { SceneControls } from '../../components/design-studio/SceneControls';
import styles from './scene-builder.module.css';

const TEMPLATE_OPTIONS: SceneTemplate[] = [
  'title-card',
  'comparison-flow',
  'process-pipeline',
  'metric-showcase',
  'capability-matrix',
  'priority-pyramid',
  'value-equation',
  'quote-highlight',
  'timeline',
  'data-breakdown',
  'orbit-layers',
  'diverging-paths',
  'insight-grid',
  'alignment-visualization',
  'workflow-chaos',
  'logic-framework',
  'system-scaling',
];

const DEFAULT_SCENE_BRIEF =
  'Create a 4-6 scene Kramaniti infographic video about a founder moving from scattered tools to a connected growth system. Keep the language concise, premium, and systems-first.';

export default function SceneBuilderPage() {
  /* ── State ───────────────────────────────────────────────── */
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showWatermark, setShowWatermark] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [resetKey, setResetKey] = useState(0);
  const [sceneBrief, setSceneBrief] = useState(DEFAULT_SCENE_BRIEF);
  const [preferredTemplate, setPreferredTemplate] = useState<SceneTemplate>('orbit-layers');
  const [copiedBrief, setCopiedBrief] = useState(false);

  const canvasWrapperRef = useRef<HTMLDivElement>(null);

  const currentScene: SceneConfig = scenes[selectedIndex] ?? scenes[0];

  const templateLabel = useCallback(
    (template: string) =>
      template
        .split('-')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' '),
    [],
  );

  const agentBrief = [
    'Kramaniti Design Studio request',
    '',
    `Message: ${sceneBrief.trim() || DEFAULT_SCENE_BRIEF}`,
    `Preferred first template: ${preferredTemplate}`,
    `Reference scene: ${currentScene ? `${currentScene.title} (${currentScene.template})` : 'None (Empty Canvas)'}`,
    '',
    'Work inside website/src/data/scenes.ts and the existing design-studio templates.',
    'Keep the positioning business-first: strategy before tools, systems before scale, content after clarity.',
    'Avoid invented claims, client names, testimonials, or unsupported metrics.',
    'After editing scenes, run npm run lint, npx tsc --noEmit, npm run build, then preview /design-studio.',
  ].join('\n');

  /* ── Scene selection ─────────────────────────────────────── */

  const selectScene = useCallback((index: number) => {
    setSelectedIndex(index);
    setIsPlaying(false);
    setResetKey((k) => k + 1);
    /* Auto-play after a short delay so the reset takes effect */
    setTimeout(() => setIsPlaying(true), 50);
  }, []);

  /* ── Playback controls ───────────────────────────────────── */

  const togglePlay = useCallback(() => {
    setIsPlaying((p) => !p);
  }, []);

  const resetAnimation = useCallback(() => {
    setIsPlaying(false);
    setResetKey((k) => k + 1);
    setTimeout(() => setIsPlaying(true), 50);
  }, []);

  const copyAgentBrief = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(agentBrief);
      setCopiedBrief(true);
      setTimeout(() => setCopiedBrief(false), 1800);
    } catch {
      setCopiedBrief(false);
    }
  }, [agentBrief]);

  /* ── Fullscreen / Presentation Mode ──────────────────────── */

  const toggleFullscreen = useCallback(() => {
    if (!canvasWrapperRef.current) return;

    if (!document.fullscreenElement) {
      canvasWrapperRef.current.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch(() => {
        /* Fullscreen denied — fallback to CSS-only presentation */
        setIsFullscreen(true);
      });
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      }).catch(() => {
        setIsFullscreen(false);
      });
    }
  }, []);

  /* Listen for fullscreen exit (e.g. pressing Escape) */
  useEffect(() => {
    const handleChange = () => {
      if (!document.fullscreenElement) {
        setIsFullscreen(false);
      }
    };
    document.addEventListener('fullscreenchange', handleChange);
    return () => document.removeEventListener('fullscreenchange', handleChange);
  }, []);

  /* ── Keyboard shortcuts ──────────────────────────────────── */

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      /* Don't capture when typing in inputs */
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      )
        return;

      switch (e.key) {
        case ' ':
          e.preventDefault();
          togglePlay();
          break;
        case 'f':
        case 'F':
          e.preventDefault();
          toggleFullscreen();
          break;
        case 'r':
        case 'R':
          e.preventDefault();
          resetAnimation();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          setSelectedIndex((i) => Math.max(0, i - 1));
          setResetKey((k) => k + 1);
          setTimeout(() => setIsPlaying(true), 50);
          break;
        case 'ArrowRight':
          e.preventDefault();
          setSelectedIndex((i) => Math.min(scenes.length - 1, i + 1));
          setResetKey((k) => k + 1);
          setTimeout(() => setIsPlaying(true), 50);
          break;
        case 'Escape':
          if (isFullscreen) {
            /* Browser handles fullscreen exit */
          } else {
            setSidebarOpen((s) => !s);
          }
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePlay, toggleFullscreen, resetAnimation, isFullscreen]);

  /* ── Auto-play first scene on mount ──────────────────────── */

  useEffect(() => {
    const timer = setTimeout(() => setIsPlaying(true), 300);
    return () => clearTimeout(timer);
  }, []);

  /* ── Render ──────────────────────────────────────────────── */

  return (
    <div
      className={`${styles.page} ${isFullscreen ? styles.fullscreen : ''}`}
    >
      {/* Sidebar */}
      {!isFullscreen && (
        <aside
          className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : styles.sidebarClosed}`}
        >
          <div className={styles.sidebarHeader}>
            <div className={styles.sidebarTitle}>
              <Layers3 size={16} className={styles.sidebarIcon} />
              <span>Scenes</span>
            </div>
            <button
              className={styles.sidebarToggle}
              onClick={() => setSidebarOpen((s) => !s)}
              aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
            >
              {sidebarOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
            </button>
          </div>

          {sidebarOpen && (
            <div className={styles.sceneList}>
              {scenes.map((scene, i) => (
                <button
                  key={scene.id}
                  className={`${styles.sceneItem} ${
                    i === selectedIndex ? styles.sceneItemActive : ''
                  }`}
                  onClick={() => selectScene(i)}
                >
                  <span className={styles.sceneNumber}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div className={styles.sceneInfo}>
                    <span className={styles.sceneName}>{scene.title}</span>
                    <span className={styles.sceneTemplate}>
                      {templateLabel(scene.template)}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </aside>
      )}

      {/* Main area */}
      <main className={styles.main}>
        {/* Top bar (hidden in fullscreen) */}
        {!isFullscreen && (
          <div className={styles.topBar}>
            <div className={styles.topBarLeft}>
              <MonitorPlay size={18} className={styles.topBarIcon} />
              <h1 className={styles.topBarTitle}>Kramaniti Scene Builder</h1>
            </div>
            <div className={styles.topBarRight}>
              <span className={styles.sceneCount}>
                {selectedIndex + 1} / {scenes.length}
              </span>
              <span className={styles.captureState}>
                Capture path ready
              </span>
            </div>
          </div>
        )}

        {/* Canvas wrapper */}
        <div
          ref={canvasWrapperRef}
          className={`${styles.canvasWrapper} ${
            isFullscreen ? styles.canvasFullscreen : ''
          }`}
        >
          <SceneRenderer
            key={resetKey}
            scene={currentScene}
            isPlaying={isPlaying}
            speed={speed}
            showWatermark={showWatermark}
          />

          {/* Controls overlay (always visible, bottom of canvas area) */}
          {isFullscreen && (
            <div className={styles.fullscreenControls}>
              <SceneControls
                isPlaying={isPlaying}
                speed={speed}
                isFullscreen={isFullscreen}
                showWatermark={showWatermark}
                onTogglePlay={togglePlay}
                onReset={resetAnimation}
                onSpeedChange={setSpeed}
                onToggleFullscreen={toggleFullscreen}
                onToggleWatermark={() => setShowWatermark((w) => !w)}
              />
            </div>
          )}
        </div>

        {/* Controls bar (below canvas, hidden in fullscreen) */}
        {!isFullscreen && (
          <div className={styles.controlsBar}>
            <SceneControls
              isPlaying={isPlaying}
              speed={speed}
              isFullscreen={isFullscreen}
              showWatermark={showWatermark}
              onTogglePlay={togglePlay}
              onReset={resetAnimation}
              onSpeedChange={setSpeed}
              onToggleFullscreen={toggleFullscreen}
              onToggleWatermark={() => setShowWatermark((w) => !w)}
            />
          </div>
        )}

        {/* Scene description (hidden in fullscreen) */}
        {!isFullscreen && currentScene && (
          <div className={styles.sceneDescription}>
            <p className={styles.descriptionText}>{currentScene.description}</p>
            <div className={styles.shortcuts}>
              <kbd>Space</kbd> Play/Pause
              <kbd>R</kbd> Reset
              <kbd>F</kbd> Fullscreen
              <kbd>←</kbd><kbd>→</kbd> Navigate
            </div>
          </div>
        )}
      </main>

      {!isFullscreen && (
        <aside className={styles.inspector}>
          <section className={styles.inspectorSection}>
            <div className={styles.panelHeading}>
              <FileText size={15} />
              <h2>Scene Brief</h2>
            </div>
            <textarea
              className={styles.briefInput}
              value={sceneBrief}
              onChange={(event) => setSceneBrief(event.target.value)}
              aria-label="Scene brief for the coding agent"
              rows={6}
            />
            <label className={styles.fieldLabel} htmlFor="preferred-template">
              Preferred template
            </label>
            <select
              id="preferred-template"
              className={styles.selectInput}
              value={preferredTemplate}
              onChange={(event) => setPreferredTemplate(event.target.value as SceneTemplate)}
            >
              {TEMPLATE_OPTIONS.map((template) => (
                <option key={template} value={template}>
                  {templateLabel(template)}
                </option>
              ))}
            </select>
            <button
              className={styles.copyButton}
              type="button"
              onClick={copyAgentBrief}
            >
              {copiedBrief ? <CheckCircle2 size={15} /> : <Copy size={15} />}
              {copiedBrief ? 'Copied' : 'Copy agent brief'}
            </button>
          </section>

          {currentScene && (
            <section className={styles.inspectorSection}>
              <div className={styles.panelHeading}>
                <Settings2 size={15} />
                <h2>Current Scene</h2>
              </div>
              <div className={styles.sceneMetaGrid}>
                <span>Template</span>
                <strong>{templateLabel(currentScene.template)}</strong>
                <span>Entrance</span>
                <strong>{templateLabel(currentScene.animation.entrance)}</strong>
                <span>Duration</span>
                <strong>{currentScene.animation.duration}ms</strong>
                <span>Stagger</span>
                <strong>{currentScene.animation.stagger}ms</strong>
              </div>
            </section>
          )}

          <section className={styles.inspectorSection}>
            <div className={styles.panelHeading}>
              <Code2 size={15} />
              <h2>Agent Prompt</h2>
            </div>
            <pre className={styles.agentPrompt}>{agentBrief}</pre>
          </section>

          <section className={styles.inspectorSection}>
            <div className={styles.panelHeading}>
              <Video size={15} />
              <h2>Export Path</h2>
            </div>
            <ol className={styles.exportList}>
              <li>Preview scenes on the local route.</li>
              <li>Use Present for a clean 16:9 capture surface.</li>
              <li>Record with Screen Studio, OBS, or the future MP4 pipeline.</li>
            </ol>
            <div className={styles.futureNote}>
              MP4 automation remains a follow-up: capture canvas frames, render at fixed FPS, then encode with ffmpeg.
            </div>
          </section>
        </aside>
      )}

    </div>
  );
}
