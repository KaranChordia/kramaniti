'use client';

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Check, Download, Search, X, Moon, Sun } from 'lucide-react';
import { libraryItems, libraryKinds, type LibraryKind } from '@/lib/library/libraryData';
import { useKramanitiTheme } from '@/hooks/useKramanitiTheme';
import styles from './workspace.module.css';

export function LibraryWorkspace() {
  const { theme, toggleTheme } = useKramanitiTheme();
  const scrollerRef = useRef<HTMLDivElement>(null);
  const kindNavRef = useRef<HTMLDivElement>(null);
  const viewNavRef = useRef<HTMLDivElement>(null);
  const [view, setView] = useState<'Library' | 'Settings'>('Library');
  const [kind, setKind] = useState<LibraryKind | 'All'>('All');
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState(libraryItems[0].id);
  const [isInspectorOpen, setIsInspectorOpen] = useState(false);
  const [canScrollUp, setCanScrollUp] = useState(false);
  const [canScrollDown, setCanScrollDown] = useState(false);
  const [kindSlider, setKindSlider] = useState({ left: 0, width: 0, ready: false });
  const [viewSlider, setViewSlider] = useState({ left: 0, width: 0, ready: false });

  /* --- Sliding pill indicators: measure active button positions --- */
  useLayoutEffect(() => {
    if (view !== 'Library') return;
    const nav = kindNavRef.current;
    if (!nav) return;
    const activeBtn = nav.querySelector<HTMLButtonElement>('[data-active="true"]');
    if (!activeBtn) return;
    const navRect = nav.getBoundingClientRect();
    const btnRect = activeBtn.getBoundingClientRect();
    setKindSlider({ left: btnRect.left - navRect.left, width: btnRect.width, ready: true });
  }, [kind, view]);

  useLayoutEffect(() => {
    const nav = viewNavRef.current;
    if (!nav) return;
    const activeBtn = nav.querySelector<HTMLButtonElement>('[data-active="true"]');
    if (!activeBtn) return;
    const navRect = nav.getBoundingClientRect();
    const btnRect = activeBtn.getBoundingClientRect();
    setViewSlider({ left: btnRect.left - navRect.left, width: btnRect.width, ready: true });
  }, [view]);

  const filteredItems = useMemo(() => libraryItems.filter((item) => {
    const searchable = `${item.kind} ${item.title} ${item.summary} ${item.useWhen} ${item.includes.join(' ')}`.toLowerCase();
    return (kind === 'All' || item.kind === kind) && searchable.includes(query.trim().toLowerCase());
  }), [kind, query]);
  const selected = filteredItems.find((item) => item.id === selectedId) ?? filteredItems[0];

  /* --- Escape to close inspector --- */
  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsInspectorOpen(false);
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, []);

  /* --- Scroll-fade affordance: detect scroll position --- */
  const updateFades = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    setCanScrollUp(el.scrollTop > 8);
    setCanScrollDown(el.scrollTop + el.clientHeight < el.scrollHeight - 8);
  }, []);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    updateFades();
    el.addEventListener('scroll', updateFades, { passive: true });
    const ro = new ResizeObserver(updateFades);
    ro.observe(el);
    return () => { el.removeEventListener('scroll', updateFades); ro.disconnect(); };
  }, [updateFades, view]);

  /* --- Reset scroll when filter or search changes --- */
  useEffect(() => {
    scrollerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  }, [kind, query]);

  const openItem = (id: string) => {
    setSelectedId(id);
    setIsInspectorOpen(true);
  };

  return (
    <main className={styles.dashboard} data-disable-global-shockwave="true">
      <nav className={styles.floatingNav} aria-label="Kosh workspace navigation">
        <Link href="/library" className={styles.brand}><Image src="/assets/brand/kramaniti-kosh-mark.png" alt="" width={52} height={52} className={styles.brandMark} priority /><strong>Kramaniti</strong><span>Kosh</span></Link>
        <div ref={viewNavRef} className={`${styles.kindNav} ${styles.primaryKindNav}`} aria-label="Toggle workspace view">
          <div className={styles.kindSlider} aria-hidden="true" style={{ transform: `translateX(${viewSlider.left}px)`, width: viewSlider.width, opacity: viewSlider.ready ? 1 : 0 }} />
          <button type="button" className="no-shockwave" data-active={view === 'Library'} onClick={() => setView('Library')}>Library</button>
          <button type="button" className="no-shockwave" data-active={view === 'Settings'} onClick={() => setView('Settings')}>Settings</button>
        </div>
        <div className={styles.navUtilities}>
          <Link href="/library" className={styles.back} aria-label="Return to Kosh guide"><ArrowLeft size={15} /></Link>
        </div>
      </nav>

      <div className={styles.workspaceContainer}>
        {view === 'Library' ? (
          <>
            <div className={styles.panelHeader}>
              <label className={styles.search}><Search size={15} /><span className={styles.srOnly}>Search Kosh</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search library..." /></label>
              <div ref={kindNavRef} className={styles.kindNav} aria-label="Filter Kosh items">
                <div className={styles.kindSlider} aria-hidden="true" style={{ transform: `translateX(${kindSlider.left}px)`, width: kindSlider.width, opacity: kindSlider.ready ? 1 : 0 }} />
                <button type="button" className="no-shockwave" data-active={kind === 'All'} onClick={() => setKind('All')}>All <small>{libraryItems.length}</small></button>
                {libraryKinds.map((itemKind) => <button key={itemKind} type="button" className="no-shockwave" data-active={kind === itemKind} onClick={() => setKind(itemKind)}>{itemKind}</button>)}
              </div>
              <span>{filteredItems.length.toString().padStart(2, '0')} templates</span>
            </div>

        <div className={styles.galleryViewport} aria-label="Kosh directory">
          {/* Scroll-fade affordances */}
          <div className={`${styles.fadeTop} ${canScrollUp ? styles.fadeVisible : ''}`} aria-hidden="true" />
          <div className={`${styles.fadeBottom} ${canScrollDown ? styles.fadeVisible : ''}`} aria-hidden="true" />

          <div ref={scrollerRef} className={styles.galleryScroller} tabIndex={0}>
            <div className={styles.gallery}>
              {filteredItems.length ? filteredItems.map((item) => (
                <button key={item.id} type="button" className={`${styles.item} no-shockwave`} data-kind={item.kind} onClick={() => openItem(item.id)}>
                  <span className={styles.itemTopline}><span className={styles.itemKind}>{item.kind}</span><span className={styles.itemArrow} aria-hidden="true">↗</span></span>
                  <strong>{item.title}</strong>
                  <span className={styles.itemSummary}>{item.summary}</span>
                  <span className={styles.itemFoot}>Open template</span>
                </button>
              )) : <p className={styles.empty}>No matching templates.</p>}
            </div>
          </div>
        </div>
          </>
        ) : (
          <div className={styles.settingsView}>
            <h2>Kosh Settings</h2>
            <p>Settings panel coming soon. This space is reserved for managing library preferences, saved items, and API configurations.</p>

            <div className={styles.settingsSection}>
              <h3>Appearance</h3>
              <div className={styles.settingRow}>
                <div>
                  <strong>Theme</strong>
                  <span>Toggle between light and dark modes</span>
                </div>
                <button type="button" className={styles.themeToggle} onClick={toggleTheme} aria-label="Toggle theme">
                  {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                  <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {isInspectorOpen && selected ? (
        <div className={styles.inspectorBackdrop} role="presentation" onMouseDown={() => setIsInspectorOpen(false)}>
          <section className={styles.inspector} role="dialog" aria-modal="true" aria-labelledby="template-title" onMouseDown={(event) => event.stopPropagation()}>
            <button type="button" className={`${styles.close} no-shockwave`} onClick={() => setIsInspectorOpen(false)} aria-label="Close template details"><X size={18} /></button>
            <div className={styles.detailMeta}><span>{selected.kind}</span><em>{selected.status}</em></div><h2 id="template-title">{selected.title}</h2><p className={styles.summary}>{selected.summary}</p>
            <div className={styles.detailGrid}><div className={styles.when}><b>Use when</b><p>{selected.useWhen}</p></div><div className={styles.includes}><b>Includes</b><ul>{selected.includes.map((entry) => <li key={entry}><Check size={14} />{entry}</li>)}</ul></div></div>
            <a href={selected.download} download className={styles.download}><Download size={17} />Download {selected.format}</a>
          </section>
        </div>
      ) : null}
    </main>
  );
}
