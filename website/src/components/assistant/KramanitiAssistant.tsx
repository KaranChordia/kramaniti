'use client';

import { FormEvent, useEffect, useRef, useState } from 'react';
import { RotateCcw, Send, X } from 'lucide-react';
import styles from './KramanitiAssistant.module.css';

type AssistantRole = 'assistant' | 'user';

type AssistantMessage = {
  id: string;
  role: AssistantRole;
  content: string;
  createdAt: string;
  isStreaming?: boolean;
};

type AssistantResponse = {
  response?: string;
  error?: string;
};

type StreamTimer = {
  id: number;
  resolve: () => void;
};

const createMessage = (role: AssistantRole, content: string): AssistantMessage => ({
  id: `${role}-${Date.now()}-${Math.random().toString(36).slice(2)}`,
  role,
  content,
  createdAt: new Date().toISOString(),
});

const INITIAL_MESSAGES: AssistantMessage[] = [
  {
    id: 'assistant-welcome',
    role: 'assistant',
    content:
      'I am the Kramaniti assistant. Ask about the method, services, founder context, Clarity Engine, Studio, or the first workflow worth clarifying.',
    createdAt: new Date(0).toISOString(),
  },
];

const starterPrompts = [
  'What does Kramaniti do?',
  'Which service fits my situation?',
  'Explain the Clarity Engine',
];

const RESPONSE_WORD_INTERVAL_MS = 58;
const RESPONSE_PUNCTUATION_PAUSE_MS = 120;
const RESPONSE_PARAGRAPH_PAUSE_MS = 180;
const STREAM_RENDER_INTERVAL_MS = 110;

const tokenizeAssistantResponse = (value: string) => value.match(/\S+\s*/g) || [];

const getTokenDelay = (token: string) => {
  if (/\n\s*\n/.test(token)) return RESPONSE_PARAGRAPH_PAUSE_MS;
  if (/[.!?]\s*$/.test(token)) return RESPONSE_PUNCTUATION_PAUSE_MS;
  if (/[,;:]\s*$/.test(token)) return 86;
  return RESPONSE_WORD_INTERVAL_MS;
};

export function KramanitiAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);
  const [draft, setDraft] = useState('');
  const [messages, setMessages] = useState<AssistantMessage[]>(INITIAL_MESSAGES);
  const [isSending, setIsSending] = useState(false);
  const [isStreamingResponse, setIsStreamingResponse] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const streamTimersRef = useRef<StreamTimer[]>([]);
  const streamRunRef = useRef(0);
  const isTyping = draft.length > 0;
  const isBusy = isSending || isStreamingResponse;

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  }, [draft, isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    messagesEndRef.current?.scrollIntoView({
      behavior: isStreamingResponse ? 'auto' : 'smooth',
      block: 'end',
    });
  }, [isOpen, isStreamingResponse, messages]);

  useEffect(() => {
    return () => {
      streamRunRef.current += 1;
      streamTimersRef.current.forEach(({ id, resolve }) => {
        window.clearTimeout(id);
        resolve();
      });
      streamTimersRef.current = [];
    };
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const focusTimer = window.setTimeout(() => textareaRef.current?.focus(), 420);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.clearTimeout(focusTimer);
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const clearStreamingTimers = () => {
    streamRunRef.current += 1;
    streamTimersRef.current.forEach(({ id, resolve }) => {
      window.clearTimeout(id);
      resolve();
    });
    streamTimersRef.current = [];
    setIsStreamingResponse(false);
  };

  const waitForStreamDelay = (delay: number) =>
    new Promise<void>((resolve) => {
      const id = window.setTimeout(() => {
        streamTimersRef.current = streamTimersRef.current.filter((activeTimer) => activeTimer.id !== id);
        resolve();
      }, delay);

      streamTimersRef.current.push({ id, resolve });
    });

  const streamAssistantResponse = async (fullResponse: string) => {
    const tokens = tokenizeAssistantResponse(fullResponse);
    const runId = streamRunRef.current + 1;
    const messageId = `assistant-stream-${runId}`;
    let lastRenderTime = 0;
    streamRunRef.current = runId;
    setIsStreamingResponse(true);

    const streamingMessage: AssistantMessage = {
      id: messageId,
      role: 'assistant',
      content: '',
      createdAt: new Date().toISOString(),
      isStreaming: true,
    };

    setMessages((current) => [...current, streamingMessage]);

    for (const [index, token] of tokens.entries()) {
      if (streamRunRef.current !== runId) return;

      const now = window.performance.now();
      const isLastToken = index === tokens.length - 1;
      if (isLastToken || now - lastRenderTime >= STREAM_RENDER_INTERVAL_MS) {
        lastRenderTime = now;
        const visibleText = tokens.slice(0, index + 1).join('');
        setMessages((current) =>
          current.map((message) =>
            message.id === messageId ? { ...message, content: visibleText } : message,
          ),
        );
      }

      await waitForStreamDelay(getTokenDelay(token));
    }

    if (streamRunRef.current !== runId) return;

    setMessages((current) =>
      current.map((message) =>
        message.id === messageId ? { ...message, content: fullResponse, isStreaming: false } : message,
      ),
    );
    setIsStreamingResponse(false);
  };

  const resetThread = () => {
    clearStreamingTimers();
    setMessages(INITIAL_MESSAGES);
    setDraft('');
  };

  const submitMessage = async (override?: string) => {
    const content = (override ?? draft).trim();
    if (!content || isBusy) return;

    const userMessage = createMessage('user', content);
    const nextMessages = [...messages, userMessage];

    setMessages(nextMessages);
    setDraft('');
    setIsSending(true);

    try {
      const response = await fetch('/api/chat/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: nextMessages.slice(-10).map(({ role, content: messageContent }) => ({
            role,
            content: messageContent,
          })),
          pagePath: window.location.pathname,
        }),
      });

      const data = (await response.json()) as AssistantResponse;

      if (!response.ok || !data.response) {
        throw new Error(data.error || 'Assistant response unavailable.');
      }

      setIsSending(false);
      await streamAssistantResponse(data.response);
    } catch {
      setIsSending(false);
      await streamAssistantResponse(
        'I could not reach the hosted intelligence layer. The safest next step is to check that GROQ_API_KEY is configured, then try again.',
      );
    } finally {
      setIsSending(false);
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void submitMessage();
  };

  const toggleAssistant = () => {
    if (!isOpen) setHasOpened(true);
    setIsOpen((current) => !current);
  };

  return (
    <div className={`${styles.root} ${isOpen ? styles.rootOpen : ''} ${isTyping ? styles.rootTyping : ''} ${isBusy ? styles.rootResponding : ''}`}>
      <button
        type="button"
        className={styles.blobButton}
        onClick={toggleAssistant}
        aria-label={isOpen ? 'Close Kramaniti assistant' : 'Open Kramaniti assistant'}
        aria-expanded={isOpen}
        title={isOpen ? 'Close assistant' : 'Open Kramaniti assistant'}
      >
        <span className={styles.assistantBlob} aria-hidden="true" />
      </button>

      {hasOpened ? (
        <div className={styles.stage} aria-hidden={!isOpen}>
          <button
            type="button"
            className={styles.backdrop}
            onClick={() => setIsOpen(false)}
            aria-label="Close assistant backdrop"
            tabIndex={isOpen ? 0 : -1}
          />

          <section
            className={styles.panel}
            role="dialog"
            aria-modal="true"
            aria-label="Kramaniti assistant chat"
          >
            <div className={styles.panelGlow} aria-hidden="true" />

            <header className={styles.header}>
              <div className={styles.panelBlob} aria-hidden="true">
                <span className={styles.panelBlobOrbitOne} />
                <span className={styles.panelBlobOrbitTwo} />
                <span className={styles.panelBlobCore} />
              </div>
              <div className={styles.identity}>
                <span className={styles.kicker}>
                  Kramaniti Assistant
                </span>
              </div>
              <div className={styles.headerActions}>
                <button type="button" className={styles.iconButton} onClick={resetThread} title="Reset chat" aria-label="Reset chat">
                  <RotateCcw size={16} />
                </button>
                <button type="button" className={styles.iconButton} onClick={() => setIsOpen(false)} title="Close" aria-label="Close">
                  <X size={18} />
                </button>
              </div>
            </header>

            <div className={styles.messages} aria-live="polite">
              {messages.map((message) => (
                <article
                  key={message.id}
                  className={`${styles.message} ${message.role === 'user' ? styles.userMessage : styles.assistantMessage} ${message.isStreaming ? styles.streamingMessage : ''}`}
                >
                  <span className={styles.messageLabel}>{message.role === 'user' ? 'You' : 'Kramaniti'}</span>
                  <p>
                    {message.content}
                    {message.isStreaming ? <span className={styles.streamCaret} aria-hidden="true" /> : null}
                  </p>
                </article>
              ))}

              {isSending && (
                <article className={`${styles.message} ${styles.assistantMessage}`}>
                  <span className={styles.messageLabel}>Kramaniti</span>
                  <div className={styles.thinking}>
                    <span />
                    <span />
                    <span />
                  </div>
                </article>
              )}
              <div ref={messagesEndRef} />
            </div>

            {messages.length === 1 && (
              <div className={styles.promptRail} aria-label="Starter prompts">
                {starterPrompts.map((prompt) => (
                  <button
                    type="button"
                    key={prompt}
                    className={styles.promptChip}
                    disabled={isBusy}
                    onClick={() => void submitMessage(prompt)}
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            )}

            <form className={styles.inputDock} onSubmit={handleSubmit}>
              <textarea
                ref={textareaRef}
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' && !event.shiftKey) {
                    event.preventDefault();
                    void submitMessage();
                  }
                }}
                placeholder="Ask about Kramaniti or a workflow..."
                rows={1}
                maxLength={900}
                disabled={isBusy}
              />
              <button type="submit" className={styles.sendButton} disabled={!draft.trim() || isBusy} aria-label="Send message">
                <Send size={17} />
              </button>
            </form>
          </section>
        </div>
      ) : null}
    </div>
  );
}
