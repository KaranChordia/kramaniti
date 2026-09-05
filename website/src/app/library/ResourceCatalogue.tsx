"use client";
import { useMemo, useState } from "react";
import { ResourceTile } from "./ResourceTile";
import { libraryItems, libraryKinds } from "@/lib/library/libraryData";
import { resourceDetails } from "@/lib/library/resourceDetails";
import styles from "./editorial.module.css";

export function ResourceCatalogue({
  initialKind = "All",
}: {
  initialKind?: string;
}) {
  const [query, setQuery] = useState("");
  const [kind, setKind] = useState(
    libraryKinds.some((kind) => kind === initialKind) ? initialKind : "All",
  );
  const [compact, setCompact] = useState(false);
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
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
        <button
          type="button"
          className={styles.secondary}
          aria-pressed={compact}
          onClick={() => setCompact(!compact)}
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
            onClick={() => setKind(value)}
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
      <div className={compact ? styles.compactCatalogue : styles.catalogue}>
        {items.map((item) => (
          <ResourceTile key={item.id} item={item} />
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
            }}
          >
            Show all resources
          </button>
        </div>
      )}
    </>
  );
}
