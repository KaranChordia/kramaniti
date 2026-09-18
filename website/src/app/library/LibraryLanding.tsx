import Link from "next/link";
import { ResourceCatalogue } from "./ResourceCatalogue";
import styles from "./editorial.module.css";
import discovery from "./discovery.module.css";

export function LibraryLanding({
  initialQuery = "",
}: {
  initialQuery?: string;
}) {
  return (
    <main
      id="kosh-main"
      className={`${styles.page} ${discovery.page}`}
      data-disable-global-shockwave="true"
      tabIndex={-1}
    >
      <header className={discovery.arrival}>
        <div className={discovery.welcome}>
          <p className={discovery.eyebrow}>A practical library</p>
          <h1>Find a useful way to work.</h1>
          <p className={discovery.intro}>
            Start with a resource. Read it, adapt it, and keep the important
            decisions with people.
          </p>
        </div>
      </header>
      <section
        id="catalogue"
        className={discovery.catalogue}
        aria-labelledby="catalogue-heading"
      >
        <div className={discovery.catalogueHeading}>
          <div>
            <h2 id="catalogue-heading">Start here.</h2>
          </div>
        </div>
        <ResourceCatalogue
          key={initialQuery}
          initialQuery={initialQuery}
        />
      </section>
      <footer className={styles.footer}>
        <Link href="/">Kramaniti</Link>
        <span>Strategy before tools. Systems before scale.</span>
        <Link href="/library/standards">Resource standards</Link>
      </footer>
    </main>
  );
}
