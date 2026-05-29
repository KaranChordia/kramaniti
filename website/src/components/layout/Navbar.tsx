'use client';
import React, { useState } from 'react';
import styles from './Navbar.module.css';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { Button } from '../ui/Button';

const ThemeToggle = dynamic(() => import('../ui/ThemeToggle').then((mod) => mod.ThemeToggle), {
  ssr: false,
});

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <>
      <div className={styles.navWrapper}>
        <header className={styles.header}>
          <div className={styles.container}>
            <Link href="/" className={styles.logoGroup} style={{ textDecoration: 'none' }} onClick={closeMobileMenu}>
              <Image
                src="/kramaniti/assets/brand/kramaniti-mark-gold.png"
                alt="Kramaniti logo"
                width={70}
                height={70}
                className={styles.logoMark}
                priority
              />
            </Link>
            
            <nav className={styles.desktopNav}>
              <Link href="/#method" className={styles.navLink}>Method</Link>
              <Link href="/#services" className={styles.navLink}>Services</Link>
              <Link href="/#workflows" className={styles.navLink}>Process</Link>
              <Link href="/#credibility" className={styles.navLink}>Proof</Link>
              <Link href="/founder" className={styles.navLink}>Founder</Link>
              <Link href="/insights" className={styles.navLink}>Insights</Link>
            </nav>

            <div className={styles.actions}>
              <ThemeToggle />
              <Button variant="primary" className={styles.ctaButton} onClick={() => {
                if (window.location.pathname === '/') {
                  document.getElementById('contact')?.scrollIntoView();
                } else {
                  window.location.href = '/#contact';
                }
              }}>
                Book Audit
              </Button>
              <button className={styles.mobileMenuBtn} aria-label="Toggle Menu" onClick={toggleMobileMenu}>
                {isMobileMenuOpen ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="3" y1="12" x2="21" y2="12"></line>
                    <line x1="3" y1="6" x2="21" y2="6"></line>
                    <line x1="3" y1="18" x2="21" y2="18"></line>
                  </svg>
                )}
              </button>
            </div>
          </div>
        </header>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className={styles.mobileMenuOverlay}>
          <nav className={styles.mobileNavLinks}>
            <Link href="/" className={styles.mobileLink} onClick={closeMobileMenu}>Home</Link>
            <Link href="/#method" className={styles.mobileLink} onClick={closeMobileMenu}>Method</Link>
            <Link href="/#services" className={styles.mobileLink} onClick={closeMobileMenu}>Services</Link>
            <Link href="/#workflows" className={styles.mobileLink} onClick={closeMobileMenu}>Process</Link>
            <Link href="/#credibility" className={styles.mobileLink} onClick={closeMobileMenu}>Proof</Link>
            <Link href="/founder" className={styles.mobileLink} onClick={closeMobileMenu}>Founder</Link>
            <Link href="/insights" className={styles.mobileLink} onClick={closeMobileMenu}>Insights</Link>
            <div style={{ marginTop: '24px' }}>
              <Button variant="primary" onClick={() => {
                closeMobileMenu();
                if (window.location.pathname === '/') {
                  document.getElementById('contact')?.scrollIntoView();
                } else {
                  window.location.href = '/#contact';
                }
              }}>
                Book Audit
              </Button>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
