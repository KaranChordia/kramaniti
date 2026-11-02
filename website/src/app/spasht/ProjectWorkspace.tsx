'use client';

import { useRef, type ReactNode } from 'react';
import { ArrowLeft, CheckCircle2, FileText, MessageCircle } from 'lucide-react';
import ui from './ProjectWorkspace.module.css';

type Mode = 'conversation' | 'steps' | 'details';
const modes = [
  { id: 'conversation', label: 'Conversation', caption: 'Think it through', icon: MessageCircle },
  { id: 'steps', label: 'Next steps', caption: 'Move it forward', icon: CheckCircle2 },
  { id: 'details', label: 'Details', caption: 'Keep the context clear', icon: FileText },
] as const;

export function ProjectWorkspace({ title, summary, openSteps, doneSteps, draft, mode, onMode, onBack, options, children }: {
  title: string; summary: string; openSteps: number; doneSteps: number; draft: boolean;
  mode: Mode; onMode: (mode: Mode) => void; onBack: () => void; options: ReactNode; children: ReactNode;
}) {
  const tabs = useRef<Array<HTMLButtonElement | null>>([]);
  const total = openSteps + doneSteps;
  return <div className={ui.workspace}>
    <div className={ui.topline}><button type="button" onClick={onBack}><ArrowLeft size={15} aria-hidden="true" />All projects</button><span>Project workspace</span></div>
    <header className={ui.header}>
      <div><span className={ui.eyebrow}>A place to move this forward</span><h1>{title}</h1></div>
      {options}
    </header>
    <div className={ui.layout}>
      <aside className={ui.anchor} aria-label="Project context">
        <div className={ui.progress}><span>Next steps</span><strong>{openSteps}<small> open</small></strong>
          {total > 0 && <><div className={ui.track} role="img" aria-label={`${doneSteps} of ${total} steps completed`}><span style={{ width: `${doneSteps / total * 100}%` }} /></div><span>{doneSteps} of {total} completed</span></>}
          {total === 0 && <span>Your next move starts here.</span>}
        </div>
        <details className={ui.context}><summary>Saved context</summary><p>{summary || 'Add a summary in Details to give this project a starting point.'}</p></details>
        {draft && <p className={ui.draft}>Unsaved details · kept while you work here</p>}
      </aside>
      <div className={ui.instrument}>
        <div className={ui.modes} role="tablist" aria-label="Project workspace" onKeyDown={event => {
          const index = modes.findIndex(item => item.id === mode);
          const next = event.key === 'ArrowRight' ? (index + 1) % modes.length : event.key === 'ArrowLeft' ? (index + modes.length - 1) % modes.length : event.key === 'Home' ? 0 : event.key === 'End' ? modes.length - 1 : null;
          if (next !== null) { event.preventDefault(); onMode(modes[next].id); tabs.current[next]?.focus(); }
        }}>
          {modes.map(({ id, label, caption, icon: Icon }, index) => <button key={id} ref={node => { tabs.current[index] = node; }} type="button" role="tab" id={`project-tab-${id}`} aria-label={label} aria-selected={mode === id} aria-controls={`project-panel-${id}`} tabIndex={mode === id ? 0 : -1} onClick={() => onMode(id)}>
            <Icon size={18} aria-hidden="true" /><span>{label}<small>{caption}</small></span>{id === 'steps' && openSteps > 0 && <b aria-hidden="true">{openSteps}</b>}{id === 'details' && draft && <i aria-label="Unsaved details" />}
          </button>)}
        </div>
        <div className={ui.surface}>{children}</div>
      </div>
    </div>
  </div>;
}
