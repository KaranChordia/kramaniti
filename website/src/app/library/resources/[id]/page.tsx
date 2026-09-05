import { ResourceTile } from "../../ResourceTile";
import type { Metadata } from "next";
import { readFile } from "node:fs/promises";
import path from "node:path";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { libraryItems } from "@/lib/library/libraryData";
import {
  resourceDetails,
  RESOURCE_VERSION,
} from "@/lib/library/resourceDetails";
import { workingTemplate } from "@/lib/kosh/resourceContent";
import { KoshNav } from "../../KoshNav";
import { ResourceWorkbench } from "../../ResourceWorkbench";
import styles from "../../editorial.module.css";

export function generateStaticParams() {
  return libraryItems.map((item) => ({ id: item.id }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const item = libraryItems.find((item) => item.id === id);
  return item
    ? {
        title: `${item.title} | Kramaniti Kosh`,
        description: item.summary,
        alternates: { canonical: `/library/resources/${id}` },
      }
    : { title: "Resource not found | Kosh" };
}
export default async function ResourcePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = libraryItems.find((item) => item.id === id);
  if (!item) notFound();
  const detail = resourceDetails[id];
  const markdown = await readFile(
    path.join(process.cwd(), "public", item.download),
    "utf8",
  );
  const headings = [
    "Intended outcome",
    "Before you begin",
    "How to use",
    "Working template",
    "Demonstration",
    "Quality check",
    "Limits and human review",
  ];
  return (
    <main className={styles.page} data-disable-global-shockwave="true">
      <KoshNav />
      <Link href="/library#catalogue" className={styles.breadcrumb}>
        ← The catalogue
      </Link>
      <header className={styles.resourceHero}>
        <p className={styles.eyebrow}>
          {item.kind} · Resource{" "}
          {String(libraryItems.indexOf(item) + 1).padStart(2, "0")}
        </p>
        <h1>{item.title}</h1>
        <p>{detail.outcome}</p>
        <div className={styles.actions}>
          <a className={styles.primary} href="#make-it-yours">
            Make it yours ↓
          </a>
          <a className={styles.secondary} href={item.download} download>
            Download complete Markdown
          </a>
        </div>
        <div className={styles.meta}>
          <span>Version {RESOURCE_VERSION}</span>
          <span>By Kramaniti</span>
          <span>Provider-neutral instructions</span>
          <Link href="/library/standards">Edition notes & standards ↗</Link>
        </div>
      </header>
      <div className={styles.readingLayout}>
        <nav className={styles.contents} aria-label="On this page">
          <span className={styles.eyebrow}>Inside this resource</span>
          {headings.map((heading) => (
            <a
              key={heading}
              href={`#${heading.toLowerCase().replaceAll(" ", "-")}`}
            >
              {heading}
            </a>
          ))}
        </nav>
        <article className={styles.prose}>
          <ReactMarkdown
            components={{
              h2: ({ children }) => (
                <h2 id={String(children).toLowerCase().replaceAll(" ", "-")}>
                  {children}
                </h2>
              ),
            }}
          >
            {markdown}
          </ReactMarkdown>
        </article>
      </div>
      <ResourceWorkbench
        key={item.id}
        item={item}
        original={`# ${item.title}\n\n${workingTemplate(markdown)}`}
        question={detail.question}
      />
      <section className={styles.section}>
        <p className={styles.eyebrow}>Continue the work</p>
        <div className={styles.catalogue}>
          {detail.related.map((id) => {
            const related = libraryItems.find((item) => item.id === id)!;
            return <ResourceTile key={id} item={related} />;
          })}
        </div>
      </section>
      <footer className={styles.footer}>
        <Link href="/library">Back to Kosh</Link>
        <span>Originals remain unchanged. Your judgement stays central.</span>
      </footer>
    </main>
  );
}
