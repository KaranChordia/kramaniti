"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Bookmark,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  Compass,
  Copy,
  Download,
  Eye,
  FilePenLine,
  FileText,
  FolderKanban,
  Library,
  Menu,
  Move,
  RotateCcw,
  Search,
  SlidersHorizontal,
  Sparkles,
  X,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type FormEvent,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import {
  defaultLibrarySort,
  formatCreatedDate,
  kindLabels,
  libraryItems,
  librarySortOptions,
  sortLibraryItems,
  type LibraryItem,
  type LibrarySort,
} from "@/lib/library/libraryData";
import { resourceDetails } from "@/lib/library/resourceDetails";
import { catalogueDiscovery, parseDiscoveryAnswer } from "@/lib/kosh/discovery";
import { getKoshSupabase } from "@/lib/kosh/supabase";
import { SITE_URL, koshUrl } from "@/lib/seo";
import styles from "./stage.module.css";

type Scene = "library" | "overview" | "create" | "review";
type Tool = "preview" | "guidance" | "assistant";
type DockMenu = "places" | "context";
type Step = 1 | 2 | 3;
type Draft = { goal: string; context: string; boundary: string };
type AssistantRecommendation = { id: string; reason: string };

const SAVED_STORAGE_KEY = "kosh:saved-templates";
const DRAFTS_STORAGE_KEY = "kosh:stage-drafts";

const categories = ["All", ...new Set(libraryItems.map((item) => item.category))];
const emptyDraft: Draft = { goal: "", context: "", boundary: "" };
const tilePlacements = [
  { x: 42, y: 42, r: -1.5 }, { x: 348, y: 112, r: 1.2 }, { x: 676, y: 28, r: -0.8 },
  { x: 1006, y: 126, r: 1.7 }, { x: 176, y: 304, r: 1.1 }, { x: 514, y: 374, r: -1.2 },
  { x: 846, y: 286, r: 0.7 }, { x: 1172, y: 394, r: -1.5 }, { x: 48, y: 574, r: -0.7 },
  { x: 386, y: 642, r: 1.4 }, { x: 726, y: 548, r: -1.1 }, { x: 1068, y: 632, r: 0.9 },
];

function parseScene(value?: string): Scene {
  return value === "overview" || value === "create" || value === "review"
    ? value
    : "library";
}

function parseStep(value?: string): Step {
  return value === "2" || value === "3" ? (Number(value) as Step) : 1;
}

function pageForItem(items: LibraryItem[], itemId: string, perPage: number) {
  const index = items.findIndex((item) => item.id === itemId);
  return index < 0 ? 0 : Math.floor(index / perPage);
}

function formatWorkingBriefMarkdown(item: LibraryItem, draft: Draft) {
  const detail = resourceDetails[item.id];
  return [
    `# ${item.title} — Working Brief`,
    "",
    `> Adapted from Kramaniti Kosh (${kindLabels[item.kind]} · ${item.category})`,
    "",
    "## 1. Outcome",
    draft.goal.trim(),
    "",
    "## 2. Approved inputs and working context",
    draft.context.trim(),
    "",
    "## 3. Included sections from template",
    ...item.includes.map((entry, index) => `${index + 1}. ${entry}`),
    "",
    "## 4. Quality check",
    detail ? detail.check : "Check every claim against approved inputs before sharing.",
    "",
    "## 5. Human review boundary",
    draft.boundary.trim(),
    detail ? `\nLimit: ${detail.limit}` : "",
    "",
  ].join("\n");
}

export function KoshStage({
  initialScene,
  initialItem,
  initialStep,
  initialQuery = "",
  initialSort = defaultLibrarySort,
}: {
  initialScene?: string;
  initialItem?: string;
  initialStep?: string;
  initialQuery?: string;
  initialSort?: LibrarySort;
}) {
  const validInitialItem = initialItem && libraryItems.some((item) => item.id === initialItem)
    ? initialItem
    : libraryItems[0].id;
  const [scene, setScene] = useState<Scene>(parseScene(initialScene));
  const [selectedId, setSelectedId] = useState(validInitialItem);
  const [step, setStep] = useState<Step>(parseStep(initialStep));
  const [tool, setTool] = useState<Tool>("preview");
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState<LibrarySort>(initialSort);
  const [page, setPage] = useState(0);
  const perPage = 12;
  const [saved, setSaved] = useState<string[]>([]);
  const [drafts, setDrafts] = useState<Record<string, Draft>>({});
  const [validation, setValidation] = useState("");
  const [copiedBrief, setCopiedBrief] = useState(false);
  const [assistantQuestion, setAssistantQuestion] = useState("");
  const [assistantState, setAssistantState] = useState<"idle" | "loading" | "ready">("idle");
  const [assistantAnswer, setAssistantAnswer] = useState("");
  const [assistantRecommendations, setAssistantRecommendations] = useState<AssistantRecommendation[]>([]);
  const [dockMenu, setDockMenu] = useState<DockMenu | null>(null);
  const [peekedId, setPeekedId] = useState<string | null>(null);
  const [canvasOffset, setCanvasOffset] = useState({ x: 0, y: 0 });
  const [panning, setPanning] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const peekHeadingRef = useRef<HTMLHeadingElement>(null);
  const canvasViewportRef = useRef<HTMLDivElement>(null);
  const canvasWorldRef = useRef<HTMLDivElement>(null);
  const tileRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const dragState = useRef<{ pointerId: number; x: number; y: number; startX: number; startY: number } | null>(null);
  const dockRef = useRef<HTMLElement>(null);
  const bottomDockRef = useRef<HTMLElement>(null);
  const placesTrigger = useRef<HTMLButtonElement>(null);
  const mobilePlacesTrigger = useRef<HTMLButtonElement>(null);
  const contextTrigger = useRef<HTMLButtonElement>(null);
  const assistantAbortRef = useRef<AbortController | null>(null);

  const selected = libraryItems.find((item) => item.id === selectedId) ?? libraryItems[0];
  const detail = resourceDetails[selected.id];
  const draft = drafts[selected.id] ?? emptyDraft;
  const draftComplete = Boolean(draft.goal.trim() && draft.context.trim() && draft.boundary.trim());

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const matched = libraryItems.filter((item) => {
      const inCategory = category === "All" || item.category === category;
      const inSearch = !needle || `${item.title} ${item.summary} ${item.category} ${item.useWhen}`.toLowerCase().includes(needle);
      return inCategory && inSearch;
    });
    return sortLibraryItems(matched, sort);
  }, [category, query, sort]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / perPage));
  const visibleItems = filtered.slice(page * perPage, page * perPage + perPage);
  const peeked = peekedId ? libraryItems.find((item) => item.id === peekedId) ?? null : null;

  useEffect(() => {
    const hydrateFrame = requestAnimationFrame(() => {
      try {
        const storedSaved = window.localStorage.getItem(SAVED_STORAGE_KEY);
        if (storedSaved) {
          const parsed = JSON.parse(storedSaved);
          if (Array.isArray(parsed)) {
            setSaved(parsed.filter((id): id is string => typeof id === "string" && libraryItems.some((item) => item.id === id)));
          }
        }
        const storedDrafts = window.sessionStorage.getItem(DRAFTS_STORAGE_KEY);
        if (storedDrafts) {
          const parsed = JSON.parse(storedDrafts);
          if (parsed && typeof parsed === "object") setDrafts(parsed);
        }
      } catch {
        // Storage unavailable in private context
      }
    });
    const supabase = getKoshSupabase();
    if (!supabase) return () => cancelAnimationFrame(hydrateFrame);
    let alive = true;
    supabase.auth.getUser().then(({ data }) => {
      if (!alive || !data.user) return;
      supabase
        .from("template_bookmarks")
        .select("template_id")
        .eq("user_id", data.user.id)
        .then(({ data: rows }) => {
          if (!alive || !rows) return;
          const remoteIds = rows
            .map((row) => row.template_id)
            .filter((id): id is string => typeof id === "string" && libraryItems.some((item) => item.id === id));
          if (remoteIds.length) {
            setSaved((current) => Array.from(new Set([...current, ...remoteIds])));
          }
        });
    });
    return () => {
      alive = false;
      cancelAnimationFrame(hydrateFrame);
    };
  }, []);

  useEffect(() => {
    const frame = requestAnimationFrame(() => headingRef.current?.focus());
    return () => cancelAnimationFrame(frame);
  }, [scene, step]);

  useEffect(() => {
    function restoreFromHistory() {
      const params = new URLSearchParams(window.location.search);
      const nextItem = params.get("item");
      const nextScene = parseScene(params.get("scene") ?? undefined);
      setScene(nextScene);
      setStep(parseStep(params.get("step") ?? undefined));
      if (nextItem && libraryItems.some((item) => item.id === nextItem)) setSelectedId(nextItem);
    }
    window.addEventListener("popstate", restoreFromHistory);
    return () => window.removeEventListener("popstate", restoreFromHistory);
  }, []);

  useEffect(() => {
    if (tool !== "assistant") {
      assistantAbortRef.current?.abort();
      assistantAbortRef.current = null;
    }
  }, [tool, selectedId]);

  useEffect(() => {
    function closeOutside(event: PointerEvent) {
      const target = event.target as Node;
      if (!dockRef.current?.contains(target) && !bottomDockRef.current?.contains(target)) setDockMenu(null);
    }
    document.addEventListener("pointerdown", closeOutside);
    return () => document.removeEventListener("pointerdown", closeOutside);
  }, []);

  function updateDraft(field: keyof Draft, value: string) {
    setDrafts((current) => {
      const next = {
        ...current,
        [selected.id]: { ...(current[selected.id] ?? emptyDraft), [field]: value },
      };
      try {
        window.sessionStorage.setItem(DRAFTS_STORAGE_KEY, JSON.stringify(next));
      } catch {
        // Ignore session storage errors
      }
      return next;
    });
    setValidation("");
  }

  function toggleSaved(templateId: string) {
    const isCurrentlySaved = saved.includes(templateId);
    const next = isCurrentlySaved ? saved.filter((id) => id !== templateId) : [...saved, templateId];
    setSaved(next);
    try {
      window.localStorage.setItem(SAVED_STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Ignore localStorage quota errors
    }
    const supabase = getKoshSupabase();
    if (!supabase) return;
    void supabase.auth.getUser().then(({ data }) => {
      if (!data.user) return;
      if (isCurrentlySaved) {
        void supabase.from("template_bookmarks").delete().eq("user_id", data.user.id).eq("template_id", templateId);
      } else {
        void supabase.from("template_bookmarks").insert({ user_id: data.user.id, template_id: templateId });
      }
    });
  }

  function clampCanvasOffset(x: number, y: number) {
    const viewport = canvasViewportRef.current;
    const world = canvasWorldRef.current;
    if (!viewport || !world) return { x, y };
    const edge = 24;
    const minX = Math.min(edge, viewport.clientWidth - world.offsetWidth - edge);
    const minY = Math.min(edge, viewport.clientHeight - world.offsetHeight - edge);
    return {
      x: Math.max(minX, Math.min(edge, x)),
      y: Math.max(minY, Math.min(edge, y)),
    };
  }

  function moveCanvas(x: number, y: number) {
    setCanvasOffset((current) => clampCanvasOffset(current.x + x, current.y + y));
  }

  function ensureTileVisible(index: number) {
    const viewport = canvasViewportRef.current;
    if (!viewport) return;
    viewport.scrollLeft = 0;
    viewport.scrollTop = 0;
    const placement = tilePlacements[index % tilePlacements.length];
    const tileW = 270;
    const tileH = 158;
    const pad = 28;
    setCanvasOffset((current) => {
      let nextX = current.x;
      let nextY = current.y;
      if (placement.x + nextX < pad) nextX = pad - placement.x;
      else if (placement.x + tileW + nextX > viewport.clientWidth - pad) nextX = viewport.clientWidth - pad - (placement.x + tileW);
      if (placement.y + nextY < pad) nextY = pad - placement.y;
      else if (placement.y + tileH + nextY > viewport.clientHeight - pad) nextY = viewport.clientHeight - pad - (placement.y + tileH);
      if (nextX === current.x && nextY === current.y) return current;
      return clampCanvasOffset(nextX, nextY);
    });
  }

  function resetCanvasView() {
    setCanvasOffset({ x: 0, y: 0 });
    setPeekedId(null);
  }

  function changePage(nextPage: number) {
    setPage(Math.max(0, Math.min(pageCount - 1, nextPage)));
    resetCanvasView();
  }

  function openTile(item: LibraryItem) {
    if (peekedId === item.id) {
      navigate("overview", { item: item.id });
      return;
    }
    setSelectedId(item.id);
    setPeekedId(item.id);
    requestAnimationFrame(() => peekHeadingRef.current?.focus());
  }

  function closeTileLens() {
    const closingId = peekedId;
    setPeekedId(null);
    requestAnimationFrame(() => closingId && tileRefs.current[closingId]?.focus());
  }

  function handleCanvasPointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    if ((event.target as Element).closest("button, a")) return;
    dragState.current = {
      pointerId: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      startX: canvasOffset.x,
      startY: canvasOffset.y,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
    setPanning(true);
  }

  function handleCanvasPointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    const drag = dragState.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    const dx = event.clientX - drag.x;
    const dy = event.clientY - drag.y;
    setCanvasOffset(clampCanvasOffset(drag.startX + dx, drag.startY + dy));
  }

  function handleCanvasPointerEnd(event: ReactPointerEvent<HTMLDivElement>) {
    if (dragState.current?.pointerId !== event.pointerId) return;
    dragState.current = null;
    setPanning(false);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  }

  function handleCanvasKeyDown(event: ReactKeyboardEvent<HTMLDivElement>) {
    if (event.target !== event.currentTarget) return;
    const movement: Record<string, [number, number]> = {
      ArrowLeft: [72, 0], ArrowRight: [-72, 0], ArrowUp: [0, 72], ArrowDown: [0, -72],
    };
    const delta = movement[event.key];
    if (!delta) return;
    event.preventDefault();
    moveCanvas(delta[0], delta[1]);
  }

  function navigate(nextScene: Scene, options?: { item?: string; step?: Step; replace?: boolean }) {
    const nextItem = options?.item ?? selectedId;
    const nextStep = options?.step ?? 1;
    setSelectedId(nextItem);
    setScene(nextScene);
    setStep(nextStep);
    setValidation("");
    setCopiedBrief(false);
    setDockMenu(null);
    setPeekedId(null);
    if (nextScene !== "overview") setTool("preview");
    if (nextScene === "library") {
      setPage(pageForItem(filtered, nextItem, perPage));
    }
    const params = new URLSearchParams();
    if (nextScene !== "library") params.set("scene", nextScene);
    if (nextScene !== "library") params.set("item", nextItem);
    if (nextScene === "create" && nextStep > 1) params.set("step", String(nextStep));
    const basePath = typeof window !== "undefined" ? window.location.pathname : "/kosh/";
    const url = `${basePath}${params.size ? `?${params.toString()}` : ""}`;
    window.history[options?.replace ? "replaceState" : "pushState"](null, "", url);
  }

  function advanceCreate() {
    const required = step === 1 ? draft.goal : step === 2 ? draft.context : draft.boundary;
    if (!required.trim()) {
      setValidation(
        step === 1
          ? "Name the outcome before continuing."
          : step === 2
            ? "Add the approved inputs and working context."
            : "Name who must review the result.",
      );
      return;
    }
    if (step === 3 && (!draft.goal.trim() || !draft.context.trim())) {
      setValidation("Complete the outcome and context before reviewing this adaptation.");
      return;
    }
    if (step < 3) navigate("create", { step: (step + 1) as Step });
    else navigate("review");
  }

  async function askAssistant(event: FormEvent) {
    event.preventDefault();
    const trimmed = assistantQuestion.trim();
    if (!trimmed) return;
    assistantAbortRef.current?.abort();
    const controller = new AbortController();
    assistantAbortRef.current = controller;
    const promptWithContext = `Regarding "${selected.title}": ${trimmed}`;
    setAssistantState("loading");
    setAssistantAnswer("");
    setAssistantRecommendations([]);
    try {
      const response = await fetch("/api/kosh/discover/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: promptWithContext.slice(0, 1000) }],
        }),
        signal: controller.signal,
      });
      const payload = await response.json();
      const parsed = response.ok ? parseDiscoveryAnswer(payload) : null;
      if (parsed) {
        setAssistantAnswer(parsed.reply);
        setAssistantRecommendations(parsed.recommendations);
        setAssistantState("ready");
        return;
      }
      throw new Error("Fallback to catalogue");
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") return;
      const fallback = catalogueDiscovery([{ role: "user", content: promptWithContext }]);
      setAssistantAnswer(
        fallback.reply ||
          `Start with “${selected.title}” when ${selected.useWhen.charAt(0).toLowerCase()}${selected.useWhen.slice(1)} Keep the first pass narrow, then name the person who checks it.`,
      );
      setAssistantRecommendations(fallback.recommendations);
      setAssistantState("ready");
    } finally {
      if (assistantAbortRef.current === controller) {
        assistantAbortRef.current = null;
      }
    }
  }

  async function copyWorkingBrief() {
    try {
      await navigator.clipboard.writeText(formatWorkingBriefMarkdown(selected, draft));
      setCopiedBrief(true);
      window.setTimeout(() => setCopiedBrief(false), 2400);
    } catch {
      downloadWorkingBrief();
    }
  }

  function downloadWorkingBrief() {
    const markdown = formatWorkingBriefMarkdown(selected, draft);
    const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${selected.id}-working-brief.md`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  }

  function closeAssistant() {
    setTool("preview");
    requestAnimationFrame(() => contextTrigger.current?.focus());
  }

  function closeDockMenu(returnFocus = true) {
    const openMenu = dockMenu;
    setDockMenu(null);
    if (returnFocus) requestAnimationFrame(() => {
      if (openMenu === "places") {
        const visiblePlacesTrigger = placesTrigger.current?.offsetParent ? placesTrigger.current : mobilePlacesTrigger.current;
        visiblePlacesTrigger?.focus();
      } else contextTrigger.current?.focus();
    });
  }

  function chooseTool(nextTool: Tool) {
    setTool(nextTool);
    closeDockMenu(false);
  }

  const contextLabel = scene === "library"
    ? category === "All" ? "Focus" : category
    : scene === "overview"
      ? tool === "preview" ? "Preview" : tool === "guidance" ? "Guidance" : "Ask Kosh"
      : scene === "create"
        ? `Step ${step} of 3`
        : "Review";

  useEffect(() => {
    function onEscape(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      if (dockMenu) {
        event.preventDefault();
        const openMenu = dockMenu;
        setDockMenu(null);
        requestAnimationFrame(() => {
          if (openMenu === "places") {
            const visiblePlacesTrigger = placesTrigger.current?.offsetParent ? placesTrigger.current : mobilePlacesTrigger.current;
            visiblePlacesTrigger?.focus();
          } else contextTrigger.current?.focus();
        });
      } else if (peekedId) {
        const closingId = peekedId;
        setPeekedId(null);
        requestAnimationFrame(() => tileRefs.current[closingId]?.focus());
      } else if (tool === "assistant") closeAssistant();
    }
    window.addEventListener("keydown", onEscape);
    return () => window.removeEventListener("keydown", onEscape);
  }, [dockMenu, peekedId, tool]);

  return (
    <main className={styles.stageRoot} data-disable-global-shockwave="true">
      <a className={styles.skipLink} href="#kosh-stage">Skip to workspace</a>
      <header className={styles.dock} ref={dockRef}>
        <Link
          className={styles.brand}
          href={koshUrl("/")}
          aria-label="Kosh library"
          onClick={(event) => {
            if (scene !== "library") {
              event.preventDefault();
              navigate("library");
            }
          }}
        >
          <Image src="/assets/brand/kramaniti-kosh-mark.png" width={30} height={30} alt="" priority />
          <span>Kosh</span>
        </Link>
        <span className={styles.dockDivider} aria-hidden="true" />
        <div className={styles.dockSlot}>
          <button
            ref={placesTrigger}
            type="button"
            className={styles.dockTrigger}
            aria-haspopup="menu"
            aria-expanded={dockMenu === "places"}
            onClick={() => setDockMenu((current) => current === "places" ? null : "places")}
          >
            <Compass size={15} aria-hidden="true" />
            <span>{scene === "library" ? "Library" : scene === "overview" ? "Template" : scene === "create" ? "Create" : "Review"}</span>
            <ChevronDown size={13} aria-hidden="true" />
          </button>
          {dockMenu === "places" && (
            <div className={`${styles.dockMenu} ${styles.placesMenu}`} role="menu" aria-label="Kosh places">
              <p>Stage</p>
              <button type="button" role="menuitem" aria-current={scene === "library" ? "page" : undefined} onClick={() => navigate("library")}><Library size={15} /> <span><strong>Library</strong><small>Explore the spatial field</small></span></button>
              <button type="button" role="menuitem" aria-current={scene === "overview" ? "page" : undefined} onClick={() => navigate("overview")}><Eye size={15} /> <span><strong>Template</strong><small>{selected.title}</small></span></button>
              <button type="button" role="menuitem" aria-current={scene === "create" ? "page" : undefined} onClick={() => navigate("create", { step })}><FilePenLine size={15} /> <span><strong>Create</strong><small>Shape a working copy</small></span></button>
              <span className={styles.menuRule} role="separator" />
              <p>More in Kosh</p>
              <Link role="menuitem" href={koshUrl(`/${selected.id}/`)}><FileText size={15} /><span><strong>Full template guide</strong><small>Read, copy or download Markdown</small></span></Link>
              <Link role="menuitem" href={koshUrl(`/create/?source=${selected.id}`)}><Sparkles size={15} /><span><strong>Skill Studio</strong><small>Package a reusable skill</small></span></Link>
              <Link role="menuitem" href={koshUrl("/workspace/")}><FolderKanban size={15} /><span><strong>My Kosh</strong><small>Saved templates and copies</small></span></Link>
              <Link role="menuitem" href={SITE_URL}><ArrowLeft size={15} /><span><strong>Kramaniti</strong><small>Return to main site</small></span></Link>
            </div>
          )}
        </div>
        <div className={styles.orientation} aria-label="Current selection">
          <span>{scene === "library" ? `${filtered.length} ${filtered.length === 1 ? "template" : "templates"}` : selected.title}</span>
        </div>
        <Link className={styles.parentLink} href={SITE_URL}>by Kramaniti</Link>
        <button ref={mobilePlacesTrigger} className={styles.mobileMenuTrigger} type="button" aria-label="Open Kosh places" aria-expanded={dockMenu === "places"} onClick={() => setDockMenu((current) => current === "places" ? null : "places")}><Menu size={17} /></button>
      </header>

      <section className={styles.sheet} aria-label="Kosh matte workspace">
        <div id="kosh-stage" className={styles.stage}>
          {scene === "library" && (
            <div className={`${styles.scene} ${styles.libraryScene}`}>
              <div className={styles.galleryHeader}>
                <div className={styles.libraryIntro}>
                  <p className={styles.eyebrow}>Library · spatial field</p>
                  <h1 ref={headingRef} tabIndex={-1}>Move through useful patterns.</h1>
                </div>
                <label className={styles.searchField}>
                  <Search size={16} aria-hidden="true" />
                  <span className={styles.srOnly}>Search templates</span>
                  <input
                    value={query}
                    onChange={(event) => { setQuery(event.target.value); setPage(0); resetCanvasView(); }}
                    placeholder="Search the library"
                  />
                  {query && <button type="button" onClick={() => { setQuery(""); setPage(0); resetCanvasView(); }} aria-label="Clear search"><X size={15} /></button>}
                </label>
                <p className={styles.galleryStatus} role="status">{filtered.length} {filtered.length === 1 ? "template" : "templates"} · field {Math.min(page + 1, pageCount)} of {pageCount}</p>
              </div>
              {visibleItems.length ? (
                <div
                  ref={canvasViewportRef}
                  className={styles.canvasViewport}
                  data-panning={panning}
                  tabIndex={0}
                  role="region"
                  aria-label="Template canvas. Drag to move, or use arrow keys."
                  onKeyDown={handleCanvasKeyDown}
                  onPointerDown={handleCanvasPointerDown}
                  onPointerMove={handleCanvasPointerMove}
                  onPointerUp={handleCanvasPointerEnd}
                  onPointerCancel={handleCanvasPointerEnd}
                >
                  <div
                    ref={canvasWorldRef}
                    className={styles.canvasWorld}
                    style={{ transform: `translate3d(${canvasOffset.x}px, ${canvasOffset.y}px, 0)` }}
                  >
                    {visibleItems.map((item, index) => {
                      const placement = tilePlacements[index % tilePlacements.length];
                      return (
                        <button
                          ref={(node) => { tileRefs.current[item.id] = node; }}
                          className={styles.galleryTile}
                          data-tone={index % 4}
                          type="button"
                          key={item.id}
                          style={{
                            "--tile-x": `${placement.x}px`,
                            "--tile-y": `${placement.y}px`,
                            "--tile-r": `${placement.r}deg`,
                          } as CSSProperties}
                          aria-label={`Preview ${item.title}`}
                          onFocus={() => ensureTileVisible(index)}
                          onClick={() => openTile(item)}
                        >
                          <span className={styles.tileTopline}>
                            <small>{kindLabels[item.kind]}</small>
                            <b>{String(page * perPage + index + 1).padStart(2, "0")}</b>
                          </span>
                          <strong>{item.title}</strong>
                          <span className={styles.tileFooter}>{item.category}<ArrowRight size={15} aria-hidden="true" /></span>
                        </button>
                      );
                    })}
                  </div>
                  <div className={styles.canvasHint}><Move size={14} aria-hidden="true" /><span>Drag the field · arrow keys also move it</span></div>
                  {peeked && (
                    <div className={styles.lensLayer} onPointerDown={(event) => { if (event.target === event.currentTarget) closeTileLens(); }}>
                      <article className={styles.templateLens} role="dialog" aria-modal="true" aria-labelledby="template-lens-heading">
                        <button className={styles.lensClose} type="button" aria-label="Close template preview" onClick={closeTileLens}><X size={17} /></button>
                        <p className={styles.eyebrow}>{kindLabels[peeked.kind]} · {peeked.category}</p>
                        <h2 id="template-lens-heading" ref={peekHeadingRef} tabIndex={-1}>{peeked.title}</h2>
                        <p>{peeked.summary}</p>
                        <div className={styles.lensMeta}>
                          <span>{peeked.includes.length} parts</span>
                          <span>{peeked.format}</span>
                          <span>{peeked.created ? `Added ${formatCreatedDate(peeked.created)}` : "Free template"}</span>
                        </div>
                        <div className={styles.lensActions}>
                          <button className={styles.lensOpen} type="button" onClick={() => navigate("overview", { item: peeked.id })}>
                            <span>Open the full template</span><ArrowRight size={17} />
                          </button>
                          <Link className={styles.lensSecondary} href={koshUrl(`/${peeked.id}/`)}>
                            <span>Full Markdown</span><ArrowUpRight size={14} />
                          </Link>
                        </div>
                        <small className={styles.lensHint}>First press previews. This press opens the complete workspace.</small>
                      </article>
                    </div>
                  )}
                </div>
              ) : (
                <div className={styles.emptyState}>
                  <Library size={25} aria-hidden="true" />
                  <h2>No templates match this view.</h2>
                  <p>Clear the search or return to all focus areas.</p>
                  <button type="button" onClick={() => { setQuery(""); setCategory("All"); setPage(0); resetCanvasView(); }}>Show all templates</button>
                </div>
              )}
            </div>
          )}

          {scene === "overview" && (
            <div className={`${styles.scene} ${styles.objectScene}`}>
              <aside className={styles.objectRail}>
                <div className={styles.objectIdentity}>
                  <small>{kindLabels[selected.kind]} · {selected.category}</small>
                  <h1 ref={headingRef} tabIndex={-1}>{selected.title}</h1>
                  <p>{selected.summary}</p>
                  <div className={styles.objectActions}>
                    <a className={styles.secondary} href={koshUrl(selected.download)} download={`${selected.id}.md`}>
                      <Download size={13} aria-hidden="true" /><span>Download .md</span>
                    </a>
                    <Link className={styles.secondary} href={koshUrl(`/${selected.id}/`)}>
                      <FileText size={13} aria-hidden="true" /><span>Full guide</span>
                    </Link>
                  </div>
                </div>
              </aside>
              <div className={styles.contextWorkspace}>
                {tool === "preview" && (
                  <div className={styles.toolSurface} role="tabpanel">
                    <p className={styles.eyebrow}>Inside the template</p>
                    <h2>{detail ? detail.outcome : "One clear operating pattern."}</h2>
                    <div className={styles.includeList}>
                      {selected.includes.map((entry, index) => <div key={entry}><span>{String(index + 1).padStart(2, "0")}</span><strong>{entry}</strong></div>)}
                    </div>
                    <p className={styles.boundaryNote}>Starter template · {selected.format} · adapt a working copy or download the original.</p>
                  </div>
                )}
                {tool === "guidance" && (
                  <div className={styles.toolSurface} role="tabpanel">
                    <p className={styles.eyebrow}>Use it when</p>
                    <h2>{selected.useWhen}</h2>
                    <div className={styles.guidanceLine}>
                      <strong>Before you start</strong>
                      <span>{detail ? detail.requires.join(" · ") : "Name one outcome and only the inputs approved for this attempt."}</span>
                    </div>
                    <div className={styles.guidanceLine}>
                      <strong>Quality check</strong>
                      <span>{detail ? detail.check : "Every claim has a traceable source and a named reviewer."}</span>
                    </div>
                    <div className={styles.guidanceLine}>
                      <strong>Human boundary</strong>
                      <span>{detail ? detail.limit : "Choose who reviews the result before the template becomes part of a live workflow."}</span>
                    </div>
                  </div>
                )}
                {tool === "assistant" && (
                  <div className={styles.toolSurface} role="tabpanel">
                    <div className={styles.surfaceHeading}>
                      <div><p className={styles.eyebrow}>Kosh Assistant</p><h2>Ask about this template.</h2></div>
                      <button type="button" onClick={closeAssistant} aria-label="Close Kosh Assistant"><X size={17} /></button>
                    </div>
                    <form className={styles.assistantForm} onSubmit={askAssistant}>
                      <label><span>Your question</span><textarea value={assistantQuestion} onChange={(event) => setAssistantQuestion(event.target.value)} placeholder="Where should I begin with this, or how does it compare with other templates?" maxLength={240} /></label>
                      <button className={styles.primary} type="submit" disabled={!assistantQuestion.trim() || assistantState === "loading"}>{assistantState === "loading" ? "Finding a starting point…" : "Ask Kosh"}</button>
                    </form>
                    <div className={styles.assistantResult} role="status" aria-live="polite">
                      {assistantState === "idle" && <p>Ask how to apply this template or which Kosh template fits your task. Avoid private or sensitive details.</p>}
                      {assistantState === "loading" && <p>Reading this template’s public guidance…</p>}
                      {assistantState === "ready" && (
                        <>
                          <p>{assistantAnswer}</p>
                          {assistantRecommendations.length > 0 && (
                            <div className={styles.assistantRecommendations}>
                              {assistantRecommendations.map((rec) => {
                                const recItem = libraryItems.find((entry) => entry.id === rec.id);
                                if (!recItem) return null;
                                return (
                                  <button
                                    key={rec.id}
                                    type="button"
                                    className={styles.assistantChip}
                                    onClick={() => {
                                      setSelectedId(recItem.id);
                                      setTool("preview");
                                      navigate("overview", { item: recItem.id });
                                    }}
                                  >
                                    <span>{recItem.title}</span>
                                    <ArrowRight size={12} aria-hidden="true" />
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {scene === "create" && (
            <div className={`${styles.scene} ${styles.createScene}`}>
              <div className={styles.createHeader}>
                <div><p className={styles.eyebrow}>Adapt · step {step} of 3</p><h1 ref={headingRef} tabIndex={-1}>{step === 1 ? "Name the outcome." : step === 2 ? "Set the working context." : "Keep the human boundary."}</h1></div>
                <div className={styles.stepTrack} aria-label={`Step ${step} of 3`}>{[1, 2, 3].map((value) => <span key={value} data-active={value <= step} />)}</div>
              </div>
              <div className={styles.createBody}>
                <aside className={styles.sourceNote}>
                  <small>Starting from</small><strong>{selected.title}</strong><p>{detail ? detail.question : selected.summary}</p>
                  <span>Draft values stay attached to this template in this tab while you move through Kosh.</span>
                </aside>
                <div className={styles.formStage}>
                  {step === 1 && <label><span>What should this help you complete?</span><textarea autoFocus value={draft.goal} onChange={(event) => updateDraft("goal", event.target.value)} placeholder="Example: Give the owner a weekly summary of sales, stock and overdue payments." maxLength={240} /></label>}
                  {step === 2 && <label><span>Which approved inputs and constraints matter?</span><textarea autoFocus value={draft.context} onChange={(event) => updateDraft("context", event.target.value)} placeholder="Example: Billing export, stock register and dues sheet. Flag missing numbers; do not estimate." maxLength={240} /></label>}
                  {step === 3 && <label><span>Who reviews the result, and what must remain human-led?</span><textarea autoFocus value={draft.boundary} onChange={(event) => updateDraft("boundary", event.target.value)} placeholder="Example: The accounts lead checks every figure before the owner receives the summary." maxLength={240} /></label>}
                  <div className={styles.formFeedback} aria-live="polite">{validation ? <p role="alert">{validation}</p> : <p>{step === 2 && detail ? `Recommended inputs: ${detail.requires.join(", ")}.` : "Your entry is kept when you move to another scene."}</p>}</div>
                  <div className={styles.formMeta}>
                    <span>{(step === 1 ? draft.goal : step === 2 ? draft.context : draft.boundary).length} / 240</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {scene === "review" && draftComplete && (
            <div className={`${styles.scene} ${styles.reviewScene}`}>
              <div className={styles.reviewIntro}>
                <p className={styles.eyebrow}>Review</p>
                <h1 ref={headingRef} tabIndex={-1}>A bounded adaptation, ready to use.</h1>
                <p>Copy or download this working brief as Markdown, or open the template in Skill Studio to package a reusable skill.</p>
              </div>
              <div className={styles.reviewSheet}>
                <header><small>Working copy</small><strong>{selected.title}</strong><span>Markdown brief · ready</span></header>
                <dl>
                  <div><dt>Outcome</dt><dd>{draft.goal}</dd></div>
                  <div><dt>Approved context</dt><dd>{draft.context}</dd></div>
                  <div><dt>Human boundary</dt><dd>{draft.boundary}</dd></div>
                  {detail && <div><dt>Quality check</dt><dd>{detail.check}</dd></div>}
                </dl>
              </div>
            </div>
          )}
          {scene === "review" && !draftComplete && (
            <div className={`${styles.scene} ${styles.recoveryScene}`}>
              <p className={styles.eyebrow}>Draft unavailable</p>
              <h1 ref={headingRef} tabIndex={-1}>This local draft is no longer in this session.</h1>
              <p>Stage drafts live in your current browser tab. The selected template is ready, so you can begin a fresh bounded adaptation or open the full Markdown guide.</p>
            </div>
          )}
        </div>
      </section>

      <footer className={`${styles.dock} ${styles.bottomDock}`} ref={bottomDockRef} aria-label="Contextual actions">
        <div className={styles.dockSlot}>
          <button
            ref={contextTrigger}
            type="button"
            className={`${styles.dockTrigger} ${styles.contextTrigger}`}
            aria-haspopup="menu"
            aria-expanded={dockMenu === "context"}
            onClick={() => setDockMenu((current) => current === "context" ? null : "context")}
          >
            {scene === "library" ? <SlidersHorizontal size={15} /> : scene === "overview" ? <Eye size={15} /> : scene === "create" ? <FilePenLine size={15} /> : <Check size={15} />}
            <span>{contextLabel}</span>
            <ChevronDown size={13} aria-hidden="true" />
          </button>
          {dockMenu === "context" && (
            <div className={`${styles.dockMenu} ${styles.contextMenu}`} role="menu" aria-label={`${contextLabel} options`}>
              {scene === "library" && <>
                <p>Focus the library</p>
                {categories.map((value) => <button key={value} type="button" role="menuitemradio" aria-checked={category === value} onClick={() => { setCategory(value); setPage(0); resetCanvasView(); closeDockMenu(false); }}><span className={styles.menuCheck}>{category === value ? <Check size={13} /> : null}</span><span><strong>{value === "All" ? "All templates" : value}</strong><small>{value === "All" ? "Show the complete public library" : `Only ${value.toLowerCase()} templates`}</small></span></button>)}
                <span className={styles.menuRule} role="separator" />
                <p>Sort order</p>
                {librarySortOptions.map((option) => <button key={option.value} type="button" role="menuitemradio" aria-checked={sort === option.value} onClick={() => { setSort(option.value); setPage(0); resetCanvasView(); closeDockMenu(false); }}><span className={styles.menuCheck}>{sort === option.value ? <Check size={13} /> : null}</span><span><strong>{option.label}</strong><small>Order templates in the field</small></span></button>)}
                {query && <button type="button" role="menuitem" onClick={() => { setQuery(""); setPage(0); resetCanvasView(); closeDockMenu(false); }}><X size={15} /><span><strong>Clear search</strong><small>Keep the current focus</small></span></button>}
              </>}
              {scene === "overview" && <>
                <p>Template tools</p>
                <button type="button" role="menuitemradio" aria-checked={tool === "preview"} onClick={() => chooseTool("preview")}><Eye size={15} /><span><strong>Preview</strong><small>See the operating pattern</small></span></button>
                <button type="button" role="menuitemradio" aria-checked={tool === "guidance"} onClick={() => chooseTool("guidance")}><CircleHelp size={15} /><span><strong>Guidance</strong><small>Know when and how to use it</small></span></button>
                <button type="button" role="menuitemradio" aria-checked={tool === "assistant"} onClick={() => chooseTool("assistant")}><Sparkles size={15} /><span><strong>Ask Kosh</strong><small>Get a catalogue-grounded starting point</small></span></button>
              </>}
              {scene === "create" && <>
                <p>Adaptation steps</p>
                <button type="button" role="menuitemradio" aria-checked={step === 1} onClick={() => navigate("create", { step: 1 })}><span className={styles.menuStep}>1</span><span><strong>Outcome</strong><small>Name the work to complete</small></span></button>
                <button type="button" role="menuitemradio" aria-checked={step === 2} disabled={!draft.goal.trim()} onClick={() => navigate("create", { step: 2 })}><span className={styles.menuStep}>2</span><span><strong>Context</strong><small>Set inputs and constraints</small></span></button>
                <button type="button" role="menuitemradio" aria-checked={step === 3} disabled={!draft.goal.trim() || !draft.context.trim()} onClick={() => navigate("create", { step: 3 })}><span className={styles.menuStep}>3</span><span><strong>Human boundary</strong><small>Name the reviewer</small></span></button>
              </>}
              {scene === "review" && <>
                <p>Review actions</p>
                <button type="button" role="menuitem" disabled={!draftComplete} onClick={() => navigate("create", { step: 1 })}><span className={styles.menuStep}>1</span><span><strong>Edit outcome</strong><small>Return without losing the draft</small></span></button>
                <button type="button" role="menuitem" disabled={!draftComplete} onClick={() => navigate("create", { step: 2 })}><span className={styles.menuStep}>2</span><span><strong>Edit context</strong><small>Return without losing the draft</small></span></button>
                <button type="button" role="menuitem" disabled={!draftComplete} onClick={() => navigate("create", { step: 3 })}><span className={styles.menuStep}>3</span><span><strong>Edit boundary</strong><small>Return without losing the draft</small></span></button>
                <span className={styles.menuRule} role="separator" />
                <Link role="menuitem" href={koshUrl(`/create/?source=${selected.id}`)}><Sparkles size={15} /><span><strong>Open in Skill Studio</strong><small>Package a full skill archive</small></span></Link>
              </>}
            </div>
          )}
        </div>

        <div className={styles.bottomStatus} aria-live="polite">
          {scene === "library" && <span>Field {Math.min(page + 1, pageCount)} / {pageCount}</span>}
          {scene === "overview" && <span>{saved.includes(selected.id) ? "Saved to Kosh" : kindLabels[selected.kind]}</span>}
          {scene === "create" && <span>{(step === 1 ? draft.goal : step === 2 ? draft.context : draft.boundary).length} / 240</span>}
          {scene === "review" && <span>{copiedBrief ? "Brief copied" : draftComplete ? "Working brief ready" : "Draft unavailable"}</span>}
        </div>

        <div className={styles.bottomActions}>
          {scene === "library" && <>
            <button type="button" className={styles.dockIconButton} onClick={resetCanvasView} aria-label="Reset canvas position"><RotateCcw size={15} /></button>
            <button type="button" className={styles.dockIconButton} onClick={() => changePage(page - 1)} disabled={page === 0} aria-label="Previous field"><ChevronLeft size={17} /></button>
            <button type="button" className={styles.dockIconButton} onClick={() => changePage(page + 1)} disabled={page >= pageCount - 1} aria-label="Next field"><ChevronRight size={17} /></button>
          </>}
          {scene === "overview" && <>
            <button type="button" className={styles.dockAction} aria-label={saved.includes(selected.id) ? "Remove saved template" : "Save template"} onClick={() => toggleSaved(selected.id)}>
              {saved.includes(selected.id) ? <Check size={15} /> : <Bookmark size={15} />}<span>{saved.includes(selected.id) ? "Saved" : "Save"}</span>
            </button>
            <button type="button" className={styles.dockPrimary} onClick={() => navigate("create")}><FilePenLine size={15} /><span>Adapt template</span></button>
          </>}
          {scene === "create" && <>
            <button type="button" className={styles.dockAction} aria-label={step === 1 ? "Return to template" : "Previous step"} onClick={() => step === 1 ? navigate("overview") : navigate("create", { step: (step - 1) as Step })}><ArrowLeft size={15} /><span>{step === 1 ? "Template" : "Previous"}</span></button>
            <button type="button" className={styles.dockPrimary} onClick={advanceCreate}><span>{step === 3 ? "Review" : "Continue"}</span><ArrowRight size={15} /></button>
          </>}
          {scene === "review" && draftComplete && <>
            <button type="button" className={styles.dockAction} aria-label="Copy working brief" onClick={() => void copyWorkingBrief()}>
              {copiedBrief ? <Check size={15} /> : <Copy size={15} />}<span>{copiedBrief ? "Copied" : "Copy brief"}</span>
            </button>
            <button type="button" className={styles.dockPrimary} onClick={downloadWorkingBrief}><Download size={15} /><span>Download brief</span></button>
          </>}
          {scene === "review" && !draftComplete && <>
            <button type="button" className={styles.dockAction} aria-label="Return to template" onClick={() => navigate("overview")}><ArrowLeft size={15} /><span>Template</span></button>
            <button type="button" className={styles.dockPrimary} onClick={() => navigate("create", { step: 1 })}><FilePenLine size={15} /><span>Start again</span></button>
          </>}
        </div>
      </footer>
    </main>
  );
}
