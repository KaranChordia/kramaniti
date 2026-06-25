'use client';

import Link from 'next/link';
import { useEffect, useEffectEvent, useMemo, useRef, useState, type CSSProperties } from 'react';
import {
  ArrowUpRight,
  AudioLines,
  Gauge,
  Mic,
  MicOff,
  Orbit,
  RefreshCw,
  Share2,
  Sparkles,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/Button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

type VisualMode =
  | 'thinking'
  | 'routing'
  | 'spawn'
  | 'scan'
  | 'research'
  | 'synthesis'
  | 'build'
  | 'validation'
  | 'merge'
  | 'delivery';

type Accent = 'gold' | 'blue';
type AgentState = 'queued' | 'live' | 'done';

type FlowStep = {
  id: string;
  indexLabel: string;
  title: string;
  emphasis: string;
  body: string;
  agent: string;
  narration: string;
  accent: Accent;
  mode: VisualMode;
  task: string;
  proof: string;
  status: string;
};

type AgentNode = {
  label: string;
  angle: number;
  distance: number;
  startAt: number;
  doneAt: number;
  work: string;
};

type SimulationTemplate = {
  id: string;
  name: string;
  brief: string;
  flow: FlowStep[];
  durations: number[];
  nodes: AgentNode[];
};

const BASE_NODES: AgentNode[] = [
  { label: 'Parse', angle: -116, distance: 198, startAt: 2, doneAt: 9, work: 'Parsing source inputs and locking task constraints' },
  { label: 'Signal', angle: -52, distance: 222, startAt: 3, doneAt: 10, work: 'Scanning risk, drift, and edge-case patterns' },
  { label: 'Reason', angle: 6, distance: 210, startAt: 4, doneAt: 11, work: 'Sequencing logic and deciding execution order' },
  { label: 'Design', angle: 66, distance: 218, startAt: 5, doneAt: 11, work: 'Refining UX behavior, hierarchy, and transitions' },
  { label: 'Build', angle: 128, distance: 198, startAt: 6, doneAt: 12, work: 'Producing the visible output and response layer' },
  { label: 'Verify', angle: 192, distance: 188, startAt: 8, doneAt: 13, work: 'Reviewing output quality and completion state' },
];

function createFlow(subject: string, lane: string, result: string): FlowStep[] {
  return [
    { id: 'task-intake', indexLabel: '[ 001 / 014 ]', title: 'Command layer', emphasis: 'reads the request', body: `The lead agent frames the ${subject} assignment, isolates the intent, and compresses the mission before specialist work begins.`, agent: 'Krama Commander', narration: `Request received. I am reading the ${subject} surface and isolating the mission before delegation.`, accent: 'gold', mode: 'thinking', task: `Mission framing for ${subject}`, proof: 'Goal, constraints, and priority stack isolated.', status: 'Lead agent thinking' },
    { id: 'plan-route', indexLabel: '[ 002 / 014 ]', title: 'Decision layer', emphasis: 'maps the route', body: `A longer chain is assembled so the ${lane} sequence stays visible from first command through final return.`, agent: 'Krama Commander', narration: 'Execution route is being mapped. Dependencies and specialist ownership are being resolved.', accent: 'gold', mode: 'routing', task: 'Task graph assembly', proof: 'Visible step order and stop conditions created.', status: 'Delegation route active' },
    { id: 'spawn-agents', indexLabel: '[ 003 / 014 ]', title: 'Sub-agents', emphasis: 'come online', body: 'Specialist units come online around the core with bounded responsibilities and defined return conditions.', agent: 'Agent Fabricator', narration: 'Sub-agents are coming online now. Each unit has a role, bounded context, and a return contract.', accent: 'blue', mode: 'spawn', task: 'Agent provisioning', proof: 'Six bounded specialist agents instantiated.', status: 'Agent network booting' },
    { id: 'brief-parse', indexLabel: '[ 004 / 014 ]', title: 'Parser agent', emphasis: 'opens the source', body: `The parser reads the ${subject} brief, extracts concrete inputs, and separates instruction from supporting signal.`, agent: 'Parse Agent', narration: 'Parsing source materials and identifying the decision-critical inputs.', accent: 'blue', mode: 'scan', task: 'Source parsing', proof: 'Inputs, dependencies, and constraints indexed.', status: 'Source parsing in progress' },
    { id: 'reference-scan', indexLabel: '[ 005 / 014 ]', title: 'Reference agent', emphasis: 'indexes context', body: 'The system scans supporting references, previous decisions, and applicable context so execution does not rely on guesswork.', agent: 'Parse Agent', narration: 'Indexing surrounding context and carrying only the references needed for execution.', accent: 'blue', mode: 'scan', task: 'Reference indexing', proof: 'Context narrowed to the active decision surface.', status: 'Reference indexing live' },
    { id: 'risk-scan', indexLabel: '[ 006 / 014 ]', title: 'Signal agent', emphasis: 'checks the risks', body: `The intelligence layer tests the ${lane} flow for failure points, blind spots, and quality loss before the build phase accelerates.`, agent: 'Signal Analyst', narration: 'Scanning for drift, risk, and clarity failures before execution increases speed.', accent: 'blue', mode: 'research', task: 'Risk and edge-case review', proof: 'Sequence, trust, and visibility risks identified.', status: 'Risk scan active' },
    { id: 'logic-structure', indexLabel: '[ 007 / 014 ]', title: 'Reasoning agent', emphasis: 'structures the logic', body: 'Execution logic is sequenced so only one primary process dominates while supporting loops stay legible in the background.', agent: 'Reason Agent', narration: 'Structuring task logic, deciding order, and determining what should remain visible.', accent: 'blue', mode: 'research', task: 'Execution logic structuring', proof: 'Primary and secondary task layers separated.', status: 'Reasoning loop active' },
    { id: 'ux-synthesis', indexLabel: '[ 008 / 014 ]', title: 'Design agent', emphasis: 'shapes the surface', body: `The design specialist turns the ${subject} system into a premium visual field with hierarchy, subtle choreography, and reduced clutter.`, agent: 'Design Synthesizer', narration: 'Design synthesis is active. I am shaping a clearer and more premium operating surface.', accent: 'gold', mode: 'synthesis', task: 'Interaction and visual synthesis', proof: 'Hierarchy, material finish, and motion language resolved.', status: 'Surface tuning in progress' },
    { id: 'build-prepare', indexLabel: '[ 009 / 014 ]', title: 'Build agent', emphasis: 'stages the output', body: `The build unit prepares the ${lane} assembly, wiring the visible surface and the hidden supporting sequences together.`, agent: 'Build Fabricator', narration: 'Preparing the build surface and staging the visible response system.', accent: 'blue', mode: 'build', task: 'Output staging', proof: 'Surface layers and motion hooks assembled.', status: 'Build staging active' },
    { id: 'build-execute', indexLabel: '[ 010 / 014 ]', title: 'Build agent', emphasis: 'runs the work', body: `The system now executes the ${subject} task live while the sub-agent network streams return states and completion markers.`, agent: 'Build Fabricator', narration: 'Build execution is live. The primary process is on stage and the network is reporting progress.', accent: 'blue', mode: 'build', task: 'Primary execution', proof: 'Visible output and reactive orchestration produced.', status: 'Primary execution live' },
    { id: 'qa-verify', indexLabel: '[ 011 / 014 ]', title: 'Review agent', emphasis: 'tests the quality', body: 'Validation checks fidelity, pacing, legibility, and whether the visible answer matches the original request surface.', agent: 'Review Auditor', narration: 'Validation is running. I am testing for fidelity, pacing, and completion quality.', accent: 'gold', mode: 'validation', task: 'Quality verification', proof: 'Sequence fidelity and surface quality validated.', status: 'Verification loop active' },
    { id: 'network-return', indexLabel: '[ 012 / 014 ]', title: 'Network layer', emphasis: 'returns the results', body: 'Sub-agents finish one by one, return their outputs, and fade from the active field as their work is absorbed into the core.', agent: 'Krama Commander', narration: 'Specialist returns are coming in. Finished agents are being collapsed back into the command core.', accent: 'gold', mode: 'merge', task: 'Sub-agent return merge', proof: 'Finished agent outputs consolidated into the command layer.', status: 'Network returns collapsing' },
    { id: 'final-compose', indexLabel: '[ 013 / 014 ]', title: 'Core agent', emphasis: 'composes the answer', body: `The command layer composes the final ${result} response so the user sees one resolved output rather than parallel fragments.`, agent: 'Krama Commander', narration: 'Composing the final answer now and removing unnecessary surface noise.', accent: 'gold', mode: 'merge', task: 'Final response composition', proof: 'One coherent response assembled from all completed work.', status: 'Final composition active' },
    { id: 'deliver-result', indexLabel: '[ 014 / 014 ]', title: 'Response layer', emphasis: 'returns the output', body: `The system settles and presents the completed ${result} output with the network cleared and the next task ready to begin.`, agent: 'Krama Commander', narration: `Final response ready. The ${result} task is complete and the answer is stable.`, accent: 'gold', mode: 'delivery', task: 'User-facing delivery', proof: `Resolved ${result} output returned to the user.`, status: 'Delivery state complete' },
  ];
}

const TEMPLATES: SimulationTemplate[] = [
  { id: 'launch-site', name: 'Launch Site', brief: 'Premium product launch microsite', flow: createFlow('launch site', 'launch build', 'launch-ready'), durations: [3400,3200,3000,3400,3400,3600,3600,3800,3600,3800,3500,3300,3200,4400], nodes: BASE_NODES },
  { id: 'funding-brief', name: 'Funding Brief', brief: 'Investor narrative and deck polish', flow: createFlow('funding brief', 'investor narrative', 'board-ready'), durations: [3400,3200,3000,3600,3400,3600,3800,3600,3400,3600,3500,3200,3200,4300], nodes: BASE_NODES.map((n) => ({ ...n, work: n.label === 'Design' ? 'Aligning story rhythm, layout, and investor hierarchy' : n.work })) },
  { id: 'workflow-audit', name: 'Workflow Audit', brief: 'Operational workflow diagnosis', flow: createFlow('workflow audit', 'operational audit', 'audit-ready'), durations: [3400,3200,3000,3500,3600,3800,3800,3500,3400,3600,3400,3300,3200,4300], nodes: BASE_NODES.map((n) => ({ ...n, work: n.label === 'Signal' ? 'Checking handoff failures and operational bottlenecks' : n.work })) },
  { id: 'content-engine', name: 'Content Engine', brief: 'Multi-channel founder content system', flow: createFlow('content engine', 'content system', 'publishing-ready'), durations: [3400,3200,3000,3400,3400,3600,3600,3900,3600,3800,3400,3300,3200,4300], nodes: BASE_NODES.map((n) => ({ ...n, work: n.label === 'Build' ? 'Producing publishing surfaces and output sequences' : n.work })) },
  { id: 'agent-stack', name: 'Agent Stack', brief: 'Internal multi-agent orchestration stack', flow: createFlow('agent stack', 'orchestration stack', 'ops-ready'), durations: [3500,3300,3000,3500,3600,3900,3900,3800,3600,3900,3500,3400,3300,4500], nodes: BASE_NODES.map((n) => ({ ...n, work: n.label === 'Reason' ? 'Structuring orchestration logic and delegation rules' : n.work })) },
];

const modeClass: Record<VisualMode, string> = {
  thinking: 'mode-thinking',
  routing: 'mode-routing',
  spawn: 'mode-spawn',
  scan: 'mode-scan',
  research: 'mode-research',
  synthesis: 'mode-synthesis',
  build: 'mode-build',
  validation: 'mode-validation',
  merge: 'mode-merge',
  delivery: 'mode-delivery',
};

export default function AgentSimulationPage() {
  const [selectedTemplateId, setSelectedTemplateId] = useState(TEMPLATES[0].id);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [voicePulse, setVoicePulse] = useState(false);
  const [runKey, setRunKey] = useState(1);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  const timersRef = useRef<number[]>([]);
  const autoStartRef = useRef(false);
  const audioContextRef = useRef<AudioContext | null>(null);

  const selectedTemplate = useMemo(
    () => TEMPLATES.find((template) => template.id === selectedTemplateId) ?? TEMPLATES[0],
    [selectedTemplateId]
  );
  const step = selectedTemplate.flow[currentIndex];

  const orbitNodes = useMemo(
    () =>
      selectedTemplate.nodes.map((node) => {
        let state: AgentState = 'queued';
        if (currentIndex >= node.startAt) state = 'live';
        if (currentIndex >= node.doneAt) state = 'done';
        return { ...node, state };
      }),
    [currentIndex, selectedTemplate]
  );

  const liveTasks = useMemo(
    () =>
      selectedTemplate.nodes.map((node) => {
        let state: AgentState = 'queued';
        if (currentIndex >= node.startAt) state = 'live';
        if (currentIndex >= node.doneAt) state = 'done';

        const span = Math.max(1, node.doneAt - node.startAt);
        const activeSpan = Math.min(Math.max(currentIndex - node.startAt + 1, 0), span);
        const progress = state === 'queued' ? 0 : state === 'done' ? 100 : Math.round((activeSpan / span) * 100);

        return { label: node.label, copy: node.work, state, progress };
      }),
    [currentIndex, selectedTemplate]
  );

  const reactiveMeta = useMemo(
    () => ({
      latency: `${28 - Math.min(currentIndex * 2, 16)} ms`,
      confidence: `${61 + currentIndex * 4}%`,
      completion: `${10 + currentIndex * 10}%`,
    }),
    [currentIndex]
  );

  const primaryTrace = useMemo(
    () => liveTasks.find((task) => task.state === 'live') ?? liveTasks.find((task) => task.state === 'done') ?? liveTasks[0],
    [liveTasks]
  );

  const secondaryTrace = useMemo(() => {
    const current = liveTasks.findIndex((task) => task.label === primaryTrace?.label);
    return current >= 0 ? liveTasks[current + 1] : null;
  }, [liveTasks, primaryTrace]);

  const viewfinderTasks = useMemo(
    () => liveTasks.filter((task) => task.state !== 'queued').slice(-3),
    [liveTasks]
  );

  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    try {
      const synth = window.speechSynthesis;
      const assignVoice = () => {
        const voices = typeof synth.getVoices === 'function' ? synth.getVoices() : [];
        if (!voices.length) return;
        const preferred =
          voices.find((voice) => /samantha|allison|ava|daniel/i.test(voice.name)) ??
          voices.find((voice) => /^en/i.test(voice.lang)) ??
          voices[0];
        setSelectedVoice(preferred ?? null);
      };

      assignVoice();
      if (typeof synth.addEventListener === 'function') {
        synth.addEventListener('voiceschanged', assignVoice);
        return () => synth.removeEventListener?.('voiceschanged', assignVoice);
      }
    } catch {
      return;
    }
  }, []);

  const clearTimers = () => {
    timersRef.current.forEach((timer) => window.clearTimeout(timer));
    timersRef.current = [];
  };

  const playTone = (accent: Accent, final = false) => {
    if (typeof window === 'undefined') return;

    try {
      const AudioCtor =
        window.AudioContext ||
        (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtor) return;

      const context = audioContextRef.current ?? new AudioCtor();
      audioContextRef.current = context;
      if (context.state === 'suspended') context.resume().catch(() => undefined);

      const osc = context.createOscillator();
      const gain = context.createGain();
      const now = context.currentTime;
      const start = final ? 760 : accent === 'blue' ? 392 : 548;
      const end = final ? 1010 : accent === 'blue' ? 516 : 712;
      const duration = final ? 0.24 : 0.14;

      osc.type = accent === 'blue' ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(start, now);
      osc.frequency.linearRampToValueAtTime(end, now + duration);
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(final ? 0.038 : 0.02, now + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
      osc.connect(gain);
      gain.connect(context.destination);
      osc.start(now);
      osc.stop(now + duration);
    } catch {
      return;
    }
  };

  const speak = useEffectEvent((text: string, accent: Accent, final = false) => {
    playTone(accent, final);
    if (!voiceEnabled || typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    try {
      const synth = window.speechSynthesis;
      synth.cancel?.();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.voice = selectedVoice ?? null;
      utterance.rate = 0.96;
      utterance.pitch = accent === 'blue' ? 1.05 : 0.92;
      utterance.onstart = () => setVoicePulse(true);
      utterance.onend = utterance.onerror = () => setVoicePulse(false);
      synth.speak(utterance);
    } catch {
      setVoicePulse(false);
    }
  });

  const startRun = () => {
    clearTimers();
    window.speechSynthesis?.cancel?.();
    setCurrentIndex(0);
    setRunKey(Date.now());
  };

  useEffect(() => {
    clearTimers();
    const narrationTimer = window.setTimeout(() => {
      speak(step.narration, step.accent, currentIndex === selectedTemplate.flow.length - 1);
    }, 0);
    timersRef.current.push(narrationTimer);

    const duration = selectedTemplate.durations[currentIndex] ?? 3200;
    if (currentIndex < selectedTemplate.flow.length - 1) {
      const timer = window.setTimeout(() => setCurrentIndex((current) => current + 1), duration);
      timersRef.current.push(timer);
    }

    return () => clearTimers();
  }, [currentIndex, runKey, selectedVoice, selectedTemplate, step, voiceEnabled]);

  useEffect(() => {
    if (autoStartRef.current) return;
    autoStartRef.current = true;
    clearTimers();
    window.speechSynthesis?.cancel?.();
    setCurrentIndex(0);
    setRunKey(Date.now());
  }, []);

  useEffect(() => {
    return () => {
      clearTimers();
      window.speechSynthesis?.cancel?.();
      audioContextRef.current?.close().catch(() => undefined);
    };
  }, []);

  return (
    <>
      <main className="relative min-h-dvh overflow-hidden bg-[radial-gradient(circle_at_50%_18%,rgba(88,163,219,0.16),transparent_24%),radial-gradient(circle_at_48%_88%,rgba(201,159,77,0.12),transparent_24%),linear-gradient(180deg,#071018_0%,#0b131b_42%,#101a24_100%)] text-white">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_44%,rgba(84,164,230,0.12),transparent_18%),radial-gradient(circle_at_32%_72%,rgba(215,176,96,0.1),transparent_20%)] blur-3xl" />
        <div className="pointer-events-none absolute left-[-10rem] top-16 size-[34rem] rounded-full border border-white/6 bg-white/[0.02] [transform:rotate(-18deg)]" />
        <div className="pointer-events-none absolute bottom-10 right-[-12rem] size-[38rem] rounded-full border border-white/6 bg-white/[0.02] [transform:rotate(18deg)]" />
        <div className="pointer-events-none absolute inset-x-[18%] top-24 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <div className="pointer-events-none absolute inset-x-[22%] bottom-20 h-px bg-gradient-to-r from-transparent via-white/8 to-transparent" />

        <div className="relative z-10 flex min-h-dvh flex-col px-6 py-5">
          <header className="mb-6 flex items-start justify-between">
            <Link href="/" className="text-[28px] tracking-[0.14em] text-white/92 transition-opacity hover:opacity-70">
              ( KRAMA_AI )
            </Link>

            <nav className="grid gap-2 text-right text-[12px] uppercase tracking-[0.16em] text-white/42">
              {['home', 'agents', 'system', 'contact'].map((item) => (
                <span key={item} className="inline-flex items-center justify-end gap-1.5">
                  {item} <ArrowUpRight size={12} />
                </span>
              ))}
            </nav>
          </header>

          <div className="relative flex flex-1 items-center justify-center">
            <div className="absolute left-12 top-18 text-[11px] uppercase tracking-[0.28em] text-white/45">[ v.03a ]</div>
            <div className="absolute left-12 top-30 flex max-w-[540px] flex-wrap gap-2">
              {TEMPLATES.map((template) => (
                <button
                  key={template.id}
                  type="button"
                  onClick={() => {
                    setSelectedTemplateId(template.id);
                    setCurrentIndex(0);
                    setRunKey(Date.now());
                  }}
                  className={cn(
                    'rounded-full border px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] transition-all',
                    template.id === selectedTemplateId
                      ? 'border-white/18 bg-white/[0.08] text-white shadow-[0_8px_24px_rgba(0,0,0,0.16)]'
                      : 'border-white/8 bg-white/[0.02] text-white/45 hover:bg-white/[0.05] hover:text-white/74'
                  )}
                >
                  {template.name}
                </button>
              ))}
            </div>
            <div className="absolute left-12 top-44 max-w-[380px] text-[12px] leading-6 text-white/42">
              {selectedTemplate.brief}
            </div>

            <div className="relative grid w-full max-w-[1500px] grid-cols-[320px_minmax(560px,1fr)_300px] items-center gap-8 xl:grid-cols-[300px_minmax(520px,1fr)_280px] lg:grid-cols-1 lg:gap-6">
              <aside className="justify-self-start lg:w-full">
                <div key={`left-${step.id}`} className="intent-reveal flex flex-col gap-5">
                  <Badge variant="outline" className="w-fit rounded-full border-white/10 bg-white/[0.03] px-3 py-1 text-[10px] tracking-[0.24em] text-white/66 backdrop-blur-md">
                    {step.agent}
                  </Badge>

                  <div className="space-y-4">
                    <h1 className="max-w-[9ch] text-[3.3rem] leading-[0.84] font-medium tracking-[-0.055em] text-white md:text-[4.35rem]">
                      {step.title} <em className="font-normal text-[#e4c17b] not-italic">{step.emphasis}</em>
                    </h1>
                    <p className="max-w-[32ch] text-[14px] leading-7 text-white/62">{step.body}</p>
                  </div>

                  <div className="flex max-w-[290px] flex-wrap items-center gap-2">
                    <span className="text-[10px] uppercase tracking-[0.22em] text-white/38">active task</span>
                    <Separator className="h-px w-10 bg-white/8" />
                    <Badge
                      variant="secondary"
                      className={cn(
                        'rounded-full border-0 px-2.5 py-0.5 text-[10px] tracking-[0.16em]',
                        step.accent === 'blue'
                          ? 'bg-sky-400/10 text-sky-200'
                          : 'bg-amber-300/10 text-amber-200'
                      )}
                    >
                      {step.indexLabel}
                    </Badge>
                  </div>

                  <div className="max-w-[31ch] space-y-2.5">
                    <h2 className="text-[1.2rem] font-medium tracking-[-0.02em] text-white/94">{step.task}</h2>
                    <p className="text-[13px] leading-6 text-white/50">{step.proof}</p>
                  </div>

                  <div key={`narrative-${step.id}`} className="intent-reveal-soft max-w-[28ch] space-y-1.5">
                    <span className="text-[10px] uppercase tracking-[0.22em] text-white/34">current narration</span>
                    <p className="mb-0 text-[13px] leading-6 text-white/58">{step.status}</p>
                  </div>

                  <div className="flex gap-3 pt-1">
                    <Button
                      variant="outline"
                      size="icon"
                      className="size-12 rounded-full border-white/10 bg-white/[0.035] text-white/88 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_10px_30px_rgba(0,0,0,0.18)] backdrop-blur-xl hover:bg-white/[0.08]"
                      onClick={() => {
                        setVoiceEnabled((current) => {
                          const next = !current;
                          if (!next) {
                            window.speechSynthesis?.cancel?.();
                            setVoicePulse(false);
                          }
                          return next;
                        });
                      }}
                    >
                      {voiceEnabled ? <Mic /> : <MicOff />}
                    </Button>

                    <Button
                      variant="outline"
                      className="h-12 rounded-full border-white/10 bg-white/[0.035] px-5 text-white/88 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_10px_30px_rgba(0,0,0,0.18)] backdrop-blur-xl hover:bg-white/[0.08]"
                      onClick={startRun}
                    >
                      <RefreshCw data-icon="inline-start" />
                      Restart Flow
                    </Button>
                  </div>
                </div>
              </aside>

              <section className="flex min-h-[760px] items-center justify-center lg:min-h-[620px]">
                <div className={cn('agent-core relative aspect-square w-[min(52vw,680px)] min-w-[520px] lg:min-w-0 lg:w-[min(88vw,620px)]', modeClass[step.mode])}>
                  <div className={cn(
                    'absolute inset-1/2 size-[62%] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl',
                    step.accent === 'blue' ? 'bg-sky-400/20' : 'bg-amber-300/18'
                  )} />
                  <div className="absolute inset-1/2 size-[72%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/6 opacity-50" />
                  <div className="absolute inset-1/2 size-[84%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/4 opacity-40" />

                  <div className="thought-halo absolute inset-0">
                    {Array.from({ length: 28 }).map((_, index) => (
                      <span
                        key={`thought-${index}`}
                        className="halo-line absolute left-1/2 top-1/2 h-40 w-px rounded-full bg-gradient-to-b from-white/70 to-amber-200/5 opacity-0"
                        style={{ ['--i' as string]: index } as CSSProperties}
                      />
                    ))}
                  </div>

                  <div className="lane-field absolute inset-0">
                    {Array.from({ length: 6 }).map((_, index) => (
                      <span
                        key={`lane-${index}`}
                        className={cn(
                          'lane-line absolute left-1/2 top-1/2 h-56 w-px rounded-full bg-gradient-to-b from-white/60 to-transparent opacity-0',
                          step.accent === 'blue' && 'from-sky-100/70'
                        )}
                        style={{ ['--i' as string]: index } as CSSProperties}
                      />
                    ))}
                  </div>

                  <div className="absolute inset-0">
                    {Array.from({ length: 3 }).map((_, index) => (
                      <span
                        key={`ring-${index}`}
                        className={cn(
                          'orbit-ring absolute left-1/2 top-1/2 rounded-full border opacity-0',
                          step.accent === 'blue' ? 'border-sky-300/16' : 'border-white/10'
                        )}
                        style={
                          {
                            width: `${312 + index * 42}px`,
                            height: `${312 + index * 42}px`,
                            marginLeft: `${-(312 + index * 42) / 2}px`,
                            marginTop: `${-(312 + index * 42) / 2}px`,
                          } as CSSProperties
                        }
                      />
                    ))}
                  </div>

                  <div className="data-pulses absolute inset-0">
                    {Array.from({ length: 20 }).map((_, index) => (
                      <span
                        key={`pulse-${index}`}
                        className="pulse-dot absolute left-1/2 top-1/2 size-1.5 rounded-full bg-sky-300 opacity-0 shadow-[0_0_12px_rgba(87,175,231,0.45)]"
                        style={{ ['--i' as string]: index } as CSSProperties}
                      />
                    ))}
                  </div>

                  {orbitNodes.map((node) => (
                    <div
                      key={node.label}
                      className={cn('orbit-node absolute left-1/2 top-1/2 z-10 size-28 -translate-x-1/2 -translate-y-1/2', `node-${node.state}`)}
                      style={
                        {
                          ['--angle' as string]: `${node.angle}deg`,
                          ['--distance' as string]: `${node.distance}px`,
                        } as CSSProperties
                      }
                    >
                      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[calc(var(--distance)-72px)] w-px -translate-x-1/2 bg-gradient-to-b from-white/20 to-transparent opacity-0 node-beam" />
                      <div className="node-shell absolute inset-[18px] grid place-items-center rounded-[26px_34px_28px_32px] border border-white/10 bg-white/[0.045] text-[11px] tracking-[0.2em] text-white/82 uppercase shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_20px_30px_rgba(0,0,0,0.18)] backdrop-blur-xl">
                        {node.label}
                      </div>
                    </div>
                  ))}

                  <div className="absolute inset-1/2 z-20 size-[30%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10 bg-[radial-gradient(circle_at_35%_28%,rgba(255,255,255,0.18),rgba(255,255,255,0.02)_56%),linear-gradient(180deg,rgba(48,66,82,0.68),rgba(14,24,34,0.3))] shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_30px_60px_rgba(0,0,0,0.26)] backdrop-blur-2xl" />

                  <div key={`status-${step.id}`} className="intent-reveal-soft absolute left-1/2 top-[72%] z-30 flex h-11 -translate-x-1/2 items-center rounded-full border border-white/10 bg-black/16 px-5 text-[11px] tracking-[0.22em] text-white/70 uppercase shadow-[0_10px_28px_rgba(0,0,0,0.14)] backdrop-blur-md">
                    {step.status}
                  </div>

                  <div className={cn(
                    'absolute left-1/2 top-1/2 z-30 grid size-24 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-[24px_30px_24px_32px] border border-white/12 bg-white/[0.07] text-amber-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_20px_34px_rgba(0,0,0,0.22)] backdrop-blur-xl transition-transform duration-500',
                    voicePulse && 'scale-[1.05]'
                  )}>
                    {voicePulse ? <AudioLines size={20} /> : <Share2 size={18} />}
                  </div>

                  <div className="absolute right-[-6%] top-[16%] z-30 flex w-[280px] flex-col gap-2 lg:right-0 lg:top-[8%] lg:w-[240px]">
                    {viewfinderTasks.map((task, index) => (
                      <div
                        key={`${selectedTemplate.id}-${step.id}-${task.label}`}
                        className={cn(
                          'intent-reveal-soft rounded-[22px_28px_22px_26px] border border-white/10 bg-white/[0.04] px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_20px_36px_rgba(0,0,0,0.16)] backdrop-blur-xl transition-all duration-700',
                          task.state === 'done' && 'opacity-34 saturate-75'
                        )}
                        style={{ ['--delay' as string]: `${index * 90}ms` } as CSSProperties}
                      >
                        <div className="mb-2 flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2">
                            <span
                              className={cn(
                                'size-2 rounded-full',
                                task.state === 'live' && 'bg-sky-300 shadow-[0_0_12px_rgba(88,178,240,0.35)]',
                                task.state === 'done' && 'bg-amber-200 shadow-[0_0_10px_rgba(226,193,123,0.24)]'
                              )}
                            />
                            <span className="text-[10px] uppercase tracking-[0.2em] text-white/82">{task.label}</span>
                          </div>
                          <span className={cn('text-[9px] uppercase tracking-[0.16em]', task.state === 'live' ? 'text-sky-200' : 'text-amber-100')}>
                            {task.state}
                          </span>
                        </div>
                        <p className="mb-2 text-[12px] leading-5 text-white/54">{task.copy}</p>
                        <div className="h-px w-full overflow-hidden rounded-full bg-white/8">
                          <div
                            className={cn('h-full transition-all duration-700', task.state === 'live' ? 'bg-sky-300/70' : 'bg-amber-200/60')}
                            style={{ width: `${task.progress}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              <aside className="justify-self-end lg:w-full">
                <div key={`right-${step.id}`} className="intent-reveal flex flex-col items-end gap-5 lg:items-start">
                  <div className="w-full max-w-[270px] space-y-4">
                    <div className="flex items-center justify-end gap-2 lg:justify-start">
                      <Badge variant="outline" className="rounded-full border-white/10 bg-white/[0.03] px-3 py-1 text-[10px] tracking-[0.24em] text-white/62 backdrop-blur-md">
                        {step.indexLabel}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between text-white/36 uppercase tracking-[0.2em] text-[10px]">
                      <span>system telemetry</span>
                      <Gauge size={14} />
                    </div>
                    <div className="grid grid-cols-3 gap-5">
                      <InlineMetric label="latency" value={reactiveMeta.latency} accent={step.accent} />
                      <InlineMetric label="confidence" value={reactiveMeta.confidence} accent={step.accent} />
                      <InlineMetric label="completion" value={reactiveMeta.completion} accent={step.accent} />
                    </div>
                  </div>

                  <div className="flex w-full max-w-[290px] flex-col gap-4">
                    {primaryTrace ? (
                      <div key={`${step.id}-${primaryTrace.label}`} className="intent-reveal-soft relative pl-5">
                        <span
                          className={cn(
                            'absolute left-0 top-1.5 size-2.5 rounded-full',
                            primaryTrace.state === 'queued' && 'bg-white/20',
                            primaryTrace.state === 'live' && 'bg-sky-300 shadow-[0_0_14px_rgba(93,190,242,0.38)]',
                            primaryTrace.state === 'done' && 'bg-amber-200 shadow-[0_0_12px_rgba(233,196,119,0.26)]'
                          )}
                        />
                        <div className="mb-1 flex items-center justify-between gap-3">
                          <span className="text-[11px] font-medium tracking-[0.2em] text-white/82 uppercase">{primaryTrace.label}</span>
                          <span
                            className={cn(
                              'text-[9px] uppercase tracking-[0.16em]',
                              primaryTrace.state === 'live' && 'text-sky-200',
                              primaryTrace.state === 'done' && 'text-amber-100',
                              primaryTrace.state === 'queued' && 'text-white/36'
                            )}
                          >
                            {primaryTrace.state}
                          </span>
                        </div>
                        <p className="text-[13px] leading-6 text-white/52">{primaryTrace.copy}</p>
                      </div>
                    ) : null}

                    {secondaryTrace ? (
                      <div key={`${step.id}-${secondaryTrace.label}-next`} className="intent-reveal-soft flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-white/30">
                        <span className="size-1.5 rounded-full bg-white/18" />
                        next: {secondaryTrace.label}
                      </div>
                    ) : null}
                  </div>
                </div>
              </aside>
            </div>
          </div>

          <footer className="relative z-10 mt-2 flex items-center gap-4 px-4 pb-3">
            <div className="grid size-10 place-items-center text-white/56">
              <Share2 size={14} />
            </div>

            <div className="mx-auto flex w-full max-w-[640px] items-center gap-3 px-4 py-3">
              <Orbit size={16} className="text-white/36" />
              <div className="flex flex-1 gap-2">
                {selectedTemplate.flow.map((item, index) => (
                  <span
                    key={item.id}
                    className={cn(
                      'h-2 flex-1 rounded-full border border-white/8 bg-white/10 transition-all duration-500',
                      index === currentIndex && 'bg-amber-200/60 shadow-[0_0_16px_rgba(226,193,123,0.26)]',
                      index < currentIndex && 'bg-white/28'
                    )}
                  />
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 px-2 py-2 text-[11px] uppercase tracking-[0.22em] text-white/54">
              <Sparkles size={14} />
              {step.status}
            </div>
          </footer>
        </div>
      </main>

      <style jsx global>{`
        @keyframes intent-reveal {
          0% {
            opacity: 0;
            transform: translateY(18px) scale(0.985);
            filter: blur(10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
            filter: blur(0);
          }
        }

        @keyframes intent-reveal-soft {
          0% {
            opacity: 0;
            transform: translateY(14px);
            filter: blur(8px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
            filter: blur(0);
          }
        }

        @keyframes thought-sweep {
          0%, 100% {
            transform: rotate(calc(var(--i) * 12.857deg)) translateY(-118px) scaleY(0.56);
            opacity: 0.14;
          }
          50% {
            transform: rotate(calc(var(--i) * 12.857deg + 20deg)) translateY(-142px) scaleY(1.06);
            opacity: 0.86;
          }
        }

        @keyframes lane-open {
          0%, 100% {
            transform: rotate(calc(var(--i) * 60deg - 90deg)) translateY(-150px) scaleY(0.2);
            opacity: 0.18;
          }
          50% {
            transform: rotate(calc(var(--i) * 60deg - 90deg)) translateY(-168px) scaleY(1);
            opacity: 0.88;
          }
        }

        @keyframes ring-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes ring-breathe {
          0%, 100% { transform: scale(0.985); opacity: 0.2; }
          50% { transform: scale(1.018); opacity: 0.32; }
        }

        @keyframes pulse-orbit {
          0% {
            transform: rotate(calc(var(--i) * 18deg)) translateY(-128px) scale(0.3);
            opacity: 0;
          }
          50% {
            transform: rotate(calc(var(--i) * 18deg + 90deg)) translateY(-204px) scale(1);
            opacity: 1;
          }
          100% {
            transform: rotate(calc(var(--i) * 18deg + 180deg)) translateY(-128px) scale(0.3);
            opacity: 0;
          }
        }

        @keyframes pulse-orbit-soft {
          0%, 100% {
            transform: rotate(calc(var(--i) * 18deg)) translateY(-150px) scale(0.42);
            opacity: 0.18;
          }
          50% {
            transform: rotate(calc(var(--i) * 18deg + 48deg)) translateY(-186px) scale(0.9);
            opacity: 0.84;
          }
        }

        @keyframes pulse-collapse {
          0%, 100% {
            transform: rotate(calc(var(--i) * 18deg)) translateY(-176px) scale(0.26);
            opacity: 0;
          }
          50% {
            transform: rotate(calc(var(--i) * 18deg)) translateY(-100px) scale(0.74);
            opacity: 0.72;
          }
        }

        @keyframes node-live {
          0%, 100% { transform: rotate(var(--angle)) translateY(calc(var(--distance) * -1)) rotate(calc(var(--angle) * -1)) scale(1); }
          50% { transform: rotate(var(--angle)) translateY(calc(var(--distance) * -1)) rotate(calc(var(--angle) * -1)) scale(1.045); }
        }

        @keyframes node-appear {
          from {
            opacity: 0;
            transform: rotate(var(--angle)) translateY(-118px) rotate(calc(var(--angle) * -1)) scale(0.7);
          }
          to {
            opacity: 1;
            transform: rotate(var(--angle)) translateY(calc(var(--distance) * -1)) rotate(calc(var(--angle) * -1)) scale(1);
          }
        }

        .intent-reveal {
          animation: intent-reveal 700ms cubic-bezier(0.22, 1, 0.36, 1);
        }

        .intent-reveal-soft {
          animation: intent-reveal-soft 820ms cubic-bezier(0.22, 1, 0.36, 1);
        }

        .intent-cascade {
          animation: intent-reveal-soft 720ms cubic-bezier(0.22, 1, 0.36, 1);
          animation-delay: var(--delay, 0ms);
          animation-fill-mode: both;
        }

        .halo-line {
          margin-left: -1px;
          margin-top: -82px;
        }

        .lane-line {
          margin-left: -1px;
          margin-top: -111px;
        }

        .pulse-dot {
          margin-left: -3px;
          margin-top: -3px;
        }

        .orbit-node {
          transform: rotate(var(--angle)) translateY(calc(var(--distance) * -1)) rotate(calc(var(--angle) * -1));
        }

        .node-live {
          animation: node-live 2s ease-in-out infinite;
        }

        .node-live .node-shell,
        .node-live .node-beam,
        .node-done .node-shell,
        .node-done .node-beam {
          opacity: 1;
        }

        .node-done .node-shell {
          border-color: rgba(226, 191, 117, 0.2);
          color: rgba(245, 224, 179, 0.94);
          background: linear-gradient(180deg, rgba(92, 69, 34, 0.36), rgba(25, 22, 18, 0.34)), rgba(255,255,255,0.03);
        }

        .node-queued .node-shell,
        .node-queued .node-beam {
          opacity: 0;
        }

        .mode-thinking .halo-line {
          opacity: 1;
          animation: thought-sweep 3s ease-in-out infinite;
          animation-delay: calc(var(--i) * 0.03s);
        }

        .mode-routing .halo-line {
          opacity: 0.45;
        }

        .mode-routing .lane-line,
        .mode-spawn .lane-line,
        .mode-scan .lane-line,
        .mode-research .lane-line,
        .mode-synthesis .lane-line,
        .mode-build .lane-line,
        .mode-validation .lane-line,
        .mode-merge .lane-line,
        .mode-delivery .lane-line {
          opacity: 1;
        }

        .mode-routing .lane-line {
          animation: lane-open 2.2s ease-in-out infinite;
          animation-delay: calc(var(--i) * 0.1s);
        }

        .mode-spawn .orbit-ring,
        .mode-scan .orbit-ring,
        .mode-research .orbit-ring,
        .mode-synthesis .orbit-ring,
        .mode-build .orbit-ring,
        .mode-validation .orbit-ring,
        .mode-merge .orbit-ring,
        .mode-delivery .orbit-ring {
          opacity: 0.3;
        }

        .mode-spawn .orbit-ring,
        .mode-scan .orbit-ring,
        .mode-research .orbit-ring,
        .mode-build .orbit-ring {
          animation: ring-spin 16s linear infinite;
        }

        .mode-synthesis .orbit-ring,
        .mode-validation .orbit-ring,
        .mode-merge .orbit-ring,
        .mode-delivery .orbit-ring {
          animation: ring-breathe 4.5s ease-in-out infinite;
        }

        .mode-scan .pulse-dot,
        .mode-research .pulse-dot,
        .mode-build .pulse-dot {
          opacity: 1;
          animation: pulse-orbit 2.3s linear infinite;
          animation-delay: calc(var(--i) * 0.07s);
        }

        .mode-synthesis .pulse-dot {
          opacity: 0.74;
          animation: pulse-orbit-soft 2.8s ease-in-out infinite;
          animation-delay: calc(var(--i) * 0.06s);
        }

        .mode-validation .pulse-dot,
        .mode-merge .pulse-dot {
          opacity: 0.42;
          animation: pulse-collapse 2s ease-in-out infinite;
          animation-delay: calc(var(--i) * 0.04s);
        }

        .mode-delivery .pulse-dot {
          opacity: 0.14;
        }

        .mode-spawn .node-live {
          animation: node-appear 900ms ease forwards;
        }
      `}</style>
    </>
  );
}

function InlineMetric({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent: Accent;
}) {
  return (
    <div className="space-y-1">
      <div className="text-[9px] uppercase tracking-[0.18em] text-white/34">{label}</div>
      <div className={cn('text-sm font-medium', accent === 'blue' ? 'text-sky-100' : 'text-amber-100')}>
        {value}
      </div>
    </div>
  );
}
