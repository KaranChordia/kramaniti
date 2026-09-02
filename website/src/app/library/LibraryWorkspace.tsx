'use client';

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import { ArrowLeft, ArrowRight, Bookmark, Check, Download, LogIn, LogOut, Search, UserRound, X, Moon, Sun } from 'lucide-react';
import { libraryItems, libraryKinds, type LibraryKind } from '@/lib/library/libraryData';
import { useKramanitiTheme } from '@/hooks/useKramanitiTheme';
import { getKoshSupabase, isKoshSupabaseConfigured } from '@/lib/kosh/supabase';
import styles from './workspace.module.css';

export function LibraryWorkspace() {
  const { theme, toggleTheme } = useKramanitiTheme();
  const scrollerRef = useRef<HTMLDivElement>(null);
  const kindNavRef = useRef<HTMLDivElement>(null);
  const viewNavRef = useRef<HTMLDivElement>(null);
  const [view, setView] = useState<'Library' | 'Saved' | 'Settings'>('Library');
  const [kind, setKind] = useState<LibraryKind | 'All'>('All');
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState(libraryItems[0].id);
  const [isInspectorOpen, setIsInspectorOpen] = useState(false);
  const [isTemplatePreviewOpen, setIsTemplatePreviewOpen] = useState(false);
  const [templateContent, setTemplateContent] = useState<{ id: string; content: string } | null>(null);
  const [authUser, setAuthUser] = useState<SupabaseUser | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(isKoshSupabaseConfigured);
  const [bookmarkIds, setBookmarkIds] = useState<string[]>([]);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'sign-in' | 'sign-up'>('sign-in');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [authMessage, setAuthMessage] = useState('');
  const [isAuthSubmitting, setIsAuthSubmitting] = useState(false);
  const [bookmarkMessage, setBookmarkMessage] = useState('');
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
  const visibleItems = view === 'Saved' ? filteredItems.filter((item) => bookmarkIds.includes(item.id)) : filteredItems;
  const selected = filteredItems.find((item) => item.id === selectedId) ?? filteredItems[0];

  const loadBookmarks = useCallback(async (userId: string) => {
    const supabase = getKoshSupabase();
    if (!supabase) return;
    const { data, error } = await supabase.from('template_bookmarks').select('template_id').eq('user_id', userId);
    if (!error) setBookmarkIds((data ?? []).map((bookmark) => bookmark.template_id));
  }, []);

  useEffect(() => {
    const supabase = getKoshSupabase();
    if (!supabase) return;

    supabase.auth.getSession().then(({ data: { session } }) => {
      setAuthUser(session?.user ?? null);
      if (session?.user) void loadBookmarks(session.user.id);
    }).finally(() => setIsAuthLoading(false));

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthUser(session?.user ?? null);
      if (session?.user) void loadBookmarks(session.user.id);
      else setBookmarkIds([]);
    });

    return () => subscription.unsubscribe();
  }, [loadBookmarks]);

  useEffect(() => {
    if (!isTemplatePreviewOpen || !selected) return;

    let isCurrent = true;

    fetch(selected.download)
      .then((response) => {
        if (!response.ok) throw new Error('Template could not be loaded.');
        return response.text();
      })
      .then((content) => {
        if (isCurrent) setTemplateContent({ id: selected.id, content });
      })
      .catch(() => {
        if (isCurrent) setTemplateContent({ id: selected.id, content: 'Template preview is unavailable. You can still download the Markdown file below.' });
      });

    return () => { isCurrent = false; };
  }, [isTemplatePreviewOpen, selected]);

  /* --- Escape to close inspector --- */
  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsTemplatePreviewOpen(false);
        setIsInspectorOpen(false);
      }
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
    setIsTemplatePreviewOpen(false);
    setIsInspectorOpen(true);
  };

  const openAccount = (mode: 'sign-in' | 'sign-up' = 'sign-in') => {
    setAuthMode(mode);
    setAuthMessage('');
    setIsAccountOpen(true);
  };

  const submitAuth = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const supabase = getKoshSupabase();
    if (!supabase) {
      setAuthMessage('Kosh accounts are not configured in this preview yet.');
      return;
    }

    setIsAuthSubmitting(true);
    setAuthMessage('');

    if (authMode === 'sign-up') {
      const { data, error } = await supabase.auth.signUp({
        email: authEmail,
        password: authPassword,
        options: { data: { display_name: authName.trim() } },
      });
      if (error) {
        setAuthMessage(error.message);
      } else if (data.session) {
        setAuthUser(data.session.user);
        setIsAccountOpen(false);
        setAuthName('');
        setAuthEmail('');
        setAuthPassword('');
      } else {
        setAuthMessage('Your account was created, but direct sign-in is not available yet. Please try again in a moment.');
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email: authEmail, password: authPassword });
      if (error) setAuthMessage(error.message);
      else setIsAccountOpen(false);
    }

    setIsAuthSubmitting(false);
  };

  const signOut = async () => {
    const supabase = getKoshSupabase();
    if (!supabase) return;
    await supabase.auth.signOut();
    setView('Library');
  };

  const toggleBookmark = async (templateId: string) => {
    const supabase = getKoshSupabase();
    if (!authUser) {
      setBookmarkMessage('Sign in to save this template.');
      openAccount('sign-in');
      return;
    }
    if (!supabase) return;

    setBookmarkMessage('');
    if (bookmarkIds.includes(templateId)) {
      const { error } = await supabase.from('template_bookmarks').delete().eq('user_id', authUser.id).eq('template_id', templateId);
      if (error) setBookmarkMessage('Your saved templates could not be updated. Please try again.');
      else setBookmarkIds((ids) => ids.filter((id) => id !== templateId));
    } else {
      const { error } = await supabase.from('template_bookmarks').insert({ user_id: authUser.id, template_id: templateId });
      if (error) setBookmarkMessage('Your saved templates could not be updated. Please try again.');
      else setBookmarkIds((ids) => [...ids, templateId]);
    }
  };

  if (!authUser) {
    return (
      <main className={styles.dashboard} data-disable-global-shockwave="true">
        <nav className={styles.floatingNav} aria-label="Kosh navigation">
          <Link href="/library" className={styles.brand}><Image src="/assets/brand/kramaniti-kosh-mark.png" alt="" width={52} height={52} className={styles.brandMark} priority /><strong>Kramaniti</strong><span>Kosh</span></Link>
          <div className={styles.navUtilities}><Link href="/library" className={styles.back} aria-label="Return to Kosh guide"><ArrowLeft size={15} /></Link></div>
        </nav>
        <section className={styles.accessGate} aria-labelledby="kosh-access-title">
          <div className={styles.accessGatePanel}>
            <span className={styles.templateLabel}>Private Kosh library</span>
            <h1 id="kosh-access-title">Sign in to open the workspace.</h1>
            <p className={styles.accountNote}>Kosh is for registered members. Create an account to access the library, save templates, and build your own working context over time.</p>
            {isAuthLoading ? <p className={styles.authMessage}>Checking your account…</p> : isKoshSupabaseConfigured() ? <form className={styles.authForm} onSubmit={submitAuth}>
              {authMode === 'sign-up' ? <label>Name<input required value={authName} onChange={(event) => setAuthName(event.target.value)} autoComplete="name" /></label> : null}
              <label>Email<input required type="email" value={authEmail} onChange={(event) => setAuthEmail(event.target.value)} autoComplete="email" /></label>
              <label>Password<input required type="password" minLength={8} value={authPassword} onChange={(event) => setAuthPassword(event.target.value)} autoComplete={authMode === 'sign-up' ? 'new-password' : 'current-password'} /></label>
              {authMessage ? <p className={styles.authMessage}>{authMessage}</p> : null}
              <button type="submit" className={styles.download} disabled={isAuthSubmitting}>{isAuthSubmitting ? 'Working…' : authMode === 'sign-up' ? 'Create account and open Kosh' : 'Sign in to Kosh'}</button>
            </form> : <p className={styles.authMessage}>Kosh accounts are not configured in this preview yet.</p>}
            <button type="button" className={styles.authSwitch} onClick={() => { setAuthMode((mode) => mode === 'sign-in' ? 'sign-up' : 'sign-in'); setAuthMessage(''); }}>{authMode === 'sign-in' ? 'New to Kosh? Create an account' : 'Already have an account? Sign in'}</button>
            <Link href="/library" className={styles.gateGuide}>Learn about Kosh <ArrowRight size={15} /></Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className={styles.dashboard} data-disable-global-shockwave="true">
      <nav className={styles.floatingNav} aria-label="Kosh workspace navigation">
        <Link href="/library" className={styles.brand}><Image src="/assets/brand/kramaniti-kosh-mark.png" alt="" width={52} height={52} className={styles.brandMark} priority /><strong>Kramaniti</strong><span>Kosh</span></Link>
        <div ref={viewNavRef} className={`${styles.kindNav} ${styles.primaryKindNav}`} aria-label="Toggle workspace view">
          <div className={styles.kindSlider} aria-hidden="true" style={{ transform: `translateX(${viewSlider.left}px)`, width: viewSlider.width, opacity: viewSlider.ready ? 1 : 0 }} />
          <button type="button" className="no-shockwave" data-active={view === 'Library'} onClick={() => setView('Library')}>Library</button>
          <button type="button" className="no-shockwave" data-active={view === 'Saved'} onClick={() => authUser ? setView('Saved') : openAccount('sign-in')}>Saved {authUser ? <small>{bookmarkIds.length}</small> : null}</button>
          <button type="button" className="no-shockwave" data-active={view === 'Settings'} onClick={() => setView('Settings')}>Settings</button>
        </div>
        <div className={styles.navUtilities}>
          {authUser ? <button type="button" className={styles.accountButton} onClick={() => setIsAccountOpen(true)} aria-label="Open Kosh account"><UserRound size={15} /><span>{authUser.user_metadata.display_name || authUser.email?.split('@')[0] || 'Account'}</span></button> : <button type="button" className={styles.accountButton} onClick={() => openAccount('sign-in')}><LogIn size={15} /><span>Sign in</span></button>}
          <Link href="/library" className={styles.back} aria-label="Return to Kosh guide"><ArrowLeft size={15} /></Link>
        </div>
      </nav>

      <div className={styles.workspaceContainer}>
        {view === 'Library' || view === 'Saved' ? (
          <>
            <div className={styles.panelHeader}>
              <label className={styles.search}><Search size={15} /><span className={styles.srOnly}>Search Kosh</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search library..." /></label>
              <div ref={kindNavRef} className={styles.kindNav} aria-label="Filter Kosh items">
                <div className={styles.kindSlider} aria-hidden="true" style={{ transform: `translateX(${kindSlider.left}px)`, width: kindSlider.width, opacity: kindSlider.ready ? 1 : 0 }} />
                <button type="button" className="no-shockwave" data-active={kind === 'All'} onClick={() => setKind('All')}>All <small>{libraryItems.length}</small></button>
                {libraryKinds.map((itemKind) => <button key={itemKind} type="button" className="no-shockwave" data-active={kind === itemKind} onClick={() => setKind(itemKind)}>{itemKind}</button>)}
              </div>
              <span>{(view === 'Saved' ? visibleItems.length : filteredItems.length).toString().padStart(2, '0')} {view === 'Saved' ? 'saved' : 'templates'}</span>
            </div>

        <div className={styles.galleryViewport} aria-label="Kosh directory">
          {/* Scroll-fade affordances */}
          <div className={`${styles.fadeTop} ${canScrollUp ? styles.fadeVisible : ''}`} aria-hidden="true" />
          <div className={`${styles.fadeBottom} ${canScrollDown ? styles.fadeVisible : ''}`} aria-hidden="true" />

            <div ref={scrollerRef} className={styles.galleryScroller} tabIndex={0}>
            <div className={styles.gallery}>
              {visibleItems.length ? visibleItems.map((item) => (
                <article key={item.id} className={styles.item} data-kind={item.kind}>
                  <button type="button" className={`${styles.itemOpen} no-shockwave`} onClick={() => openItem(item.id)}>
                  <span className={styles.itemTopline}><span className={styles.itemKind}>{item.kind}</span><span className={styles.itemArrow} aria-hidden="true">↗</span></span>
                  <strong>{item.title}</strong>
                  <span className={styles.itemSummary}>{item.summary}</span>
                  <span className={styles.itemFoot}>Open template</span>
                  </button>
                  <button type="button" className={`${styles.bookmark} no-shockwave ${bookmarkIds.includes(item.id) ? styles.bookmarkSaved : ''}`} onClick={() => void toggleBookmark(item.id)} aria-label={bookmarkIds.includes(item.id) ? `Remove ${item.title} from saved templates` : `Save ${item.title}`} aria-pressed={bookmarkIds.includes(item.id)}><Bookmark size={16} fill={bookmarkIds.includes(item.id) ? 'currentColor' : 'none'} /></button>
                </article>
              )) : <p className={styles.empty}>{view === 'Saved' ? (authUser ? 'No saved templates yet.' : 'Sign in to see your saved templates.') : 'No matching templates.'}</p>}
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
            {authUser ? <button type="button" className={styles.signOutButton} onClick={() => void signOut()}><LogOut size={16} />Sign out</button> : <button type="button" className={styles.signOutButton} onClick={() => openAccount('sign-in')}><LogIn size={16} />Sign in to Kosh</button>}
          </div>
        )}
      </div>

      {isInspectorOpen && selected ? (
        <div className={styles.inspectorBackdrop} role="presentation" onMouseDown={() => { setIsTemplatePreviewOpen(false); setIsInspectorOpen(false); }}>
          <section className={styles.inspector} role="dialog" aria-modal="true" aria-labelledby="template-title" onMouseDown={(event) => event.stopPropagation()}>
            <button type="button" className={`${styles.close} no-shockwave`} onClick={() => { setIsTemplatePreviewOpen(false); setIsInspectorOpen(false); }} aria-label="Close template details"><X size={18} /></button>
            <div className={styles.detailMeta}><span>{selected.kind}</span><em>{selected.status}</em></div><h2 id="template-title">{selected.title}</h2><p className={styles.summary}>{selected.summary}</p>
            <div className={styles.detailGrid}><div className={styles.when}><b>Use when</b><p>{selected.useWhen}</p></div><div className={styles.includes}><b>Includes</b><ul>{selected.includes.map((entry) => <li key={entry}><Check size={14} />{entry}</li>)}</ul></div></div>
            <div className={styles.templateActions}>
              <button type="button" className={styles.learnMore} onClick={() => setIsTemplatePreviewOpen(true)}>Get to know the template <ArrowRight size={17} /></button>
              <a href={selected.download} download className={styles.download}><Download size={17} />Download as Markdown</a>
              <button type="button" className={`${styles.saveTemplate} ${bookmarkIds.includes(selected.id) ? styles.saveTemplateActive : ''}`} onClick={() => void toggleBookmark(selected.id)}><Bookmark size={16} fill={bookmarkIds.includes(selected.id) ? 'currentColor' : 'none'} />{bookmarkIds.includes(selected.id) ? 'Saved to Kosh' : 'Save to Kosh'}</button>
            </div>
            {bookmarkMessage ? <p className={styles.actionMessage}>{bookmarkMessage}</p> : null}
          </section>
        </div>
      ) : null}
      {isTemplatePreviewOpen && selected ? (
        <div className={styles.readerBackdrop} role="presentation" onMouseDown={() => setIsTemplatePreviewOpen(false)}>
          <section className={styles.templateReader} role="dialog" aria-modal="true" aria-labelledby="template-reader-title" onMouseDown={(event) => event.stopPropagation()}>
            <button type="button" className={`${styles.close} no-shockwave`} onClick={() => setIsTemplatePreviewOpen(false)} aria-label="Close template reader"><X size={18} /></button>
            <span className={styles.templateLabel}>Template reader</span>
            {templateContent?.id === selected.id ? <ReactMarkdown>{templateContent.content}</ReactMarkdown> : <p className={styles.templateLoading}>Loading template…</p>}
          </section>
        </div>
      ) : null}
      {isAccountOpen ? (
        <div className={styles.accountBackdrop} role="presentation" onMouseDown={() => setIsAccountOpen(false)}>
          <section className={styles.accountDialog} role="dialog" aria-modal="true" aria-labelledby="kosh-account-title" onMouseDown={(event) => event.stopPropagation()}>
            <button type="button" className={`${styles.close} no-shockwave`} onClick={() => setIsAccountOpen(false)} aria-label="Close Kosh account"><X size={18} /></button>
            {authUser ? (
              <>
                <span className={styles.templateLabel}>Kosh account</span>
                <h2 id="kosh-account-title">Your library, kept private.</h2>
                <p>{authUser.email}</p>
                <p className={styles.accountNote}>Saved templates are private to your account. Context-aware copies will remain separate from Kosh’s canonical starter templates.</p>
                <button type="button" className={styles.signOutButton} onClick={() => void signOut()}><LogOut size={16} />Sign out</button>
              </>
            ) : (
              <>
                <span className={styles.templateLabel}>Kosh account</span>
                <h2 id="kosh-account-title">Keep useful starting points close.</h2>
                <p className={styles.accountNote}>{authMode === 'sign-up' ? 'Create a Kosh account with your name, email, and password. It is ready to use immediately.' : 'Sign in to save templates. Your personal context will only be used for adaptations you explicitly request later.'}</p>
                {isKoshSupabaseConfigured() ? <form className={styles.authForm} onSubmit={submitAuth}>
                  {authMode === 'sign-up' ? <label>Name<input required value={authName} onChange={(event) => setAuthName(event.target.value)} autoComplete="name" /></label> : null}
                  <label>Email<input required type="email" value={authEmail} onChange={(event) => setAuthEmail(event.target.value)} autoComplete="email" /></label>
                  <label>Password<input required type="password" minLength={8} value={authPassword} onChange={(event) => setAuthPassword(event.target.value)} autoComplete={authMode === 'sign-up' ? 'new-password' : 'current-password'} /></label>
                  {authMessage ? <p className={styles.authMessage}>{authMessage}</p> : null}
                  <button type="submit" className={styles.download} disabled={isAuthSubmitting}>{isAuthSubmitting ? 'Working…' : authMode === 'sign-up' ? 'Create account and continue' : 'Sign in'}</button>
                </form> : <p className={styles.authMessage}>Kosh account keys are being connected to this local preview. The public interface is ready; sign-in will activate as soon as the Kosh environment is present.</p>}
                <button type="button" className={styles.authSwitch} onClick={() => { setAuthMode((mode) => mode === 'sign-in' ? 'sign-up' : 'sign-in'); setAuthMessage(''); }}>{authMode === 'sign-in' ? 'New to Kosh? Create an account' : 'Already have an account? Sign in'}</button>
              </>
            )}
          </section>
        </div>
      ) : null}
    </main>
  );
}
