'use client';

import type { ReactNode } from 'react';
import { Send } from 'lucide-react';
import styles from './SimpleWorkspace.module.css';

type Message = { id: string; role: 'user' | 'assistant'; content: string };

export function ClarityConversation({ messages, input, busy, onInput, onSend, renderAction, placeholder, label, emptyText, feedback }: {
  messages: Message[];
  input: string;
  busy: boolean;
  onInput: (value: string) => void;
  onSend: () => void;
  renderAction: (id: string) => ReactNode;
  placeholder: string;
  label: string;
  emptyText?: string;
  feedback?: ReactNode;
}) {
  return <div className={styles.conversation}>
    <div className={styles.messages} aria-label={`${label} messages`}>
      {messages.map((message) => <article key={message.id} className={message.role === 'user' ? styles.userMessage : styles.assistantMessage}>
        <span className={styles.speaker}>{message.role === 'user' ? 'You' : 'Clarity'}</span>
        <p>{message.content}</p>
        {renderAction(message.id)}
      </article>)}
      {!messages.length && emptyText && <p className={styles.emptyConversation}>{emptyText}</p>}
      {busy && <p role="status" className={styles.thinking}>Working through your idea…</p>}
    </div>
    <form className={styles.composer} onSubmit={(event) => { event.preventDefault(); onSend(); }}>
      <label className={styles.inputLabel}>
        <span>{label}</span>
        <textarea aria-label={label} value={input} onChange={(event) => onInput(event.target.value)} placeholder={placeholder} rows={3} disabled={busy}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) { event.preventDefault(); if (input.trim() && !busy) onSend(); }
          }} />
      </label>
      <button type="submit" disabled={busy || !input.trim()} aria-label={`Send ${label.toLowerCase()}`}><Send size={17} aria-hidden="true" />Send</button>
    </form>
    {feedback}
  </div>;
}
