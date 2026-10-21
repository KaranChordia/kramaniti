'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Download, Loader2 } from 'lucide-react';
import { createInitialSessionEnvelope, type AssistantEnvelope, type ClarityAnswers, type ConversationTurn } from '@/lib/clarity-engine/assistant';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';
import { AnimatedHeading } from '../ui/AnimatedHeading';
import styles from './Contact.module.css';

const STAGES = [
  { key: 'phase1_clarity_goal', label: 'The goal' },
  { key: 'phase2_audience_problem', label: 'The people' },
  { key: 'phase3_current_workflow', label: 'The workflow' },
  { key: 'phase4_main_friction', label: 'The friction' },
  { key: 'phase5_ai_boundary', label: 'People + AI' },
  { key: 'phase6_presence_proof', label: 'The outcome' },
];
const STARTERS = ['Follow-ups keep slipping', 'Reporting takes too long', 'Context lives everywhere'];
const IDENTITY = [
  { key: 'name', question: 'Who should we thank for the context?', placeholder: 'Your name', type: 'text', autoComplete: 'name', max: 160 },
  { key: 'company', question: 'Which business or team is this for?', placeholder: 'Business or team name', type: 'text', autoComplete: 'organization', max: 200 },
  { key: 'email', question: 'Where can we continue the conversation?', placeholder: 'you@company.com', type: 'email', autoComplete: 'email', max: 200 },
] as const;

type Snapshot = { answers: ClarityAnswers; envelope: AssistantEnvelope; transcript: ConversationTurn[] };

// Reuse the Clarity Engine's response protocol without mounting its separate workspace.
async function getNextQuestion(answers: ClarityAnswers, current: AssistantEnvelope, answer: string, transcript: ConversationTurn[], signal: AbortSignal, onOutput: (text: string) => void) {
  const response = await fetch('/api/clarity-engine/chat/', {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, signal,
    body: JSON.stringify({ answers, transcript, requireAI: true, currentQuestionKey: current.nextQuestionKey, currentQuestion: current.nextQuestion, latestAnswer: answer }),
  });
  if (!response.ok || !response.body) throw new Error('Clarity unavailable');
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let raw = '';
  try {
    while (true) {
      const { done, value } = await reader.read();
      buffer += decoder.decode(value, { stream: !done });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';
      if (done && buffer.trim()) lines.push(buffer);
      for (const line of lines) {
        if (!line.trim()) continue;
        const event = JSON.parse(line);
        if (event.type === 'error') throw new Error(event.message);
        if (event.type === 'token') {
          raw += event.value;
          const reply = raw.match(/"assistantReply"\s*:\s*"((?:\\.|[^"\\])*)/);
          if (reply) {
            try { onOutput(JSON.parse(`"${reply[1]}"`)); } catch { /* Wait for the rest of an escaped character. */ }
          }
        }
        if (event.type === 'final' && event.data && typeof event.data.nextQuestion === 'string' && ['groq', 'local'].includes(event.data.source)) {
          return event.data as AssistantEnvelope;
        }
      }
      if (done) throw new Error('Incomplete clarity response');
    }
  } finally { await reader.cancel(); }
}

export function Contact() {
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.1 });
  const [session, setSession] = useState<Snapshot>({ answers: {}, envelope: createInitialSessionEnvelope(), transcript: [] });
  const [history, setHistory] = useState<Snapshot[]>([]);
  const [draft, setDraft] = useState('');
  const [busy, setBusy] = useState(false);
  const [output, setOutput] = useState('');
  const [typing, setTyping] = useState(false);
  const typingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  function updateDraft(value: string) {
    setDraft(value); setTyping(true);
    if (typingTimer.current) clearTimeout(typingTimer.current);
    typingTimer.current = setTimeout(() => setTyping(false), 1100);
  }
  const [notice, setNotice] = useState('');
  const [contactStep, setContactStep] = useState<number | null>(null);
  const [identity, setIdentity] = useState({ name: '', company: '', email: '' });
  const [sent, setSent] = useState(false);
  const field = useRef<HTMLInputElement & HTMLTextAreaElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const request = useRef<AbortController | null>(null);
  const lock = useRef(false);
  const interacted = useRef(false);
  const honeypot = useRef<HTMLInputElement>(null);
  const { answers, envelope } = session;
  const complete = envelope.nextQuestionKey === 'complete';
  const identityField = contactStep !== null ? IDENTITY[contactStep] : undefined;
  const brief = STAGES.filter(stage => answers[stage.key]).map(stage => `${stage.label}: ${answers[stage.key]}`).join('\n\n');

  useEffect(() => () => { request.current?.abort(); if (typingTimer.current) clearTimeout(typingTimer.current); }, []);
  useEffect(() => {
    if (interacted.current || contactStep !== null) {
      if (!complete || identityField) field.current?.focus({ preventScroll: true });
      else heading.current?.focus({ preventScroll: true });
    }
  }, [history.length, complete, contactStep, identityField]);

  async function advance(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (lock.current || !draft.trim()) return;
    interacted.current = true;
    if (identityField) {
      setIdentity(previous => ({ ...previous, [identityField.key]: draft.trim() }));
      setContactStep(step => (step ?? 0) + 1);
      setDraft('');
      setNotice('');
      return;
    }
    lock.current = true;
    setBusy(true);
    setTyping(false);
    setOutput('');
    setNotice('');
    const answer = draft.trim();
    const nextAnswers = { ...answers, [envelope.nextQuestionKey]: [answers[envelope.nextQuestionKey], answer].filter(Boolean).join(' / ') };
    const transcript: ConversationTurn[] = [...session.transcript,
      { role: 'assistant', content: envelope.nextQuestion, createdAt: new Date().toISOString() },
      { role: 'user', content: answer, createdAt: new Date().toISOString() }];
    const controller = new AbortController();
    request.current = controller;
    const timeout = window.setTimeout(() => controller.abort(), 60000);
    try {
      const next = await getNextQuestion(nextAnswers, envelope, answer, transcript, controller.signal, setOutput);
      if (next.source !== 'groq' || ![...STAGES.map(stage => stage.key), 'complete'].includes(next.nextQuestionKey)) throw new Error('The AI response could not be completed. Please try again.');
      setHistory(previous => [...previous, session]);
      setSession({ answers: nextAnswers, envelope: next, transcript });
      setDraft('');
    } catch {
      setNotice('Clarity Engine could not connect. Your answer is still here. Please try again in a moment.');
    } finally {
      window.clearTimeout(timeout);
      request.current = null;
      lock.current = false;
      setBusy(false);
      setOutput('');
    }
  }

  function goBack() {
    if (busy) return;
    interacted.current = true;
    setNotice('');
    if (contactStep !== null) {
      if (contactStep === 0) { setContactStep(null); setDraft(''); }
      else { const step = contactStep - 1; setContactStep(step); setDraft(identity[IDENTITY[step].key]); }
      return;
    }
    const previous = history.at(-1);
    if (!previous) return;
    setDraft(session.transcript.at(-1)?.content || '');
    setSession(previous);
    setHistory(items => items.slice(0, -1));
  }

  function downloadBrief() {
    const url = URL.createObjectURL(new Blob([`Kramaniti · Workflow audit brief\n\nYour answers, ready for human review.\n\n${brief}`], { type: 'text/plain;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url; link.download = 'kramaniti-workflow-brief.txt'; link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  async function sendBrief() {
    if (lock.current || sent) return;
    lock.current = true; setBusy(true); setNotice('');
    const controller = new AbortController();
    request.current = controller;
    const timeout = window.setTimeout(() => controller.abort(), 15000);
    try {
      const response = await fetch('/api/contact/', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, signal: controller.signal,
        body: JSON.stringify({ ...identity, goal: brief, budget: '', website: honeypot.current?.value || '', page: window.location.href }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Your brief could not be sent. Please try again.');
      setSent(true);
      setNotice('Your brief is with us. We will review it and reply by email.');
    } catch (error) {
      setNotice(error instanceof Error && error.name !== 'AbortError' ? error.message : 'Sending timed out. Please try again or email ask@kramaniti.com.');
    } finally {
      window.clearTimeout(timeout); request.current = null; lock.current = false; setBusy(false);
    }
  }

  return (
    <section className={styles.contact} id="contact" ref={ref as React.RefObject<HTMLDivElement>} aria-labelledby="audit-title">
      <div className={styles.atmosphere} aria-hidden="true">Clarity</div>
      <div className={styles.container}>
        <div className={styles.header}>
          <span id="audit-title" className="micro-label">Workflow audit · Powered by Clarity Engine</span>
          <AnimatedHeading isVisible={isVisible}>Every clearer workflow starts with a conversation.</AnimatedHeading>
          <p>Bring the part that feels harder than it should. We’ll help you follow the thread.</p>
        </div>
        <div className={styles.experience} aria-busy={busy}>
          <aside className={styles.journey} aria-label="Clarity Engine">
            <span className={styles.orbLabel}>{busy ? output ? 'Putting it into words' : 'Connecting the dots' : typing ? 'Following your thought' : complete ? 'A clearer direction' : 'Here to find the thread'}</span>
            <p className={styles.journeyNote}>Your context leads.<br />Clarity is the direction.</p>
          </aside>
          <div className={styles.conversation}>
            <div className={styles.signal}><span>{complete ? 'Your starting point, clarified' : history.length ? 'A conversation around your work' : 'Start wherever the friction is.'}</span></div>
            {!busy && !complete && !identityField && history.length > 0 && <p className={styles.contextSummary}>{envelope.latestSummary}</p>}
            {busy && <p className={styles.stream} aria-live="off">{output || 'Thinking through what you shared…'}</p>}
            {(!complete || identityField) ? <form onSubmit={advance} className={styles.question}>
              <div key={identityField?.key || history.length} className={styles.reveal}>
                <span className={styles.stepLabel}>{identityField ? 'Continue with Kramaniti' : envelope.nextQuestionLabel}</span>
                <h3 hidden={busy}><label htmlFor="audit-answer">{identityField?.question || envelope.nextQuestion}</label></h3>
                {identityField ? <input ref={field} id="audit-answer" value={draft} onChange={event => updateDraft(event.target.value)} type={identityField.type} autoComplete={identityField.autoComplete} maxLength={identityField.max} placeholder={identityField.placeholder} required disabled={busy} /> : <textarea ref={field} id="audit-answer" value={draft} onChange={event => updateDraft(event.target.value)} maxLength={250} placeholder={envelope.nextQuestionPlaceholder} rows={3} required disabled={busy} aria-describedby="audit-hint" />}
              </div>
              {!history.length && <div className={styles.starters}><span>Try a starting point</span>{STARTERS.map(text => <button key={text} type="button" disabled={busy} onClick={() => { setDraft(text); field.current?.focus(); }}>{text}<ArrowRight size={13} /></button>)}</div>}
              <div className={styles.controls}>
                <button className={styles.back} type="button" onClick={goBack} disabled={busy || (!history.length && contactStep === null)}><ArrowLeft size={15} /> Back</button>
                <span id="audit-hint" className={styles.hint}>{identityField ? 'Only shared when you send.' : `${draft.length}/250 · A few plain words are enough.`}</span>
                <button className={styles.primary} type="submit" disabled={busy || !draft.trim()}>{busy ? <Loader2 className={styles.spinner} size={17} /> : <>Continue <ArrowRight size={17} /></>}</button>
              </div>
            </form> : <div className={styles.review}>
              <span className={styles.stepLabel}>{sent ? 'Request received' : 'Your workflow brief'}</span>
              <h3 ref={heading} tabIndex={-1}>{sent ? 'A clearer conversation starts here.' : 'Here’s the thread we’ll follow.'}</h3>
              <p className={styles.reviewIntro}>{envelope.clarityContext || 'Your words, gathered into a starting brief for human review.'}</p>
              <p className={styles.reviewIntro}>{envelope.workflowDirection}</p><dl>{STAGES.filter(stage => answers[stage.key]).map(stage => <div key={stage.key}><dt>{stage.label}</dt><dd>{answers[stage.key]}</dd></div>)}</dl>
              {contactStep === 3 && !sent && <p className={styles.recipient}>{identity.name} · {identity.company}<br />Reply to {identity.email}</p>}
              <div className={styles.reviewActions}>
                {!sent && <button className={styles.back} onClick={goBack} disabled={busy}><ArrowLeft size={15} /> {contactStep === 3 ? 'Edit details' : 'Edit answers'}</button>}
                <button className={styles.back} onClick={downloadBrief}><Download size={15} /> Keep a copy</button>
                {!sent && <button className={styles.primary} disabled={busy} onClick={() => { if (contactStep === 3) void sendBrief(); else { setContactStep(0); setDraft(identity.name); setNotice(''); } }}>{busy ? <Loader2 className={styles.spinner} size={17} /> : <>{contactStep === 3 ? 'Send my audit brief' : 'Discuss this with Kramaniti'}<ArrowRight size={17} /></>}</button>}
              </div>
              {contactStep === 3 && !sent && <p className={styles.privacy}>Sending shares this brief and your contact details with Kramaniti for a reply.</p>}
            </div>}
            <input ref={honeypot} type="text" name="website" tabIndex={-1} autoComplete="off" className={styles.honeypot} aria-hidden="true" />
            <p className={styles.notice} role="status">{notice}</p>
            {!complete && <p className={styles.privacy}>A focused AI conversation. No contact details needed to begin. Your answers are processed by Kramaniti and its AI provider, Groq, when available. Please leave out sensitive information.</p>}
          </div>
        </div>

        <aside className={styles.investorDoorway} id="investor-doorway" aria-labelledby="investor-doorway-heading">
          <div className={styles.investorCopy}>
            <span className="micro-label">Company Thesis · Investors &amp; Strategic Partners</span>
            <h3 id="investor-doorway-heading">Evaluating Kramaniti from an investment or ecosystem lens?</h3>
            <p>
              Kramaniti pairs forward-deployed workflow and AI systems engineering with proprietary software products—<strong>Kramaniti Spasht</strong>, <strong>Kramaniti Kosh</strong>, and <strong>Clarity Engine</strong>—turning real operational bottlenecks into compounding, human-led software IP. Skip the client workflow diagnostic and reach the founder directly.
            </p>
          </div>
          <div className={styles.investorActions}>
            <a
              href="mailto:karan@kramaniti.com?subject=Kramaniti%20%E2%80%94%20Investor%20%2F%20Strategic%20Conversation"
              className={styles.investorPrimary}
            >
              <span>Email Karan directly (karan@kramaniti.com)</span>
              <ArrowRight size={15} />
            </a>
            <div className={styles.investorLinks}>
              <Link href="/founder#operating-leverage">Founder &amp; Operating Thesis</Link>
              <span aria-hidden="true">·</span>
              <Link href="/work">Verified Execution Footprint</Link>
              <span aria-hidden="true">·</span>
              <Link href="/spasht/">Open Spasht</Link>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
