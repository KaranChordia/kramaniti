"use client";
import { useState } from "react";
import type {
  Assessment,
  Finding,
  HumanReview,
  Sample,
  SkillDraft,
} from "@/lib/kosh/studio/schema";
import { researchSample } from "@/lib/kosh/studio/schema";
import { digest, validate } from "@/lib/kosh/studio/validation";
import { Field } from "./Field";
import styles from "./studio.module.css";
export function TestWorkbench({
  draft,
  sample,
  setSample,
  reviews,
  onReview,
  currentDigest,
  sampleDigest,
}: {
  draft: SkillDraft;
  sample: Sample;
  setSample: (s: Sample) => void;
  reviews: HumanReview[];
  onReview: (r: HumanReview) => void;
  currentDigest: string;
  sampleDigest: string;
}) {
  const [check, setCheck] = useState<{
    digest: string;
    findings: Finding[];
  } | null>(null);
  const [manual, setManual] = useState(false);
  const [message, setMessage] = useState("");
  const [assessments, setAssessments] = useState<HumanReview["assessments"]>({
    output: "needs-review",
    evidence: "needs-review",
    boundaries: "needs-review",
  });
  const [assessmentBase, setAssessmentBase] = useState("");
  const reviewKey = `${currentDigest}:${sampleDigest}`;
  const labels = {
    output: "Meets expected characteristics",
    evidence: "Uses only supplied evidence",
    boundaries: "Respects disallowed behaviour",
  };
  const update = (key: keyof Sample, value: string) =>
    setSample({ ...sample, [key]: value });
  return (
    <>
      <p className={styles.intro}>
        Try it with a small example. Keep evidence separate from confidence.
      </p>
      <div className={styles.rowActions}>
        <button
          className={styles.secondary}
          onClick={async () =>
            setCheck({ digest: await digest(draft), findings: validate(draft) })
          }
        >
          Check structure
        </button>
        <span className={styles.hint}>Deterministic · no model call</span>
      </div>
      {check && (
        <div className={styles.notice} role="status">
          <strong>
            {check.digest !== currentDigest
              ? "Earlier structure check · content has changed"
              : check.findings.length
                ? `${check.findings.length} fields need attention`
                : "Structure complete"}
          </strong>
          {check.findings.length > 0 && (
            <ul>
              {check.findings.map((f) => (
                <li key={f.code}>{f.message}</li>
              ))}
            </ul>
          )}
          <p>
            Checks confirm structure, size and common credential patterns. They
            do not verify facts or enforce rules.
          </p>
        </div>
      )}
      <div className={styles.sectionHeading}>
        <h2>Sample</h2>
        <button
          onClick={() => {
            if (
              (!sample.input && !sample.output) ||
              window.confirm(
                "Replace this sample with the labelled synthetic example? Your skill stays unchanged.",
              )
            )
              setSample(researchSample);
          }}
        >
          Use synthetic input ↙
        </button>
      </div>
      <Field
        label="Test name"
        value={sample.name}
        onChange={(v) => update("name", v)}
        maxLength={100}
      />
      <Field
        label="Sample input"
        value={sample.input}
        onChange={(v) => update("input", v)}
        maxLength={8000}
      />
      <Field
        label="Expected characteristics"
        value={sample.expected}
        onChange={(v) => update("expected", v)}
        maxLength={2000}
      />
      <Field
        label="Disallowed behaviour"
        value={sample.disallowed}
        onChange={(v) => update("disallowed", v)}
        maxLength={2000}
      />
      <button className={styles.secondary} onClick={() => setManual(true)}>
        Review sample manually
      </button>
      <p className={styles.hint}>
        Sample generation unavailable in this local milestone. Paste an output
        you produced and assess it yourself.
      </p>
      {manual && (
        <section>
          <Field
            label="Sample output"
            value={sample.output}
            onChange={(v) => update("output", v)}
            maxLength={16000}
          />
          <h2>Your assessment</h2>
          {Object.entries(labels).map(([key, label]) => (
            <label className={styles.assessment} key={key}>
              <span>{label}</span>
              <select
                aria-label={label}
                value={
                  assessmentBase === reviewKey
                    ? assessments[key as keyof typeof assessments]
                    : "needs-review"
                }
                onChange={(e) => {
                  setAssessments({
                    ...(assessmentBase === reviewKey
                      ? assessments
                      : {
                          output: "needs-review",
                          evidence: "needs-review",
                          boundaries: "needs-review",
                        }),
                    [key]: e.target.value as Assessment,
                  });
                  setAssessmentBase(reviewKey);
                }}
              >
                <option value="needs-review">Needs review</option>
                <option value="pass">Pass</option>
                <option value="fail">Fail</option>
              </select>
            </label>
          ))}
          <button
            className={styles.primary}
            onClick={async () => {
              if (Object.values(sample).some((x) => !x.trim())) {
                setMessage(
                  "Complete the sample fields and paste an output before recording a review.",
                );
                return;
              }
              const contentDigest = await digest(draft);
              const sd = await digest(sample);
              onReview({
                contentDigest,
                sampleDigest: sd,
                assessments:
                  assessmentBase === reviewKey
                    ? assessments
                    : {
                        output: "needs-review",
                        evidence: "needs-review",
                        boundaries: "needs-review",
                      },
                reviewedAt: new Date().toISOString(),
              });
              setMessage(
                "Human assessment recorded for this exact skill and sample. Evidence stays in this tab.",
              );
            }}
          >
            Record human assessment
          </button>
        </section>
      )}
      <p role="status" className={styles.notice}>
        {message}
      </p>
      {reviews.length > 0 && (
        <details className={styles.details}>
          <summary>Review history · {reviews.length}</summary>
          {reviews.map((r, i) => (
            <p key={i}>
              {r.contentDigest === currentDigest &&
              r.sampleDigest === sampleDigest
                ? "Current sample"
                : "Earlier snapshot"}{" "}
              ·{" "}
              {Object.values(r.assessments).every((v) => v === "pass")
                ? "Human assessments passed"
                : "Needs attention"}{" "}
              · {r.contentDigest.slice(0, 10)}
            </p>
          ))}
        </details>
      )}
    </>
  );
}
