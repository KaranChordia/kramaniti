"use client";
import { useRef } from "react";
import type { SkillDraft } from "@/lib/kosh/studio/schema";
import { Field } from "./Field";
import styles from "./studio.module.css";
export function ArtifactEditor({
  draft,
  onChange,
}: {
  draft: SkillDraft;
  onChange: (draft: SkillDraft) => void;
}) {
  const c = draft.content;
  const addInputRef = useRef<HTMLButtonElement>(null);
  const addStepRef = useRef<HTMLButtonElement>(null);
  function focusRow(
    id: string | undefined,
    fallback: HTMLButtonElement | null,
  ) {
    requestAnimationFrame(() => {
      const target = id
        ? document.getElementById(id)?.querySelector("textarea")
        : fallback;
      target?.focus({ preventScroll: true });
      target?.scrollIntoView({ block: "nearest", behavior: "instant" });
    });
  }
  const update = (key: keyof typeof c, value: (typeof c)[keyof typeof c]) =>
    onChange({ ...draft, content: { ...c, [key]: value } });
  return (
    <>
      <Field
        label="Purpose"
        value={c.purpose}
        onChange={(v) => update("purpose", v)}
        placeholder="What should this skill help someone achieve?"
      />
      <Field
        label="Use when"
        value={c.useWhen}
        onChange={(v) => update("useWhen", v)}
        placeholder="Name the moment this method becomes useful."
      />
      <section className={styles.field}>
        <h2>Inputs</h2>
        <p className={styles.hint}>What must someone bring to the work?</p>
        {c.inputs.map((input, index) => (
          <div className={styles.orderedRow} key={input.id} id={input.id}>
            <span className={styles.number}>
              {String(index + 1).padStart(2, "0")}
            </span>
            <div>
              <Field
                compact
                label={`Input ${index + 1} name`}
                value={input.name}
                onChange={(name) =>
                  update(
                    "inputs",
                    c.inputs.map((x) =>
                      x.id === input.id ? { ...x, name } : x,
                    ),
                  )
                }
                maxLength={150}
              />
              <Field
                compact
                label={`Input ${index + 1} description`}
                value={input.description}
                onChange={(description) =>
                  update(
                    "inputs",
                    c.inputs.map((x) =>
                      x.id === input.id ? { ...x, description } : x,
                    ),
                  )
                }
              />
              <div className={styles.rowActions}>
                <label className={styles.check}>
                  <input
                    type="checkbox"
                    checked={input.required}
                    onChange={(e) =>
                      update(
                        "inputs",
                        c.inputs.map((x) =>
                          x.id === input.id
                            ? { ...x, required: e.target.checked }
                            : x,
                        ),
                      )
                    }
                  />
                  Required input
                </label>
                <span className={styles.hint}>Text</span>
                <button
                  onClick={() => {
                    update(
                      "inputs",
                      c.inputs.filter((x) => x.id !== input.id),
                    );
                    focusRow(
                      c.inputs[index + 1]?.id ?? c.inputs[index - 1]?.id,
                      addInputRef.current,
                    );
                  }}
                  aria-label={`Remove input ${index + 1}`}
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
        <button
          ref={addInputRef}
          className={styles.textAction}
          onClick={() => {
            const id = `input-${crypto.randomUUID()}`;
            update("inputs", [
              ...c.inputs,
              {
                id,
                name: "",
                description: "",
                type: "text",
                required: true,
              },
            ]);
            focusRow(id, addInputRef.current);
          }}
        >
          + Add input
        </button>
      </section>
      <section className={styles.field}>
        <h2>Method</h2>
        <p className={styles.hint}>A clear sequence that someone can follow.</p>
        {c.steps.map((step, index) => (
          <div className={styles.orderedRow} key={step.id} id={step.id}>
            <span className={styles.number}>
              {String(index + 1).padStart(2, "0")}
            </span>
            <div>
              <Field
                compact
                label={`Step ${index + 1}`}
                value={step.instruction}
                onChange={(instruction) =>
                  update(
                    "steps",
                    c.steps.map((x) =>
                      x.id === step.id ? { ...x, instruction } : x,
                    ),
                  )
                }
              />
              <div className={styles.rowActions}>
                <button
                  disabled={index === 0}
                  aria-label={`Move step ${index + 1} up`}
                  onClick={() => {
                    const steps = [...c.steps];
                    [steps[index - 1], steps[index]] = [
                      steps[index],
                      steps[index - 1],
                    ];
                    update("steps", steps);
                  }}
                >
                  Move up ↑
                </button>
                <button
                  aria-label={`Remove step ${index + 1}`}
                  onClick={() => {
                    update(
                      "steps",
                      c.steps.filter((x) => x.id !== step.id),
                    );
                    focusRow(
                      c.steps[index + 1]?.id ?? c.steps[index - 1]?.id,
                      addStepRef.current,
                    );
                  }}
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
        <button
          ref={addStepRef}
          className={styles.textAction}
          onClick={() => {
            const id = `step-${crypto.randomUUID()}`;
            update("steps", [...c.steps, { id, instruction: "" }]);
            focusRow(id, addStepRef.current);
          }}
        >
          + Add step
        </button>
      </section>
      <Field
        label="Output"
        value={c.output}
        onChange={(v) => update("output", v)}
        placeholder="Describe the result, its format and what it must include."
      />
      <Field
        label="Quality checks"
        value={c.qualityChecks}
        onChange={(v) => update("qualityChecks", v)}
        placeholder="What would make the output useful and trustworthy?"
      />
      <Field
        label="Limitations"
        value={c.limitations}
        onChange={(v) => update("limitations", v)}
        placeholder="What can this skill not establish or do?"
      />
      <details className={styles.details}>
        <summary>Package details</summary>
        <Field
          label="Summary"
          value={draft.summary}
          onChange={(summary) => onChange({ ...draft, summary })}
          maxLength={500}
        />
        <Field
          label="Package name"
          value={draft.slug}
          onChange={(slug) => onChange({ ...draft, slug })}
          maxLength={64}
          hint="Lowercase letters, numbers and hyphens. Used only for the package folder."
        />
      </details>
    </>
  );
}
export function BoundariesEditor({
  draft,
  onChange,
}: {
  draft: SkillDraft;
  onChange: (draft: SkillDraft) => void;
}) {
  const fields = {
    sources: "Allowed inputs and sources",
    permitted: "Permitted actions",
    prohibited: "Prohibited actions",
    approvalRequired: "Approval required",
    missingInformation: "When information is missing",
    escalationOwner: "Escalation owner",
  } as const;
  return (
    <>
      <p className={styles.intro}>
        Define where the work stops and human judgment begins.
      </p>
      <p className={styles.notice}>
        Instruction only · These rules travel with your skill. The destination
        must enforce them. Kosh does not execute tools.
      </p>
      {Object.entries(fields).map(([key, label]) => (
        <Field
          key={key}
          label={label}
          value={draft.governance[key as keyof typeof fields]}
          onChange={(value) =>
            onChange({
              ...draft,
              governance: { ...draft.governance, [key]: value },
            })
          }
          placeholder={
            key === "escalationOwner"
              ? "Name the person or accountable role. Unresolved until supplied."
              : undefined
          }
        />
      ))}
    </>
  );
}
