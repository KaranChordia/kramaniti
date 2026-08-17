'use client';

import Image from 'next/image';
import { useMemo, useState } from 'react';
import {
  Activity, Archive, Blocks, BookOpen, Check, ChevronRight, CircleDot,
  FileCheck2, FolderKanban, LayoutDashboard, Menu, Play, Search, ShieldCheck, X,
} from 'lucide-react';
import { blocks, contextSources, outputs, reviews, runStages, type BlockDefinition } from '@/lib/blocks/blocksData';
import styles from './blocks.module.css';

type View = 'overview' | 'blocks' | 'runs' | 'context' | 'reviews' | 'outputs';

const nav = [
  { id: 'overview' as const, label: 'Overview', icon: LayoutDashboard },
  { id: 'blocks' as const, label: 'Blocks', icon: Blocks },
  { id: 'runs' as const, label: 'Runs', icon: Play },
  { id: 'context' as const, label: 'Context', icon: BookOpen },
  { id: 'reviews' as const, label: 'Reviews', icon: FileCheck2, count: 1 },
  { id: 'outputs' as const, label: 'Outputs', icon: Archive },
];

function Status({ children, tone = 'neutral' }: { children: React.ReactNode; tone?: 'neutral' | 'gold' | 'green' | 'amber' }) {
  return <span className={`${styles.status} ${styles[tone]}`}>{children}</span>;
}

function BlockCard({ block, selected, onSelect }: { block: BlockDefinition; selected: boolean; onSelect: () => void }) {
  return (
    <button className={`${styles.blockCard} ${selected ? styles.selectedCard : ''}`} onClick={onSelect} aria-pressed={selected}>
      <span className={styles.cardTop}><span className={styles.blockGlyph}><Blocks size={17} /></span><Status tone={block.status === 'Ready' ? 'green' : block.status === 'Working copy' ? 'gold' : 'amber'}>{block.status}</Status></span>
      <span><strong>{block.name}</strong><small>{block.category}</small></span>
      <span className={styles.cardSummary}>{block.summary}</span>
      <span className={styles.cardFooter}><span>{block.owner}</span><ChevronRight size={16} /></span>
    </button>
  );
}

export function BlocksWorkspace() {
  const [view, setView] = useState<View>('overview');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState(blocks[0].id);
  const [runStarted, setRunStarted] = useState(false);
  const selectedBlock = blocks.find((block) => block.id === selectedId) ?? blocks[0];
  const filteredBlocks = useMemo(() => blocks.filter((block) => `${block.name} ${block.category} ${block.summary}`.toLowerCase().includes(query.toLowerCase())), [query]);

  const selectView = (next: View) => { setView(next); setMobileOpen(false); };

  return (
    <main className={styles.workspace}>
      <aside className={`${styles.sidebar} ${mobileOpen ? styles.sidebarOpen : ''}`}>
        <div className={styles.brand}><Image src="/assets/brand/kramaniti-mark-gold.png" alt="Kramaniti" width={38} height={38} priority /><div><strong>Kramaniti</strong><span>Blocks</span></div><button className={styles.closeNav} onClick={() => setMobileOpen(false)} aria-label="Close navigation"><X size={20} /></button></div>
        <nav aria-label="Blocks workspace">
          {nav.map((item) => <button key={item.id} className={view === item.id ? styles.activeNav : ''} onClick={() => selectView(item.id)}><item.icon size={18} /><span>{item.label}</span>{item.count ? <em>{item.count}</em> : null}</button>)}
        </nav>
        <div className={styles.boundary}><ShieldCheck size={17} /><div><strong>Human-controlled</strong><span>Review gates pause consequential actions.</span></div></div>
      </aside>

      <section className={styles.main}>
        <header className={styles.topbar}>
          <button className={styles.menu} onClick={() => setMobileOpen(true)} aria-label="Open navigation"><Menu size={21} /></button>
          <div><span>Workspace</span><strong>Kramaniti operating lab</strong></div>
          <Status tone="green"><CircleDot size={11} /> System ready</Status>
        </header>

        {view === 'overview' && <Overview onOpen={selectView} />}
        {view === 'blocks' && <Catalogue query={query} setQuery={setQuery} filtered={filteredBlocks} selected={selectedBlock} setSelected={setSelectedId} onOpenRun={() => setView('runs')} />}
        {view === 'runs' && <RunView runStarted={runStarted} onStart={() => setRunStarted(true)} />}
        {view === 'context' && <ContextView />}
        {view === 'reviews' && <ReviewView />}
        {view === 'outputs' && <OutputsView />}
      </section>
      {mobileOpen && <button className={styles.scrim} aria-label="Close navigation" onClick={() => setMobileOpen(false)} />}
    </main>
  );
}

function PageTitle({ eyebrow, title, detail, action }: { eyebrow: string; title: string; detail: string; action?: React.ReactNode }) {
  return <div className={styles.pageTitle}><div><span>{eyebrow}</span><h1>{title}</h1><p>{detail}</p></div>{action}</div>;
}

function Overview({ onOpen }: { onOpen: (view: View) => void }) {
  return <div className={styles.content}>
    <PageTitle eyebrow="Operational overview" title="Intelligent work, made visible." detail="Organise context, run repeatable workflows, and keep consequential decisions with people." action={<button className={styles.primary} onClick={() => onOpen('blocks')}><Blocks size={17} /> Browse blocks</button>} />
    <section className={styles.metrics} aria-label="Workspace summary">
      {[['3', 'Available blocks', '1 ready to run'], ['1', 'Active run', 'At diagnosis stage'], ['1', 'Review needed', 'Human decision pending'], ['2', 'Approved outputs', 'Across recent runs']].map(([value, label, note]) => <article key={label}><strong>{value}</strong><span>{label}</span><small>{note}</small></article>)}
    </section>
    <div className={styles.overviewGrid}>
      <section className={styles.panel}><div className={styles.sectionHead}><div><span>Active run</span><h2>Workflow diagnostic / 0042</h2></div><Status tone="gold">In progress</Status></div><div className={styles.progress}><i style={{ width: '54%' }} /></div><div className={styles.runMeta}><span><Activity size={15} /> Diagnosing friction</span><span>3 of 5 stages</span></div>{runStages.slice(0, 4).map((stage, index) => <div className={styles.miniStage} key={stage.name}><span className={stage.status === 'Complete' ? styles.doneDot : stage.status === 'Active' ? styles.activeDot : styles.waitDot}>{stage.status === 'Complete' ? <Check size={12} /> : index + 1}</span><div><strong>{stage.name}</strong><small>{stage.mode}</small></div></div>)}<button className={styles.textButton} onClick={() => onOpen('runs')}>Open run <ChevronRight size={16} /></button></section>
      <section className={styles.panel}><div className={styles.sectionHead}><div><span>Decision queue</span><h2>Human review</h2></div><Status tone="amber">1 waiting</Status></div><div className={styles.reviewCallout}><FileCheck2 size={20} /><div><strong>Confirm the primary bottleneck</strong><p>Review the evidence before the action plan is created.</p><small>Owner: KC · Ready now</small></div></div><button className={styles.secondary} onClick={() => onOpen('reviews')}>Review decision</button><div className={styles.divider} /><div className={styles.systemNote}><ShieldCheck size={18} /><div><strong>Why this paused</strong><p>The recommendation changes workflow ownership. Blocks will not carry it forward without a named reviewer.</p></div></div></section>
    </div>
  </div>;
}

function Catalogue({ query, setQuery, filtered, selected, setSelected, onOpenRun }: { query: string; setQuery: (v: string) => void; filtered: BlockDefinition[]; selected: BlockDefinition; setSelected: (id: string) => void; onOpenRun: () => void }) {
  return <div className={styles.content}><PageTitle eyebrow="Capability catalogue" title="Blocks" detail="Reusable operating capabilities with clear inputs, outputs, ownership, and review boundaries." />
    <div className={styles.search}><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search blocks" aria-label="Search blocks" /></div>
    <div className={styles.catalogueLayout}><div className={styles.cardGrid}>{filtered.length ? filtered.map((block) => <BlockCard key={block.id} block={block} selected={selected.id === block.id} onSelect={() => setSelected(block.id)} />) : <div className={styles.empty}><Search size={24} /><strong>No matching blocks</strong><span>Try a broader capability or category.</span></div>}</div>
      <aside className={styles.detailPanel}><span>Selected block</span><h2>{selected.name}</h2><p>{selected.summary}</p><dl><div><dt>Owner</dt><dd>{selected.owner}</dd></div><div><dt>Status</dt><dd>{selected.status}</dd></div></dl><h3>Required context</h3><ul>{selected.inputs.map((item) => <li key={item}><Check size={14} />{item}</li>)}</ul><h3>Produces</h3><ul>{selected.outputs.map((item) => <li key={item}><ChevronRight size={14} />{item}</li>)}</ul><button className={styles.primary} disabled={selected.status !== 'Ready'} onClick={onOpenRun}><Play size={16} />{selected.status === 'Ready' ? 'Configure run' : 'Setup required'}</button>{selected.status !== 'Ready' && <small className={styles.workingCopy}>Working copy — execution contract requires review.</small>}</aside>
    </div>
  </div>;
}

function RunView({ runStarted, onStart }: { runStarted: boolean; onStart: () => void }) {
  return <div className={styles.content}><PageTitle eyebrow="Active workflow" title="Workflow diagnostic / 0042" detail="A visible operating sequence from scoped context to reviewed action." action={<button className={styles.primary} onClick={onStart} disabled={runStarted}>{runStarted ? <><Check size={17} /> Run active</> : <><Play size={17} /> Start demo run</>}</button>} />
    <div className={styles.runLayout}><section className={styles.panel}><div className={styles.sectionHead}><div><span>Run sequence</span><h2>{runStarted ? 'Execution in progress' : 'Ready to begin'}</h2></div><Status tone={runStarted ? 'gold' : 'green'}>{runStarted ? 'Stage 3 active' : 'Inputs ready'}</Status></div><div className={styles.timeline}>{runStages.map((stage, index) => { const status = runStarted ? stage.status : index === 0 ? 'Waiting' : 'Queued'; return <article key={stage.name} className={styles.timelineItem}><span className={`${styles.timelineMarker} ${status === 'Complete' ? styles.completeMarker : status === 'Active' ? styles.activeMarker : ''}`}>{status === 'Complete' ? <Check size={14} /> : index + 1}</span><div><div><strong>{stage.name}</strong><Status tone={stage.mode === 'Human review' ? 'amber' : 'neutral'}>{stage.mode}</Status></div><p>{stage.detail}</p><small>{status}</small></div></article>; })}</div></section><aside className={styles.stack}><section className={styles.panel}><span className={styles.kicker}>Run boundary</span><dl className={styles.runDetails}><div><dt>Owner</dt><dd>KC</dd></div><div><dt>Block</dt><dd>Workflow diagnostic</dd></div><div><dt>Sources</dt><dd>3 available</dd></div><div><dt>Approval</dt><dd>Required</dd></div></dl></section><section className={styles.panel}><div className={styles.systemNote}><ShieldCheck size={18} /><div><strong>Action boundary</strong><p>This demo changes local interface state only. It does not call a model, write data, or contact another system.</p></div></div></section></aside></div>
  </div>;
}

function ContextView() { return <div className={styles.content}><PageTitle eyebrow="Knowledge boundary" title="Context" detail="See exactly which sources a run may use, where they apply, and whether they need review." /><section className={styles.tablePanel}><div className={styles.tableHeader}><span>Source</span><span>Scope</span><span>Freshness</span><span>State</span></div>{contextSources.map((source) => <article className={styles.tableRow} key={source.name}><div><FolderKanban size={18} /><span><strong>{source.name}</strong><small>{source.type}</small></span></div><span>{source.scope}</span><span>{source.freshness}</span><Status tone={source.state === 'Available' ? 'green' : 'amber'}>{source.state}</Status></article>)}</section></div>; }

function ReviewView() { return <div className={styles.content}><PageTitle eyebrow="Human decision points" title="Reviews" detail="Approve, revise, or stop a run with its evidence and downstream effect in view." /><div className={styles.list}>{reviews.map((review) => <article className={styles.listItem} key={review.title}><div className={styles.listIcon}><FileCheck2 size={19} /></div><div><strong>{review.title}</strong><span>{review.run}</span><small>Owner: {review.owner} · {review.due}</small></div><Status tone={review.state === 'Approved' ? 'green' : 'amber'}>{review.state}</Status><button className={styles.secondary}>{review.state === 'Approved' ? 'View record' : 'Open review'}</button></article>)}</div></div>; }

function OutputsView() { return <div className={styles.content}><PageTitle eyebrow="Actionable results" title="Outputs" detail="Versioned results connected to their originating run and approval state." /><div className={styles.list}>{outputs.map((output) => <article className={styles.listItem} key={output.title}><div className={styles.listIcon}><Archive size={19} /></div><div><strong>{output.title}</strong><span>{output.type} · {output.run}</span><small>{output.time}</small></div><Status tone={output.state === 'Approved' ? 'green' : 'gold'}>{output.state}</Status><button className={styles.secondary}>Open</button></article>)}</div></div>; }
