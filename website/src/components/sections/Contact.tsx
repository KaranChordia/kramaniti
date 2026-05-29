'use client';
import React from 'react';
import styles from './Contact.module.css';
import { Input, Textarea, Select } from '../ui/Input';
import { Button } from '../ui/Button';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';

export function Contact() {
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.1, freezeOnceVisible: true });

  const budgetOptions = [
    { value: '', label: 'Select budget range' },
    { value: 'under_75k', label: 'Under ₹75K' },
    { value: '75k_1.5L', label: '₹75K – ₹1.5L' },
    { value: '1.5L_3L', label: '₹1.5L – ₹3L' },
    { value: '3L_6L', label: '₹3L – ₹6L' },
    { value: '6L_plus', label: '₹6L+' },
    { value: 'not_sure', label: 'Not sure yet' }
  ];

  return (
    <section className={styles.contact} id="contact" ref={ref as React.RefObject<HTMLDivElement>}>
      <div className={styles.atmosphere} aria-hidden="true">
        <span className={`${styles.atmosWord} ${styles.atmosWordOne}`}>Connect</span>
        <span className={`${styles.atmosWord} ${styles.atmosWordTwo}`}>Start</span>
      </div>
      <div className={styles.container}>
        <div className={`${styles.header} ${isVisible ? styles.visible : ''}`}>
          <span className="micro-label">Start here</span>
          <h2>Book an AI Workflow Audit.</h2>
          <p className="text-secondary">Share the workflow, team handoff, or content bottleneck you want to make clearer. The first conversation is about finding the highest-impact system to build first.</p>
        </div>

        <div className={styles.grid}>
          <div className={`${styles.formColumn} ${isVisible ? styles.visible : ''}`}>
            <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
              <Input label="Name" placeholder="Your full name" required />
              <Input label="Work Email" type="email" placeholder="name@company.com" required />
              <Input label="Company / Brand" placeholder="Company or brand name" required />
              <Select label="Budget Range" options={budgetOptions} />
              <Textarea label="Workflow / Goal" placeholder="Tell us what feels messy, manual, unclear, or ready to improve" />
              <Button type="submit" variant="primary" className={styles.submitBtn}>
                Request Audit
              </Button>
            </form>
          </div>

          <div className={`${styles.calendlyColumn} ${isVisible ? styles.visible : ''}`}>
            <div className={styles.calendlyPlaceholder}>
              <span className="micro-label">Audit focus</span>
              <h3>Find the first system worth building.</h3>
              <p className="text-secondary caption">A useful audit should leave you with business clarity, a workflow priority, and a practical next step. No platform shopping, no generic tool list, no pressure to replace every task.</p>
              <div className={styles.auditList}>
                <span>Workflow clarity</span>
                <span>Implementation roadmap</span>
                <span>Prototype specification</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
