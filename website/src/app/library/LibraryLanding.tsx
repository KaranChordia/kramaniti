import Link from "next/link";
import { KoshNav } from "./KoshNav";
import { ResourceCatalogue } from "./ResourceCatalogue";
import { KoshHeroField } from "./KoshHeroField";
import { libraryItems } from "@/lib/library/libraryData";
import { Bot, Sparkles, Plug, ShieldCheck, ArrowUpRight } from "lucide-react";
import styles from "./editorial.module.css";

const formats = [
  {
    kind: "Agent",
    title: "Agents",
    summary: "Give a recurring job a clear brief.",
    icon: Bot,
  },
  {
    kind: "Skill",
    title: "Skills",
    summary: "Put a repeatable method to work.",
    icon: Sparkles,
  },
  {
    kind: "Plugin guide",
    title: "Plugin guides",
    summary: "Choose connections with care.",
    icon: Plug,
  },
  {
    kind: "Governance",
    title: "Human review",
    summary: "Keep consequential calls with people.",
    icon: ShieldCheck,
  },
];
export function LibraryLanding({
  initialKind = "All",
}: {
  initialKind?: string;
}) {
  return (
    <main className={styles.page} data-disable-global-shockwave="true">
      <KoshNav />
      <header className={styles.hero}>
        <KoshHeroField />
        <p className={styles.eyebrow}>The Kramaniti library · Edition 01</p>
        <h1>A practical library for human-led systems.</h1>
        <div className={styles.heroBottom}>
          <p>
            Start with a useful pattern. Make it fit the work. Keep the
            consequential call with people.
          </p>
          <a href="#catalogue" className={styles.primary}>
            Explore the library <span aria-hidden="true">↓</span>
          </a>
        </div>
        <div
          className={styles.heroShortcuts}
          aria-label="Explore resource formats"
        >
          {formats.map(({ kind, title, summary, icon: Icon }) => (
            <Link
              className={styles.formatTile}
              key={kind}
              href={`/library?kind=${encodeURIComponent(kind)}#catalogue`}
            >
              <span className={styles.formatTop}>
                <Icon size={21} strokeWidth={1.4} aria-hidden="true" />
                <small>
                  {libraryItems
                    .filter((item) => item.kind === kind)
                    .length.toString()
                    .padStart(2, "0")}
                </small>
              </span>
              <strong>{title}</strong>
              <span>{summary}</span>
              <ArrowUpRight
                className={styles.formatArrow}
                size={16}
                aria-hidden="true"
              />
            </Link>
          ))}
        </div>
      </header>
      <section
        className={styles.section}
        id="catalogue"
        aria-labelledby="catalogue-heading"
      >
        <div className={styles.sectionIntro}>
          <div>
            <p className={styles.eyebrow}>The catalogue</p>
            <h2 id="catalogue-heading">Start with the work.</h2>
          </div>
          <p>
            Choose a useful outcome. Every resource includes a working template,
            setup guidance and an illustrative example.
          </p>
        </div>
        <ResourceCatalogue key={initialKind} initialKind={initialKind} />
      </section>
      <section
        id="collections"
        className={`${styles.section} ${styles.feature}`}
        aria-labelledby="collection-heading"
      >
        <div>
          <p className={styles.eyebrow}>A collection to begin with</p>
          <h2 id="collection-heading">
            Research.
            <br />
            Evidence.
            <br />
            <em>A human decision.</em>
          </h2>
          <p>
            Three resources, one considered sequence. Move from an open question
            to a brief someone can act on.
          </p>
          <Link
            className={styles.textLink}
            href="/library/collections/research-a-decision"
          >
            Explore the collection <span aria-hidden="true">↗</span>
          </Link>
        </div>
        <div className={styles.specimen}>
          <span className={styles.eyebrow}>Inside the research template</span>
          <h3>Should we review content weekly or fortnightly?</h3>
          <dl>
            <dt>Evidence</dt>
            <dd>
              The sample calendar has a Friday review slot. The sample editor
              note describes two draft batches each month.
            </dd>
            <dt>Inference</dt>
            <dd>
              A fortnightly review may align with draft availability. A benefit
              has not been measured.
            </dd>
            <dt>Next decision</dt>
            <dd>
              Ask the editor to check the next publication calendar before
              choosing a cadence.
            </dd>
          </dl>
          <p className={styles.caption}>
            Illustrative example. No client work or measured result is
            represented.
          </p>
          <Link href="/library/resources/research-synthesis-agent">
            Read the complete resource →
          </Link>
        </div>
      </section>
      <section
        className={`${styles.section} ${styles.membership}`}
        aria-labelledby="membership-heading"
      >
        <p className={styles.eyebrow}>Your working library</p>
        <h2 id="membership-heading">
          A starting point.
          <br />
          Then, your own.
        </h2>
        <div>
          <p>
            Read and download the originals without an account. Sign in to keep
            favourites and use private context to adapt a resource. Review each
            draft before putting it to work.
          </p>
          <Link className={styles.primary} href="/library/workspace">
            Open my library ↗
          </Link>
          <p className={styles.caption}>
            Templates support your work. They do not run agents, install plugins
            or take actions on your behalf.
          </p>
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
