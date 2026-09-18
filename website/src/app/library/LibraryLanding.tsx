import Link from "next/link";
import { ArrowDown, ArrowRight, ArrowUpRight } from "lucide-react";
import { ResourceCatalogue } from "./ResourceCatalogue";
import { libraryItems } from "@/lib/library/libraryData";
import styles from "./editorial.module.css";
import discovery from "./discovery.module.css";

const researchPath = [
  {
    id: "research-synthesis-agent",
    label: "Frame the question",
    kind: "Research",
  },
  { id: "source-checking-skill", label: "Follow the evidence", kind: "Verify" },
  { id: "human-review-gate", label: "Make a human decision", kind: "Review" },
];

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
    <main
      id="kosh-main"
      className={`${styles.page} ${discovery.page}`}
      data-disable-global-shockwave="true"
      tabIndex={-1}
    >
      <header className={discovery.arrival}>
        <div className={discovery.welcome}>
          <p className={discovery.eyebrow}>
            <span aria-hidden="true" /> A library for thoughtful work
          </p>
          <h1>
            A place for your next
            <br />
            <em>way of working.</em>
          </h1>
          <p className={discovery.intro}>
            Find a practical method, make it your own, and keep important
            decisions in human hands.
          </p>
          <div className={discovery.heroActions}>
            <a href="#catalogue" className={discovery.primary}>
              Explore the library <ArrowDown size={16} aria-hidden="true" />
            </a>
            <Link href="/library/create" className={discovery.textAction}>
              Create a skill <ArrowUpRight size={16} aria-hidden="true" />
            </Link>
          </div>
          <p className={discovery.heroNote}>
            {libraryItems.length} resources · Open to explore · Yours to adapt
          </p>
        </div>
        <aside
          className={discovery.guided}
          aria-label="A guided starting point"
        >
          <p className={discovery.eyebrow}>Not sure where to begin?</p>
          <Link
            href="/library/collections/research-a-decision"
            className={discovery.guidedTitle}
          >
            Research a decision <ArrowUpRight size={20} aria-hidden="true" />
          </Link>
          <p>A considered path from a question to a clear next move.</p>
          <ol className={discovery.researchPath}>
            {researchPath.map((step, index) => (
              <li key={step.id}>
                <Link href={`/library/resources/${step.id}`}>
                  <span className={discovery.pathNode} aria-hidden="true">
                    0{index + 1}
                  </span>
                  <span>
                    <small>{step.kind}</small>
                    <strong>{step.label}</strong>
                  </span>
                  <ArrowRight size={16} aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ol>
        </aside>
      </header>
      <section
        id="catalogue"
        className={discovery.catalogue}
        aria-labelledby="catalogue-heading"
      >
        <div className={discovery.catalogueHeading}>
          <div>
            <p className={discovery.eyebrow}>The collection</p>
            <h2 id="catalogue-heading">Follow the work that interests you.</h2>
          </div>
          <p>
            Small, practical starting points. <br />
            Each with a method, example and review.
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
      <section className={discovery.createInvitation}>
        <div>
          <p className={discovery.eyebrow}>From an idea to your own method</p>
          <h2>
            Good work deserves
            <br />a repeatable starting point.
          </h2>
        </div>
        <div>
          <p>
            Bring a method into the Creation Studio. Shape its steps, set its
            boundaries, and export something you can use.
          </p>
          <Link href="/library/create" className={discovery.textAction}>
            Create your first skill <ArrowRight size={18} aria-hidden="true" />
          </Link>
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
