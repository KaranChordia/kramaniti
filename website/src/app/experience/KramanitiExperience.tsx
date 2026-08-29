'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowDown, ArrowRight, Check, CornerDownRight, X } from 'lucide-react';
import { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import { getSignalLabel, type SignalState } from '../../lib/signalProtocol';
import styles from './Experience.module.css';

type SectionId = 'threshold' | 'services' | 'insights' | 'audit';

const services = [
  {
    coordinate: '01',
    title: 'Foundation Strategy',
    outcome: 'Understand the work before building.',
    description:
      'Find the real bottleneck, decide what matters most, and choose a clear first step.',
  },
  {
    coordinate: '02',
    title: 'Systems Engineering',
    outcome: 'Build practical support around the work.',
    description:
      'Turn the chosen workflow into useful tools, clear handoffs, review points, and simple instructions.',
  },
  {
    coordinate: '03',
    title: 'Complete Lifecycle Retainer',
    outcome: 'Keep the system and communication improving.',
    description:
      'Keep the work, AI support, team adoption, and communication moving together while people stay in control.',
  },
] as const;

const insightSignals = [
  {
    coordinate: '03.01',
    label: 'Question infrastructure',
    title: 'Capture the Question Before Building the Answer',
    slug: 'capture-the-question-before-building-the-answer',
    summary:
      'Turn repeated questions and scattered intake into scoped system work before choosing the tool.',
  },
  {
    coordinate: '03.02',
    label: 'Audit decisions',
    title: 'A Workflow Map Is Not Yet a Build Decision',
    slug: 'a-workflow-map-is-not-yet-a-build-decision',
    summary:
      'Move from a visible workflow to a named constraint, owner, boundary, and success signal.',
  },
  {
    coordinate: '03.03',
    label: 'Human review',
    title: 'Founder Review Should Be Conditional, Not Constant',
    slug: 'founder-review-should-be-conditional-not-constant',
    summary:
      'Design review around conditions that change the outcome, rather than keeping the founder inside every step.',
  },
] as const;

const sectionNames: Record<SectionId, string> = {
  threshold: 'Signal corridor',
  services: 'Services',
  insights: 'Insights',
  audit: 'Next step',
};

export function KramanitiExperience() {
  const [name, setName] = useState('');
  const [intent, setIntent] = useState('');
  const [journeyStarted, setJourneyStarted] = useState(false);
  const [thresholdState, setThresholdState] = useState<SignalState>('dormant');
  const [activeSection, setActiveSection] = useState<SectionId>('threshold');
  const [activeService, setActiveService] = useState(0);
  const [handoffService, setHandoffService] = useState<number | null>(null);
  const [activeInsight, setActiveInsight] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const experienceRef = useRef<HTMLElement>(null);
  const serviceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const thresholdTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const serviceUnlockTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const insightUnlockTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scrollFrame = useRef<number | null>(null);
  const scrollServiceStage = useRef(0);
  const scrollInsightStage = useRef(0);
  const manualServiceLock = useRef(false);
  const manualInsightLock = useRef(false);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updatePreference = () => setPrefersReducedMotion(media.matches);
    updatePreference();
    media.addEventListener('change', updatePreference);
    return () => media.removeEventListener('change', updatePreference);
  }, []);

  useEffect(() => {
    if (!journeyStarted) return;

    const root = experienceRef.current;
    if (!root) return;

    const clamp = (value: number) => Math.min(1, Math.max(0, value));
    const getSectionProgress = (section: HTMLElement, headerOffset: number) => {
      const rect = section.getBoundingClientRect();
      const travel = Math.max(1, rect.height - (window.innerHeight - headerOffset));
      return clamp((headerOffset - rect.top) / travel);
    };

    const updateScrollSignals = () => {
      scrollFrame.current = null;
      const headerOffset = window.innerWidth <= 820 ? 68 : 76;
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const pageProgress = clamp(window.scrollY / maxScroll);
      root.style.setProperty('--rail-progress', `${pageProgress * 100}%`);
      const rootRect = root.getBoundingClientRect();
      const railHeight = Math.max(1, root.scrollHeight - headerOffset - 94);
      const travelerPosition = headerOffset + pageProgress * railHeight;

      const sections = Array.from(
        root.querySelectorAll<HTMLElement>('[data-experience-section]')
      );
      const viewportFocus = headerOffset + (window.innerHeight - headerOffset) * 0.46;
      const focusedSection = sections
        .map((section) => {
          const rect = section.getBoundingClientRect();
          return {
            section,
            rect,
            distance: Math.abs((rect.top + rect.bottom) / 2 - viewportFocus),
          };
        })
        .filter(({ rect }) => rect.bottom > headerOffset && rect.top < window.innerHeight)
        .sort((a, b) => a.distance - b.distance)[0];

      if (focusedSection) {
        setActiveSection(
          focusedSection.section.dataset.experienceSection as SectionId
        );
      }

      sections.forEach((section) => {
        const sectionRect = section.getBoundingClientRect();
        const sectionTop = sectionRect.top - rootRect.top;
        const sectionBottom = sectionTop + sectionRect.height;
        const localProgress = getSectionProgress(section, headerOffset);
        const signalProgress = clamp(
          (travelerPosition - sectionTop) / Math.max(1, sectionRect.height)
        );
        const distanceFromSection = travelerPosition < sectionTop
          ? sectionTop - travelerPosition
          : travelerPosition > sectionBottom
            ? travelerPosition - sectionBottom
            : 0;
        const centeredness = clamp(1 - Math.abs(signalProgress - 0.5) * 2);
        const proximity = distanceFromSection === 0
          ? 0.5 + Math.pow(centeredness, 0.74) * 0.5
          : clamp(1 - distanceFromSection / Math.max(1, sectionRect.height * 0.34)) * 0.38;
        const focusStrength = Math.pow(proximity, 0.72);

        section.style.setProperty('--section-progress', localProgress.toFixed(3));
        section.style.setProperty('--signal-progress', signalProgress.toFixed(3));
        section.style.setProperty('--section-focus', focusStrength.toFixed(3));
        section.style.setProperty('--section-opacity', `${0.3 + focusStrength * 0.7}`);
        section.style.setProperty('--section-brightness', `${0.48 + focusStrength * 0.76}`);
        section.style.setProperty('--section-saturation', `${0.66 + focusStrength * 0.48}`);
        section.style.setProperty('--section-glow-radius', `${44 + focusStrength * 20}%`);
        section.style.setProperty(
          '--section-glow-color',
          `rgba(201, 168, 76, ${0.004 + focusStrength * 0.17})`
        );
        section.dataset.signalPhase = travelerPosition < sectionTop
          ? 'before'
          : travelerPosition > sectionBottom
            ? 'after'
            : 'active';

        if (section.id === 'services') {
          section.style.setProperty('--orbit-tilt', `${66 - localProgress * 6}deg`);
          section.style.setProperty('--orbit-rotation', `${-5 + localProgress * 10}deg`);
        }
        if (section.id === 'audit') {
          section.style.setProperty('--ring-scale', `${0.88 + localProgress * 0.18}`);
        }
      });

      const servicesSection = document.getElementById('services');
      if (servicesSection && !manualServiceLock.current) {
        const rect = servicesSection.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.72 && rect.bottom > headerOffset) {
          const progress = getSectionProgress(servicesSection, headerOffset);
          const nextStage = Math.min(services.length - 1, Math.floor(progress * services.length));
          if (nextStage !== scrollServiceStage.current) {
            scrollServiceStage.current = nextStage;
            setHandoffService(nextStage);
            if (serviceTimer.current) clearTimeout(serviceTimer.current);
            serviceTimer.current = setTimeout(
              () => {
                setActiveService(nextStage);
                setHandoffService(null);
              },
              prefersReducedMotion ? 0 : 360
            );
          }
        }
      }

      const insightsSection = document.getElementById('insights');
      if (insightsSection && !manualInsightLock.current) {
        const rect = insightsSection.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.72 && rect.bottom > headerOffset) {
          const progress = getSectionProgress(insightsSection, headerOffset);
          const nextStage = Math.min(
            insightSignals.length - 1,
            Math.floor(progress * insightSignals.length)
          );
          if (nextStage !== scrollInsightStage.current) {
            scrollInsightStage.current = nextStage;
            setActiveInsight(nextStage);
          }
        }
      }
    };

    const queueScrollUpdate = () => {
      if (scrollFrame.current !== null) return;
      scrollFrame.current = window.requestAnimationFrame(updateScrollSignals);
    };

    updateScrollSignals();
    window.addEventListener('scroll', queueScrollUpdate, { passive: true });
    window.addEventListener('resize', queueScrollUpdate);

    return () => {
      window.removeEventListener('scroll', queueScrollUpdate);
      window.removeEventListener('resize', queueScrollUpdate);
      if (scrollFrame.current !== null) window.cancelAnimationFrame(scrollFrame.current);
    };
  }, [journeyStarted, prefersReducedMotion]);

  useEffect(() => {
    return () => {
      if (serviceTimer.current) clearTimeout(serviceTimer.current);
      if (thresholdTimer.current) clearTimeout(thresholdTimer.current);
      if (serviceUnlockTimer.current) clearTimeout(serviceUnlockTimer.current);
      if (insightUnlockTimer.current) clearTimeout(insightUnlockTimer.current);
    };
  }, []);

  const visitorContext = useMemo(() => {
    if (!name.trim() && !intent.trim()) return 'A clearer operating path';
    if (name.trim() && intent.trim()) return `${name.trim()} · ${intent.trim()}`;
    return name.trim() || intent.trim();
  }, [intent, name]);

  const moveTo = (id: SectionId) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
      block: 'start',
    });
  };

  const beginJourney = (event?: FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    setJourneyStarted(true);
    setThresholdState('input');

    if (thresholdTimer.current) clearTimeout(thresholdTimer.current);
    thresholdTimer.current = setTimeout(
      () => {
        setThresholdState('handoff');
        moveTo('services');
        thresholdTimer.current = setTimeout(
          () => setThresholdState('complete'),
          prefersReducedMotion ? 0 : 720
        );
      },
      prefersReducedMotion ? 0 : 680
    );
  };

  const activateService = (index: number) => {
    manualServiceLock.current = true;
    if (serviceUnlockTimer.current) clearTimeout(serviceUnlockTimer.current);
    serviceUnlockTimer.current = setTimeout(() => {
      manualServiceLock.current = false;
    }, 2200);
    scrollServiceStage.current = index;
    if (index === activeService || handoffService === index) return;
    setHandoffService(index);
    if (serviceTimer.current) clearTimeout(serviceTimer.current);
    serviceTimer.current = setTimeout(
      () => {
        setActiveService(index);
        setHandoffService(null);
      },
      prefersReducedMotion ? 0 : 420
    );
  };

  const activateInsight = (index: number) => {
    manualInsightLock.current = true;
    if (insightUnlockTimer.current) clearTimeout(insightUnlockTimer.current);
    insightUnlockTimer.current = setTimeout(() => {
      manualInsightLock.current = false;
    }, 2200);
    scrollInsightStage.current = index;
    setActiveInsight(index);
  };

  return (
    <main
      ref={experienceRef}
      className={styles.experience}
      data-entered={journeyStarted ? 'true' : 'false'}
      data-active-section={activeSection}
      data-disable-global-shockwave="true"
    >
      <p className={styles.srOnly} aria-live="polite">
        Signal focus: {sectionNames[activeSection]}.
      </p>
      <header className={styles.experienceHeader}>
        <Link href="/" className={styles.brandLink} aria-label="Kramaniti home">
          <Image
            src="/assets/brand/kramaniti-mark-gold.png"
            width={48}
            height={48}
            alt="Kramaniti"
            priority
          />
          <span>
            <strong>Kramaniti</strong>
            <small>AI systems partner</small>
          </span>
        </Link>

        {journeyStarted ? (
          <nav className={styles.chapterNav} aria-label="Experience chapters">
            <button type="button" onClick={() => moveTo('services')} aria-current={activeSection === 'services' ? 'step' : undefined}>
              Services
            </button>
            <button type="button" onClick={() => moveTo('insights')} aria-current={activeSection === 'insights' ? 'step' : undefined}>
              Insights
            </button>
          </nav>
        ) : null}

        <Link href="/" className={styles.exitLink}>
          <span>Return to Kramaniti</span>
          <X size={16} aria-hidden="true" />
        </Link>
      </header>

      {journeyStarted ? (
        <div className={styles.journeyRail} aria-hidden="true">
          <span className={styles.railBase} />
          <span className={styles.railProgress} />
          <span className={styles.railTraveler}>
            <small>{sectionNames[activeSection]}</small>
          </span>
        </div>
      ) : null}

      <section
        id="threshold"
        className={styles.threshold}
        data-experience-section="threshold"
        data-section-active={activeSection === 'threshold' ? 'true' : 'false'}
        aria-labelledby="experience-title"
      >
        <span className={styles.atmosphericWord} aria-hidden="true">Clarity</span>
        <div className={styles.corridor} aria-hidden="true">
          <span className={styles.corridorPlane} />
          <span className={styles.corridorPlane} />
          <span className={styles.corridorPlane} />
          <span className={styles.corridorPlane} />
        </div>

        <div className={styles.thresholdGrid}>
          <div className={styles.thresholdCopy}>
            <div className={styles.coordinate}><span>01</span> Signal corridor</div>
            <h1 id="experience-title">Follow the work from problem to system.</h1>
            <p className={styles.modeNote}>A guided view. Nothing is saved.</p>

            <form className={styles.entryForm} onSubmit={beginJourney}>
              <label>
                <span>Your name <small>Optional</small></span>
                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  onFocus={() => setThresholdState('focus')}
                  onBlur={() => setThresholdState('dormant')}
                  autoComplete="name"
                />
              </label>
              <label>
                <span>What feels harder than it should?</span>
                <input
                  value={intent}
                  onChange={(event) => setIntent(event.target.value)}
                  onFocus={() => setThresholdState('focus')}
                  onBlur={() => setThresholdState('dormant')}
                  placeholder="A workflow, handoff, follow-up, or decision"
                />
              </label>

              <button type="submit" className={styles.primaryAction}>
                <span>Start the journey</span>
                <ArrowRight size={18} aria-hidden="true" />
              </button>

              <button type="button" className={styles.textAction} onClick={() => beginJourney()}>
                Explore without adding context
              </button>
            </form>
          </div>

          <div className={styles.portalStage} data-state={thresholdState}>
            <div className={styles.portalDoor}>
              <Image
                src="/assets/brand/kramaniti-mark-gold.png"
                width={92}
                height={92}
                alt=""
                aria-hidden="true"
              />
            </div>
            <span className={styles.thresholdRail} />
            <div className={styles.thresholdSignal}>
              <span className={styles.semanticNode} />
              <span className={styles.stateAnnotation}>{getSignalLabel(thresholdState)}</span>
            </div>
            <div className={styles.signalLegend} aria-label="Signal state key">
              <span data-state="dormant"><i />Dormant</span>
              <span data-state="focus"><i />In focus</span>
              <span data-state="complete"><i />Complete</span>
            </div>
          </div>
        </div>

        {journeyStarted ? (
          <button type="button" className={styles.continueCue} onClick={() => moveTo('services')}>
            <span>See the next step</span>
            <ArrowDown size={16} aria-hidden="true" />
          </button>
        ) : null}
      </section>

      {journeyStarted ? (
        <>
          <section
            id="services"
            className={styles.services}
            data-experience-section="services"
            data-section-active={activeSection === 'services' ? 'true' : 'false'}
            aria-labelledby="services-title"
          >
            <span className={`${styles.atmosphericWord} ${styles.wordBuild}`} aria-hidden="true">Build</span>
            <div className={styles.sectionFrame}>
              <div className={styles.sectionIntro}>
                <div className={styles.coordinate}><span>02</span> Services</div>
                <h2 id="services-title">Three ways to make the work clearer.</h2>
                <p>
                  Start with a clear plan, build practical support, or keep the whole system improving over time.
                </p>
                <div className={styles.visitorReadout}>
                  <span>Current context</span>
                  <strong>{visitorContext}</strong>
                </div>
              </div>

              <div className={styles.serviceArchitecture}>
                <div className={styles.orbitField} aria-hidden="true">
                  {services.map((service, index) => {
                    const state: SignalState = handoffService === index
                      ? 'handoff'
                      : index === activeService
                        ? 'focus'
                        : index < activeService
                          ? 'complete'
                          : 'dormant';
                    return (
                      <span
                        key={service.title}
                        className={styles.orbit}
                        data-state={state}
                        style={{ '--orbit-index': index } as React.CSSProperties}
                      />
                    );
                  })}
                  <span className={styles.orbitCore} data-state={handoffService !== null ? 'handoff' : 'focus'} />
                </div>

                <div className={styles.serviceSequence}>
                  {services.map((service, index) => {
                    const state: SignalState = handoffService === index
                      ? 'handoff'
                      : index === activeService
                        ? 'focus'
                        : index < activeService
                          ? 'complete'
                          : 'dormant';
                    return (
                      <button
                        type="button"
                        className={styles.serviceStep}
                        data-state={state}
                        aria-pressed={index === activeService}
                        onClick={() => activateService(index)}
                        onFocus={() => activateService(index)}
                        onPointerEnter={() => activateService(index)}
                        key={service.title}
                      >
                        <span className={styles.serviceNode} aria-hidden="true">
                          {state === 'complete' ? <Check size={13} /> : null}
                        </span>
                        <span className={styles.serviceContent}>
                          <small>{service.coordinate} · {getSignalLabel(state)}</small>
                          <strong>{service.title}</strong>
                          <em>{service.outcome}</em>
                          <span>{service.description}</span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>

          <section
            id="insights"
            className={styles.insights}
            data-experience-section="insights"
            data-section-active={activeSection === 'insights' ? 'true' : 'false'}
            aria-labelledby="insights-title"
          >
            <span className={`${styles.atmosphericWord} ${styles.wordSignal}`} aria-hidden="true">Signal</span>
            <div className={styles.sectionFrame}>
              <div className={styles.sectionIntro}>
                <div className={styles.coordinate}><span>03</span> Insights</div>
                <h2 id="insights-title">Ideas grounded in real work.</h2>
                <p>
                  Practical notes on where work breaks, what to build, and how to keep people in control.
                </p>
                <Link href="/insights" className={styles.inlineLink}>
                  Read all insights <ArrowRight size={16} aria-hidden="true" />
                </Link>
              </div>

              <div className={styles.insightSystem}>
                <div
                  className={styles.evidenceRelay}
                  aria-label="Insight evidence thresholds"
                  style={{ '--evidence-progress': `${23 + activeInsight * 27}%` } as React.CSSProperties}
                >
                  <span className={styles.evidenceRail} aria-hidden="true" />
                  <span className={styles.evidenceRailProgress} aria-hidden="true" />

                  {insightSignals.map((insight, index) => {
                    const state: SignalState = index === activeInsight
                      ? 'focus'
                      : index < activeInsight
                        ? 'complete'
                        : 'dormant';

                    return (
                      <button
                        type="button"
                        key={insight.slug}
                        className={styles.evidenceStage}
                        data-state={state}
                        style={{ '--evidence-stage-position': `${23 + index * 27}%` } as React.CSSProperties}
                        aria-label={`Focus insight: ${insight.title}`}
                        aria-pressed={index === activeInsight}
                        onClick={() => activateInsight(index)}
                        onFocus={() => activateInsight(index)}
                        onPointerEnter={() => activateInsight(index)}
                      >
                        <span className={styles.evidenceStageLabel}>
                          <small>{insight.coordinate}</small>
                          <strong>Evidence threshold</strong>
                          <em>{getSignalLabel(state)}</em>
                        </span>
                        <span className={styles.evidenceStageNode} aria-hidden="true">
                          {state === 'complete' ? <Check size={12} /> : null}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <article
                  key={insightSignals[activeInsight].slug}
                  className={styles.focusedInsight}
                  aria-live="polite"
                >
                  <span>{insightSignals[activeInsight].label}</span>
                  <h3>{insightSignals[activeInsight].title}</h3>
                  <p>{insightSignals[activeInsight].summary}</p>
                  <Link href={`/insights/${insightSignals[activeInsight].slug}`}>
                    Read the article <ArrowRight size={17} aria-hidden="true" />
                  </Link>
                </article>
              </div>
            </div>
          </section>

          <section
            id="audit"
            className={styles.audit}
            data-experience-section="audit"
            data-section-active={activeSection === 'audit' ? 'true' : 'false'}
            aria-labelledby="audit-title"
          >
            <div className={styles.auditSignal} aria-hidden="true">
              <span className={styles.auditRail} />
              <span className={styles.auditNode} />
              <span className={styles.auditRings} />
            </div>
            <div className={styles.auditCopy}>
              <div className={styles.coordinate}><span>Next step</span> Complete</div>
              <h2 id="audit-title">Start with the workflow that matters most.</h2>
            </div>
            <div className={styles.auditAction}>
              <p>
                We will look at how the work happens now, where it gets stuck, and what would make a useful first change.
              </p>
              <Link href="/#contact" className={styles.primaryAction}>
                <span>Start with a workflow audit</span>
                <CornerDownRight size={18} aria-hidden="true" />
              </Link>
            </div>
          </section>

          <footer className={styles.experienceFooter}>
            <span>Kramaniti · Logic in sequence</span>
            <Link href="/">Back to the main website</Link>
          </footer>
        </>
      ) : null}
    </main>
  );
}
