"use client";
import { useState } from "react";
import type { HumanReview, Sample, SkillDraft } from "@/lib/kosh/studio/schema";
import { packageSkill, skillMarkdown } from "@/lib/kosh/studio/export";
import { validate } from "@/lib/kosh/studio/validation";
import { StudioDialog } from "./StudioDialog";
import styles from "./studio.module.css";
export function downloadBytes(bytes: BlobPart, name: string, type: string) {
  const url = URL.createObjectURL(new Blob([bytes], { type }));
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = name;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  setTimeout(() => URL.revokeObjectURL(url), 10000);
}
export function ExportReview({
  draft,
  sample,
  review,
  currentDigest,
  onClose,
}: {
  draft: SkillDraft;
  sample: Sample;
  review: HumanReview | null;
  currentDigest: string;
  onClose: () => void;
}) {
  const [includeSamples, setIncludeSamples] = useState(false);
  const [acknowledged, setAcknowledged] = useState(false);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const findings = validate(draft);
  const blocked = findings.some((f) => f.blocking);
  const reviewed =
    !findings.length &&
    !!review &&
    Object.values(review.assessments).every((a) => a === "pass");
  async function download(asReviewed: boolean) {
    setBusy(true);
    try {
      const result = await packageSkill(draft, sample, review, {
        reviewed: asReviewed,
        acknowledgedDigest: acknowledged ? currentDigest : null,
        includeSamples,
      });
      downloadBytes(
        new Uint8Array(result.zip).buffer,
        `${draft.slug}-${asReviewed ? "reviewed" : "draft"}.zip`,
        "application/zip",
      );
      setMessage(
        "Package prepared. Your browser handles the download; this draft remains unsaved.",
      );
    } catch (e) {
      setMessage(
        e instanceof Error
          ? e.message
          : "Package could not be prepared. Recover the Markdown below.",
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <StudioDialog title="Take your skill with you" onClose={onClose}>
      <p className={styles.eyebrow}>Portable Kosh package</p>
      <h3>{draft.title}</h3>
      <p className={styles.hint}>
        Unsaved local snapshot ·{" "}
        {currentDigest.slice(0, 12) || "Calculating digest…"}
      </p>
      <p>
        Working instructions, boundaries and an honest record of what you
        reviewed. No destination integration has been tested.
      </p>
      <ul className={styles.fileList}>
        {[
          "kosh.json",
          "README.md",
          "skill.md",
          "governance.md",
          "checks.json",
          ...(includeSamples ? ["tests/examples.json"] : []),
        ].map((f) => (
          <li key={f}>
            <code>{f}</code>
          </li>
        ))}
      </ul>
      <details className={styles.details}>
        <summary>Preview skill.md</summary>
        <pre>{skillMarkdown(draft)}</pre>
      </details>
      <div className={styles.notice}>
        <strong>
          {findings.length
            ? `${findings.length} unresolved checks`
            : "Required structure complete"}
        </strong>
        {findings.length > 0 && (
          <ul>
            {findings.map((f) => (
              <li key={f.code}>{f.message}</li>
            ))}
          </ul>
        )}
        <p>
          {reviewed
            ? "Passing human assessments match this skill and sample."
            : "A complete, passing human sample review is needed for a reviewed export."}
        </p>
      </div>
      <details className={styles.details}>
        <summary>Review sample data before including it</summary>
        <pre>{JSON.stringify(sample, null, 2)}</pre>
        <label className={styles.check}>
          <input
            type="checkbox"
            checked={includeSamples}
            onChange={(e) => setIncludeSamples(e.target.checked)}
          />
          Include sample data
        </label>
      </details>
      <p className={styles.hint}>
        Rules are instructions only. Structure and credential-pattern checks do
        not prove accuracy, safety or absence of secrets. No profile context or
        conversation is added to the package.
      </p>
      {reviewed && (
        <label className={styles.check}>
          <input
            type="checkbox"
            checked={acknowledged}
            onChange={(e) => setAcknowledged(e.target.checked)}
          />
          I acknowledge these limitations for this exact snapshot.
        </label>
      )}
      <div className={styles.actions}>
        <button
          className={styles.primary}
          disabled={blocked || busy || !reviewed || !acknowledged}
          onClick={() => download(true)}
        >
          Download reviewed version
        </button>
        <button
          className={styles.secondary}
          disabled={blocked || busy}
          onClick={() => download(false)}
        >
          Download draft
        </button>
      </div>
      <p role="status" className={styles.notice}>
        {busy ? "Preparing package…" : message}
      </p>
      <button
        className={styles.textAction}
        disabled={blocked}
        onClick={() =>
          downloadBytes(
            skillMarkdown(draft),
            `${draft.slug}.md`,
            "text/markdown",
          )
        }
      >
        Download individual Markdown
      </button>
      {blocked && (
        <p className={styles.hint}>
          Correct the blocking findings in the editor before downloading.
        </p>
      )}
    </StudioDialog>
  );
}
