'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Check, Download, Search, X } from 'lucide-react';
import { libraryItems, libraryKinds, type LibraryKind } from '@/lib/library/libraryData';
import styles from './workspace.module.css';

export function LibraryWorkspace() {
  const galleryRef = useRef<HTMLElement>(null);
  const [kind, setKind] = useState<LibraryKind | 'All'>('All');
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState(libraryItems[0].id);
  const [isInspectorOpen, setIsInspectorOpen] = useState(false);

  const filteredItems = useMemo(() => libraryItems.filter((item) => {
    const searchable = `${item.kind} ${item.title} ${item.summary} ${item.useWhen} ${item.includes.join(' ')}`.toLowerCase();
    return (kind === 'All' || item.kind === kind) && searchable.includes(query.trim().toLowerCase());
  }), [kind, query]);
  const selected = filteredItems.find((item) => item.id === selectedId) ?? filteredItems[0];

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsInspectorOpen(false);
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, []);

  useEffect(() => {
    const gallery = galleryRef.current;
    if (!gallery) return;

    const moveAcrossRail = (event: WheelEvent) => {
      if (isInspectorOpen || event.ctrlKey) return;
      const distance = Math.abs(event.deltaY) >= Math.abs(event.deltaX) ? event.deltaY : event.deltaX;
      if (!distance) return;
      event.preventDefault();
      gallery.scrollBy({ left: distance, behavior: 'auto' });
    };

    window.addEventListener('wheel', moveAcrossRail, { passive: false });
    return () => window.removeEventListener('wheel', moveAcrossRail);
  }, [isInspectorOpen]);

  useEffect(() => {
    galleryRef.current?.scrollTo({ left: 0, behavior: 'smooth' });
  }, [kind, query]);

  const openItem = (id: string) => {
    setSelectedId(id);
    setIsInspectorOpen(true);
  };

  return (
    <main className={styles.dashboard} data-disable-global-shockwave="true">
      <nav className={styles.floatingNav} aria-label="Kosh workspace navigation">
        <Link href="/library" className={styles.brand}><Image src="/assets/brand/kramaniti-kosh-mark.png" alt="" width={38} height={38} className={styles.brandMark} priority /><strong>Kramaniti</strong><span>Kosh</span></Link>
        <div className={styles.kindNav} aria-label="Filter Kosh items">
          <button type="button" className="no-shockwave" data-active={kind === 'All'} onClick={() => setKind('All')}>All <small>{libraryItems.length}</small></button>
          {libraryKinds.map((itemKind) => <button key={itemKind} type="button" className="no-shockwave" data-active={kind === itemKind} onClick={() => setKind(itemKind)}>{itemKind}</button>)}
        </div>
        <div className={styles.navUtilities}>
          <label className={styles.search}><Search size={15} /><span className={styles.srOnly}>Search Kosh</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search" /></label>
          <Link href="/library" className={styles.back} aria-label="Return to Kosh guide"><ArrowLeft size={15} /></Link>
        </div>
      </nav>

      <div className={styles.workspaceContainer}>
        <div className={styles.railHeader} aria-hidden="true">
          <span>Pattern library</span>
          <span>{filteredItems.length.toString().padStart(2, '0')} templates</span>
          <span>Scroll to explore <i>→</i></span>
        </div>
        <section ref={galleryRef} className={styles.galleryViewport} aria-label="Kosh directory" tabIndex={0}>
          <div className={styles.gallery} aria-label="Kosh directory">
            {filteredItems.length ? filteredItems.map((item) => (
              <button key={item.id} type="button" className={`${styles.item} no-shockwave`} data-kind={item.kind} onClick={() => openItem(item.id)}>
                <span className={styles.itemTopline}><span className={styles.itemKind}>{item.kind}</span><span className={styles.itemArrow} aria-hidden="true">↗</span></span><strong>{item.title}</strong><span className={styles.itemSummary}>{item.summary}</span><span className={styles.itemFoot}>Open template</span>
              </button>
            )) : <p className={styles.empty}>No matching templates.</p>}
          </div>
        </section>
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
