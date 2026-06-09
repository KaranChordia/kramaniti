'use client';

import React, { useState, useRef, useEffect } from 'react';
import styles from './ChatbotWidget.module.css';

type Message = {
  id: string;
  role: 'user' | 'ai';
  text: string;
};

export function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'ai',
      text: 'I am the Kramaniti Intelligence Copilot. How can I help you map a workflow or synthesize your operating logic today?',
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const toggleWidget = () => {
    setIsOpen(!isOpen);
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: input.trim(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage.text }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch AI response');
      }

      const data = await response.json();
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        text: data.response || "No response received.",
      };

      setMessages(prev => [...prev, aiMessage]);

    } catch (error) {
      console.error(error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        text: "System Error: Unable to reach intelligence layer. Check logs.",
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.widgetContainer}>
      
      {/* Floating Chat Window */}
      <div className={`${styles.chatWindow} ${isOpen ? styles.isOpen : ''}`}>
        
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerIcon}>
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div className={styles.headerText}>
            <h3>Intelligence Copilot</h3>
            <p>Gemini Flash Architecture</p>
          </div>
        </div>

        {/* Message Thread */}
        <div className={styles.messagesArea}>
          {messages.map((msg) => (
            <div key={msg.id} className={`${styles.messageWrapper} ${msg.role === 'user' ? styles.user : styles.ai}`}>
              <div className={styles.messageBubble}>
                {msg.text}
              </div>
              <div className={styles.messageLabel}>
                {msg.role === 'user' ? 'Founder' : 'System'}
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className={`${styles.messageWrapper} ${styles.ai}`}>
              <div className={styles.messageBubble}>
                <div className={styles.typingIndicator}>
                  <div className={styles.dot}></div>
                  <div className={styles.dot}></div>
                  <div className={styles.dot}></div>
                </div>
              </div>
              <div className={styles.messageLabel}>Synthesizing</div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        <div className={styles.inputArea}>
          <form onSubmit={handleSend} className={styles.inputForm}>
            <input 
              type="text" 
              className={styles.inputField} 
              placeholder="Ask the intelligence layer..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
            />
            <button type="submit" className={styles.sendButton} disabled={!input.trim() || isLoading}>
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </form>
        </div>
      </div>

      {/* Floating Trigger Button */}
      <button className={`${styles.triggerButton} ${isOpen ? styles.isOpen : ''}`} onClick={toggleWidget}>
        {isOpen ? (
          <svg className={styles.icon} width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className={styles.icon} width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        )}
      </button>

    </div>
  );
}
