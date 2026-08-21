'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useState, type ReactNode } from 'react';
import {
  Archive, ArrowDown, ArrowRight, Blocks, BookOpen, Check, ChevronRight,
  CircleDot, CornerDownRight, FileCheck2, FolderKanban, LayoutDashboard, Play,
  Search, Sparkles, Workflow,
} from 'lucide-react';
import {
  blocks,
  contextSources,
  delegationAgents,
  outputs,
  reviews,
  runStages,
} from '@/lib/blocks/blocksData';
import styles from './blocks.module.css';

type SectionId = 'overview' | 'blocks' | 'runs' | 'context' | 'reviews' | 'outputs';

const nav = [
  { id: 'overview' as const, label: 'Overview', icon: LayoutDashboard },
  { id: 'blocks' as const, label: 'Delegation', icon: Blocks },
  { id: 'runs' as const, label: 'Runs', icon: Play },
  { id: 'context' as const, label: 'Context', icon: BookOpen },
  { id: 'reviews' as const, label: 'Reviews', icon: FileCheck2, count: 1 },
  { id: 'outputs' as const, label: 'Outputs', icon: Archive },
];

function Status({ children, tone = 'neutral' }: { children: ReactNode; tone?: 'neutral' | 'gold' | 'green' | 'amber' }) {
  return <span className={`${styles.status} ${styles[tone]}`}>{children}</span>;
}

function SectionMarker({ coordinate, label }: { coordinate: string; label: string }) {
  return <div className={styles.coordinate}><span>{coordinate}</span>{label}</div>;
}

export function BlocksWorkspace() {
  const [activeSection, setActiveSection] = useState<SectionId>('overview');
  const [activeAgent, setActiveAgent] = useState(0);
  const [handoffAgent, setHandoffAgent] = useState<number | null>(null);
  const [runStarted, setRunStarted] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedBlock, setSelectedBlock] = useState(blocks[0]);
  const filteredBlocks = useMemo(
    () => blocks.filter((block) => `${block.name} ${block.category} ${block.summary}`.toLowerCase().includes(query.toLowerCase())),
    [query],
  );

  useEffect(() => {
    const sections = nav.map(({ id }) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && setActiveSection(entry.target.id as SectionId)),
      { rootMargin: '-18% 0px -58% 0px', threshold: 0 },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const moveTo = (id: SectionId) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  const activateAgent = (index: number) => {
    setHandoffAgent(index);
    window.setTimeout(() => {
      setActiveAgent(index);
      setHandoffAgent(null);
    }, 360);
  };

  const beginDelegation = () => {
    setRunStarted(true);
    moveTo('blocks');
  };

  return (
    <main className={styles.workspace} data-active-section={activeSection}>
      <div className={styles.atmosphere} aria-hidden="true" />
      <p className={styles.srOnly} aria-live="polite">Current Blocks focus: {activeSection}.</p>

      <header className={styles.floatingNav}>
        <Link href="/" className={styles.brand} aria-label="Kramaniti home">
          <Image src="/assets/brand/kramaniti-mark-gold.png" alt="Kramaniti" width={38} height={38} priority />
          <span><strong>Kramaniti</strong><small>Blocks</small></span>
        </Link>
        <nav aria-label="Blocks workspace chapters">
          {nav.map((item) => <button key={item.id} type="button" className={activeSection === item.id ? styles.activeNav : ''} onClick={() => moveTo(item.id)} aria-label={item.label} title={item.label} aria-current={activeSection === item.id ? 'step' : undefined}><item.icon size={15} /><span>{item.label}</span>{item.count ? <em>{item.count}</em> : null}</button>)}
        </nav>
        <div className={styles.navSignal}><CircleDot size={11} /><span>Ready</span></div>
      </header>

      <div className={styles.journeyRail} aria-hidden="true"><span className={styles.railBase} /><span className={styles.railProgress} /></div>

      <section id="overview" className={`${styles.threshold} ${styles.flowSection}`} aria-labelledby="blocks-title">
        <span className={`${styles.atmosphericWord} ${styles.wordClarity}`} aria-hidden="true">Clarity</span>
        <div className={styles.thresholdGrid}>
          <div className={styles.thresholdCopy}>
            <SectionMarker coordinate="01" label="Signal corridor" />
            <h1 id="blocks-title">Coordinate the work.</h1>
            <p className={styles.lede}>Delegate the right question to the right specialist, keep the handoff visible, and leave consequential judgment with a person.</p>
            <div className={styles.entryActions}>
              <button type="button" className={styles.primaryAction} onClick={beginDelegation}><span>{runStarted ? 'Delegation active' : 'Begin delegation'}</span><ArrowRight size={18} /></button>
              <button type="button" className={styles.textAction} onClick={() => moveTo('runs')}>Explore the run sequence <ArrowDown size={16} /></button>
            </div>
          </div>
          <div className={styles.portalStage} data-state={runStarted ? 'active' : 'dormant'}>
            <div className={styles.portalDoor}><Sparkles size={46} strokeWidth={1} /></div>
            <span className={styles.thresholdRail} />
            <div className={styles.thresholdSignal}><span className={styles.semanticNode} /><span>{runStarted ? 'Delegation in focus' : 'Awaiting first signal'}</span></div>
            <div className={styles.signalLegend}><span><i />Human-led</span><span><i />AI-assisted</span><span><i />Review gate</span></div>
          </div>
        </div>
        <button type="button" className={styles.continueCue} onClick={() => moveTo('blocks')}><span>Follow the handoff</span><ArrowDown size={16} /></button>
      </section>

      <section id="blocks" className={`${styles.delegation} ${styles.flowSection}`} aria-labelledby="delegation-title">
        <span className={`${styles.atmosphericWord} ${styles.wordBuild}`} aria-hidden="true">Build</span>
        <div className={styles.sectionFrame}>
          <div className={styles.sectionIntro}>
            <SectionMarker coordinate="02" label="Agent delegation" />
            <h2 id="delegation-title">A visible handoff, not a hidden swarm.</h2>
            <p>Blocks routes a repeatable workflow through specialist agents. Each one has a role, a boundary, and a named handoff into the next decision.</p>
            <div className={styles.contextReadout}><span>Current coordination</span><strong>{delegationAgents[activeAgent].name} → {delegationAgents[Math.min(activeAgent + 1, delegationAgents.length - 1)].name}</strong></div>
          </div>

          <div className={styles.delegationSystem}>
            <div className={styles.agentConstellation} aria-hidden="true">
              <span className={styles.constellationRing} /><span className={styles.constellationRing} /><span className={styles.constellationCore}><Workflow size={22} /></span>
              {delegationAgents.map((agent, index) => <span key={agent.id} className={`${styles.agentOrbit} ${index === activeAgent ? styles.orbitFocus : ''} ${index < activeAgent ? styles.orbitComplete : ''}`} style={{ '--agent-index': index } as React.CSSProperties} />)}
            </div>
            <div className={styles.agentSequence}>
              {delegationAgents.map((agent, index) => {
                const state = handoffAgent === index ? 'handoff' : index === activeAgent ? 'focus' : index < activeAgent ? 'complete' : 'dormant';
                return <button type="button" key={agent.id} className={styles.agentStep} data-state={state} aria-pressed={index === activeAgent} onClick={() => activateAgent(index)} onFocus={() => activateAgent(index)}>
                  <span className={styles.agentNode}>{state === 'complete' ? <Check size={13} /> : null}</span>
                  <span className={styles.agentContent}><small>{agent.coordinate} · {state}</small><strong>{agent.name}</strong><em>{agent.role}</em><span>{agent.description}</span></span>
                </button>;
              })}
            </div>
            <aside className={styles.agentReadout} aria-live="polite">
              <span className={styles.kicker}>Focused agent</span>
              <h3>{delegationAgents[activeAgent].name}</h3>
              <p>{delegationAgents[activeAgent].handoff}</p>
              <Status tone={delegationAgents[activeAgent].mode === 'Human review' ? 'amber' : delegationAgents[activeAgent].mode === 'AI-assisted' ? 'gold' : 'green'}>{delegationAgents[activeAgent].mode}</Status>
              <small className={styles.blockFocus}>Block in focus · {selectedBlock.name}</small>
              <button type="button" className={styles.secondaryAction} onClick={() => moveTo(activeAgent === delegationAgents.length - 1 ? 'reviews' : 'runs')}>Trace next handoff <ChevronRight size={16} /></button>
            </aside>
          </div>
          <div className={styles.blockRelay}>
            <div className={styles.blockRelayHead}><div><span className={styles.kicker}>Capability catalogue</span><h3>Choose the work worth carrying forward.</h3></div><label className={styles.search}><Search size={15} /><span className={styles.srOnly}>Search blocks</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search blocks" /></label></div>
            <div className={styles.blockOptions}>{filteredBlocks.map((block) => <button type="button" key={block.id} className={selectedBlock.id === block.id ? styles.selectedBlock : ''} onClick={() => setSelectedBlock(block)}><small>{block.category} · {block.status}</small><strong>{block.name}</strong><span>{block.summary}</span></button>)}</div>
          </div>
        </div>
      </section>

      <section id="runs" className={`${styles.runs} ${styles.flowSection}`} aria-labelledby="runs-title">
        <div className={styles.sectionFrame}>
          <div className={styles.sectionIntro}><SectionMarker coordinate="03" label="Run sequence" /><h2 id="runs-title">Every stage carries its own context.</h2><p>Watch the work move from a framed question to an approved action. No invisible leap from prompt to outcome.</p></div>
          <div className={styles.runArchitecture}>
            <div className={styles.timeline}>
              {runStages.map((stage, index) => { const state = runStarted ? stage.status : index === 0 ? 'Waiting' : 'Queued'; return <article className={styles.timelineItem} key={stage.name}><span className={`${styles.timelineMarker} ${state === 'Complete' ? styles.completeMarker : state === 'Active' ? styles.activeMarker : ''}`}>{state === 'Complete' ? <Check size={14} /> : index + 1}</span><div><div className={styles.timelineHead}><strong>{stage.name}</strong><Status tone={stage.mode === 'Human review' ? 'amber' : 'neutral'}>{stage.mode}</Status></div><p>{stage.detail}</p><small>{state}</small></div></article>; })}
            </div>
            <div className={styles.runAction}><span className={styles.kicker}>Local prototype boundary</span><h3>{runStarted ? 'The run is moving.' : 'Ready to test the handoff.'}</h3><p>This vertical slice changes local interface state only. It does not call a model, write data, or contact another system.</p><button type="button" className={styles.primaryAction} onClick={() => setRunStarted(true)} disabled={runStarted}><span>{runStarted ? 'Run active' : 'Start demo run'}</span><Play size={17} /></button></div>
          </div>
        </div>
      </section>

      <section id="context" className={`${styles.context} ${styles.flowSection}`} aria-labelledby="context-title">
        <div className={styles.sectionFrame}><div className={styles.sectionIntro}><SectionMarker coordinate="04" label="Knowledge boundary" /><h2 id="context-title">Context stays beside the work.</h2><p>Every delegation needs a visible source boundary: what the run may use, where it applies, and what still needs confirmation.</p></div><div className={styles.sourceRelay}>{contextSources.map((source) => <article key={source.name} className={styles.sourceStage}><span className={styles.sourceNode}><FolderKanban size={16} /></span><div><small>{source.type} · {source.scope}</small><strong>{source.name}</strong><span>{source.freshness}</span></div><Status tone={source.state === 'Available' ? 'green' : 'amber'}>{source.state}</Status></article>)}</div></div>
      </section>

      <section id="reviews" className={`${styles.reviews} ${styles.flowSection}`} aria-labelledby="reviews-title">
        <div className={styles.sectionFrame}><div className={styles.sectionIntro}><SectionMarker coordinate="05" label="Human decision" /><h2 id="reviews-title">The system pauses where judgment matters.</h2><p>Agents can structure, synthesise, and prepare. A named person still decides whether the recommendation should change the work.</p></div><div className={styles.reviewArchitecture}><div className={styles.reviewSignal} aria-hidden="true"><span /><i /><b /></div><div className={styles.reviewCopy}><Status tone="amber">1 waiting</Status><h3>{reviews[0].title}</h3><p>Review the evidence before the action plan is created. The downstream effect stays visible before approval.</p><small>Owner: {reviews[0].owner} · {reviews[0].due}</small></div><button type="button" className={styles.primaryAction} onClick={() => moveTo('outputs')}><span>Trace the decision</span><CornerDownRight size={18} /></button></div></div>
      </section>

      <section id="outputs" className={`${styles.outputs} ${styles.flowSection}`} aria-labelledby="outputs-title">
        <span className={`${styles.atmosphericWord} ${styles.wordSignal}`} aria-hidden="true">Signal</span>
        <div className={styles.sectionFrame}><div className={styles.sectionIntro}><SectionMarker coordinate="06" label="Output handoff" /><h2 id="outputs-title">Move from signal to system.</h2><p>Outputs retain their origin, state, and approval trail so the work can improve the next run.</p></div><div className={styles.outputRelay}>{outputs.map((output) => <article key={output.title} className={styles.outputStage}><span className={styles.outputNode}><Archive size={17} /></span><div><strong>{output.title}</strong><small>{output.type} · {output.run}</small><span>{output.time}</span></div><Status tone={output.state === 'Approved' ? 'green' : 'gold'}>{output.state}</Status></article>)}</div><Link href="/#contact" className={styles.primaryAction}><span>Move from Blocks to a real workflow</span><ArrowRight size={18} /></Link></div>
        <footer className={styles.flowFooter}><span>Kramaniti · Logic in sequence</span><Link href="/">Return to the information-led website</Link></footer>
      </section>
    </main>
  );
}
