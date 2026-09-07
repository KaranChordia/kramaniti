"use client";
import { Fragment, useLayoutEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useKoshJourney } from "@/components/kosh/world/KoshWorld";
import world from "@/components/kosh/world/world.module.css";
import { ResourceTile } from "./ResourceTile";
import { libraryItems, libraryKinds } from "@/lib/library/libraryData";
import { resourceDetails } from "@/lib/library/resourceDetails";
import styles from "./editorial.module.css";

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
  const journey = useKoshJourney();
  const restoreExplore = journey?.restoreExplore;
  useLayoutEffect(() => {
    if (pathView) restoreExplore?.();
  }, [pathView, restoreExplore]);
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
  const items = useMemo(
    () =>
      libraryItems.filter(
        (item) =>
          (kind === "All" || item.kind === kind) &&
          `${item.title} ${item.summary} ${item.useWhen} ${resourceDetails[item.id].outcome}`
            .toLowerCase()
            .includes(query.trim().toLowerCase()),
      ),
    [query, kind],
  );
  return (
    <>
      <div className={styles.toolbar}>
        <label className={styles.search}>
          Find a resource
          <input
            type="search"
            placeholder="Try research, claims or workflow"
            value={query}
            maxLength={200}
            onChange={(e) => {
              setQuery(e.target.value);
              updateLocation(e.target.value, kind, compact);
            }}
          />
        </label>
        <button
          type="button"
          className={styles.secondary}
          aria-pressed={compact}
          onClick={() => {
            setCompact(!compact);
            updateLocation(query, kind, !compact);
          }}
        >
          Compact view
        </button>
      </div>
      <div className={styles.kindNav} role="group" aria-label="Resource format">
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
            {value}{" "}
            <small>
              {value === "All"
                ? libraryItems.length
                : libraryItems.filter((item) => item.kind === value).length}
            </small>
          </button>
        ))}
      </div>
      <p className={styles.caption} role="status">
        {items.length} {items.length === 1 ? "resource" : "resources"}
      </p>
      <div
        className={
          pathView
            ? `${world.list} ${compact ? world.compact : ""}`
            : compact
              ? styles.compactCatalogue
              : styles.catalogue
        }
      >
        {items.map((item) => (
          <Fragment key={item.id}>
            {pathView ? (
              <Link
                key={item.id}
                href={`/library/resources/${item.id}`}
                className={world.item}
              >
                <span className={world.itemKind}>{item.kind}</span>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.summary}</p>
                </div>
                <span aria-hidden="true">↗</span>
              </Link>
            ) : (
              <ResourceTile key={item.id} item={item} />
            )}
          </Fragment>
        ))}
      </div>
      {!items.length && (
        <div className={styles.empty}>
          <p>
            No resources match this search. Try a broader task or reset the
            filters.
          </p>
          <button
            className={styles.secondary}
            onClick={() => {
              setQuery("");
              setKind("All");
              updateLocation("", "All", compact);
            }}
          >
            Show all resources
          </button>
        </div>
      )}
    </>
  );
}
