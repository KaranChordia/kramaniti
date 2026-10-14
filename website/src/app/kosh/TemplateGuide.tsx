"use client";
import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, LoaderCircle, Sparkles } from "lucide-react";
import { libraryItems, kindLabels } from "@/lib/library/libraryData";
import { discoveryHistory, discoveryStarters, MAX_DISCOVERY_MESSAGE, MAX_DISCOVERY_TURNS, parseDiscoveryAnswer, type DiscoveryTurn } from "@/lib/kosh/discovery";
import { useKoshJourney } from "@/components/kosh/world/KoshWorld";
import styles from "./template-guide.module.css";

export function TemplateGuide() {
  const journey = useKoshJourney();
  const [turns, setTurns] = useState<DiscoveryTurn[]>(() => journey?.readGuide() ?? []);
  const [question, setQuestion] = useState("");
  const [pending, setPending] = useState("");
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState(true);
  const input = useRef<HTMLTextAreaElement>(null);
  const controller = useRef<AbortController | null>(null);
  const result = useRef<HTMLDivElement>(null);
  const id = useId();
  const latest = turns.at(-1)?.answer;
  const full = turns.length >= MAX_DISCOVERY_TURNS;
  useEffect(() => () => controller.current?.abort(), []);
  function remember(next: DiscoveryTurn[]) { setTurns(next); journey?.writeGuide(next); }
  async function ask(text: string) {
    const content = text.trim();
    if (!content || controller.current || full) return;
    const abort = new AbortController();
    controller.current = abort;
    setPending(content);
    setError("");
    const timeout = window.setTimeout(() => abort.abort(), 25000);
    try {
      const response = await fetch("/api/kosh/discover/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...discoveryHistory(turns), { role: "user", content }] }),
        signal: abort.signal,
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(typeof payload.error === "string" ? payload.error : "The guide could not answer. Try again.");
      const answer = parseDiscoveryAnswer(payload);
      if (!answer || (payload.mode !== "assistant" && payload.mode !== "catalogue")) throw new Error("The guide could not answer. Try again.");
      answer.mode = payload.mode;
      remember([...turns, { question: content, answer }]);
      setQuestion("");
      requestAnimationFrame(() => {
        result.current?.focus({ preventScroll: true });
        result.current?.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth", block: "nearest" });
      });
    } catch (cause) {
      setError(cause instanceof Error && cause.name !== "AbortError" ? cause.message : "The guide took too long. Try again, or browse the library below.");
      setQuestion(content);
    } finally {
      window.clearTimeout(timeout);
      controller.current = null;
      setPending("");
    }
  }
  function submit(event: FormEvent) { event.preventDefault(); void ask(question); }
  function reset() {
    remember([]); setQuestion(""); setError("");
    requestAnimationFrame(() => input.current?.focus());
  }
  return (
    <section className={styles.guide} aria-labelledby={`${id}-heading`}>
      <div className={styles.heading}>
        <div>
          <p className={styles.eyebrow}><Sparkles size={14} aria-hidden="true" /> Kosh guide</p>
          <h2 id={`${id}-heading`}>Tell me what you’re trying to do.</h2>
          <p>I’ll help you choose a template and a useful place to start.</p>
        </div>
        <button type="button" className={styles.quiet} aria-expanded={expanded} aria-controls={`${id}-guide`} onClick={() => setExpanded(!expanded)}>
          {expanded ? "Hide guide" : "Show guide"}
        </button>
      </div>
      <div id={`${id}-guide`} hidden={!expanded}>
        {turns.length > 0 && <div className={styles.conversation}>
          {turns.map((turn, index) => <div className={styles.turn} key={index}>
            <p className={styles.question}><span>You</span>{turn.question}</p>
            <div className={styles.answer}>
              <span>Kosh guide</span>
              <p>{turn.answer.reply}</p>
              {turn.answer.mode === "catalogue" && <p className={styles.fallback}>Catalogue suggestions · conversational guidance is unavailable right now.</p>}
              <ol className={styles.recommendations}>
                {turn.answer.recommendations.map(({ id: templateId, reason }, order) => {
                  const item = libraryItems.find((entry) => entry.id === templateId);
                  if (!item) return null;
                  return <li key={templateId}>
                    <span className={styles.number}>{String(order + 1).padStart(2, "0")}</span>
                    <div>
                      <small>{order === 0 ? "Start here" : "Also useful"} · {kindLabels[item.kind]}</small>
                      <Link href={`/kosh/${item.id}/`} className={styles.templateLink}>{item.title}<ArrowUpRight size={17} aria-hidden="true" /></Link>
                      <p>{reason}</p>
                    </div>
                  </li>;
                })}
              </ol>
            </div>
          </div>)}
        </div>}
        <div ref={result} tabIndex={-1} className={styles.result} role="status" aria-live="polite" aria-atomic="true">
          {pending ? "Finding a useful starting point…" : latest ? `${latest.reply} ${latest.recommendations.length} template suggestions available above.` : ""}
        </div>
        {pending && <p className={styles.loading}><LoaderCircle size={16} aria-hidden="true" />Finding a useful starting point…</p>}
        {error && <p role="alert" className={styles.error}>{error}</p>}
        {!full ? <>
          <form onSubmit={submit} className={styles.composer}>
            <label htmlFor={`${id}-question`}>{turns.length ? "Refine your request" : "What do you need help with?"}</label>
            <div className={styles.inputRow}>
              <textarea id={`${id}-question`} ref={input} value={question} disabled={Boolean(pending)} rows={2} maxLength={MAX_DISCOVERY_MESSAGE} placeholder={turns.length ? "Tell me a little more, or ask how the templates differ…" : "For example, our sales team keeps handing over clients without enough detail…"} onChange={(event) => setQuestion(event.target.value)} />
              <button className={styles.submit} type="submit" disabled={Boolean(pending) || !question.trim()}>
                {turns.length ? "Ask guide" : "Find my template"}<ArrowRight size={17} aria-hidden="true" />
              </button>
            </div>
          </form>
          <div className={styles.prompts} aria-label="Suggested questions">
            {(turns.length ? latest?.followUps ?? [] : discoveryStarters).map((text) => <button type="button" key={text} disabled={Boolean(pending)} onClick={() => void ask(text)}>{text}<ArrowUpRight size={13} aria-hidden="true" /></button>)}
          </div>
        </> : <p className={styles.limit}>Ready for a different task? Start a new conversation, or open a suggested template.</p>}
        <div className={styles.bottom}>
          <p>Your messages are sent to our AI provider to suggest public templates. Avoid private or sensitive details. This conversation stays in this tab while you browse Kosh and clears on refresh.</p>
          {turns.length > 0 && <button type="button" className={styles.quiet} disabled={Boolean(pending)} onClick={reset}>Start over</button>}
        </div>
      </div>
    </section>
  );
}
