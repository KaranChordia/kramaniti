'use client';
import React from 'react';
import styles from './Contact.module.css';
import { Input, Textarea, Select } from '../ui/Input';
import { Button } from '../ui/Button';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';
import { AnimatedHeading } from '../ui/AnimatedHeading';

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
          <AnimatedHeading isVisible={isVisible}>Start with an Alignment Audit.</AnimatedHeading>
          <p className="text-secondary">Share the workflow, handoff, decision loop, or communication gap you want to clarify. The first conversation is about finding the highest-impact system to build first, not adding more tools for their own sake.</p>
        </div>

        <div className={styles.grid}>
          <div className={`${styles.formColumn} ${isVisible ? styles.visible : ''}`}>
            <form className={`glass-border-layer ${styles.form} ${styles.contactGlass}`} onSubmit={(e) => e.preventDefault()}>
              <Input label="Name" placeholder="Your full name" required />
              <Input label="Work Email" type="email" placeholder="name@company.com" required />
              <Input label="Company / Brand" placeholder="Company or brand name" required />
              <Select label="Budget Range" options={budgetOptions} />
              <Textarea label="Workflow / Goal" placeholder="Tell us what feels messy, manual, unclear, or ready to improve" />
              <Button type="submit" variant="primary" className={styles.submitBtn}>
                Request Alignment Audit
              </Button>
            </form>
          </div>

          <div className={`${styles.calendlyColumn} ${isVisible ? styles.visible : ''}`}>
            <div className={`glass-border-layer ${styles.calendlyPlaceholder} ${styles.contactGlass}`}>
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
