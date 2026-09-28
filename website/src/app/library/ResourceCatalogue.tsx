"use client";
import { useId, useMemo, useRef, useState, type CSSProperties } from "react";
import Link from "next/link";
import { ArrowUpRight, Search, X } from "lucide-react";
import { ResourceTile } from "./ResourceTile";
import { kindLabels, libraryItems } from "@/lib/library/libraryData";
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
  const search = useRef<HTMLInputElement>(null);
  const searchId = useId();
  function reset() {
    setQuery("");
    search.current?.focus();
  }
  const matching = useMemo(() => {
    const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
    return libraryItems.filter((item) => {
      const text =
        `${item.title} ${kindLabels[item.kind]} ${item.kind} ${item.summary} ${item.useWhen} ${item.includes.join(" ")} ${resourceDetails[item.id].outcome}`.toLowerCase();
      return terms.every((term) => text.includes(term));
    });
  }, [query]);
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
      <div className={discovery.resultStatus}>
        <p role="status" aria-atomic="true">
          {items.length} {items.length === 1 ? "resource" : "resources"}
        </p>
        {query && (
          <button type="button" onClick={reset}>
            Reset <X size={12} aria-hidden="true" />
          </button>
        )}
      </div>
      <div
        key={query}
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
