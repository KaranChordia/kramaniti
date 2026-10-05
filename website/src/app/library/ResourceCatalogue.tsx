"use client";
import { useId, useMemo, useRef, useState, type CSSProperties } from "react";
import Link from "next/link";
import { ArrowUpRight, Search, X } from "lucide-react";
import { ResourceTile } from "./ResourceTile";
import { kindLabels, libraryItems, libraryKinds } from "@/lib/library/libraryData";
import { resourceDetails } from "@/lib/library/resourceDetails";
import styles from "./editorial.module.css";
import discovery from "./discovery.module.css";

export function ResourceCatalogue({
  initialQuery = "",
  pathView = false,
}: {
  initialQuery?: string;
  pathView?: boolean;
}) {
  const [query, setQuery] = useState(initialQuery);
  const [kind, setKind] = useState("All");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("library");
  const categories = Array.from(new Set(libraryItems.map((item) => item.category)));
  const search = useRef<HTMLInputElement>(null);
  const searchId = useId();
  function reset() {
    setQuery("");
    setKind("All");
    setCategory("All");
    search.current?.focus();
  }
  const matching = useMemo(() => {
    const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
    return libraryItems.filter((item) => {
      const text =
        `${item.title} ${item.category} ${kindLabels[item.kind]} ${item.kind} ${item.summary} ${item.useWhen} ${item.includes.join(" ")} ${resourceDetails[item.id].outcome}`.toLowerCase();
      return (kind === "All" || item.kind === kind) &&
        (category === "All" || item.category === category) &&
        terms.every((term) => text.includes(term));
    }).sort((a, b) => {
      if (sort === "az") return a.title.localeCompare(b.title);
      if (sort === "za") return b.title.localeCompare(a.title);
      if (sort === "category") return a.category.localeCompare(b.category) || a.title.localeCompare(b.title);
      return libraryItems.indexOf(a) - libraryItems.indexOf(b);
    });
  }, [query, kind, category, sort]);
  const items = matching;
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
            placeholder="Search the library"
            value={query}
            maxLength={200}
            onChange={(event) => setQuery(event.target.value)}
          />
          {query ? (
            <button
              type="button"
              aria-label="Clear search"
              onClick={reset}
            >
              <X size={16} aria-hidden="true" />
            </button>
          ) : null}
        </div>
      </div>
      <div className={discovery.filters}>
        <label>Format
          <select value={kind} onChange={(event) => setKind(event.target.value)}>
            <option value="All">All formats</option>
            {libraryKinds.map((value) => <option key={value} value={value}>{kindLabels[value]}</option>)}
          </select>
        </label>
        <label>Category
          <select value={category} onChange={(event) => setCategory(event.target.value)}>
            <option value="All">All categories</option>
            {categories.map((value) => <option key={value}>{value}</option>)}
          </select>
        </label>
        <label>Sort by
          <select value={sort} onChange={(event) => setSort(event.target.value)}>
            <option value="library">Library order</option>
            <option value="az">Title: A–Z</option>
            <option value="za">Title: Z–A</option>
            <option value="category">Category</option>
          </select>
        </label>
      </div>
      <div className={discovery.resultStatus}>
        <p role="status" aria-atomic="true">
          {items.length} {items.length === 1 ? "resource" : "resources"}
        </p>
        {(query || kind !== "All" || category !== "All") && (
          <button type="button" onClick={reset}>
            Reset <X size={12} aria-hidden="true" />
          </button>
        )}
      </div>
      <div
        key={`${query}:${kind}:${category}:${sort}`}
        className={
          pathView ? discovery.list : styles.catalogue
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
              <div className={discovery.itemBody}>
                <span className={discovery.itemIdentity}>{kindLabels[item.kind]}</span>
                <h3>{item.title}</h3>
                <span className={discovery.itemSummary}>{item.summary}</span>
              </div>
              <span className={discovery.itemAction}>
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
          <h3>Nothing found yet.</h3>
          <p>
            Try a broader word, or return to the full library.
          </p>
          <button
            type="button"
            className={discovery.textAction}
            onClick={reset}
          >
            Show all resources
          </button>
        </div>
      )}
    </div>
  );
}
