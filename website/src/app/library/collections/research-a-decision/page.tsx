import Link from "next/link";
import { KoshNav } from "../../KoshNav";
import { researchCollection } from "@/lib/library/resourceDetails";
import { libraryItems } from "@/lib/library/libraryData";
import styles from "../../editorial.module.css";
export const metadata = {
  title: "Research a decision | Kramaniti Kosh",
  description:
    "A three-part collection: research a question, check the evidence and prepare a human decision.",
  alternates: { canonical: "/library/collections/research-a-decision" },
};
export default function ResearchCollection() {
  return (
    <main className={styles.page} data-disable-global-shockwave="true">
      <KoshNav />
      <Link className={styles.breadcrumb} href="/library">
        ← Kosh collections
      </Link>
      <header className={styles.resourceHero}>
        <p className={styles.eyebrow}>Collection 01 · Three resources</p>
        <h1>Research a decision.</h1>
        <p>
          Begin with a question. Follow the evidence. Give the final call to
          someone who owns it.
        </p>
        <p className={styles.caption}>
          Bring a specific decision, approved sources and a named owner. Each
          step produces the input for the next. These are templates to use in
          your own tools, not an automated workflow.
        </p>
      </header>
      <ol className={styles.collectionSteps}>
        {researchCollection.map((step, index) => (
          <li key={step.id}>
            <span className={styles.stepNumber} aria-hidden="true">
              0{index + 1}
            </span>
            <div>
              <p className={styles.eyebrow}>{step.step}</p>
              <h2>{libraryItems.find((item) => item.id === step.id)!.title}</h2>
              <p>{step.handoff}</p>
              <Link
                className={styles.textLink}
                href={`/library/resources/${step.id}`}
              >
                Open resource ↗
              </Link>
            </div>
          </li>
        ))}
      </ol>
      <section className={styles.section}>
        <h2>What you should leave with</h2>
        <p>
          A source-backed brief, a checked claim register and an explicit
          approval record. If evidence or authority is missing, the next step is
          to resolve it, not to imply a decision has been made.
        </p>
        <Link href="/library#catalogue" className={styles.secondary}>
          Explore all resources
        </Link>
      </section>
    </main>
  );
}
