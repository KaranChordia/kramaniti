"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import {
  formatCreatedDate,
  kindLabels,
  type LibraryItem,
} from "@/lib/library/libraryData";
import type { ResourceDetail } from "@/lib/library/resourceDetails";
import type { ResourceSection } from "@/lib/kosh/resourceSections";
import { BackToExplore } from "../world/KoshWorld";
import { ResourceWorkbench } from "@/app/kosh/ResourceWorkbench";
import styles from "./resource-space.module.css";

/**
 * A simple template page for busy owners: what it helps with, one obvious
 * download or copy action, three steps, then the template itself.
 */
export function ResourceSpace({
  item,
  detail,
  template,
  original,
  sections,
  related,
}: {
  item: LibraryItem;
  detail: ResourceDetail;
  template: string;
  original: string;
  sections: ResourceSection[];
  related: LibraryItem[];
}) {
  const [copied, setCopied] = useState<"idle" | "done" | "failed">("idle");
  const [yourCopyOpen, setYourCopyOpen] = useState(false);
  const yourCopy = useRef<HTMLDetailsElement>(null);
  const section = (id: string) =>
    sections.find((entry) => entry.id === id)?.body ?? "";

  useEffect(() => {
    // Saved working copies link here with ?copy=... or #make-it-yours.
    if (
      window.location.hash === "#make-it-yours" ||
      new URLSearchParams(window.location.search).has("copy")
    ) {
      requestAnimationFrame(() => {
        setYourCopyOpen(true);
        yourCopy.current?.scrollIntoView({ block: "start" });
      });
    }
  }, []);

  async function copyTemplate() {
    try {
      await navigator.clipboard.writeText(original);
      setCopied("done");
    } catch {
      setCopied("failed");
    }
    window.setTimeout(() => setCopied("idle"), 2500);
  }

  const prose = (body: string) => (
    <div className={styles.prose}>
      <ReactMarkdown>{body}</ReactMarkdown>
    </div>
  );

  return (
    <main className={styles.page} data-disable-global-shockwave="true">
      <nav className={styles.back} aria-label="Back">
        <BackToExplore>← All templates</BackToExplore>
      </nav>

      <header className={styles.hero}>
        <p className={styles.tag}>
          {kindLabels[item.kind]}
          <span aria-hidden="true"> · </span>
          Free template
          {item.created ? (
            <>
              <span aria-hidden="true"> · </span>
              Added {formatCreatedDate(item.created)}
            </>
          ) : null}
        </p>
        <h1>{item.title}</h1>
        <p className={styles.lead}>{item.summary}</p>
        <p className={styles.useWhen}>
          <b>Use it when</b> {item.useWhen}
        </p>
        <div className={styles.actions}>
          <a
            className={styles.primary}
            href={item.download}
            download={`${item.id}.md`}
          >
            Download template <span aria-hidden="true">↓</span>
          </a>
          <button
            type="button"
            className={styles.secondary}
            onClick={copyTemplate}
          >
            {copied === "done"
              ? "Copied ✓"
              : copied === "failed"
                ? "Could not copy, try Download"
                : "Copy template"}
          </button>
          <span className={styles.srOnly} aria-live="polite">
            {copied === "done" ? "Template copied to your clipboard." : ""}
          </span>
        </div>
        <p className={styles.fileNote}>
          It is a simple text file. Open it in any text editor, or paste it into
          ChatGPT, Claude or Gemini and ask for help filling it in.
        </p>
      </header>

      <section className={styles.block} aria-labelledby="how-heading">
        <h2 id="how-heading">How to use it</h2>
        <div className={styles.steps}>{prose(section("how-to-use"))}</div>
        <details className={styles.fold}>
          <summary>What you will need before you start</summary>
          {prose(section("before-you-begin"))}
        </details>
      </section>

      <section className={styles.block} aria-labelledby="template-heading">
        <div className={styles.blockHead}>
          <h2 id="template-heading">The template</h2>
          <button type="button" onClick={copyTemplate}>
            {copied === "done" ? "Copied ✓" : "Copy"}
          </button>
        </div>
        <p className={styles.hint}>
          Fill in the blanks for your business. This is what you get when you
          download or copy it.
        </p>
        <article className={`${styles.prose} ${styles.sheet}`}>
          <ReactMarkdown components={{ h2: "h3", h3: "h4" }}>
            {template}
          </ReactMarkdown>
        </article>
      </section>

      <section className={styles.block} aria-label="More detail">
        <details className={styles.fold}>
          <summary>See an example</summary>
          <p className={styles.hint}>
            A made-up example, so you can see what a filled-in version looks
            like.
          </p>
          <div className={styles.prose}>
            <ReactMarkdown components={{ h2: "h3", h3: "h4" }}>
              {section("demonstration")}
            </ReactMarkdown>
          </div>
        </details>
        <details className={styles.fold}>
          <summary>How to tell it is done well</summary>
          {prose(section("quality-check"))}
        </details>
        <details className={styles.fold}>
          <summary>Where a person should decide</summary>
          {prose(section("limits-and-human-review"))}
          <p className={styles.hint}>{detail.limit}</p>
        </details>
        <details
          ref={yourCopy}
          id="make-it-yours"
          className={styles.fold}
          open={yourCopyOpen}
          onToggle={(event) =>
            setYourCopyOpen((event.target as HTMLDetailsElement).open)
          }
        >
          <summary>Edit your own copy on this site</summary>
          {yourCopyOpen ? (
            <ResourceWorkbench
              key={item.id}
              item={item}
              original={original}
              question={detail.question}
              focused
              onNavigationBlocked={() => setYourCopyOpen(true)}
            />
          ) : null}
        </details>
        <details className={styles.fold}>
          <summary>About this version</summary>
          {prose(section("edition-notes"))}
          <Link className={styles.textLink} href="/kosh/standards">
            How we write Kosh templates
          </Link>
        </details>
      </section>

      {related.length ? (
        <footer className={styles.related}>
          <h2>You might also like</h2>
          <div>
            {related.map((resource) => (
              <Link key={resource.id} href={`/kosh/${resource.id}`}>
                <span>{kindLabels[resource.kind]}</span>
                <b>{resource.title}</b>
                <small>Open template →</small>
              </Link>
            ))}
          </div>
        </footer>
      ) : null}
    </main>
  );
}
