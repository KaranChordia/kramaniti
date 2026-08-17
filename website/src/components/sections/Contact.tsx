'use client';
import React from 'react';
import { Check, Map, Route, Stethoscope } from 'lucide-react';
import styles from './Contact.module.css';
import { Input, Textarea, Select } from '../ui/Input';
import { BrandButton } from '../ui/BrandButton';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';
import { AnimatedHeading } from '../ui/AnimatedHeading';
import { IconMark } from '../ui/IconMark';
import { SectionKicker } from '../ui/SectionKicker';

type SubmitState = 'idle' | 'submitting' | 'success' | 'error';
const MIN_PROGRESS_MS = 750;

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
      setMessage('Your enquiry has been received. We will review it and respond shortly.');
    } catch (error) {
      setSubmitState('error');
      setMessage(error instanceof Error ? error.message : 'Unable to submit the enquiry right now.');
    }
  }

  return (
    <section className={`${styles.contact} home-section`} id="contact" ref={ref as React.RefObject<HTMLDivElement>}>
      <div className={styles.atmosphere} aria-hidden="true">
        <span className={`${styles.atmosWord} ${styles.atmosWordOne}`}>Connect</span>
        <span className={`${styles.atmosWord} ${styles.atmosWordTwo}`}>Start</span>
      </div>
      <div className={`${styles.container} home-container`}>
        <div className={`${styles.header} home-header ${isVisible ? styles.visible : ''}`}>
          <SectionKicker>Start here</SectionKicker>
          <AnimatedHeading isVisible={isVisible}>Initiate a Workflow Audit.</AnimatedHeading>
          <p className="home-lede">Describe your operational bottlenecks or areas lacking clarity. We will start by diagnosing the core issues and identifying the highest-impact system to build.</p>
        </div>

        <div className={styles.grid}>
          <div className={`${styles.formColumn} ${isVisible ? styles.visible : ''}`}>
            <form className={styles.form} onSubmit={handleSubmit}>
              <Input label="Name" name="name" placeholder="Your full name" required className={styles.contactInput} />
              <Input label="Work Email" name="email" type="email" placeholder="name@company.com" required className={styles.contactInput} />
              <Input label="Company / Brand" name="company" placeholder="Company or brand name" required className={styles.contactInput} />
              <Select label="Budget Range" name="budget" options={budgetOptions} className={styles.contactInput} />
              <Textarea label="Workflow / Goal" name="goal" placeholder="Describe the workflows that currently feel inefficient, disconnected, or ready for optimization." required className={styles.contactInput} />
              <input
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                className={styles.honeypot}
                aria-hidden="true"
              />
              <BrandButton
                type="submit"
                variant="primary"
                className={`${styles.submitBtn} ${submitState === 'submitting' ? styles.submitBtnLoading : ''} ${submitState === 'success' ? styles.submitBtnSuccess : ''}`}
                disabled={submitState === 'submitting'}
                aria-label={submitState === 'success' ? 'Enquiry submitted' : 'Request a Workflow Audit'}
              >
                <span className={styles.submitProgress} aria-hidden="true" />
                <span className={styles.submitContent}>
                  {submitState === 'success' ? (
                    <>
                      <Check size={18} strokeWidth={2.5} aria-hidden="true" />
                      <span>Enquiry Received</span>
                    </>
                  ) : (
                    <span>{submitState === 'submitting' ? 'Sending...' : 'Request a Workflow Audit'}</span>
                  )}
                </span>
              </BrandButton>
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
              <SectionKicker>Where to begin</SectionKicker>
              <h3>Determine the most effective starting point.</h3>
              <p className="home-lede">The audit provides a comprehensive diagnosis of your operations, a prioritized workflow map, and a practical implementation roadmap.</p>
              <div className={styles.auditList}>
                <span>
                  <IconMark>
                    <Stethoscope strokeWidth={1.75} />
                  </IconMark>
                  Comprehensive diagnosis
                </span>
                <span>
                  <IconMark>
                    <Map strokeWidth={1.75} />
                  </IconMark>
                  Prioritized workflow map
                </span>
                <span>
                  <IconMark>
                    <Route strokeWidth={1.75} />
                  </IconMark>
                  Implementation roadmap
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
