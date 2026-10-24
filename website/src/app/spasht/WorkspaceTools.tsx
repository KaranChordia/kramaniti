'use client';

import { useEffect, useRef, useState } from 'react';
import { Activity, ArrowLeft, ArrowUpRight, CheckCircle2, ChevronDown, Compass, Database, FileText, FolderOpen, MessageCircle, Repeat2, Search, Users, Wrench, X } from 'lucide-react';
import { workspaceToolGroups, type WorkspaceView } from '@/lib/spasht/navigation';
import ui from './WorkspaceTools.module.css';

const icons = { path: Compass, context: FileText, loops: Repeat2, tasks: CheckCircle2, assistant: MessageCircle, files: FolderOpen, overview: Activity, memory: Database, community: Users };
const labels = ['Think', 'Work', 'Review'];
const shortLabels: Partial<Record<WorkspaceView, string>> = { path: 'Path', context: 'Brief', loops: 'Loops', tasks: 'Tasks', assistant: 'Assistant', files: 'Organiser', overview: 'Overview', memory: 'Memory', community: 'Examples' };
type Tool = { id: WorkspaceView; title: string; detail: string };
const tools = workspaceToolGroups.flatMap<Tool>(group => group.items);

export function WorkspaceTools({ active, expanded, contextLabel, counts, onExpand, onCollapse, onSelect, onExit }: {
  active: WorkspaceView;
  expanded: boolean;
  contextLabel: string;
  counts: Partial<Record<WorkspaceView, number>>;
  onExpand: () => void;
  onCollapse: () => void;
  onSelect: (view: WorkspaceView) => void;
  onExit: () => void;
}) {
  const [query, setQuery] = useState('');
  const searchRef = useRef<HTMLInputElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const previousExpanded = useRef(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const previousActive = useRef(active);
  const current = tools.find(tool => tool.id === active);
  const ActiveIcon = current ? icons[current.id as keyof typeof icons] : Wrench;
  const search = query.trim().toLowerCase();
  const matching = tools.filter(tool => `${tool.id} ${tool.title} ${shortLabels[tool.id]} ${tool.detail}`.toLowerCase().includes(search));

  useEffect(() => {
    if (expanded && !previousExpanded.current) searchRef.current?.focus();
    previousExpanded.current = expanded;
  }, [expanded]);

  useEffect(() => {
    if (previousActive.current !== active) headingRef.current?.focus({ preventScroll: true });
    previousActive.current = active;
  }, [active]);

  const collapse = () => { onCollapse(); triggerRef.current?.focus(); };

  return <section id="workspace-tools" className={ui.station} aria-label="Workspace tools" onKeyDown={event => {
    if (event.key === 'Escape' && expanded) { event.preventDefault(); event.stopPropagation(); collapse(); }
  }}>
    <div className={ui.bar}>
      <div className={ui.identity}><span className={ui.toolIcon}><ActiveIcon size={19} aria-hidden="true" /></span><div>
        <span className={ui.eyebrow}>{current ? 'Workspace tools' : contextLabel}</span>
        {current ? <h2 ref={headingRef} tabIndex={-1}>{current.title}</h2> : <h1>Tools</h1>}
      </div></div>
      {current && <span className={ui.context} title={contextLabel}>{contextLabel}</span>}
      <div className={ui.controls}>
        {current && <button ref={triggerRef} type="button" onClick={expanded ? collapse : onExpand} aria-expanded={expanded} aria-controls="workspace-tool-palette"><Wrench size={15} aria-hidden="true" /><span>All tools</span><ChevronDown size={14} className={expanded ? ui.rotate : ''} aria-hidden="true" /></button>}
        <button type="button" className={ui.exit} onClick={onExit} aria-label="Exit tools"><X size={17} aria-hidden="true" /></button>
      </div>
    </div>
    {expanded && <div id="workspace-tool-palette" className={ui.palette}>
      <div className={ui.search}><Search size={16} aria-hidden="true" /><input ref={searchRef} aria-label="Find a tool" placeholder="Find a tool…" value={query} onChange={event => setQuery(event.target.value)} />{query && <button type="button" aria-label="Clear tool search" onClick={() => { setQuery(''); searchRef.current?.focus(); }}><X size={15} aria-hidden="true" /></button>}<kbd>esc</kbd></div>
      <div className={ui.groups}>
        {workspaceToolGroups.map((group, index) => {
          const visible = group.items.filter(tool => matching.includes(tool));
          return visible.length > 0 && <section key={group.title} className={ui.group} aria-label={`${labels[index]} tools`}><h2>{labels[index]}</h2><div className={ui.toolGrid}>
            {visible.map(tool => { const Icon = icons[tool.id as keyof typeof icons]; return <button key={tool.id} type="button" className={ui.tool} aria-label={tool.title} aria-pressed={active === tool.id} title={tool.detail} onClick={() => { setQuery(''); onSelect(tool.id); }}>
              <Icon size={22} strokeWidth={1.5} aria-hidden="true" /><span className={ui.fullLabel}>{tool.title}</span><span className={ui.shortLabel}>{shortLabels[tool.id]}</span>
              {tool.id === 'community' ? <small>Local preview</small> : counts[tool.id] !== undefined ? <small>{counts[tool.id]} {tool.id === 'tasks' ? 'open' : 'saved'}</small> : <ArrowUpRight size={13} className={ui.arrow} aria-hidden="true" />}
            </button>; })}
          </div></section>;
        })}
      </div>
      {!matching.length && <div className={ui.empty}><Search size={24} aria-hidden="true" /><p>No tool matches “{query}”.</p><button type="button" onClick={() => { setQuery(''); searchRef.current?.focus(); }}>Show all tools</button></div>}
      <div className={ui.foot}><span><span className={ui.dot} />Private workspace</span><button type="button" onClick={collapse}><ArrowLeft size={14} aria-hidden="true" />{current ? 'Back to tool' : 'Back to work'}</button></div>
    </div>}
  </section>;
}
