'use client';
import React from 'react';
import styles from './Clients.module.css';

const clients = [
  'Co-working',
  'Hospitality',
  'Education',
  'Startup ecosystems',
  'B2B technology',
  'Founder-led brands'
];

export function Clients() {
  return (
    <section className={styles.clientsSection}>
      <div className={styles.container}>
        <h3 className={styles.heading}>EXPERIENCE ACROSS</h3>
        <div className={styles.marqueeContainer}>
          <div className={styles.marqueeContent}>
            {/* Double the list to create a seamless infinite loop */}
            {[...clients, ...clients].map((client, index) => (
              <div key={index} className={styles.clientItem}>
                {client}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
