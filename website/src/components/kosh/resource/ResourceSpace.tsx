"use client";
import {
  useCallback,
  useRef,
  useState,
  useSyncExternalStore,
  type MouseEvent,
} from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import type { LibraryItem } from "@/lib/library/libraryData";
import type { ResourceDetail } from "@/lib/library/resourceDetails";
import { RESOURCE_VERSION } from "@/lib/library/resourceDetails";
import type { ResourceSection } from "@/lib/kosh/resourceSections";
import { BackToExplore } from "../world/KoshWorld";
import { ResourceWorkbench } from "@/app/library/ResourceWorkbench";
import styles from "./resource-space.module.css";

const places = [
  { id: "intended-outcome", name: "Intent", hint: "Find the purpose" },
  { id: "working-template", name: "Method", hint: "Follow its structure" },
  { id: "demonstration", name: "Example", hint: "See it in context" },
  { id: "quality-check", name: "Review", hint: "Know the boundaries" },
  { id: "make-it-yours", name: "Your copy", hint: "Shape it for your work" },
];
function subscribe(callback: () => void) {
  window.addEventListener("hashchange", callback);
  window.addEventListener("popstate", callback);
  return () => {
    window.removeEventListener("hashchange", callback);
    window.removeEventListener("popstate", callback);
  };
}
function snapshot() {
  return (
    window.location.hash.slice(1) ||
    (new URLSearchParams(window.location.search).has("copy")
      ? "make-it-yours"
      : "intended-outcome")
  );
}
const serverSnapshot = () => "intended-outcome";

export function ResourceSpace({
  item,
  detail,
  markdown,
  original,
  sections,
  related,
}: {
  item: LibraryItem;
  detail: ResourceDetail;
  markdown: string;
  original: string;
  sections: ResourceSection[];
  related: LibraryItem[];
}) {
  const hash = useSyncExternalStore(subscribe, snapshot, serverSnapshot);
  const start = sections.findIndex(
    (section) => section.id === "working-template",
  );
  const end = sections.findIndex((section) => section.id === "demonstration");
  const method = [
    sections.find((section) => section.id === "how-to-use")!,
    ...sections.slice(start, end).filter((section) => section.body),
  ];
  const part = Math.max(
    0,
    method.findIndex((section) => section.id === hash),
  );
  const place =
    hash === "make-it-yours"
      ? 4
      : ["quality-check", "limits-and-human-review", "edition-notes"].includes(
            hash,
          )
        ? 3
        : hash === "demonstration"
          ? 2
          : hash === "working-template" ||
              method.some((section) => section.id === hash)
            ? 1
            : 0;
  const field = useRef<HTMLDivElement>(null);
  const currentPart = useRef("working-template");
  const dialog = useRef<HTMLDialogElement>(null);
  const originalTrigger = useRef<HTMLButtonElement>(null);
  const [direction, setDirection] = useState("forward");
  const activeSection = method[part];
  const section = (id: string) => sections.find((entry) => entry.id === id);
  const move = useCallback((id: string, backwards = false) => {
    if (window.location.hash === `#${id}`) return;
    setDirection(backwards ? "back" : "forward");
    window.history.pushState(
      null,
      "",
      `${window.location.pathname}${window.location.search}#${id}`,
    );
    window.dispatchEvent(new HashChangeEvent("hashchange"));
  }, []);
  const revealCopy = useCallback(() => move("make-it-yours"), [move]);
  function travel(
    event: MouseEvent<HTMLAnchorElement>,
    id: string,
    backwards = false,
  ) {
    if (
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      event.button !== 0
    )
      return;
    event.preventDefault();
    if (place === 1) currentPart.current = activeSection.id;
    move(id === "working-template" ? currentPart.current : id, backwards);
    requestAnimationFrame(() => {
      field.current
        ?.querySelector<HTMLElement>("[data-focus-heading]")
        ?.focus({ preventScroll: true });
      const top = field.current?.getBoundingClientRect().top ?? 0;
      if (
        window.matchMedia("(max-width: 767px)").matches ||
        top < 0 ||
        top > window.innerHeight * 0.6
      )
        field.current?.scrollIntoView({ block: "start", behavior: "instant" });
    });
  }
  const next =
    place === 1 && part < method.length - 1
      ? { id: method[part + 1].id, name: method[part + 1].title }
      : places[place + 1];
  const previous =
    place === 1 && part > 0
      ? { id: method[part - 1].id, name: method[part - 1].title }
      : places[place - 1];
  const prose = (body?: string) => (
    <div className={styles.prose}>
      <ReactMarkdown>{body ?? ""}</ReactMarkdown>
    </div>
  );
  return (
    <main className={styles.space} data-disable-global-shockwave="true">
      <div className={styles.topline}>
        <BackToExplore>← Back to Explore</BackToExplore>
        <span>
          {item.kind} <span aria-hidden="true">/</span> Version{" "}
          {RESOURCE_VERSION}
        </span>
        <button
          ref={originalTrigger}
          onClick={() => dialog.current?.showModal()}
        >
          Read complete original ↗
        </button>
      </div>
      <header className={styles.identity}>
        <div>
          <p className={styles.eyebrow}>Inside the resource</p>
          <h1>{item.title}</h1>
        </div>
        <div className={styles.resourceActions}>
          <Link href={`/library/create?source=${item.id}`}>
            Create a skill from this <span aria-hidden="true">↗</span>
          </Link>
          <a href={item.download} download>
            Download complete Markdown <span aria-hidden="true">↓</span>
          </a>
        </div>
      </header>
      <div className={styles.landscape}>
        <aside className={styles.orientation}>
          <p className={styles.mapLabel}>One resource. Five places.</p>
          <nav aria-label="Resource spaces" className={styles.map}>
            <svg
              viewBox="0 0 250 410"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path
                d="M 20 28 V 66 H 100 V 112 V 150 H 20 V 196 V 234 H 100 V 280 V 318 H 20 V 364"
                fill="none"
                stroke="currentColor"
              />
            </svg>
            {places.map((destination, index) => (
              <a
                key={destination.id}
                href={`#${destination.id}`}
                aria-current={place === index ? "location" : undefined}
                onClick={(event) =>
                  travel(event, destination.id, index < place)
                }
              >
                <span className={styles.node} aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span>
                  <b>{destination.name}</b>
                  <small>{destination.hint}</small>
                </span>
              </a>
            ))}
          </nav>
          <p className={styles.mapFoot}>
            Move at your own pace.
            <br />
            The original stays intact.
          </p>
        </aside>
        <div ref={field} className={styles.field} data-direction={direction}>
          <div
            className={styles.coordinates}
            aria-live="polite"
            aria-atomic="true"
          >
            <span>
              {String(place + 1).padStart(2, "0")}{" "}
              <span aria-hidden="true">/</span> 05
            </span>
            <span>
              {places[place].name}
              {place === 1 ? ` · ${part + 1} of ${method.length}` : ""}
            </span>
            <span aria-hidden="true">+ </span>
          </div>
          <div
            key={`${place}:${part}`}
            className={styles.focus}
            hidden={place === 4}
          >
            {place === 0 && (
              <>
                <p className={styles.eyebrow}>What this makes possible</p>
                <h2 data-focus-heading tabIndex={-1} className={styles.promise}>
                  {detail.outcome}
                </h2>
                <p className={styles.useWhen}>{item.useWhen}</p>
                <div className={styles.preparation}>
                  <h3>Bring these into the work</h3>
                  {prose(section("before-you-begin")?.body)}
                </div>
                <a
                  className={styles.enter}
                  href="#working-template"
                  onClick={(event) => travel(event, "working-template")}
                >
                  Enter the method <span aria-hidden="true">→</span>
                </a>
              </>
            )}
            {place === 1 && (
              <>
                <p className={styles.eyebrow}>The working method</p>
                <h2 data-focus-heading tabIndex={-1}>
                  {activeSection.title}
                </h2>
                <nav aria-label="Method parts" className={styles.parts}>
                  {method.map((entry, index) => (
                    <a
                      key={entry.id}
                      href={`#${entry.id}`}
                      aria-current={part === index ? "step" : undefined}
                      onClick={(event) => travel(event, entry.id, index < part)}
                    >
                      <small>{String(index + 1).padStart(2, "0")}</small>
                      {entry.title}
                    </a>
                  ))}
                </nav>
                {prose(activeSection.body)}
              </>
            )}
            {place === 2 && (
              <>
                <p className={styles.eyebrow}>Illustrative scenario</p>
                <h2 data-focus-heading tabIndex={-1}>
                  See the method at work.
                </h2>
                {prose(section("demonstration")?.body)}
              </>
            )}
            {place === 3 && (
              <>
                <p className={styles.eyebrow}>Before this leaves your hands</p>
                <h2 data-focus-heading tabIndex={-1}>
                  Keep your judgement in the loop.
                </h2>
                <div className={styles.review}>
                  <h3>What good looks like</h3>
                  {prose(section("quality-check")?.body)}
                  <h3>Where a person takes over</h3>
                  {prose(section("limits-and-human-review")?.body)}
                </div>
                <details className={styles.notes}>
                  <summary>Edition notes & standards</summary>
                  {prose(section("edition-notes")?.body)}
                  <Link href="/library/standards">Read Kosh standards ↗</Link>
                </details>
              </>
            )}
          </div>
          <div className={styles.copySpace} hidden={place !== 4}>
            <p className={styles.eyebrow}>A separate working copy</p>
            <h2 data-focus-heading tabIndex={-1}>
              Make room for your context.
            </h2>
            <ResourceWorkbench
              key={item.id}
              item={item}
              original={original}
              question={detail.question}
              focused
              onNavigationBlocked={revealCopy}
            />
          </div>
          <div className={styles.travel}>
            {previous ? (
              <a
                href={`#${previous.id}`}
                onClick={(event) => travel(event, previous.id, true)}
              >
                <span aria-hidden="true">←</span>
                <span>
                  <small>Back to</small>
                  {previous.name}
                </span>
              </a>
            ) : (
              <span className={styles.caption}>
                Start with the purpose.
                <br />
                Then follow the parts that matter.
              </span>
            )}
            {next && place !== 0 && (
              <a
                href={`#${next.id}`}
                onClick={(event) => travel(event, next.id)}
              >
                <span>
                  <small>Continue to</small>
                  {next.name}
                </span>
                <span aria-hidden="true">→</span>
              </a>
            )}
          </div>
        </div>
      </div>
      <footer className={styles.connections}>
        <p className={styles.eyebrow}>Connected resources</p>
        {related.map((resource) => (
          <Link key={resource.id} href={`/library/resources/${resource.id}`}>
            <span>{resource.kind}</span>
            {resource.title}
            <b aria-hidden="true">↗</b>
          </Link>
        ))}
      </footer>
      <dialog
        ref={dialog}
        className={styles.original}
        aria-labelledby="original-heading"
        onClose={() => {
          originalTrigger.current?.focus();
        }}
      >
        <header>
          <div>
            <p className={styles.eyebrow}>
              Canonical resource · {RESOURCE_VERSION}
            </p>
            <h2 id="original-heading">Complete original</h2>
          </div>
          <button onClick={() => dialog.current?.close()} autoFocus>
            Close original ×
          </button>
        </header>
        <article className={styles.prose}>
          <ReactMarkdown
            components={{ h1: ({ children }) => <h2>{children}</h2> }}
          >
            {markdown}
          </ReactMarkdown>
        </article>
      </dialog>
    </main>
  );
}
