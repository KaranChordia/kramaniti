import Link from "next/link";
import { ResourceCatalogue } from "./ResourceCatalogue";
import styles from "./editorial.module.css";
import world from "@/components/kosh/world/world.module.css";
export function LibraryLanding({
  initialKind = "All",
  initialQuery = "",
  initialCompact = false,
}: {
  initialKind?: string;
  initialQuery?: string;
  initialCompact?: boolean;
}) {
  return (
    <main className={styles.page} data-disable-global-shockwave="true">
      <header className={world.arrival}>
        <p className={world.eyebrow}>Welcome to Kosh</p>
        <h1>
          A place for your next
          <br />
          way of working.
        </h1>
        <p>
          Discover a useful method. Shape it around your work. Keep the
          decisions that matter in human hands.
        </p>
        <div
          className={world.destinations}
          aria-label="Find your place in Kosh"
        >
          <svg
            className={world.path}
            viewBox="0 0 1200 180"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path
              d="M 16 0 H 380 V 48 H 790 V 96 H 1200"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
            />
          </svg>
          <a href="#catalogue" className={world.destination}>
            <small aria-hidden="true">01</small>
            <h2>Explore</h2>
            <p>Find a starting point among six practical resources.</p>
            <span>
              Follow a useful idea <b aria-hidden="true">↓</b>
            </span>
          </a>
          <Link href="/library/create" className={world.destination}>
            <small aria-hidden="true">02</small>
            <h2>Create</h2>
            <p>
              Turn a way of working into a skill you can edit, review and
              export.
            </p>
            <span>
              Begin with your work <b aria-hidden="true">→</b>
            </span>
          </Link>
          <Link href="/library/workspace" className={world.destination}>
            <small aria-hidden="true">03</small>
            <h2>My work</h2>
            <p>Return to your favourites and private context.</p>
            <span>
              Open your workspace <b aria-hidden="true">→</b>
            </span>
          </Link>
        </div>
      </header>
      <section
        id="catalogue"
        className={world.catalogue}
        aria-labelledby="catalogue-heading"
      >
        <div className={world.catalogueHeading}>
          <h2 id="catalogue-heading">Follow the work that interests you.</h2>
          <p>
            Open a resource, understand its method, then make something of your
            own.
          </p>
        </div>
        <ResourceCatalogue
          key={`${initialKind}:${initialQuery}:${initialCompact}`}
          initialKind={initialKind}
          initialQuery={initialQuery}
          initialCompact={initialCompact}
          pathView
        />
      </section>
      <section id="collections" className={world.crossroads}>
        <div>
          <p className={world.eyebrow}>A connected collection</p>
          <h2>
            Research. Evidence.
            <br />A human decision.
          </h2>
          <p>
            Three resources trace a considered route from an open question to a
            brief someone can act on.
          </p>
          <Link href="/library/collections/research-a-decision">
            Enter the collection →
          </Link>
        </div>
        <div>
          <p className={world.eyebrow}>A space to shape your own</p>
          <h2>Have a method in mind?</h2>
          <p>
            Bring it into the Creation Studio. Your local draft stays in your
            control, with clear boundaries and a real downloadable package.
          </p>
          <Link href="/library/create">Create a skill →</Link>
        </div>
      </section>
      <footer className={styles.footer}>
        <Link href="/">Kramaniti</Link>
        <span>Strategy before tools. Systems before scale.</span>
        <Link href="/library/standards">Resource standards</Link>
      </footer>
    </main>
  );
}
