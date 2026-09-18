"use client";
import { useRef, useState } from "react";
import {
  blankSkill,
  exampleIntents,
  researchFixture,
  type SkillDraft,
} from "@/lib/kosh/studio/schema";
import styles from "./studio.module.css";
export function CreationEntry({
  onStart,
}: {
  onStart: (draft: SkillDraft) => void;
}) {
  const questions = [
    { label: "What would you like to make repeatable?", hint: "For example: prepare a weekly research brief for product decisions." },
    { label: "Who will use it, and what should they receive?", hint: "Name the owner, audience and useful outcome." },
    { label: "What information or source material can it use?", hint: "Include what is in scope and what must stay out." },
    { label: "Where should a person review or approve the work?", hint: "Name the decisions that should never be automatic." },
    { label: "What are you creating?", hint: "Choose a skill, agent, governance rule, plugin guide, or a combined package." },
  ];
  const [answers, setAnswers] = useState(["", "", "", "", ""]);
  const [step, setStep] = useState(0);
  const ref = useRef<HTMLTextAreaElement>(null);
  const intent = answers[0];
  const isLast = step === questions.length - 1;
  function update(value: string) {
    setAnswers((current) => current.map((answer, index) => index === step ? value : answer));
  }
  function startDraft() {
    const draft = blankSkill(intent.trim());
    draft.title = `${intent.trim() || "Untitled"} package`;
    draft.summary = answers.filter(Boolean).join(" ");
    draft.content.useWhen = answers[1] || draft.content.useWhen;
    draft.content.qualityChecks = [
      answers[2] && `Use only: ${answers[2]}`,
      answers[3] && `Human review: ${answers[3]}`,
      answers[4] && `Requested package: ${answers[4]}`,
    ].filter(Boolean).join("\n");
    onStart(draft);
  }
  return (
    <section className={styles.arrival}>
      <p className={styles.eyebrow}>Kosh assistant / Create</p>
      <h1>
        What would you like
        <br className={styles.desktopBreak} /> to make repeatable?
      </h1>
      <p className={styles.arrivalLead}>
        Answer five concise questions.
        <br />
        Shape a skill you can refine, review and take with you.
      </p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!answers[step].trim()) return;
          if (isLast) startDraft();
          else {
            setStep((value) => value + 1);
            requestAnimationFrame(() => ref.current?.focus());
          }
        }}
      >
        <label htmlFor="skill-intent" className={styles.hint}>
          Question {step + 1} of {questions.length}
        </label>
        <p>{questions[step].label}</p>
        <textarea
          data-studio-intent="true"
          ref={ref}
          id="skill-intent"
          value={answers[step]}
          onChange={(e) => update(e.target.value)}
          maxLength={4000}
          rows={3}
          placeholder={questions[step].hint}
          required
        />
        <div className={styles.entryActions}>
          <button className={styles.primary} type="submit">
            {isLast ? "Create my starting package" : "Continue"} <span aria-hidden="true">↗</span>
          </button>
          {step > 0 && <button type="button" onClick={() => setStep((value) => value - 1)}>Back</button>}
          <button type="button" onClick={() => onStart(blankSkill())}>
            Start with a blank skill
          </button>
        </div>
        <p className={styles.hint}>
          This guided intake creates an editable local starting package. A connected model must be configured before Kosh can use or send any context.
        </p>
      </form>
      <div className={styles.examples}>
        <span className={styles.hint}>A place to start</span>
        {exampleIntents.map((example) => (
          <button
            key={example.label}
            onClick={() => {
              setAnswers((current) =>
                current.map((answer, index) =>
                  index === 0 ? example.intent : answer,
                ),
              );
              setStep(0);
              ref.current?.focus();
            }}
          >
            {example.label} <span aria-hidden="true">↖</span>
          </button>
        ))}
      </div>
      <details className={styles.details}>
        <summary>Explore a complete synthetic example</summary>
        <p className={styles.hint}>
          A prepared research skill for trying the editor and review flow. This
          is an explicit design fixture, not generated work.
        </p>
        <button onClick={() => onStart(researchFixture())}>
          Open synthetic research skill →
        </button>
      </details>
      <p className={styles.arrivalFoot}>
        Local draft · Human review · A package you own
      </p>
    </section>
  );
}
