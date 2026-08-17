'use client';
import React, { useState } from 'react';
import styles from './Navbar.module.css';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { BrandButton } from '../ui/BrandButton';
import { Menu, X } from 'lucide-react';

const ThemeToggle = dynamic(() => import('../ui/ThemeToggle').then((mod) => mod.ThemeToggle), {
  ssr: false,
});

interface NavbarProps {
  isVisible?: boolean;
}

export function Navbar({ isVisible = true }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);
  const scrollToContact = () => {
    const isHomepage =
      window.location.pathname === '/' || window.location.pathname === '/brand-blue-preview';

    if (isHomepage) {
      document.getElementById('contact')?.scrollIntoView();
    } else {
      window.location.href = '/#contact';
    }
  };

  return (
    <>
      <div className={`${styles.navWrapper} ${isVisible ? styles.visible : styles.hidden}`}>
        <header className={`glass-border-layer ${styles.header}`}>
          <div className={styles.container}>
            <Link href="/" className={styles.logoGroup} style={{ textDecoration: 'none' }} onClick={closeMobileMenu}>
              <Image
                src="/assets/brand/kramaniti-mark-gold.png"
                alt="Kramaniti logo"
                width={70}
                height={70}
                className={styles.logoMark}
                priority
              />
            </Link>
            
            <nav className={styles.desktopNav}>
              <Link href="/#method" className={styles.navLink}>How We Work</Link>
              <Link href="/#services" className={styles.navLink}>Services</Link>
              <Link href="/clarity-engine" className={styles.navLink}>Clarity Engine</Link>
              <Link href="/#workflows" className={styles.navLink}>Process</Link>
              <Link href="/work" className={styles.navLink}>Work</Link>
              <Link href="/founder" className={styles.navLink}>Founder</Link>
              <Link href="/insights" className={styles.navLink}>Insights</Link>
            </nav>

            <div className={styles.actions}>
              <ThemeToggle />
              <BrandButton variant="primary" className={styles.ctaButton} onClick={scrollToContact}>
                Book a Workflow Audit
              </BrandButton>
              <button className={styles.mobileMenuBtn} aria-label="Toggle Menu" onClick={toggleMobileMenu}>
                {isMobileMenuOpen ? (
                  <X size={22} strokeWidth={1.75} />
                ) : (
                  <Menu size={22} strokeWidth={1.75} />
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
            <Link href="/#method" className={styles.mobileLink} onClick={closeMobileMenu}>How We Work</Link>
            <Link href="/#services" className={styles.mobileLink} onClick={closeMobileMenu}>Services</Link>
            <Link href="/clarity-engine" className={styles.mobileLink} onClick={closeMobileMenu}>Clarity Engine</Link>
            <Link href="/#workflows" className={styles.mobileLink} onClick={closeMobileMenu}>Process</Link>
            <Link href="/work" className={styles.mobileLink} onClick={closeMobileMenu}>Work</Link>
            <Link href="/founder" className={styles.mobileLink} onClick={closeMobileMenu}>Founder</Link>
            <Link href="/insights" className={styles.mobileLink} onClick={closeMobileMenu}>Insights</Link>
            <div className={styles.mobileCta}>
              <BrandButton variant="primary" onClick={() => {
                closeMobileMenu();
                scrollToContact();
              }}>
                Book a Workflow Audit
              </BrandButton>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
