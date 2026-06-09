import type { Metadata } from 'next';
import './globals.css';
import styles from './layout.module.css';

export const metadata: Metadata = {
  title: 'Kramaniti Studio | Pipeline',
  description: 'First-principles AI systems partner dashboard.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className={styles.layoutContainer}>
          {/* Sidebar Navigation */}
          <aside className={styles.sidebar}>
            <div className={styles.brand}>
              <div className={styles.brandName}>
                Kramaniti <span className={styles.studioBadge}>Studio</span>
              </div>
            </div>

            <div className={styles.navSection}>
              <div className={styles.navTitle}>Phase 1: Strategy</div>
              <ul className={styles.navList}>
                <li className={`${styles.navItem} ${styles.active}`}>
                  <svg className={styles.navIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                  Diagnose
                </li>
              </ul>
            </div>

            <div className={styles.navSection}>
              <div className={styles.navTitle}>Phase 2: Systems</div>
              <ul className={styles.navList}>
                <li className={styles.navItem}>
                  <svg className={styles.navIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                  Design
                </li>
                <li className={styles.navItem}>
                  <svg className={styles.navIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  Build
                </li>
                <li className={styles.navItem}>
                  <svg className={styles.navIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Train
                </li>
              </ul>
            </div>

            <div className={styles.navSection}>
              <div className={styles.navTitle}>Phase 3: Content</div>
              <ul className={styles.navList}>
                <li className={styles.navItem}>
                  <svg className={styles.navIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  Communicate
                </li>
                <li className={styles.navItem}>
                  <svg className={styles.navIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  Improve
                </li>
              </ul>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className={styles.mainContent}>
            <header className={styles.topbar}>
              <div className={styles.clientContext}>
                <div className={styles.clientAvatar}>AC</div>
                <div className={styles.clientDetails}>
                  <h2>Acme Corp</h2>
                  <span>Workflow Pipeline • In Progress</span>
                </div>
              </div>
              
              <div className={styles.topActions}>
                <div className={`${styles.aiIndicator}`}>
                  <div className={styles.dot}></div>
                  AI Assistant Ready
                </div>
              </div>
            </header>
            
            <div className={styles.pageContainer}>
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
