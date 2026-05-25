'use client';
import React from 'react';
import styles from './Clients.module.css';

const clients = [
  'WeWork India',
  'Hyatt Centric',
  'Nexocean',
  'DigitalOcean',
  'New Horizon Institute',
  'HackerRank',
  'Bumble',
  'Techstars',
  'Well Ergon',
  'ClearGlass',
  'Wolves India',
  'GoQloak',
  'Vidhi Centre',
  'PK Narendra & Co',
  'Equidor'
];

export function Clients() {
  return (
    <section className={styles.clientsSection}>
      <div className={styles.container}>
        <h3 className={styles.heading}>TRUSTED BY</h3>
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
