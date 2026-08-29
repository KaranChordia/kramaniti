'use client';
import React from 'react';
import { Check } from 'lucide-react';
import styles from './Contact.module.css';
import { Input, Textarea, Select } from '../ui/Input';
import { Button } from '../ui/Button';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';
import { AnimatedHeading } from '../ui/AnimatedHeading';

type SubmitState = 'idle' | 'submitting' | 'success' | 'error';
const MIN_PROGRESS_MS = 750;

export function Contact() {
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.1 });
  const [submitState, setSubmitState] = React.useState<SubmitState>('idle');
  const [message, setMessage] = React.useState('');

  const budgetOptions = [
    { value: '', label: 'Choose one, or leave this blank' },
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
      const submissionRequest = fetch('/api/contact/', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      const minimumProgress = new Promise((resolve) => {
        window.setTimeout(resolve, MIN_PROGRESS_MS);
      });
      const [response] = await Promise.all([submissionRequest, minimumProgress]);

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Unable to submit the enquiry.');
      }

      form.reset();
      setSubmitState('success');
      setMessage('Thanks—your note is with us. We will review it and reply soon.');
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
          <AnimatedHeading isVisible={isVisible}>Start with one workflow that feels harder than it should.</AnimatedHeading>
          <p className="text-secondary">Tell us where work slows down, gets repeated, or depends too much on memory. We will review it and suggest a clear starting point.</p>
        </div>

        <div className={styles.grid}>
          <div className={`${styles.formColumn} ${isVisible ? styles.visible : ''}`}>
            <form className={styles.form} onSubmit={handleSubmit}>
              <Input label="Name" name="name" placeholder="Your full name" required className={styles.contactInput} />
              <Input label="Email" name="email" type="email" placeholder="name@company.com" required className={styles.contactInput} />
              <Input label="Business / Team" name="company" placeholder="Where do you work?" required className={styles.contactInput} />
              <Select label="Do you have a budget in mind? (Optional)" name="budget" options={budgetOptions} className={styles.contactInput} />
              <Textarea label="Where does the work get stuck?" name="goal" placeholder="For example: follow-ups are missed, reporting takes too long, or important context lives in too many places." required className={styles.contactInput} />
              <input
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                className={styles.honeypot}
                aria-hidden="true"
              />
              <Button
                type="submit"
                variant="primary"
                className={`${styles.submitBtn} ${submitState === 'submitting' ? styles.submitBtnLoading : ''} ${submitState === 'success' ? styles.submitBtnSuccess : ''}`}
                disabled={submitState === 'submitting'}
                aria-label={submitState === 'success' ? 'Workflow audit request received' : 'Request a workflow audit'}
              >
                <span className={styles.submitProgress} aria-hidden="true" />
                <span className={styles.submitContent}>
                  {submitState === 'success' ? (
                    <>
                      <Check size={18} strokeWidth={2.5} aria-hidden="true" />
                      <span>Request received</span>
                    </>
                  ) : (
                    <span>{submitState === 'submitting' ? 'Sending...' : 'Request a workflow audit'}</span>
                  )}
                </span>
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
              <span className="micro-label">What happens next</span>
              <h3>We look for the clearest place to begin.</h3>
              <p className="text-secondary caption">The audit looks at how the work happens now, where it gets stuck, and what would make a useful first change.</p>
              <div className={styles.auditList}>
                <span>A clear view of the current workflow</span>
                <span>The bottleneck worth fixing first</span>
                <span>A practical next step</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
