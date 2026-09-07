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
  const [intent, setIntent] = useState("");
  const ref = useRef<HTMLTextAreaElement>(null);
  return (
    <section className={styles.arrival}>
      <p className={styles.eyebrow}>Kosh / Creation Studio</p>
      <h1>
        What would you like
        <br className={styles.desktopBreak} /> to make repeatable?
      </h1>
      <p className={styles.arrivalLead}>
        Give your work a method.
        <br />
        Shape a skill you can refine, review and take with you.
      </p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (intent.trim()) onStart(blankSkill(intent.trim()));
        }}
      >
        <label htmlFor="skill-intent" className={styles.hint}>
          The work and the result
        </label>
        <textarea
          data-studio-intent="true"
          ref={ref}
          id="skill-intent"
          value={intent}
          onChange={(e) => setIntent(e.target.value)}
          maxLength={4000}
          rows={3}
          placeholder="Describe the work and the result you want."
          required
        />
        <div className={styles.entryActions}>
          <button className={styles.primary} type="submit">
            Shape my skill <span aria-hidden="true">↗</span>
          </button>
          <button type="button" onClick={() => onStart(blankSkill())}>
            Start with a blank skill
          </button>
        </div>
        <p className={styles.hint}>
          Your description becomes the purpose. Shape the rest by hand. No AI
          request.
        </p>
      </form>
      <div className={styles.examples}>
        <span className={styles.hint}>A place to start</span>
        {exampleIntents.map((example) => (
          <button
            key={example.label}
            onClick={() => {
              setIntent(example.intent);
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
