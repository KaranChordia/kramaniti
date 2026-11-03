import Link from "next/link";
import { SITE_URL, koshUrl } from "@/lib/seo";
import { ResourceCatalogue } from "./ResourceCatalogue";
import { defaultLibrarySort, type LibrarySort } from "@/lib/library/libraryData";
import styles from "./editorial.module.css";
import discovery from "./discovery.module.css";

export function LibraryLanding({
  initialQuery = "",
  initialSort = defaultLibrarySort,
}: {
  initialQuery?: string;
  initialSort?: LibrarySort;
}) {
  return (
    <main
      id="kosh-main"
      className={`${styles.page} ${discovery.page}`}
      data-disable-global-shockwave="true"
      tabIndex={-1}
    >
      <section
        id="catalogue"
        className={discovery.catalogue}
        aria-labelledby="catalogue-heading"
      >
        <div className={discovery.catalogueHeading}>
          <p className={discovery.eyebrow}>Browse the collection</p>
          <h1 id="catalogue-heading">Templates for clearer decisions, better handoffs and useful systems.</h1>
        </div>
        <ResourceCatalogue
          key={`${initialQuery}:${initialSort}`}
          initialQuery={initialQuery}
          initialSort={initialSort}
        />
      </section>
      <footer className={styles.footer}>
        <Link href={SITE_URL}>Kramaniti</Link>
        <span>Strategy before tools. Systems before scale.</span>
        <Link href={koshUrl("/standards/")}>Resource standards</Link>
      </footer>
    </main>
  );
}
