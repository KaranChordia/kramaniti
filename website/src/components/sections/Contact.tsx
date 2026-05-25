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
      <div className={styles.container}>
        <div className={`${styles.header} ${isVisible ? styles.visible : ''}`}>
          <h2>Let's Build Something</h2>
          <p className="text-secondary">Tell us about your project. We respond within 24 hours.</p>
        </div>

        <div className={styles.grid}>
          <div className={`${styles.formColumn} ${isVisible ? styles.visible : ''}`}>
            <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
              <Input label="Name" placeholder="Your full name" required />
              <Input label="Work Email" type="email" placeholder="name@company.com" required />
              <Input label="Company / Brand" placeholder="Company or brand name" required />
              <Select label="Budget Range" options={budgetOptions} />
              <Textarea label="Message" placeholder="Tell us briefly what you're looking for" />
              <Button type="submit" variant="primary" className={styles.submitBtn}>
                Send Project Brief
              </Button>
            </form>
          </div>

          <div className={`${styles.calendlyColumn} ${isVisible ? styles.visible : ''}`}>
            <div className={styles.calendlyPlaceholder}>
              <h3>Book a Discovery Call</h3>
              <p className="text-secondary caption">Select a time that works for you. (Calendly embed placeholder)</p>
              <Button variant="secondary" className={styles.placeholderBtn}>
                Open Calendly (Placeholder)
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
