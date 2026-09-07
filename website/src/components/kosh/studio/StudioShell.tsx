"use client";
import Link from "next/link";
import { useKoshJourney } from "../world/KoshWorld";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  emptySample,
  slugify,
  type HumanReview,
  type Sample,
  type SkillDraft,
} from "@/lib/kosh/studio/schema";
import { digest } from "@/lib/kosh/studio/validation";
import { useStudioTransition } from "./useStudioTransition";
import { CreationEntry } from "./CreationEntry";
import { ArtifactEditor, BoundariesEditor } from "./ArtifactEditor";
import { TestWorkbench } from "./TestWorkbench";
import { ExportReview } from "./ExportReview";
import { StudioDialog } from "./StudioDialog";
import styles from "./studio.module.css";

type View = "Build" | "Boundaries" | "Test";
export function StudioShell({
  initialDraft,
  sourceError,
}: {
  initialDraft?: SkillDraft;
  sourceError?: string;
}) {
  const journey = useKoshJourney();
  const sessionKey = initialDraft?.source?.resourceId ?? "blank";
  const [restored] = useState(() => journey?.readStudio(sessionKey));
  const [draft, setDraft] = useState<SkillDraft | null>(
    restored?.draft ?? initialDraft ?? null,
  );
  const [view, setView] = useState<View>(restored?.view ?? "Build");
  const [sample, setSample] = useState<Sample>(restored?.sample ?? emptySample);
  const [reviews, setReviews] = useState<HumanReview[]>(
    restored?.reviews ?? [],
  );
  const [currentDigest, setDigest] = useState("");
  const [sampleDigest, setSampleDigest] = useState("");
  const [dialog, setDialog] = useState<"export" | "save" | "compare" | null>(
    null,
  );
  const [candidate, setCandidate] = useState<{
    draft: SkillDraft;
    base: string;
  } | null>(restored?.candidate ?? null);
  const [message, setMessage] = useState("");
  const [changeRequest, setChangeRequest] = useState(
    restored?.changeRequest ?? "",
  );
  const [context, setContext] = useState(restored?.context ?? "none");
  const [customContext, setCustomContext] = useState(
    restored?.customContext ?? "",
  );
  const titleRef = useRef<HTMLTextAreaElement>(null);
  const scroll = useRef<Record<View, number>>(
    restored?.scroll ?? {
      Build: 0,
      Boundaries: 0,
      Test: 0,
    },
  );
  const transition = useStudioTransition();
  const viewRef = useRef<View>(restored?.view ?? "Build");
  const editingPlace = useRef<
    Partial<
      Record<
        View,
        {
          element: HTMLTextAreaElement;
          start: number;
          end: number;
          label: string;
        }
      >
    >
  >({});
  const [resumeLabel, setResumeLabel] = useState("");
  const writeStudio = journey?.writeStudio;
  useLayoutEffect(() => {
    writeStudio?.(sessionKey, {
      draft,
      view,
      sample,
      reviews,
      candidate,
      changeRequest,
      context,
      customContext,
      scroll: scroll.current,
    });
  }, [
    writeStudio,
    sessionKey,
    draft,
    view,
    sample,
    reviews,
    candidate,
    changeRequest,
    context,
    customContext,
  ]);
  useLayoutEffect(() => {
    if (restored?.draft)
      requestAnimationFrame(() =>
        window.scrollTo({
          top: restored.scroll[restored.view],
          behavior: "instant",
        }),
      );
  }, [restored]);
  function edit(next: SkillDraft) {
    setDigest("");
    setDraft(next);
  }
  useEffect(() => {
    let cancelled = false;
    if (draft)
      digest(draft).then((v) => {
        if (!cancelled) setDigest(v);
      });
    return () => {
      cancelled = true;
    };
  }, [draft]);
  useEffect(() => {
    let cancelled = false;
    digest(sample).then((v) => {
      if (!cancelled) setSampleDigest(v);
    });
    return () => {
      cancelled = true;
    };
  }, [sample]);
  useEffect(() => {
    if (!draft) return;
    const rememberScroll = () => {
      scroll.current[viewRef.current] = window.scrollY;
    };
    document.addEventListener("click", rememberScroll, true);
    return () => document.removeEventListener("click", rememberScroll, true);
  }, [draft]);
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "s" && draft) {
        e.preventDefault();
        setDialog("save");
      }
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [draft]);
  const currentReview =
    [...reviews]
      .reverse()
      .find(
        (r) =>
          r.contentDigest === currentDigest && r.sampleDigest === sampleDigest,
      ) ?? null;
  function changeView(next: View) {
    const previous = viewRef.current;
    scroll.current[previous] = window.scrollY;
    const direction =
      ["Build", "Boundaries", "Test"].indexOf(next) >=
      ["Build", "Boundaries", "Test"].indexOf(previous)
        ? "forward"
        : "back";
    transition(
      () => {
        setView(next);
        viewRef.current = next;
        setResumeLabel(
          editingPlace.current[next]?.element.isConnected
            ? editingPlace.current[next]!.label
            : "",
        );
      },
      direction,
      () => window.scrollTo({ top: scroll.current[next], behavior: "instant" }),
    );
  }
  function start(next: SkillDraft) {
    transition(
      () => {
        edit(next);
        setView("Build");
        viewRef.current = "Build";
      },
      "arrival",
      () => {
        window.scrollTo({ top: 0, behavior: "instant" });
        titleRef.current?.focus({ preventScroll: true });
      },
    );
  }
  function rememberSelection(element: EventTarget) {
    if (!(element instanceof HTMLTextAreaElement)) return;
    const label =
      element.labels?.[0]?.textContent ??
      element.getAttribute("aria-label") ??
      "your text";
    const panel = element
      .closest('[role="tabpanel"]')
      ?.id.replace("panel-", "") as View | undefined;
    if (!panel) return;
    editingPlace.current[panel] = {
      element,
      start: element.selectionStart,
      end: element.selectionEnd,
      label,
    };
  }
  function resumeEditing() {
    const place = editingPlace.current[view];
    if (!place || !place.element.isConnected) return;
    place.element.focus({ preventScroll: true });
    place.element.setSelectionRange(place.start, place.end);
    place.element.scrollIntoView({
      block: "center",
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    });
    setResumeLabel("");
  }
  return (
    <main className={styles.page} data-disable-global-shockwave="true">
      {sourceError && (
        <p className={styles.notice} role="alert">
          {sourceError} Start a new skill below, or return to the Library.
        </p>
      )}
      {!draft ? (
        <CreationEntry onStart={start} />
      ) : (
        <>
          <header className={styles.studioHeader}>
            <div className={styles.titleBlock}>
              <p className={styles.eyebrow}>Skill / Your working draft</p>
              <h1 aria-label={draft.title}>
                <textarea
                  rows={1}
                  ref={titleRef}
                  aria-label="Skill title"
                  className={styles.title}
                  value={draft.title}
                  maxLength={100}
                  onChange={(e) =>
                    edit({
                      ...draft,
                      title: e.target.value,
                      slug:
                        draft.slug === slugify(draft.title)
                          ? slugify(e.target.value)
                          : draft.slug,
                    })
                  }
                />
              </h1>
              <p className={styles.hint}>
                Unsaved changes <span aria-hidden="true">·</span>{" "}
                {currentReview
                  ? "Current human assessment"
                  : reviews.length
                    ? "Content or sample changed; review again"
                    : "Only in this tab"}
              </p>
            </div>
            <div className={styles.headerActions}>
              <button onClick={() => setDialog("save")}>Save version</button>
              <button
                className={styles.primary}
                onClick={() => setDialog("export")}
              >
                Export <span aria-hidden="true">↗</span>
              </button>
            </div>
          </header>
          {draft.source && (
            <p className={styles.source}>
              From{" "}
              <Link href={`/library/resources/${draft.source.resourceId}`}>
                {draft.source.resourceId}
              </Link>{" "}
              · v{draft.source.version} · Original unchanged
            </p>
          )}
          <div className={styles.chapterNav}>
            <div
              className={styles.tabs}
              role="tablist"
              aria-label="Skill views"
            >
              {(["Build", "Boundaries", "Test"] as const).map(
                (tab, index, tabs) => (
                  <button
                    key={tab}
                    role="tab"
                    aria-label={`${tab}: ${tab === "Build" ? "Shape the method" : tab === "Boundaries" ? "Set its boundaries" : "Try it out"}`}
                    id={`tab-${tab}`}
                    aria-controls={`panel-${tab}`}
                    aria-selected={view === tab}
                    tabIndex={view === tab ? 0 : -1}
                    onClick={() => changeView(tab)}
                    onKeyDown={(e) => {
                      if (
                        ["ArrowRight", "ArrowLeft", "Home", "End"].includes(
                          e.key,
                        )
                      ) {
                        e.preventDefault();
                        const next =
                          e.key === "Home"
                            ? tabs[0]
                            : e.key === "End"
                              ? tabs[2]
                              : tabs[
                                  (index + (e.key === "ArrowRight" ? 1 : 2)) % 3
                                ];
                        changeView(next);
                        document.getElementById(`tab-${next}`)?.focus();
                      }
                    }}
                  >
                    <span className={styles.chapterNumber} aria-hidden="true">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span>
                      {tab === "Build"
                        ? "Shape the method"
                        : tab === "Boundaries"
                          ? "Set its boundaries"
                          : "Try it out"}
                    </span>
                  </button>
                ),
              )}
            </div>
            <div className={styles.chapterContext}>
              <span>
                {view === "Build"
                  ? "The work, in your words."
                  : view === "Boundaries"
                    ? "The same skill. A clear scope."
                    : "Bring the method into a real example."}
              </span>
              {resumeLabel && (
                <button onClick={resumeEditing}>
                  Resume at {resumeLabel} ↙
                </button>
              )}
            </div>
          </div>
          <div
            className={styles.document}
            onFocusCapture={(e) => rememberSelection(e.target)}
            onSelectCapture={(e) => rememberSelection(e.target)}
            onBlurCapture={(e) => rememberSelection(e.target)}
          >
            <section
              hidden={view !== "Build"}
              role="tabpanel"
              aria-labelledby="tab-Build"
              id="panel-Build"
            >
              <ArtifactEditor draft={draft} onChange={edit} />
              <button
                className={styles.nextAction}
                onClick={() => {
                  changeView("Boundaries");
                  document.getElementById("tab-Boundaries")?.focus();
                }}
              >
                Give this work clear boundaries <span>→</span>
              </button>
            </section>
            <section
              hidden={view !== "Boundaries"}
              role="tabpanel"
              aria-labelledby="tab-Boundaries"
              id="panel-Boundaries"
            >
              <BoundariesEditor draft={draft} onChange={edit} />
              <button
                className={styles.nextAction}
                onClick={() => {
                  changeView("Test");
                  document.getElementById("tab-Test")?.focus();
                }}
              >
                Try it with a sample <span>→</span>
              </button>
            </section>
            <section
              hidden={view !== "Test"}
              role="tabpanel"
              aria-labelledby="tab-Test"
              id="panel-Test"
            >
              <TestWorkbench
                draft={draft}
                sample={sample}
                setSample={(s) => {
                  setSampleDigest("");
                  setSample(s);
                }}
                reviews={reviews}
                onReview={(r) => setReviews((old) => [...old, r])}
                currentDigest={currentDigest}
                sampleDigest={sampleDigest}
              />
              <button
                className={styles.nextAction}
                onClick={() => setDialog("export")}
              >
                Review your package <span>→</span>
              </button>
            </section>
            <details className={styles.assistance}>
              <summary>
                Ask for a change{" "}
                <span className={styles.hint}>AI unavailable</span>
              </summary>
              <label htmlFor="change-request">
                What would you like to refine?
              </label>
              <textarea
                id="change-request"
                value={changeRequest}
                onChange={(e) => setChangeRequest(e.target.value)}
                maxLength={2000}
                rows={2}
                placeholder="Describe a change. Your notes stay here while you edit."
              />
              <label className={styles.context}>
                Context for a future request
                <select
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                >
                  <option value="none">None</option>
                  <option value="personal">Personal</option>
                  <option value="professional">Professional</option>
                  <option value="custom">Custom</option>
                </select>
              </label>
              {context === "custom" && (
                <textarea
                  aria-label="Custom context"
                  value={customContext}
                  onChange={(e) => setCustomContext(e.target.value)}
                  maxLength={8000}
                  rows={3}
                  placeholder="Context stays in this tab and is excluded from exports."
                />
              )}
              <p className={styles.hint}>
                {context === "personal" || context === "professional"
                  ? "Saved profile access requires sign-in and configured Kosh services. No profile has been read."
                  : context === "none"
                    ? "No profile selected."
                    : "Only the custom context you enter is selected."}{" "}
                Nothing is sent. Manual editing remains available.
              </p>
              <details className={styles.details}>
                <summary>Design review: candidate comparison</summary>
                <p className={styles.hint}>
                  A labelled synthetic candidate demonstrates review and
                  stale-change protection. No model is called.
                </p>
                <button
                  onClick={() => {
                    setCandidate({
                      draft: {
                        ...draft,
                        content: {
                          ...draft.content,
                          qualityChecks:
                            `${draft.content.qualityChecks}\nCheck each factual claim against the supplied material.`.trim(),
                        },
                      },
                      base: currentDigest,
                    });
                    setMessage(
                      "Synthetic candidate ready. Your artifact is unchanged. You can edit it before reviewing.",
                    );
                  }}
                >
                  Prepare synthetic candidate
                </button>
              </details>
            </details>
            {candidate && (
              <div className={styles.pending}>
                <span>Synthetic change pending</span>
                <button onClick={() => setDialog("compare")}>
                  Review changes →
                </button>
                <button
                  onClick={() => {
                    setCandidate(null);
                    setMessage("Candidate discarded. Your draft is unchanged.");
                  }}
                >
                  Discard
                </button>
              </div>
            )}
            <p className={styles.notice} role="status">
              {message}
            </p>
          </div>
        </>
      )}
      <footer className={styles.footer}>
        <span>A method you shape. A decision you own.</span>
        <Link href="/library/standards">Kosh standards ↗</Link>
      </footer>
      {draft && dialog === "export" && (
        <ExportReview
          draft={draft}
          sample={sample}
          review={currentReview}
          currentDigest={currentDigest}
          onClose={() => setDialog(null)}
        />
      )}
      {dialog === "save" && (
        <StudioDialog title="Keep this version" onClose={() => setDialog(null)}>
          <p>
            Private saving is not available yet. Your full
            draft remains in this tab.
          </p>
          <p className={styles.hint}>
            Signing in does not yet enable Studio storage. Download your package
            before closing or refreshing this page.
          </p>
          <button
            className={styles.primary}
            onClick={() => setDialog("export")}
          >
            Review and export
          </button>
        </StudioDialog>
      )}
      {draft && dialog === "compare" && candidate && (
        <StudioDialog
          title="Review the proposed change"
          onClose={() => setDialog(null)}
        >
          <p className={styles.eyebrow}>Synthetic candidate · Quality checks</p>
          <p className={styles.notice}>
            {candidate.base !== currentDigest
              ? "Your draft changed after this candidate was prepared. Discard it and prepare a fresh candidate; nothing can overwrite your newer edits."
              : "Only Quality checks will change. Saving stays separate."}
          </p>
          <div className={styles.comparison}>
            <section>
              <h3>Your current text</h3>
              <pre>{draft.content.qualityChecks || "Empty"}</pre>
            </section>
            <section>
              <h3>Proposed text</h3>
              <pre>{candidate.draft.content.qualityChecks}</pre>
            </section>
          </div>
          <div className={styles.actions}>
            <button
              className={styles.primary}
              disabled={!currentDigest || candidate.base !== currentDigest}
              onClick={() => {
                edit({
                  ...draft,
                  content: {
                    ...draft.content,
                    qualityChecks: candidate.draft.content.qualityChecks,
                  },
                });
                setCandidate(null);
                setDialog(null);
                setMessage(
                  "Change applied to your draft. Review results now need refreshing.",
                );
              }}
            >
              Apply change
            </button>
            <button
              onClick={() => {
                setCandidate(null);
                setDialog(null);
                setMessage("Candidate discarded.");
              }}
            >
              Discard
            </button>
          </div>
        </StudioDialog>
      )}
    </main>
  );
}
