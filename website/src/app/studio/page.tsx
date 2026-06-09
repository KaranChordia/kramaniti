'use client';

import { useState } from 'react';
import styles from './studio.module.css';
import { ChatbotWidget } from '../../components/studio/ChatbotWidget';

// --- MOCK DATA ENGINE: KRAMANITI METHODOLOGY ---

type SystemNode = { name: string; desc: string; status: 'active' | 'pending' };

interface ClientWorkflow {
  id: string;
  name: string;
  initial: string;
  description: string;
  
  diagnose: { friction: string; };
  define: { operatingLogic: string; };
  design: { architecture: string; };
  build: { systems: SystemNode[]; };
  enable: { adoptionPlan: string; };
  translate: { campaignTitle: string; campaignDesc: string; };
  refine: { optimizationLog: string; };
}

const CLIENTS: ClientWorkflow[] = [
  {
    id: 'nexocean',
    name: 'Nexocean',
    initial: 'N',
    description: 'Recruitment Operations',
    diagnose: {
      friction: "Recruiters are spending up to 4 hours a day manually reading through hundreds of PDF resumes to identify technical requirements. Once found, they write generic emails that don't get replies."
    },
    define: {
      operatingLogic: "Nexocean needs to instantly score unstructured PDF resumes against highly specific technical matrices, and use the exact extracted skills to draft hyper-personalized outreach before human review."
    },
    design: {
      architecture: "Architect the 'Wingman Assistants' suite: A multi-agent orchestration where Atlas (Intake) feeds parsed JSON arrays to Zephyr (Outreach), tracked centrally by Radar."
    },
    build: {
      systems: [
        { name: 'Atlas: Resume Intelligence', desc: 'PDF and text intake, structured ATS-oriented scoring, and recruiter follow-up planning.', status: 'active' },
        { name: 'Zephyr: Outreach Copilot', desc: "Drafting hyper-personalized emails and LinkedIn messages using candidates' specific skills.", status: 'active' },
        { name: 'Radar: Talent Database', desc: 'Candidate filtering, role matching, and AI-driven quality checks across profiles.', status: 'pending' }
      ]
    },
    enable: {
      adoptionPlan: "Deployed custom Chrome Extension 'Wingman UI' directly into recruiters' browser workflows. Provided 1-page cheat sheet for triggering Zephyr sequences."
    },
    translate: {
      campaignTitle: '"Great Hire Begins Here"',
      campaignDesc: "Brand film highlighting Nexocean's new AI-augmented recruiting power, emphasizing human connection supported by invisible technology."
    },
    refine: {
      optimizationLog: "Reduced Zephyr token usage by 14% via prompt restructuring. Adjusted Atlas scoring matrix for senior engineering roles."
    }
  },
  {
    id: 'hyatt',
    name: 'Hyatt Centric',
    initial: 'H',
    description: 'Hospitality Management',
    diagnose: {
      friction: "Front desk staff and event coordinators are manually consolidating guest preferences from multiple inbox streams into spreadsheets, causing delayed personalized experiences."
    },
    define: {
      operatingLogic: "Property operations must centralize all asynchronous communication streams into a single structured guest intelligence profile before check-in."
    },
    design: {
      architecture: "Implement a centralized Guest Intelligence Router to unify incoming email data, triggering automated preference tagging in the local PMS."
    },
    build: {
      systems: [
        { name: 'Concierge AI', desc: 'Automated extraction of dietary and stay preferences from unstructured guest emails.', status: 'active' },
        { name: 'Event Sync', desc: 'Synchronizes B2B event itineraries with operations schedules dynamically.', status: 'pending' }
      ]
    },
    enable: {
      adoptionPlan: "Zero-UI deployment. System runs completely in the background via webhooks, updating existing dashboard tags automatically."
    },
    translate: {
      campaignTitle: '"The Centric Experience"',
      campaignDesc: "A digital showcase of hyper-personalized hospitality powered by seamless backend infrastructure."
    },
    refine: {
      optimizationLog: "Fine-tuned Concierge AI to correctly parse multi-lingual email requests. Expanded Event Sync to capture flight arrival delays."
    }
  }
];

const PHASES = [
  { id: 'clarity', label: 'Clarity' },
  { id: 'build', label: 'Build' },
  { id: 'growth', label: 'Growth' },
];

const SUB_MENUS = {
  clarity: [
    { id: 'diagnose', label: 'Diagnose Reality' },
    { id: 'define', label: 'Define Operating Logic' }
  ],
  build: [
    { id: 'design', label: 'Design the System' },
    { id: 'build', label: 'Build Practical Support' },
    { id: 'enable', label: 'Enable Adoption' }
  ],
  growth: [
    { id: 'translate', label: 'Translate into Presence' },
    { id: 'refine', label: 'Refine Continuously' }
  ]
};

export default function KramanitiStudio() {
  const [activeClientId, setActiveClientId] = useState<string>(CLIENTS[0].id);
  const [activePhaseIndex, setActivePhaseIndex] = useState(0);
  const [activeSubMenuId, setActiveSubMenuId] = useState<string>('diagnose');
  
  // ROLE ARCHITECTURE
  const [userRole, setUserRole] = useState<'admin' | 'client'>('admin');

  // THEME ARCHITECTURE
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  const activeClient = CLIENTS.find(c => c.id === activeClientId) || CLIENTS[0];
  const activePhase = PHASES[activePhaseIndex];
  
  const currentSubMenus = SUB_MENUS[activePhase.id as keyof typeof SUB_MENUS];

  const handlePhaseChange = (idx: number) => {
    setActivePhaseIndex(idx);
    const newPhaseId = PHASES[idx].id as keyof typeof SUB_MENUS;
    setActiveSubMenuId(SUB_MENUS[newPhaseId][0].id);
  };

  const selectClient = (id: string) => {
    setActiveClientId(id);
    handlePhaseChange(0);
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const renderContextualAction = () => {
    if (userRole === 'admin') {
      switch (activePhaseIndex) {
        case 0: return <div className={styles.contextualAction}>Export Audit</div>;
        case 1: return <div className={styles.contextualAction}>Deploy Agents</div>;
        case 2: return <div className={styles.contextualAction}>Publish Assets</div>;
      }
    } else {
      switch (activePhaseIndex) {
        case 0: return <div className={styles.contextualAction}>View Blueprint</div>;
        case 1: return <div className={styles.contextualAction}>System Status</div>;
        case 2: return <div className={styles.contextualAction}>Share Link</div>;
      }
    }
    return null;
  };

  return (
    <div className={styles.layoutContainer} data-theme={theme}>
      
      {/* Floating Pill Navigation */}
      <div className={styles.floatingNavContainer}>
        <nav className={styles.floatingPill}>
          <div className={styles.pillLeft}>
            <div className={styles.brandName}>
              Kramaniti <span className={styles.studioBadge}>Studio</span>
            </div>
            
            <div className={styles.roleSwitcher}>
              <div 
                className={`${styles.roleOption} ${userRole === 'admin' ? styles.activeRole : ''}`}
                onClick={() => setUserRole('admin')}
              >
                Admin
              </div>
              <div 
                className={`${styles.roleOption} ${userRole === 'client' ? styles.activeRole : ''}`}
                onClick={() => setUserRole('client')}
              >
                Client
              </div>
            </div>

            {/* THEME TOGGLE */}
            <div className={styles.themeToggle} onClick={toggleTheme} title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}>
              {theme === 'dark' ? (
                // Sun Icon for Dark Mode (click to go light)
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                // Moon Icon for Light Mode (click to go dark)
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </div>

            <div className={styles.progressContainer}>
              {PHASES.map((_, idx) => (
                <div 
                  key={idx} 
                  className={`${styles.progressSegment} ${idx < activePhaseIndex ? styles.completed : ''} ${idx === activePhaseIndex ? styles.active : ''}`} 
                />
              ))}
            </div>
          </div>

          <div className={styles.pillCenter}>
            {PHASES.map((phase, idx) => (
              <div key={phase.id} className={styles.navItemContainer}>
                <div 
                  className={`${styles.navItem} ${idx === activePhaseIndex ? styles.active : ''}`}
                  onClick={() => handlePhaseChange(idx)}
                >
                  {phase.label}
                </div>
              </div>
            ))}
          </div>

          <div className={styles.pillRight}>
            {renderContextualAction()}
            
            <div className={styles.clientLogoContainer}>
              <div className={styles.clientLogo} title={activeClient.name}>
                {activeClient.initial}
              </div>
              
              <div className={styles.clientSwitcher}>
                <div style={{ padding: '0.5rem 1rem', fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-tertiary)', letterSpacing: '0.1em', fontWeight: 600 }}>
                  Switch Workspace
                </div>
                {CLIENTS.map(client => (
                  <div 
                    key={client.id} 
                    className={`${styles.clientOption} ${client.id === activeClientId ? styles.activeClient : ''}`}
                    onClick={() => selectClient(client.id)}
                  >
                    <div className={styles.miniLogo}>{client.initial}</div>
                    {client.name}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </nav>
      </div>

      <div className={styles.workspaceGrid}>
        
        {/* FLOATING Contextual Sub-Navigation Sidebar */}
        <aside className={styles.contextSidebar}>
          <div className={styles.sidebarHeader}>
            {activePhase.label} Workflow
          </div>
          <div className={styles.sidebarMenu}>
            {currentSubMenus.map(menu => (
              <div 
                key={menu.id} 
                className={`${styles.sidebarItem} ${activeSubMenuId === menu.id ? styles.activeSubMenu : ''}`}
                onClick={() => setActiveSubMenuId(menu.id)}
              >
                <svg className={styles.sidebarItemIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="3" />
                </svg>
                {menu.label}
              </div>
            ))}
          </div>
        </aside>

        {/* Main Content Workspace */}
        <main className={styles.mainContent}>
          <div className={styles.pageContainer}>
            <div className={styles.contentWrapper} key={`${activeClientId}-${activeSubMenuId}-${userRole}`}>
              
              {/* --- CLARITY PHASE --- */}
              {activeSubMenuId === 'diagnose' && (
                <>
                  <header className={styles.header}>
                    <h1 className={styles.title}>Diagnose <strong>Reality</strong></h1>
                    <p className={styles.subtitle}>
                      Identify the workflow, handoff, decision loop, or message gap creating the most friction for {activeClient.name}.
                    </p>
                  </header>
                  <div className={styles.card}>
                    {userRole === 'admin' && <div className={styles.adminOverlayBadge}>Audit Active</div>}
                    <div className={styles.cardGlow} />
                    <div className={styles.cardTitle}>Operational Friction</div>
                    <div className={styles.formGroup}>
                      {userRole === 'admin' ? (
                        <textarea className={styles.textarea} defaultValue={activeClient.diagnose.friction} />
                      ) : (
                        <div className={styles.readOnlyText}>{activeClient.diagnose.friction}</div>
                      )}
                    </div>
                  </div>
                </>
              )}

              {activeSubMenuId === 'define' && (
                <>
                  <header className={styles.header}>
                    <h1 className={styles.title}>Define <strong>Operating Logic</strong></h1>
                    <p className={styles.subtitle}>
                      Clarify what the business needs to do consistently before choosing tools or formats.
                    </p>
                  </header>
                  <div className={styles.card}>
                    {userRole === 'admin' && <div className={styles.adminOverlayBadge}>Logic Editor</div>}
                    <div className={styles.cardGlow} />
                    <div className={styles.cardTitle}>First Principles Alignment</div>
                    <div className={styles.formGroup}>
                      {userRole === 'admin' ? (
                        <>
                          <textarea className={styles.textarea} defaultValue={activeClient.define.operatingLogic} />
                          <button className={styles.inlineBuilderAction}>
                            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                            Synthesize Logic from Friction
                          </button>
                        </>
                      ) : (
                        <div className={styles.readOnlyHighlight}>{activeClient.define.operatingLogic}</div>
                      )}
                    </div>
                  </div>
                </>
              )}

              {/* --- BUILD PHASE --- */}
              {activeSubMenuId === 'design' && (
                <>
                  <header className={styles.header}>
                    <h1 className={styles.title}>Design the <strong>System</strong></h1>
                    <p className={styles.subtitle}>
                      Map the simplest workflow, intelligence layer, and supporting process.
                    </p>
                  </header>
                  <div className={styles.card}>
                    {userRole === 'admin' && <div className={styles.adminOverlayBadge}>Blueprint Draft</div>}
                    <div className={styles.cardGlow} />
                    <div className={styles.cardTitle}>System Architecture Blueprint</div>
                    <div className={styles.formGroup}>
                      {userRole === 'admin' ? (
                        <textarea className={styles.textarea} defaultValue={activeClient.design.architecture} />
                      ) : (
                        <div className={styles.readOnlyText}>{activeClient.design.architecture}</div>
                      )}
                    </div>
                  </div>
                </>
              )}

              {activeSubMenuId === 'build' && (
                <>
                  <header className={styles.header}>
                    <h1 className={styles.title}>Build <strong>Practical Support</strong></h1>
                    <p className={styles.subtitle}>
                      Create the AI-assisted tools, documents, or internal systems that make the workflow easier to run.
                    </p>
                  </header>
                  <div className={styles.systemGrid}>
                    {activeClient.build.systems.map((system, i) => (
                      <div key={i} className={styles.systemCard}>
                        <div className={styles.systemIcon}>
                          <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <h3>{system.name}</h3>
                        <p>{system.desc}</p>
                        <div className={`${styles.systemStatus} ${system.status === 'pending' ? styles.pending : ''}`}>
                          {system.status === 'active' ? <><div className={styles.dot} /> Fully Integrated</> : 'Deploying...'}
                        </div>

                        {userRole === 'admin' && (
                          <div className={styles.adminSystemActions}>
                            <button className={styles.adminSystemBtn}>Configure Node</button>
                            <button className={styles.adminSystemBtn}>Edit Prompt</button>
                          </div>
                        )}
                      </div>
                    ))}

                    {userRole === 'admin' && (
                      <div className={styles.addSystemCard}>
                        <div className={styles.addIcon}>
                          <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                        </div>
                        <span style={{ fontWeight: 600 }}>Create New Tool</span>
                        <span style={{ fontSize: '12px', marginTop: '0.5rem', opacity: 0.7 }}>Add to infrastructure</span>
                      </div>
                    )}
                  </div>
                </>
              )}

              {activeSubMenuId === 'enable' && (
                <>
                  <header className={styles.header}>
                    <h1 className={styles.title}>Enable <strong>Adoption</strong></h1>
                    <p className={styles.subtitle}>
                      Document usage, edge cases, roles, and handoffs so the system becomes part of daily work.
                    </p>
                  </header>
                  <div className={styles.card}>
                    {userRole === 'admin' && <div className={styles.adminOverlayBadge}>Docs Editor</div>}
                    <div className={styles.cardGlow} />
                    <div className={styles.cardTitle}>Integration & Handoff</div>
                    <div className={styles.formGroup}>
                      {userRole === 'admin' ? (
                        <textarea className={styles.textarea} defaultValue={activeClient.enable.adoptionPlan} />
                      ) : (
                        <div className={styles.readOnlyText}>{activeClient.enable.adoptionPlan}</div>
                      )}
                    </div>
                  </div>
                </>
              )}

              {/* --- GROWTH PHASE --- */}
              {activeSubMenuId === 'translate' && (
                <>
                  <header className={styles.header}>
                    <h1 className={styles.title}>Translate into <strong>Presence</strong></h1>
                    <p className={styles.subtitle}>
                      Turn internal clarity into sharper brand communication and useful content.
                    </p>
                  </header>
                  <div className={styles.card}>
                    {userRole === 'admin' && <div className={styles.adminOverlayBadge}>Campaign Editor</div>}
                    <div className={styles.cardGlow} />
                    
                    {userRole === 'admin' ? (
                      <input className={styles.input} defaultValue={activeClient.translate.campaignTitle} style={{ fontSize: '24px', fontWeight: 600, marginBottom: '0.75rem' }} />
                    ) : (
                      <div className={styles.cardTitle}>{activeClient.translate.campaignTitle}</div>
                    )}

                    {userRole === 'admin' ? (
                      <textarea className={styles.textarea} defaultValue={activeClient.translate.campaignDesc} style={{ minHeight: '80px', marginBottom: '2rem' }} />
                    ) : (
                      <p className={styles.cardSubtitle}>{activeClient.translate.campaignDesc}</p>
                    )}
                    
                    <div className={styles.videoPlaceholder}>
                      <div className={styles.playButton}>
                        <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                      <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                        Cinematic Rollout Active
                      </span>

                      {userRole === 'admin' && (
                        <div className={styles.adminUploadOverlay}>
                          <button className={styles.primaryButton} style={{ background: 'var(--color-success)', color: '#fff' }}>
                            Upload Asset
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}

              {activeSubMenuId === 'refine' && (
                <>
                  <header className={styles.header}>
                    <h1 className={styles.title}>Refine <strong>Continuously</strong></h1>
                    <p className={styles.subtitle}>
                      Review what is working, remove complexity, and keep the system aligned as the brand evolves.
                    </p>
                  </header>
                  <div className={styles.card}>
                    {userRole === 'admin' && <div className={styles.adminOverlayBadge}>Alignment Retainer</div>}
                    <div className={styles.cardGlow} />
                    <div className={styles.cardTitle}>Optimization Logs</div>
                    <div className={styles.formGroup}>
                      {userRole === 'admin' ? (
                        <>
                          <textarea className={styles.textarea} defaultValue={activeClient.refine.optimizationLog} />
                          <button className={styles.inlineBuilderAction}>
                            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Log New Optimization
                          </button>
                        </>
                      ) : (
                        <div className={styles.readOnlyText}>{activeClient.refine.optimizationLog}</div>
                      )}
                    </div>
                  </div>
                </>
              )}

            </div>
          </div>
        </main>

      </div>
      
      {/* AI Intelligence Copilot */}
      <ChatbotWidget />
      
    </div>
  );
}
