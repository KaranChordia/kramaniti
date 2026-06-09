import styles from './page.module.css';

export default function Dashboard() {
  return (
    <div className={`${styles.container} animate-fade-in`}>
      <header className={styles.header}>
        <h1 className={styles.title}>Pipeline Blueprint</h1>
        <p className={styles.subtitle}>
          This dynamic workspace tracks the progression from initial clarity to custom systems engineering and final content growth.
        </p>
      </header>

      {/* PHASE 1: DIAGNOSE */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <span className={styles.phaseBadge}>Phase 1</span>
          <h2 className={styles.sectionTitle}>Strategy & Clarity Audit</h2>
        </div>
        
        <div className={styles.grid2}>
          <div className={styles.card}>
            <div className={styles.cardTitle}>Business Diagnostic</div>
            <p className={styles.cardSubtitle}>Identify the core bottleneck in your operational workflow.</p>
            
            <div className={styles.formGroup}>
              <label className={styles.label}>Where is your team spending the most repetitive manual time?</label>
              <textarea className={styles.textarea} placeholder="e.g., Manually moving data from Typeform to Notion, and writing custom emails..."></textarea>
            </div>
            
            <div className={styles.formGroup}>
              <label className={styles.label}>Current tech stack</label>
              <input type="text" className={styles.input} placeholder="Notion, Slack, Webflow, Make.com" />
            </div>

            <button className={styles.button}>
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Run AI Workflow Analysis
            </button>
          </div>

          <div className={styles.card}>
            <div className={styles.cardTitle}>AI Readiness Score</div>
            <p className={styles.cardSubtitle}>Based on your infrastructure and clarity.</p>
            
            <div className={styles.scoreCircle}>
              <div className={styles.scoreValue}>42</div>
              <div className={styles.scoreLabel}>Out of 100</div>
            </div>

            <div className={styles.scoreMetrics}>
              <div className={styles.metricRow}>
                <span className={styles.metricLabel}>Data Structure</span>
                <div className={styles.metricBar}><div className={styles.metricFill} style={{width: '60%'}}></div></div>
                <span className={styles.metricValue}>60</span>
              </div>
              <div className={styles.metricRow}>
                <span className={styles.metricLabel}>Process Clarity</span>
                <div className={styles.metricBar}><div className={styles.metricFill} style={{width: '30%'}}></div></div>
                <span className={styles.metricValue}>30</span>
              </div>
              <div className={styles.metricRow}>
                <span className={styles.metricLabel}>Tech Stack</span>
                <div className={styles.metricBar}><div className={styles.metricFill} style={{width: '80%'}}></div></div>
                <span className={styles.metricValue}>80</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PHASE 2: SYSTEMS */}
      <section className={styles.section} style={{ marginTop: '2rem' }}>
        <div className={styles.sectionHeader}>
          <span className={styles.phaseBadge}>Phase 2</span>
          <h2 className={styles.sectionTitle}>Systems Architecture</h2>
        </div>

        <div className={styles.grid3}>
          <div className={styles.card}>
            <div className={styles.cardTitle}>
              Lead Intelligence System
              <span className={`${styles.statusBadge} ${styles.statusActive}`}>Active</span>
            </div>
            <p className={styles.cardSubtitle}>Automatically enriching inbound leads.</p>
            
            <div className={styles.workflowNode}>
              <div className={styles.nodeIcon}>
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                </svg>
              </div>
              <div className={styles.nodeContent}>
                <h4>Trigger: Webhook</h4>
                <p>New form submission</p>
              </div>
            </div>
            
            <div className={styles.workflowNode}>
              <div className={styles.nodeIcon}>
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div className={styles.nodeContent}>
                <h4>LLM Processing</h4>
                <p>Extracts industry and intent</p>
              </div>
            </div>
          </div>

          <div className={styles.card}>
            <div className={styles.cardTitle}>
              Content Repurposing
              <span className={`${styles.statusBadge} ${styles.statusPending}`}>Pending</span>
            </div>
            <p className={styles.cardSubtitle}>Long-form video to LinkedIn posts.</p>
            
            <div className={styles.workflowNode} style={{ opacity: 0.5 }}>
              <div className={styles.nodeIcon}>
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <div className={styles.nodeContent}>
                <h4>YouTube RSS</h4>
                <p>Watches for new uploads</p>
              </div>
            </div>
          </div>
          
          <div className={styles.card} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', borderStyle: 'dashed' }}>
             <div style={{ textAlign: 'center', color: 'var(--text-tertiary)' }}>
               <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ margin: '0 auto 0.5rem', opacity: 0.5 }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
               <p>Propose New System</p>
             </div>
          </div>
        </div>
      </section>

      {/* PHASE 3: CONTENT */}
      <section className={styles.section} style={{ marginTop: '2rem' }}>
        <div className={styles.sectionHeader}>
          <span className={styles.phaseBadge}>Phase 3</span>
          <h2 className={styles.sectionTitle}>Content & Growth Engine</h2>
        </div>
        
        <div className={styles.card}>
          <div className={styles.cardTitle}>Cinematic Content Rollout</div>
          <p className={styles.cardSubtitle}>Tracking the distribution of brand narrative across platforms.</p>
          
          <div style={{ height: '200px', display: 'flex', alignItems: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
             {/* Mock Bar Chart for Content Growth */}
             {[40, 65, 80, 50, 100, 75, 120].map((height, i) => (
                <div key={i} style={{ 
                  flex: 1, 
                  height: `${height}px`, 
                  background: i === 6 ? 'var(--gradient-gold-horizon)' : 'rgba(255,255,255,0.05)',
                  borderRadius: '6px 6px 0 0',
                  position: 'relative'
                }}>
                  {i === 6 && <div style={{ position: 'absolute', top: '-25px', left: '50%', transform: 'translateX(-50%)', fontSize: '12px', color: 'var(--color-burnished-gold)', fontWeight: 'bold' }}>Live</div>}
                </div>
             ))}
          </div>
        </div>
      </section>
    </div>
  );
}
