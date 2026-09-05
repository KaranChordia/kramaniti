import Link from "next/link";
import { KoshNav } from "../KoshNav";
import styles from "../editorial.module.css";
export const metadata = {
  title: "Resource standards | Kramaniti Kosh",
  description:
    "How Kosh resources describe scope, examples, versions and human review.",
};
export default function StandardsPage() {
  return (
    <main className={styles.page} data-disable-global-shockwave="true">
      <KoshNav />
      <header className={styles.resourceHero}>
        <p className={styles.eyebrow}>The editorial standard</p>
        <h1>Know what you are starting with.</h1>
        <p>
          Every Kosh resource should help you understand its purpose, use it
          with appropriate context and recognise where human judgement is
          required.
        </p>
      </header>
      <article className={styles.prose}>
        <h2>What each edition includes</h2>
        <p>
          An intended outcome, prerequisites, usage steps, a working template,
          an illustrative example, a quality checklist and limitations.
        </p>
        <h2>Examples are demonstrations</h2>
        <p>
          Sample scenarios show the shape of useful work. They are not client
          case studies, evidence of performance or facts to copy into your own
          work.
        </p>
        <h2>What has been verified</h2>
        <p>
          Version 1.1 adds setup guidance and examples to the six original
          resources. The resources are provider-neutral Markdown instructions.
          Runtime behaviour and compatibility have not been verified across AI
          providers. No tested-platform badge or performance guarantee is
          implied.
        </p>
        <h2>Originals and working copies</h2>
        <p>
          Adaptations are drafts for your review. A saved copy records its
          source version; it is never silently replaced when the original
          changes. Copying or adapting a template does not grant tool
          permissions or authority to take consequential actions.
        </p>
        <h2>Reuse terms</h2>
        <p>
          You can read and download these resources. Formal reuse and
          redistribution terms have not yet been published. Contact Kramaniti to
          clarify redistribution or commercial packaging before proceeding.
        </p>
        <h2>Report a problem</h2>
        <p>
          Include the resource URL, version and a description of what needs
          correction. Keep private context out of your report.
        </p>
        <Link className={styles.textLink} href="/#contact">
          Contact Kramaniti ↗
        </Link>
      </article>
      <footer className={styles.footer}>
        <Link href="/library">Back to the library</Link>
      </footer>
    </main>
  );
}
