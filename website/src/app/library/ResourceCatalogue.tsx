"use client";
import {
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  LayoutList,
  List,
  Search,
  X,
} from "lucide-react";
import { useKoshJourney } from "@/components/kosh/world/KoshWorld";
import { ResourceTile } from "./ResourceTile";
import { libraryItems, libraryKinds } from "@/lib/library/libraryData";
import { resourceDetails } from "@/lib/library/resourceDetails";
import styles from "./editorial.module.css";
import discovery from "./discovery.module.css";

const suggestions = [
  { label: "Research a decision", query: "research" },
  { label: "Improve a workflow", query: "process" },
  { label: "Check a claim", query: "claims" },
];
export function ResourceCatalogue({
  initialKind = "All",
  initialQuery = "",
  initialCompact = false,
  pathView = false,
}: {
  initialKind?: string;
  initialQuery?: string;
  initialCompact?: boolean;
  pathView?: boolean;
}) {
  const [query, setQuery] = useState(initialQuery);
  const [kind, setKind] = useState(
    libraryKinds.some((kind) => kind === initialKind) ? initialKind : "All",
  );
  const [compact, setCompact] = useState(initialCompact);
  const search = useRef<HTMLInputElement>(null);
  const searchId = useId();
  const journey = useKoshJourney();
  const restoreExplore = journey?.restoreExplore;
  useLayoutEffect(() => {
    if (pathView) restoreExplore?.();
  }, [pathView, restoreExplore]);
  useEffect(() => {
    if (!pathView) return;
    function focusSearch(event: KeyboardEvent) {
      const target = event.target as HTMLElement;
      if (
        event.defaultPrevented ||
        event.isComposing ||
        target.closest(
          "input, textarea, select, [contenteditable='true'], [role='textbox'], dialog[open]",
        )
      )
        return;
      if (
        (event.key === "/" &&
          !event.metaKey &&
          !event.ctrlKey &&
          !event.altKey) ||
        (event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey))
      ) {
        event.preventDefault();
        search.current?.focus({ preventScroll: true });
        search.current?.scrollIntoView({
          block: "center",
          behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
            ? "instant"
            : "smooth",
        });
      }
    }
    window.addEventListener("keydown", focusSearch);
    return () => window.removeEventListener("keydown", focusSearch);
  }, [pathView]);
  function updateLocation(
    nextQuery: string,
    nextKind: string,
    nextCompact: boolean,
  ) {
    if (!pathView) return;
    const url = new URL(window.location.href);
    if (nextQuery) url.searchParams.set("q", nextQuery);
    else url.searchParams.delete("q");
    if (nextKind !== "All") url.searchParams.set("kind", nextKind);
    else url.searchParams.delete("kind");
    if (nextCompact) url.searchParams.set("view", "compact");
    else url.searchParams.delete("view");
    window.history.replaceState(
      null,
      "",
      `${url.pathname}${url.search}#catalogue`,
    );
  }
  function reset() {
    setQuery("");
    setKind("All");
    updateLocation("", "All", compact);
  }
  const matching = useMemo(() => {
    const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
    return libraryItems.filter((item) => {
      const text =
        `${item.title} ${item.kind} ${item.summary} ${item.useWhen} ${item.includes.join(" ")} ${resourceDetails[item.id].outcome}`.toLowerCase();
      return terms.every((term) => text.includes(term));
    });
  }, [query]);
  const items = matching.filter((item) => kind === "All" || item.kind === kind);
  const filtered = !!query || kind !== "All";
  return (
    <div className={discovery.browser}>
      <div className={discovery.toolbar}>
        <div className={discovery.search}>
          <Search size={19} aria-hidden="true" />
          <label className={discovery.srOnly} htmlFor={searchId}>
            Find a resource
          </label>
          <input
            ref={search}
            id={searchId}
            aria-label="Find a resource"
            type="search"
            placeholder="Search by task or topic"
            value={query}
            maxLength={200}
            aria-keyshortcuts="/ Control+k Meta+k"
            onChange={(event) => {
              setQuery(event.target.value);
              updateLocation(event.target.value, kind, compact);
            }}
          />
          {query ? (
            <button
              type="button"
              aria-label="Clear search"
              onClick={() => {
                setQuery("");
                updateLocation("", kind, compact);
                search.current?.focus();
              }}
            >
              <X size={16} aria-hidden="true" />
            </button>
          ) : (
            <kbd aria-hidden="true">/</kbd>
          )}
        </div>
        <button
          type="button"
          className={discovery.viewToggle}
          aria-label="Compact view"
          aria-pressed={compact}
          onClick={() => {
            setCompact(!compact);
            updateLocation(query, kind, !compact);
          }}
        >
          {compact ? (
            <List size={18} aria-hidden="true" />
          ) : (
            <LayoutList size={18} aria-hidden="true" />
          )}
          <span>Compact</span>
        </button>
      </div>
      <div className={discovery.suggestions} aria-label="Search by task">
        <span>Start with a task</span>
        {suggestions.map((suggestion) => (
          <button
            key={suggestion.query}
            type="button"
            aria-pressed={query === suggestion.query && kind === "All"}
            onClick={() => {
              setQuery(suggestion.query);
              setKind("All");
              updateLocation(suggestion.query, "All", compact);
            }}
          >
            {suggestion.label}
            <ArrowUpRight size={12} aria-hidden="true" />
          </button>
        ))}
      </div>
      <div className={discovery.filterBar}>
        <div
          className={discovery.kindNav}
          role="group"
          aria-label="Resource format"
        >
          {["All", ...libraryKinds].map((value) => (
            <button
              key={value}
              type="button"
              aria-pressed={kind === value}
              onClick={() => {
                setKind(value);
                updateLocation(query, value, compact);
              }}
            >
              {value}
              <small>
                {value === "All"
                  ? matching.length
                  : matching.filter((item) => item.kind === value).length}
              </small>
            </button>
          ))}
        </div>
        <div className={discovery.resultStatus}>
          <p role="status" aria-atomic="true">
            {items.length} {items.length === 1 ? "resource" : "resources"}
          </p>
          {filtered && (
            <button type="button" onClick={reset}>
              Reset <X size={12} aria-hidden="true" />
            </button>
          )}
        </div>
      </div>
      <div
        key={`${kind}:${query}:${compact}`}
        className={
          pathView
            ? `${discovery.list} ${compact ? discovery.compact : ""}`
            : compact
              ? styles.compactCatalogue
              : styles.catalogue
        }
      >
        {items.map((item, index) => {
          return pathView ? (
            <Link
              key={item.id}
              href={`/library/resources/${item.id}`}
              className={discovery.item}
              style={{ "--item-order": index } as CSSProperties}
            >
              <span className={discovery.itemIdentity}>{item.kind}</span>
              <div className={discovery.itemBody}>
                <h3>{item.title}</h3>
                <span className={discovery.itemSummary}>{item.summary}</span>
                <span className={discovery.itemIncludes}>
                  {item.includes.slice(0, 2).map((label) => (
                    <span key={label}>{label}</span>
                  ))}
                </span>
              </div>
              <span className={discovery.itemAction}>
                <span>Explore</span>
                <ArrowUpRight size={21} aria-hidden="true" />
              </span>
            </Link>
          ) : (
            <ResourceTile key={item.id} item={item} />
          );
        })}
      </div>
      {!items.length && (
        <div className={discovery.empty}>
          <Search size={28} strokeWidth={1.2} aria-hidden="true" />
          <h3>A different starting point?</h3>
          <p>
            No resources match{query ? <> “{query}”</> : " this selection"}
            {kind !== "All" ? ` in ${kind}` : ""}. Try a broader task or explore
            the full collection.
          </p>
          <button
            type="button"
            className={discovery.textAction}
            onClick={reset}
          >
            Show all resources <ArrowRight size={16} aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  );
}
