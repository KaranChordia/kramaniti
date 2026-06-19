'use client';
import React from 'react';
import styles from './Contact.module.css';
import { Input, Textarea, Select } from '../ui/Input';
import { Button } from '../ui/Button';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';
import { AnimatedHeading } from '../ui/AnimatedHeading';

type SubmitState = 'idle' | 'submitting' | 'success' | 'error';

export function Contact() {
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.1 });
  const [submitState, setSubmitState] = React.useState<SubmitState>('idle');
  const [message, setMessage] = React.useState('');

  const budgetOptions = [
    { value: '', label: 'Select budget range' },
    { value: 'under_75k', label: 'Under ₹75K' },
    { value: '75k_1.5L', label: '₹75K – ₹1.5L' },
    { value: '1.5L_3L', label: '₹1.5L – ₹3L' },
    { value: '3L_6L', label: '₹3L – ₹6L' },
    { value: '6L_plus', label: '₹6L+' },
    { value: 'not_sure', label: 'Not sure yet' }
  ];

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setSubmitState('submitting');
    setMessage('');

    const formData = new FormData(form);
    const payload = {
      name: String(formData.get('name') || ''),
      email: String(formData.get('email') || ''),
      company: String(formData.get('company') || ''),
      budget: String(formData.get('budget') || ''),
      goal: String(formData.get('goal') || ''),
      website: String(formData.get('website') || ''),
      page: window.location.href,
    };

    try {
      const response = await fetch('/api/contact/', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Unable to submit the enquiry.');
      }

      form.reset();
      setSubmitState('success');
      setMessage('Your enquiry has been received. We will review the workflow context and respond shortly.');
    } catch (error) {
      setSubmitState('error');
      setMessage(error instanceof Error ? error.message : 'Unable to submit the enquiry right now.');
    }
  }

  return (
    <section className={styles.contact} id="contact" ref={ref as React.RefObject<HTMLDivElement>}>
      <div className={styles.atmosphere} aria-hidden="true">
        <span className={`${styles.atmosWord} ${styles.atmosWordOne}`}>Connect</span>
        <span className={`${styles.atmosWord} ${styles.atmosWordTwo}`}>Start</span>
      </div>
      <div className={styles.container}>
        <div className={`${styles.header} ${isVisible ? styles.visible : ''}`}>
          <span className="micro-label">Start here</span>
          <AnimatedHeading isVisible={isVisible}>Start with an Alignment Audit.</AnimatedHeading>
          <p className="text-secondary">Share the workflow, handoff, decision loop, or communication gap you want to clarify. The first conversation is about finding the highest-impact system to build first, not adding more tools for their own sake.</p>
        </div>

        <div className={styles.grid}>
          <div className={`${styles.formColumn} ${isVisible ? styles.visible : ''}`}>
            <form className={styles.form} onSubmit={handleSubmit}>
              <Input label="Name" name="name" placeholder="Your full name" required className={styles.contactInput} />
              <Input label="Work Email" name="email" type="email" placeholder="name@company.com" required className={styles.contactInput} />
              <Input label="Company / Brand" name="company" placeholder="Company or brand name" required className={styles.contactInput} />
              <Select label="Budget Range" name="budget" options={budgetOptions} className={styles.contactInput} />
              <Textarea label="Workflow / Goal" name="goal" placeholder="Tell us what feels messy, manual, unclear, or ready to improve" required className={styles.contactInput} />
              <input
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                className={styles.honeypot}
                aria-hidden="true"
              />
              <Button type="submit" variant="primary" className={styles.submitBtn} disabled={submitState === 'submitting'}>
                {submitState === 'submitting' ? 'Sending...' : 'Request Alignment Audit'}
              </Button>
              <p
                className={`${styles.formMessage} ${submitState === 'error' ? styles.errorMessage : ''} ${submitState === 'success' ? styles.successMessage : ''}`}
                role="status"
                aria-live="polite"
              >
                {message}
              </p>
            </form>
          </div>

          <div className={`${styles.calendlyColumn} ${isVisible ? styles.visible : ''}`}>
            <div className={styles.calendlyPlaceholder}>
              <span className="micro-label">Alignment focus</span>
              <h3>Find the first system worth building.</h3>
              <p className="text-secondary caption">A useful audit should leave you with clearer business logic, a priority workflow, and a practical next step across operations, intelligence, and presence.</p>
              <div className={styles.auditList}>
                <span>Operational clarity</span>
                <span>Priority workflow</span>
                <span>Practical next step</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
