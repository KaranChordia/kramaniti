'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import styles from './KoshPreview.module.css';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';
import { AnimatedHeading } from '../ui/AnimatedHeading';

const KOSH_SHELF = [
  { type: 'Agent', title: 'Research & synthesis' },
  { type: 'Skill', title: 'Workflow diagnostic' },
  { type: 'Plugin guide', title: 'Evaluate before connecting' },
  { type: 'Governance', title: 'Human review gate' },
];

const ECOSYSTEM_SURFACES = [
  {
    code: '[01/DIAGNOSE]',
    name: 'Clarity Engine',
    role: 'Interactive workflow diagnostic',
    copy: 'Turns scattered operational friction into a structured six-part workflow brief before any tool or build is chosen.',
    href: '/clarity-engine',
    cta: 'Open Clarity Engine',
  },
  {
    code: '[02/STANDARDIZE]',
    name: 'Kramaniti Kosh',
    role: 'Context-adaptable AI library',
    copy: '25+ governed starter patterns across agents, skills, plugin evaluations, and human review gates—adaptable to your private operating context.',
    href: '/kosh',
    cta: 'Explore Kosh',
  },
  {
    code: '[03/OPERATE]',
    name: 'Kramaniti Spasht',
    role: 'Founder & builder clarity workspace',
    copy: 'Ongoing workspace combining structured project instructions, five guided operating loops, task execution, and persistent context memory.',
    href: '/spasht/',
    cta: 'Enter Spasht',
  },
  {
    code: '[04/TRANSFORM]',
    name: 'Systems & Lifecycle Partner',
    role: 'Strategy, systems and story',
    copy: 'High-touch workflow audits, custom internal AI tools, and cinematic brand story that uncover the next generation of repeatable patterns.',
    href: '#services',
    cta: 'View Service Architecture',
  },
];

export function KoshPreview() {
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.12 });

  return (
    <section className={styles.kosh} id="kosh" ref={ref as React.RefObject<HTMLDivElement>}>
      <div className={styles.container}>
        <div className={styles.content}>
          <span className="micro-label">The Kramaniti Ecosystem · Products &amp; Systems</span>
          <AnimatedHeading isVisible={isVisible}>
            Where bespoke workflow engineering compounds into usable software.
          </AnimatedHeading>
          <p className="text-secondary">
            Kramaniti pairs high-conviction workflow and AI systems consulting with proprietary product surfaces. Real operational bottlenecks uncovered in client work are codified into governed tools—so founders and teams can diagnose friction, adapt proven patterns in <strong>Kosh</strong>, and run ongoing clarity loops in <strong>Spasht</strong>.
          </p>
          <div className={styles.primaryActions}>
            <Link href="/kosh" className={styles.link}>
              Explore Kosh
              <ArrowRight size={17} strokeWidth={1.8} aria-hidden="true" />
            </Link>
            <Link href="/spasht/" className={styles.secondaryLink}>
              Open Spasht Workspace
              <ArrowRight size={17} strokeWidth={1.8} aria-hidden="true" />
            </Link>
          </div>
        </div>

        <div className={styles.libraryObject} aria-label="A preview of the Kramaniti Kosh library">
          <div className={styles.objectHeader}>
            <span>Kramaniti Kosh</span>
            <span>Working library · 25+ patterns</span>
          </div>
          <div className={styles.shelf}>
            {KOSH_SHELF.map((item, index) => (
              <div className={styles.shelfItem} key={item.type}>
                <span className={styles.index}>0{index + 1}</span>
                <span className={styles.itemTitle}>{item.title}</span>
                <span className={styles.itemType}>{item.type}</span>
              </div>
            ))}
          </div>
          <p className={styles.objectNote}>Built to be useful before it is impressive.</p>
        </div>
      </div>

      <div className={styles.flywheelContainer}>
        <div className={styles.flywheelHeader}>
          <span className="micro-label">Services-to-Software Flywheel</span>
          <p className={styles.flywheelLead}>
            One connected architecture from first workflow diagnosis to daily operating memory.
          </p>
        </div>

        <ul className={styles.ecosystemGrid} role="list" aria-label="Kramaniti product and service ecosystem">
          {ECOSYSTEM_SURFACES.map((surface) => (
            <li key={surface.name} className={styles.ecosystemCard}>
              <div className={styles.cardTop}>
                <span className={styles.cardCode}>{surface.code}</span>
                <span className={styles.cardRole}>{surface.role}</span>
              </div>
              <h3>{surface.name}</h3>
              <p>{surface.copy}</p>
              <Link href={surface.href} className={styles.cardLink}>
                <span>{surface.cta}</span>
                <ArrowRight size={15} strokeWidth={1.8} aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>

        <div className={styles.moatBanner} aria-label="Structured context and governance moat">
          <div className={styles.moatCopy}>
            <span className="micro-label">The Context &amp; Governance Moat</span>
            <h4>Why Kramaniti systems compound instead of commoditizing</h4>
            <p className="text-secondary caption">
              Generic AI wrappers fail in daily operations because they lack business context and clear decision boundaries. Across <strong>Kosh</strong>, <strong>Spasht</strong>, and custom system builds, Kramaniti structures the underlying workflow context, explicit ownership, and human-led review gates—creating durable operational memory that improves with real use.
            </p>
          </div>
          <div className={styles.moatPills} aria-label="Ecosystem defensibility pillars">
            <span>Context-adapted patterns</span>
            <span>Persistent project &amp; loop memory</span>
            <span>Explicit human review gates</span>
          </div>
        </div>
      </div>
    </section>
  );
}
