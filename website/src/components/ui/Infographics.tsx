import React from 'react';
import { 
  XCircle, 
  CheckCircle2, 
  ArrowDown, 
  ArrowRight, 
  Cpu, 
  Layers, 
  Zap,
  ShieldCheck,
  Workflow,
  Radar,
  CircleAlert,
  BrainCircuit,
  DatabaseZap,
  Settings2,
  Scale,
  FolderSync,
  FileCheck2,
  GitBranch,
  Megaphone,
  MessageSquareText
} from 'lucide-react';
import styles from './Infographics.module.css';

export function AlignmentRouteMapInfographic() {
  const route = [
    {
      icon: Radar,
      label: 'Operating reality',
      copy: 'The team names the repeated friction, decision loop, handoff, or customer-facing gap.',
    },
    {
      icon: GitBranch,
      label: 'Alignment route',
      copy: 'Requirement, owner, source packet, risk boundary, and priority are tied to one route.',
    },
    {
      icon: Workflow,
      label: 'Useful system',
      copy: 'Only the support that changes the route is built: tool, note, review gate, or handoff.',
    },
    {
      icon: FolderSync,
      label: 'Growth signal',
      copy: 'Learning writes back into operations, intelligence, adoption, and public communication.',
    },
  ];

  return (
    <div className={styles.infographicWrapper}>
      <div className={styles.infographicTitle}>Alignment Route Map</div>
      <div className={styles.threadMap}>
        <div className={styles.threadLine} aria-hidden="true" />
        {route.map((stage, index) => {
          const Icon = stage.icon;

          return (
            <div className={`${styles.threadStage} ${index === route.length - 1 ? styles.threadStageHighlight : ''}`} key={stage.label}>
              <div className={index === route.length - 1 ? styles.threadIconHighlight : styles.threadIcon}>
                <Icon size={18} />
              </div>
              <span className={styles.threadStep}>{String(index + 1).padStart(2, '0')}</span>
              <h4>{stage.label}</h4>
              <p>{stage.copy}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function PresenceTranslationRouteInfographic() {
  const route = [
    {
      icon: Radar,
      label: 'Operating signal',
      copy: 'A repeated question, handoff gap, support pattern, or proof boundary appears in real work.',
    },
    {
      icon: Workflow,
      label: 'Service route',
      copy: 'The team names what happens frontstage, what happens backstage, and what evidence supports it.',
    },
    {
      icon: FileCheck2,
      label: 'Public brief',
      copy: 'The page, post, deck line, or article receives the source, owner, promise, and limitation.',
    },
    {
      icon: Megaphone,
      label: 'Presence output',
      copy: 'The message says what the business can actually support, in language the audience can use.',
    },
  ];

  return (
    <div className={styles.infographicWrapper}>
      <div className={styles.infographicTitle}>Presence Translation Route</div>
      <div className={styles.threadMap}>
        <div className={styles.threadLine} aria-hidden="true" />
        {route.map((stage, index) => {
          const Icon = stage.icon;

          return (
            <div className={`${styles.threadStage} ${index === route.length - 1 ? styles.threadStageHighlight : ''}`} key={stage.label}>
              <div className={index === route.length - 1 ? styles.threadIconHighlight : styles.threadIcon}>
                <Icon size={18} />
              </div>
              <span className={styles.threadStep}>{String(index + 1).padStart(2, '0')}</span>
              <h4>{stage.label}</h4>
              <p>{stage.copy}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function PublicPageRealityCheckInfographic() {
  return (
    <div className={styles.infographicWrapper}>
      <div className={styles.infographicTitle}>Public Page Reality Check</div>
      <div className={styles.matrixScrollWrapper}>
        <table className={styles.matrixTable}>
          <thead>
            <tr>
              <th className={styles.matrixColHeader}>Page element</th>
              <th className={styles.matrixColHeader}>Weak translation habit</th>
              <th className={`${styles.matrixColHeader} ${styles.matrixColHeaderHighlight}`}>Workflow-backed test</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className={styles.matrixCellLabel}>Headline</td>
              <td className={styles.matrixCell}>Names the tool or trend first.</td>
              <td className={`${styles.matrixCell} ${styles.matrixCellHighlight}`}>Names the audience outcome and operating reality.</td>
            </tr>
            <tr>
              <td className={styles.matrixCellLabel}>Service promise</td>
              <td className={styles.matrixCell}>Sounds polished but has no delivery route.</td>
              <td className={`${styles.matrixCell} ${styles.matrixCellHighlight}`}>Maps to owner, handoff, evidence, and review boundary.</td>
            </tr>
            <tr>
              <td className={styles.matrixCellLabel}>CTA</td>
              <td className={styles.matrixCell}>Asks for a vague call or generic demo.</td>
              <td className={`${styles.matrixCell} ${styles.matrixCellHighlight}`}>Asks for the workflow, decision loop, or gap to clarify.</td>
            </tr>
            <tr>
              <td className={styles.matrixCellLabel}>Support copy</td>
              <td className={styles.matrixCell}>Explains features without usage context.</td>
              <td className={`${styles.matrixCell} ${styles.matrixCellHighlight}`}>Shows when people act, override, escalate, or learn.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function OperatingThreadMapInfographic() {
  const thread = [
    {
      icon: Radar,
      label: 'Market signal',
      copy: 'A paid tool, repeated request, customer question, or manual workaround appears.',
    },
    {
      icon: Workflow,
      label: 'Operating route',
      copy: 'The team names the workflow, owner, trigger, handoff, and decision boundary.',
    },
    {
      icon: DatabaseZap,
      label: 'Context packet',
      copy: 'Source record, status, exception, and write-back location travel with the work.',
    },
    {
      icon: Megaphone,
      label: 'Presence output',
      copy: 'The public message reflects what the internal system can actually support.',
    },
  ];

  return (
    <div className={styles.infographicWrapper}>
      <div className={styles.infographicTitle}>Operating Thread Map</div>
      <div className={styles.threadMap}>
        <div className={styles.threadLine} aria-hidden="true" />
        {thread.map((stage, index) => {
          const Icon = stage.icon;

          return (
            <div className={`${styles.threadStage} ${index === thread.length - 1 ? styles.threadStageHighlight : ''}`} key={stage.label}>
              <div className={index === thread.length - 1 ? styles.threadIconHighlight : styles.threadIcon}>
                <Icon size={18} />
              </div>
              <span className={styles.threadStep}>{String(index + 1).padStart(2, '0')}</span>
              <h4>{stage.label}</h4>
              <p>{stage.copy}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function SubscriptionToSystemGateInfographic() {
  const gates = [
    {
      label: 'Subscription',
      weak: 'A paid AI service exists.',
      useful: 'The workflow it supports is named.',
    },
    {
      label: 'Usage',
      weak: 'Someone gets faster privately.',
      useful: 'The approved route is visible to the team.',
    },
    {
      label: 'Context',
      weak: 'Outputs move without source or status.',
      useful: 'A context packet travels with every handoff.',
    },
    {
      label: 'Adoption',
      weak: 'The tool remains an extra task.',
      useful: 'Learning writes back into operations and presence.',
    },
  ];

  return (
    <div className={styles.infographicWrapper}>
      <div className={styles.infographicTitle}>Subscription to System Gate</div>
      <div className={styles.gateStack}>
        {gates.map((gate, index) => (
          <div className={styles.gateRow} key={gate.label}>
            <div className={styles.gateIndex}>{String(index + 1).padStart(2, '0')}</div>
            <div className={styles.gateLabel}>{gate.label}</div>
            <div className={styles.gateWeak}>{gate.weak}</div>
            <div className={styles.gateUseful}>
              <ShieldCheck size={15} />
              <span>{gate.useful}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function FirstSystemTriageInfographic() {
  return (
    <div className={styles.infographicWrapper}>
      <div className={styles.infographicTitle}>First System Triage</div>
      <div className={styles.matrixScrollWrapper}>
        <table className={styles.matrixTable}>
          <thead>
            <tr>
              <th className={styles.matrixColHeader}>Signal</th>
              <th className={styles.matrixColHeader}>Weak selection habit</th>
              <th className={`${styles.matrixColHeader} ${styles.matrixColHeaderHighlight}`}>Priority build test</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className={styles.matrixCellLabel}>Repeated wait</td>
              <td className={styles.matrixCell}>Add a tool where work is loudest.</td>
              <td className={`${styles.matrixCell} ${styles.matrixCellHighlight}`}>Find the stage where value stops moving.</td>
            </tr>
            <tr>
              <td className={styles.matrixCellLabel}>Founder correction</td>
              <td className={styles.matrixCell}>Ask for better drafts each cycle.</td>
              <td className={`${styles.matrixCell} ${styles.matrixCellHighlight}`}>Retain the standard, source, and review boundary.</td>
            </tr>
            <tr>
              <td className={styles.matrixCellLabel}>Customer confusion</td>
              <td className={styles.matrixCell}>Publish more explanation.</td>
              <td className={`${styles.matrixCell} ${styles.matrixCellHighlight}`}>Clarify the route that creates the confusion.</td>
            </tr>
            <tr>
              <td className={styles.matrixCellLabel}>Content drift</td>
              <td className={styles.matrixCell}>Increase production volume.</td>
              <td className={`${styles.matrixCell} ${styles.matrixCellHighlight}`}>Connect message, proof, owner, and operating record.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function ConstraintToBuildMapInfographic() {
  const route = [
    {
      icon: Radar,
      label: 'Locate pressure',
      copy: 'Watch where work waits, repeats, restarts, or loses context in the real route.',
    },
    {
      icon: CircleAlert,
      label: 'Name constraint',
      copy: 'Identify the limiting point: decision, handoff, source quality, review, or adoption.',
    },
    {
      icon: Workflow,
      label: 'Shape support',
      copy: 'Build the smallest route, packet, note, or tool that protects the constraint.',
    },
    {
      icon: ShieldCheck,
      label: 'Retain learning',
      copy: 'Write back the standard so the next cycle moves with less reconstruction.',
    },
  ];

  return (
    <div className={styles.infographicWrapper}>
      <div className={styles.infographicTitle}>Constraint to Build Map</div>
      <div className={styles.briefBoard}>
        {route.map((stage, index) => {
          const Icon = stage.icon;
          const isFinal = index === route.length - 1;

          return (
            <React.Fragment key={stage.label}>
              <div className={`${styles.briefCard} ${isFinal ? styles.briefCardHighlight : ''}`}>
                <div className={isFinal ? styles.briefIconHighlight : styles.briefIcon}>
                  <Icon size={18} />
                </div>
                <div className={isFinal ? styles.briefLabelGold : styles.briefLabel}>{stage.label}</div>
                <p className={isFinal ? styles.briefCopyGold : styles.briefCopy}>{stage.copy}</p>
              </div>
              {index < route.length - 1 ? (
                <div className={styles.briefConnector}>
                  <ArrowRight className={styles.arrowIconDesktop} size={18} />
                  <ArrowDown className={styles.arrowIconMobile} size={18} />
                </div>
              ) : null}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

export function SupportRouteRolloutInfographic() {
  const route = [
    {
      icon: Radar,
      label: 'Expected questions',
      copy: 'Name the clarification, access, status, exception, and claim-boundary questions before launch.',
    },
    {
      icon: Workflow,
      label: 'Support route',
      copy: 'Define the channel, owner, response path, and escalation condition for real use.',
    },
    {
      icon: FileCheck2,
      label: 'Reusable answer',
      copy: 'Retain the accepted answer beside the workflow so the next cycle starts with context.',
    },
    {
      icon: FolderSync,
      label: 'System update',
      copy: 'Turn repeated support into a form label, handoff note, training snippet, or public explanation.',
    },
  ];

  return (
    <div className={styles.infographicWrapper}>
      <div className={styles.infographicTitle}>Support Route Before Rollout</div>
      <div className={styles.briefBoard}>
        {route.map((stage, index) => {
          const Icon = stage.icon;
          const isFinal = index === route.length - 1;

          return (
            <React.Fragment key={stage.label}>
              <div className={`${styles.briefCard} ${isFinal ? styles.briefCardHighlight : ''}`}>
                <div className={isFinal ? styles.briefIconHighlight : styles.briefIcon}>
                  <Icon size={18} />
                </div>
                <div className={isFinal ? styles.briefLabelGold : styles.briefLabel}>{stage.label}</div>
                <p className={isFinal ? styles.briefCopyGold : styles.briefCopy}>{stage.copy}</p>
              </div>
              {index < route.length - 1 ? (
                <div className={styles.briefConnector}>
                  <ArrowRight className={styles.arrowIconDesktop} size={18} />
                  <ArrowDown className={styles.arrowIconMobile} size={18} />
                </div>
              ) : null}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

export function SupportSignalLedgerInfographic() {
  return (
    <div className={styles.infographicWrapper}>
      <div className={styles.infographicTitle}>Support Signal Ledger</div>
      <div className={styles.matrixScrollWrapper}>
        <table className={styles.matrixTable}>
          <thead>
            <tr>
              <th className={styles.matrixColHeader}>Rollout signal</th>
              <th className={styles.matrixColHeader}>Weak support habit</th>
              <th className={`${styles.matrixColHeader} ${styles.matrixColHeaderHighlight}`}>Useful route update</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className={styles.matrixCellLabel}>Repeated clarification</td>
              <td className={styles.matrixCell}>Answer again in chat.</td>
              <td className={`${styles.matrixCell} ${styles.matrixCellHighlight}`}>Update the workflow note or public explanation.</td>
            </tr>
            <tr>
              <td className={styles.matrixCellLabel}>Exception request</td>
              <td className={styles.matrixCell}>Ask the founder each time.</td>
              <td className={`${styles.matrixCell} ${styles.matrixCellHighlight}`}>Define escalation condition and decision owner.</td>
            </tr>
            <tr>
              <td className={styles.matrixCellLabel}>AI correction</td>
              <td className={styles.matrixCell}>Fix the output privately.</td>
              <td className={`${styles.matrixCell} ${styles.matrixCellHighlight}`}>Retain source, review rule, and accepted standard.</td>
            </tr>
            <tr>
              <td className={styles.matrixCellLabel}>Public confusion</td>
              <td className={styles.matrixCell}>Publish more content.</td>
              <td className={`${styles.matrixCell} ${styles.matrixCellHighlight}`}>Clarify the route before increasing volume.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

// 1. Redesigned Side-by-Side Flow (The Classic Redesigned)
export function DisconnectedOpsInfographic() {
  return (
    <div className={styles.infographicWrapper}>
      <div className={styles.infographicTitle}>Operational Architecture</div>
      <div className={styles.comparisonGrid}>
        
        <div className={styles.wrongWay}>
          <div className={styles.wayLabel}>
            <XCircle className={styles.labelIconDanger} size={16} />
            The Assembly Line
          </div>
          <div className={styles.flow}>
            <div className={`${styles.node} ${styles.nodeBroken}`}>Siloed Boardroom Strategy</div>
            <ArrowDown className={styles.arrow} size={18} />
            <div className={`${styles.node} ${styles.nodeBroken}`}>Disconnected IT & Automation</div>
            <ArrowDown className={styles.arrow} size={18} />
            <div className={`${styles.node} ${styles.nodeDanger}`}>Generic Freelance Content</div>
          </div>
        </div>

        <div className={styles.rightWay}>
          <div className={styles.wayLabel}>
            <CheckCircle2 className={styles.labelIconGold} size={16} />
            The Unified Pipeline
          </div>
          <div className={styles.flow}>
            <div className={`${styles.node} ${styles.nodeGold}`}>Deep Strategy & Identity</div>
            <ArrowDown className={styles.arrowGold} size={18} />
            <div className={`${styles.node} ${styles.nodeGold}`}>Custom Agentic Infrastructure</div>
            <ArrowDown className={styles.arrowGold} size={18} />
            <div className={`${styles.node} ${styles.nodeSolid}`}>Cinematic Standard Output</div>
          </div>
        </div>

      </div>
    </div>
  );
}

export function OperatingSignalLedgerInfographic() {
  return (
    <div className={styles.infographicWrapper}>
      <div className={styles.infographicTitle}>Operating Signal Ledger</div>
      <div className={styles.matrixScrollWrapper}>
        <table className={styles.matrixTable}>
          <thead>
            <tr>
              <th className={styles.matrixColHeader}>Signal in work</th>
              <th className={styles.matrixColHeader}>Evidence to retain</th>
              <th className={`${styles.matrixColHeader} ${styles.matrixColHeaderHighlight}`}>Presence move</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className={styles.matrixCellLabel}>Repeated question</td>
              <td className={styles.matrixCell}>Sales note, call pattern, objection log.</td>
              <td className={`${styles.matrixCell} ${styles.matrixCellHighlight}`}>Clarifying founder post or FAQ line.</td>
            </tr>
            <tr>
              <td className={styles.matrixCellLabel}>Delivery friction</td>
              <td className={styles.matrixCell}>Workflow map, handoff gap, owner comment.</td>
              <td className={`${styles.matrixCell} ${styles.matrixCellHighlight}`}>Service explanation grounded in real route.</td>
            </tr>
            <tr>
              <td className={styles.matrixCellLabel}>Client language</td>
              <td className={styles.matrixCell}>Approved phrase, category-safe insight, source context.</td>
              <td className={`${styles.matrixCell} ${styles.matrixCellHighlight}`}>Sharper deck, article, or sales narrative.</td>
            </tr>
            <tr>
              <td className={styles.matrixCellLabel}>System learning</td>
              <td className={styles.matrixCell}>Correction, review threshold, write-back record.</td>
              <td className={`${styles.matrixCell} ${styles.matrixCellHighlight}`}>Public claim only after proof route is stable.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function PresenceBriefCanvasInfographic() {
  const briefItems = [
    {
      icon: Radar,
      label: 'Signal',
      copy: 'The recurring market, workflow, or delivery pattern noticed in real work.',
    },
    {
      icon: Workflow,
      label: 'Workflow source',
      copy: 'The route, handoff, call, report, or system where signal actually appeared.',
    },
    {
      icon: FileCheck2,
      label: 'Evidence retained',
      copy: 'The record that lets future content point back to operating truth.',
    },
    {
      icon: ShieldCheck,
      label: 'Claim boundary',
      copy: 'What can be said publicly, what needs softer language, and what stays internal.',
    },
    {
      icon: MessageSquareText,
      label: 'Owner interpretation',
      copy: 'Founder or subject owner decides what signal means for the business.',
    },
    {
      icon: Megaphone,
      label: 'Presence format',
      copy: 'The safest useful output: post, article, deck line, sales note, or internal doc.',
    },
  ];

  return (
    <div className={styles.infographicWrapper}>
      <div className={styles.infographicTitle}>Presence Brief Canvas</div>
      <div className={styles.packetChecklist}>
        {briefItems.map((item, index) => {
          const Icon = item.icon;

          return (
            <div className={`${styles.packetItem} ${index === briefItems.length - 1 ? styles.packetItemHighlight : ''}`} key={item.label}>
              <div className={index === briefItems.length - 1 ? styles.packetIconHighlight : styles.packetIcon}>
                <Icon size={18} />
              </div>
              <div className={styles.packetContent}>
                <span className={styles.packetNumber}>{String(index + 1).padStart(2, '0')}</span>
                <h4>{item.label}</h4>
                <p>{item.copy}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function ClaimProofRouteInfographic() {
  const route = [
    {
      icon: Megaphone,
      label: 'Public claim',
      copy: 'The line a prospect, customer, partner, or team member will read and act on.',
    },
    {
      icon: FileCheck2,
      label: 'Substantiation',
      copy: 'The source, record, permission, standard, or observed workflow that supports the claim.',
    },
    {
      icon: Workflow,
      label: 'Delivery route',
      copy: 'The operating path that can consistently make the promise true in real work.',
    },
    {
      icon: ShieldCheck,
      label: 'Review trigger',
      copy: 'The condition that forces the claim to be softened, updated, removed, or kept internal.',
    },
  ];

  return (
    <div className={styles.infographicWrapper}>
      <div className={styles.infographicTitle}>Claim Proof Route</div>
      <div className={styles.briefBoard}>
        {route.map((stage, index) => {
          const Icon = stage.icon;
          const isFinal = index === route.length - 1;

          return (
            <React.Fragment key={stage.label}>
              <div className={`${styles.briefCard} ${isFinal ? styles.briefCardHighlight : ''}`}>
                <div className={isFinal ? styles.briefIconHighlight : styles.briefIcon}>
                  <Icon size={18} />
                </div>
                <div className={isFinal ? styles.briefLabelGold : styles.briefLabel}>{stage.label}</div>
                <p className={isFinal ? styles.briefCopyGold : styles.briefCopy}>{stage.copy}</p>
              </div>
              {index < route.length - 1 ? (
                <div className={styles.briefConnector}>
                  <ArrowRight className={styles.arrowIconDesktop} size={18} />
                  <ArrowDown className={styles.arrowIconMobile} size={18} />
                </div>
              ) : null}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

export function PromiseDeliveryCheckInfographic() {
  return (
    <div className={styles.infographicWrapper}>
      <div className={styles.infographicTitle}>Promise Delivery Check</div>
      <div className={styles.matrixScrollWrapper}>
        <table className={styles.matrixTable}>
          <thead>
            <tr>
              <th className={styles.matrixColHeader}>Claim moment</th>
              <th className={styles.matrixColHeader}>Weak route</th>
              <th className={`${styles.matrixColHeader} ${styles.matrixColHeaderHighlight}`}>Proof-ready route</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className={styles.matrixCellLabel}>Homepage line</td>
              <td className={styles.matrixCell}>Sounds impressive but points to no delivery standard.</td>
              <td className={`${styles.matrixCell} ${styles.matrixCellHighlight}`}>Maps to a service, owner, workflow, and review condition.</td>
            </tr>
            <tr>
              <td className={styles.matrixCellLabel}>Founder post</td>
              <td className={styles.matrixCell}>Turns a private anecdote into a broad market claim.</td>
              <td className={`${styles.matrixCell} ${styles.matrixCellHighlight}`}>Separates observed signal, inference, and permission-safe language.</td>
            </tr>
            <tr>
              <td className={styles.matrixCellLabel}>Sales deck</td>
              <td className={styles.matrixCell}>Uses client names, outcomes, or metrics without status.</td>
              <td className={`${styles.matrixCell} ${styles.matrixCellHighlight}`}>Labels proof as verified, softened, internal, or not publishable.</td>
            </tr>
            <tr>
              <td className={styles.matrixCellLabel}>System promise</td>
              <td className={styles.matrixCell}>Promises automation before adoption and override rules exist.</td>
              <td className={`${styles.matrixCell} ${styles.matrixCellHighlight}`}>Shows what is automated, assisted, human-led, and written back.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function ValueGapFunnelInfographic() {
  const steps = [
    {
      label: 'Adoption',
      value: '90%+',
      copy: 'Tools are available, trials are active, and usage is visible.',
    },
    {
      label: 'Debt',
      value: 'Process',
      copy: 'Data, workflow, technology, and talent gaps still shape the route.',
    },
    {
      label: 'Value',
      value: '6%',
      copy: 'Only the resolved operating system turns AI activity into measurable value.',
    },
  ];

  return (
    <div className={styles.infographicWrapper}>
      <div className={styles.infographicTitle}>AI Value Gap Funnel</div>
      <div className={styles.pipelineContainer}>
        {steps.map((step, index) => (
          <React.Fragment key={step.label}>
            <div className={`${styles.pipelineNode} ${index === steps.length - 1 ? styles.pipelineNodeHighlight : ''}`}>
              <div className={index === steps.length - 1 ? styles.pipelineStepHighlight : styles.pipelineStep}>{step.value}</div>
              <div className={styles.pipelineContent}>
                <div className={index === steps.length - 1 ? styles.pipelineNodeTitleHighlight : styles.pipelineNodeTitle}>{step.label}</div>
                <p className={index === steps.length - 1 ? styles.pipelineNodeDescHighlight : styles.pipelineNodeDesc}>{step.copy}</p>
              </div>
            </div>
            {index < steps.length - 1 ? (
              <div className={styles.pipelineArrow}>
                <ArrowRight className={styles.arrowIconDesktop} size={20} />
                <ArrowDown className={styles.arrowIconMobile} size={20} />
              </div>
            ) : null}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

export function CollaborationBoundaryMapInfographic() {
  return (
    <div className={styles.infographicWrapper}>
      <div className={styles.infographicTitle}>Collaboration Boundary Map</div>
      <div className={styles.boundaryMap}>
        <div className={styles.boundaryColumn}>
          <span className={styles.boundaryStep}>01</span>
          <h4>Automate repetition</h4>
          <p>Routing, formatting, extraction, reminders, and low-risk updates move without adding judgment debt.</p>
          <div className={styles.boundaryTag}>System handles repetition</div>
        </div>

        <div className={styles.boundaryDivider}></div>

        <div className={`${styles.boundaryColumn} ${styles.boundaryColumnAssist}`}>
          <span className={styles.boundaryStepAssist}>02</span>
          <h4>Assist judgment</h4>
          <p>Summaries, classification, drafts, research, and recommendations support a visible decision owner.</p>
          <div className={styles.boundaryTagAssist}>AI supports the route</div>
        </div>

        <div className={styles.boundaryDivider}></div>

        <div className={`${styles.boundaryColumn} ${styles.boundaryColumnHighlight}`}>
          <span className={styles.boundaryStepHighlight}>03</span>
          <h4>Keep people accountable</h4>
          <p>Trust, taste, pricing, promises, sensitive data, and final approvals stay human-led.</p>
          <div className={styles.boundaryTagHighlight}>People own the standard</div>
        </div>
      </div>
    </div>
  );
}

export function SourceRouteCalendarInfographic() {
  const stages = [
    {
      icon: Radar,
      label: 'Signal',
      copy: 'A repeated question, delivery lesson, bottleneck, or market pattern appears in real work.',
    },
    {
      icon: FolderSync,
      label: 'Source',
      copy: 'The team retains the call note, workflow record, approval comment, or system evidence.',
    },
    {
      icon: ShieldCheck,
      label: 'Boundary',
      copy: 'The owner decides what is safe to say, what needs softer language, and what stays internal.',
    },
    {
      icon: Megaphone,
      label: 'Calendar slot',
      copy: 'The public format is chosen only after the message has a source route.',
    },
  ];

  return (
    <div className={styles.infographicWrapper}>
      <div className={styles.infographicTitle}>Source Route Calendar</div>
      <div className={styles.briefBoard}>
        {stages.map((stage, index) => {
          const Icon = stage.icon;
          const isFinal = index === stages.length - 1;

          return (
            <React.Fragment key={stage.label}>
              <div className={`${styles.briefCard} ${isFinal ? styles.briefCardHighlight : ''}`}>
                <div className={isFinal ? styles.briefIconHighlight : styles.briefIcon}>
                  <Icon size={18} />
                </div>
                <div className={isFinal ? styles.briefLabelGold : styles.briefLabel}>{stage.label}</div>
                <p className={isFinal ? styles.briefCopyGold : styles.briefCopy}>{stage.copy}</p>
              </div>
              {index < stages.length - 1 ? (
                <div className={styles.briefConnector}>
                  <ArrowRight className={styles.arrowIconDesktop} size={18} />
                  <ArrowDown className={styles.arrowIconMobile} size={18} />
                </div>
              ) : null}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

export function MessageMapSourceRouteInfographic() {
  return (
    <div className={styles.infographicWrapper}>
      <div className={styles.infographicTitle}>Message Map Source Route</div>
      <div className={styles.matrixScrollWrapper}>
        <table className={styles.matrixTable}>
          <thead>
            <tr>
              <th className={styles.matrixColHeader}>Message field</th>
              <th className={styles.matrixColHeader}>Weak calendar habit</th>
              <th className={`${styles.matrixColHeader} ${styles.matrixColHeaderHighlight}`}>Source-led standard</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className={styles.matrixCellLabel}>Audience question</td>
              <td className={styles.matrixCell}>Pick a trending topic.</td>
              <td className={`${styles.matrixCell} ${styles.matrixCellHighlight}`}>Use a question customers or operators already repeat.</td>
            </tr>
            <tr>
              <td className={styles.matrixCellLabel}>Evidence</td>
              <td className={styles.matrixCell}>Rely on memory or generic research.</td>
              <td className={`${styles.matrixCell} ${styles.matrixCellHighlight}`}>Point to a retained workflow, note, source, or standard.</td>
            </tr>
            <tr>
              <td className={styles.matrixCellLabel}>Claim boundary</td>
              <td className={styles.matrixCell}>Say the strongest version.</td>
              <td className={`${styles.matrixCell} ${styles.matrixCellHighlight}`}>Say the strongest version the source can support.</td>
            </tr>
            <tr>
              <td className={styles.matrixCellLabel}>Write-back</td>
              <td className={styles.matrixCell}>Publish and move on.</td>
              <td className={`${styles.matrixCell} ${styles.matrixCellHighlight}`}>Return new objections, phrases, and lessons to the system.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function ShadowAiRouteInfographic() {
  return (
    <div className={styles.infographicWrapper}>
      <div className={styles.infographicTitle}>Shadow Use vs. Visible Route</div>
      <div className={styles.comparisonGrid}>
        <div className={styles.wrongWay}>
          <div className={styles.wayLabel}>
            <CircleAlert className={styles.labelIconDanger} size={16} />
            Shadow AI use
          </div>
          <div className={styles.flow}>
            <div className={`${styles.node} ${styles.nodeBroken}`}>Private prompt</div>
            <ArrowDown className={styles.arrow} size={18} />
            <div className={`${styles.node} ${styles.nodeBroken}`}>Unreviewed output</div>
            <ArrowDown className={styles.arrow} size={18} />
            <div className={`${styles.node} ${styles.nodeDanger}`}>No retained route</div>
          </div>
        </div>

        <div className={styles.rightWay}>
          <div className={styles.wayLabel}>
            <ShieldCheck className={styles.labelIconGold} size={16} />
            Visible workflow route
          </div>
          <div className={styles.flow}>
            <div className={`${styles.node} ${styles.nodeGold}`}>Named workflow</div>
            <ArrowDown className={styles.arrowGold} size={18} />
            <div className={`${styles.node} ${styles.nodeGold}`}>Human owner and review rule</div>
            <ArrowDown className={styles.arrowGold} size={18} />
            <div className={`${styles.node} ${styles.nodeSolid}`}>Approved write-back record</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function WorkflowAdoptionRhythmInfographic() {
  return (
    <div className={styles.infographicWrapper}>
      <div className={styles.infographicTitle}>Workflow Adoption Rhythm</div>
      <div className={styles.pipelineContainer}>
        <div className={styles.pipelineNode}>
          <div className={styles.pipelineStep}>01</div>
          <div className={styles.pipelineContent}>
            <div className={styles.pipelineNodeTitle}>Name the workflow</div>
            <p className={styles.pipelineNodeDesc}>Make the business route visible before tool usage spreads.</p>
          </div>
        </div>

        <div className={styles.pipelineArrow}>
          <ArrowRight className={styles.arrowIconDesktop} size={20} />
          <ArrowDown className={styles.arrowIconMobile} size={20} />
        </div>

        <div className={styles.pipelineNode}>
          <div className={styles.pipelineStep}>02</div>
          <div className={styles.pipelineContent}>
            <div className={styles.pipelineNodeTitle}>Define allowed support</div>
            <p className={styles.pipelineNodeDesc}>Clarify what AI may draft, summarize, check, or suggest.</p>
          </div>
        </div>

        <div className={styles.pipelineArrow}>
          <ArrowRight className={styles.arrowIconDesktop} size={20} />
          <ArrowDown className={styles.arrowIconMobile} size={20} />
        </div>

        <div className={styles.pipelineNode}>
          <div className={styles.pipelineStep}>03</div>
          <div className={styles.pipelineContent}>
            <div className={styles.pipelineNodeTitle}>Review the boundary</div>
            <p className={styles.pipelineNodeDesc}>Keep judgment, exception handling, and approval with a person.</p>
          </div>
        </div>

        <div className={styles.pipelineArrow}>
          <ArrowRight className={styles.arrowIconDesktop} size={20} />
          <ArrowDown className={styles.arrowIconMobile} size={20} />
        </div>

        <div className={`${styles.pipelineNode} ${styles.pipelineNodeHighlight}`}>
          <div className={styles.pipelineStepHighlight}>04</div>
          <div className={styles.pipelineContent}>
            <div className={styles.pipelineNodeTitleHighlight}>Write back learning</div>
            <p className={styles.pipelineNodeDescHighlight}>Return approved outputs and exceptions to the system of record.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function EscalationClarityMapInfographic() {
  return (
    <div className={styles.infographicWrapper}>
      <div className={styles.infographicTitle}>Escalation Clarity Map</div>
      <div className={styles.comparisonGrid}>
        <div className={styles.wrongWay}>
          <div className={styles.wayLabel}>
            <CircleAlert className={styles.labelIconDanger} size={16} />
            Assistant-first launch
          </div>
          <div className={styles.flow}>
            <div className={`${styles.node} ${styles.nodeBroken}`}>Fast answer</div>
            <ArrowDown className={styles.arrow} size={18} />
            <div className={`${styles.node} ${styles.nodeBroken}`}>Thin context transfer</div>
            <ArrowDown className={styles.arrow} size={18} />
            <div className={`${styles.node} ${styles.nodeDanger}`}>Customer repeats the issue</div>
          </div>
        </div>

        <div className={styles.rightWay}>
          <div className={styles.wayLabel}>
            <ShieldCheck className={styles.labelIconGold} size={16} />
            Escalation-ready route
          </div>
          <div className={styles.flow}>
            <div className={`${styles.node} ${styles.nodeGold}`}>Issue type and threshold</div>
            <ArrowDown className={styles.arrowGold} size={18} />
            <div className={`${styles.node} ${styles.nodeGold}`}>Human owner receives context</div>
            <ArrowDown className={styles.arrowGold} size={18} />
            <div className={`${styles.node} ${styles.nodeSolid}`}>Resolution writes back to record</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ServiceRecoveryLoopInfographic() {
  return (
    <div className={styles.infographicWrapper}>
      <div className={styles.infographicTitle}>Service Recovery Loop</div>
      <div className={styles.spineGrid}>
        <div className={styles.spineCard}>
          <div className={styles.spineStep}>01</div>
          <div className={styles.spineTitle}>Detect escalation</div>
          <p className={styles.spineCopy}>
            Watch for low confidence, policy limits, repeated attempts, or visible customer frustration.
          </p>
        </div>

        <div className={styles.spineConnector}>
          <ArrowRight className={styles.arrowIconDesktop} size={20} />
          <ArrowDown className={styles.arrowIconMobile} size={20} />
        </div>

        <div className={styles.spineCard}>
          <div className={styles.spineStep}>02</div>
          <div className={styles.spineTitle}>Carry context</div>
          <p className={styles.spineCopy}>
            Transfer customer goal, attempted answer, source record, and risk reason to the owner.
          </p>
        </div>

        <div className={styles.spineConnector}>
          <ArrowRight className={styles.arrowIconDesktop} size={20} />
          <ArrowDown className={styles.arrowIconMobile} size={20} />
        </div>

        <div className={styles.spineCard}>
          <div className={styles.spineStep}>03</div>
          <div className={styles.spineTitle}>Recover with judgment</div>
          <p className={styles.spineCopy}>
            A person handles nuance, trust repair, exceptions, and final communication.
          </p>
        </div>

        <div className={styles.spineConnector}>
          <ArrowRight className={styles.arrowIconDesktop} size={20} />
          <ArrowDown className={styles.arrowIconMobile} size={20} />
        </div>

        <div className={`${styles.spineCard} ${styles.spineCardHighlight}`}>
          <div className={styles.spineStepHighlight}>04</div>
          <div className={styles.spineTitleHighlight}>Retain learning</div>
          <p className={styles.spineCopyHighlight}>
            Write the final resolution, exception, and improved route back into the system.
          </p>
        </div>
      </div>
    </div>
  );
}

export function FounderMemoryInfrastructureInfographic() {
  return (
    <div className={styles.infographicWrapper}>
      <div className={styles.infographicTitle}>Founder Memory vs. Operating Memory</div>
      <div className={styles.matrixScrollWrapper}>
        <table className={styles.matrixTable}>
          <thead>
            <tr>
              <th className={styles.matrixColHeader}>Where judgment sits</th>
              <th className={styles.matrixColHeader}>What breaks</th>
              <th className={`${styles.matrixColHeader} ${styles.matrixColHeaderHighlight}`}>What to retain</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className={styles.matrixCellLabel}>Founder memory</td>
              <td className={styles.matrixCell}>Every repeated correction waits for the founder again.</td>
              <td className={`${styles.matrixCell} ${styles.matrixCellHighlight}`}>Standard, reason, and example.</td>
            </tr>
            <tr>
              <td className={styles.matrixCellLabel}>Chat thread</td>
              <td className={styles.matrixCell}>Context is useful once, then disappears into scrollback.</td>
              <td className={`${styles.matrixCell} ${styles.matrixCellHighlight}`}>Approved answer and source route.</td>
            </tr>
            <tr>
              <td className={styles.matrixCellLabel}>AI output</td>
              <td className={styles.matrixCell}>Draft gets faster while judgment stays invisible.</td>
              <td className={`${styles.matrixCell} ${styles.matrixCellHighlight}`}>Review condition and human owner.</td>
            </tr>
            <tr>
              <td className={styles.matrixCellLabel}>Operating memory</td>
              <td className={styles.matrixCell}>The workflow can now improve without restarting.</td>
              <td className={`${styles.matrixCell} ${styles.matrixCellHighlight}`}>Write-back record inside the route.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function MemoryWritebackLoopInfographic() {
  return (
    <div className={styles.infographicWrapper}>
      <div className={styles.infographicTitle}>Memory Write-Back Loop</div>
      <div className={styles.spineGrid}>
        <div className={styles.spineCard}>
          <div className={styles.spineStep}>01</div>
          <div className={styles.spineTitle}>Notice repeated judgment</div>
          <p className={styles.spineCopy}>
            Capture the correction, objection, exception, or taste decision that keeps returning.
          </p>
        </div>

        <div className={styles.spineConnector}>
          <ArrowRight className={styles.arrowIconDesktop} size={20} />
          <ArrowDown className={styles.arrowIconMobile} size={20} />
        </div>

        <div className={styles.spineCard}>
          <div className={styles.spineStep}>02</div>
          <div className={styles.spineTitle}>Name the standard</div>
          <p className={styles.spineCopy}>
            Turn founder intuition into a short rule, boundary, reason, and approved example.
          </p>
        </div>

        <div className={styles.spineConnector}>
          <ArrowRight className={styles.arrowIconDesktop} size={20} />
          <ArrowDown className={styles.arrowIconMobile} size={20} />
        </div>

        <div className={styles.spineCard}>
          <div className={styles.spineStep}>03</div>
          <div className={styles.spineTitle}>Attach it to the route</div>
          <p className={styles.spineCopy}>
            Place the record inside the CRM, proposal, checklist, brief, or internal tool.
          </p>
        </div>

        <div className={styles.spineConnector}>
          <ArrowRight className={styles.arrowIconDesktop} size={20} />
          <ArrowDown className={styles.arrowIconMobile} size={20} />
        </div>

        <div className={`${styles.spineCard} ${styles.spineCardHighlight}`}>
          <div className={styles.spineStepHighlight}>04</div>
          <div className={styles.spineTitleHighlight}>Use it three times</div>
          <p className={styles.spineCopyHighlight}>
            Improve the record when the same question, edge case, or approval gap returns.
          </p>
        </div>
      </div>
    </div>
  );
}

export function SystemAcceptanceTestInfographic() {
  return (
    <div className={styles.infographicWrapper}>
      <div className={styles.infographicTitle}>System Acceptance Test</div>
      <div className={styles.matrixScrollWrapper}>
        <table className={styles.matrixTable}>
          <thead>
            <tr>
              <th className={styles.matrixColHeader}>Brief field</th>
              <th className={styles.matrixColHeader}>Weak version</th>
              <th className={`${styles.matrixColHeader} ${styles.matrixColHeaderHighlight}`}>Testable version</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className={styles.matrixCellLabel}>Workflow</td>
              <td className={styles.matrixCell}>Improve sales follow-up.</td>
              <td className={`${styles.matrixCell} ${styles.matrixCellHighlight}`}>Route every qualified lead to owner, next step, and source context.</td>
            </tr>
            <tr>
              <td className={styles.matrixCellLabel}>Evidence</td>
              <td className={styles.matrixCell}>Use previous calls and notes.</td>
              <td className={`${styles.matrixCell} ${styles.matrixCellHighlight}`}>Retain call signal, fit reason, objection, and approved status.</td>
            </tr>
            <tr>
              <td className={styles.matrixCellLabel}>Human review</td>
              <td className={styles.matrixCell}>Founder checks when needed.</td>
              <td className={`${styles.matrixCell} ${styles.matrixCellHighlight}`}>Founder reviews only high-value, unclear, or proof-sensitive cases.</td>
            </tr>
            <tr>
              <td className={styles.matrixCellLabel}>Pass signal</td>
              <td className={styles.matrixCell}>The tool feels useful.</td>
              <td className={`${styles.matrixCell} ${styles.matrixCellHighlight}`}>Team can run the route twice without reconstructing missing context.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function BuildReadinessGateInfographic() {
  const gates = [
    {
      icon: Workflow,
      label: 'Workflow named',
      copy: 'The route, trigger, owner, and handoff are visible before tooling.',
    },
    {
      icon: FileCheck2,
      label: 'Acceptance criteria',
      copy: 'The team knows what done looks like in real operating conditions.',
    },
    {
      icon: DatabaseZap,
      label: 'Evidence retained',
      copy: 'Source records, review decisions, and exceptions write back into the route.',
    },
    {
      icon: ShieldCheck,
      label: 'Review rhythm',
      copy: 'Human override, edge cases, and improvement cadence are assigned.',
    },
  ];

  return (
    <div className={styles.infographicWrapper}>
      <div className={styles.infographicTitle}>Build Readiness Gate</div>
      <div className={styles.packetChecklist}>
        {gates.map((gate, index) => {
          const Icon = gate.icon;
          const isFinal = index === gates.length - 1;

          return (
            <div className={`${styles.packetItem} ${isFinal ? styles.packetItemHighlight : ''}`} key={gate.label}>
              <div className={isFinal ? styles.packetIconHighlight : styles.packetIcon}>
                <Icon size={18} />
              </div>
              <div className={styles.packetContent}>
                <span className={styles.packetNumber}>{String(index + 1).padStart(2, '0')}</span>
                <h4>{gate.label}</h4>
                <p>{gate.copy}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function WorkflowPolicyNoteInfographic() {
  const fields = [
    {
      icon: Workflow,
      label: 'Workflow name',
      copy: 'The route where AI support is allowed, reviewed, and retained.',
    },
    {
      icon: Settings2,
      label: 'Allowed support',
      copy: 'What AI may draft, summarize, classify, check, or suggest.',
    },
    {
      icon: ShieldCheck,
      label: 'Review condition',
      copy: 'The moment a person must approve, override, or escalate.',
    },
    {
      icon: DatabaseZap,
      label: 'Write-back record',
      copy: 'Where the approved output, exception, or learning returns.',
    },
  ];

  return (
    <div className={styles.infographicWrapper}>
      <div className={styles.infographicTitle}>Workflow Policy Note</div>
      <div className={styles.signalGrid}>
        {fields.map((field, index) => {
          const Icon = field.icon;
          const isFinal = index === fields.length - 1;

          return (
            <div className={`${styles.signalCard} ${isFinal ? styles.signalCardHighlight : ''}`} key={field.label}>
              <div className={isFinal ? styles.signalIconHighlight : styles.signalIcon}>
                <Icon size={20} />
              </div>
              <div className={isFinal ? styles.signalMetricGold : styles.signalMetric}>{String(index + 1).padStart(2, '0')}</div>
              <div className={isFinal ? styles.signalLabelGold : styles.signalLabel}>{field.label}</div>
              <p className={isFinal ? styles.signalCopyGold : styles.signalCopy}>{field.copy}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function PolicyBoundaryRouteInfographic() {
  return (
    <div className={styles.infographicWrapper}>
      <div className={styles.infographicTitle}>Policy Boundary Route</div>
      <div className={styles.matrixScrollWrapper}>
        <table className={styles.matrixTable}>
          <thead>
            <tr>
              <th className={styles.matrixColHeader}>Workflow moment</th>
              <th className={styles.matrixColHeader}>Detached policy says</th>
              <th className={`${styles.matrixColHeader} ${styles.matrixColHeaderHighlight}`}>Workflow note says</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className={styles.matrixCellLabel}>Input</td>
              <td className={styles.matrixCell}>Protect sensitive data.</td>
              <td className={`${styles.matrixCell} ${styles.matrixCellHighlight}`}>Use only approved notes; remove private customer details.</td>
            </tr>
            <tr>
              <td className={styles.matrixCellLabel}>Output</td>
              <td className={styles.matrixCell}>Review AI-generated work.</td>
              <td className={`${styles.matrixCell} ${styles.matrixCellHighlight}`}>Founder reviews proof-sensitive claims before publishing.</td>
            </tr>
            <tr>
              <td className={styles.matrixCellLabel}>Action</td>
              <td className={styles.matrixCell}>Avoid excessive autonomy.</td>
              <td className={`${styles.matrixCell} ${styles.matrixCellHighlight}`}>AI may suggest next step; owner sends or rejects it.</td>
            </tr>
            <tr>
              <td className={styles.matrixCellLabel}>Record</td>
              <td className={styles.matrixCell}>Keep auditability in mind.</td>
              <td className={`${styles.matrixCell} ${styles.matrixCellHighlight}`}>Approved answer, exception, and owner decision write back.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function HandoffPacketMapInfographic() {
  const fields = [
    {
      icon: Workflow,
      label: 'Trigger',
      copy: 'The event that starts the handoff: call completed, lead qualified, issue escalated, or claim drafted.',
    },
    {
      icon: FolderSync,
      label: 'Context source',
      copy: 'The record the next owner can inspect without asking someone to reconstruct the history.',
    },
    {
      icon: ShieldCheck,
      label: 'Boundary',
      copy: 'The review, approval, exception, or human-led judgment condition that protects the route.',
    },
    {
      icon: DatabaseZap,
      label: 'Write-back',
      copy: 'The accepted output, correction, or learning returns to the system instead of disappearing into a thread.',
    },
  ];

  return (
    <div className={styles.infographicWrapper}>
      <div className={styles.infographicTitle}>Handoff Packet Map</div>
      <div className={styles.packetChecklist}>
        {fields.map((field, index) => {
          const Icon = field.icon;
          const isFinal = index === fields.length - 1;

          return (
            <div className={`${styles.packetItem} ${isFinal ? styles.packetItemHighlight : ''}`} key={field.label}>
              <div className={isFinal ? styles.packetIconHighlight : styles.packetIcon}>
                <Icon size={18} />
              </div>
              <div className={styles.packetContent}>
                <span className={styles.packetNumber}>{String(index + 1).padStart(2, '0')}</span>
                <h4>{field.label}</h4>
                <p>{field.copy}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function HandoffTraceRouteInfographic() {
  return (
    <div className={styles.infographicWrapper}>
      <div className={styles.infographicTitle}>Handoff Trace Route</div>
      <div className={styles.spineGrid}>
        <div className={styles.spineCard}>
          <div className={styles.spineStep}>01</div>
          <div className={styles.spineTitle}>Capture signal</div>
          <p className={styles.spineCopy}>
            Retain the call note, issue, decision, or source that made the workflow move.
          </p>
        </div>

        <div className={styles.spineConnector}>
          <ArrowRight className={styles.arrowIconDesktop} size={20} />
          <ArrowDown className={styles.arrowIconMobile} size={20} />
        </div>

        <div className={styles.spineCard}>
          <div className={styles.spineStep}>02</div>
          <div className={styles.spineTitle}>Carry context</div>
          <p className={styles.spineCopy}>
            Move owner, source, status, and review condition with the task.
          </p>
        </div>

        <div className={styles.spineConnector}>
          <ArrowRight className={styles.arrowIconDesktop} size={20} />
          <ArrowDown className={styles.arrowIconMobile} size={20} />
        </div>

        <div className={styles.spineCard}>
          <div className={styles.spineStep}>03</div>
          <div className={styles.spineTitle}>Act with judgment</div>
          <p className={styles.spineCopy}>
            A person approves, corrects, escalates, or rejects where trust and taste matter.
          </p>
        </div>

        <div className={styles.spineConnector}>
          <ArrowRight className={styles.arrowIconDesktop} size={20} />
          <ArrowDown className={styles.arrowIconMobile} size={20} />
        </div>

        <div className={`${styles.spineCard} ${styles.spineCardHighlight}`}>
          <div className={styles.spineStepHighlight}>04</div>
          <div className={styles.spineTitleHighlight}>Write back truth</div>
          <p className={styles.spineCopyHighlight}>
            The approved output and exception return to the operating record.
          </p>
        </div>
      </div>
    </div>
  );
}

// 2. The Priority Pyramid (Layered Stack)
export function TechStackInfographic() {
  return (
    <div className={styles.infographicWrapper}>
      <div className={styles.infographicTitle}>Priority Stack (Tech Comes Last)</div>
      <div className={styles.pyramidContainer}>
        
        <div className={`${styles.pyramidLayer} ${styles.layerTop}`}>
          <div className={styles.layerNum}>03</div>
          <div className={styles.layerContent}>
            <span className={styles.layerTitle}>Technology Stack</span>
            <span className={styles.layerDesc}>AI Agents, API Integrations, Webhooks</span>
          </div>
        </div>
        
        <div className={`${styles.pyramidLayer} ${styles.layerMiddle}`}>
          <div className={styles.layerNum}>02</div>
          <div className={styles.layerContent}>
            <span className={styles.layerTitle}>Operational Design</span>
            <span className={styles.layerDesc}>Process audit, bottleneck mapping, logic rules</span>
          </div>
        </div>
        
        <div className={`${styles.pyramidLayer} ${styles.layerBase}`}>
          <div className={styles.layerNum}>01</div>
          <div className={styles.layerContent}>
            <span className={styles.layerTitle}>Brand Strategy & Value Core</span>
            <span className={styles.layerDesc}>Unique IP, distinct positioning, commercial goals</span>
          </div>
        </div>

      </div>
    </div>
  );
}

// 3. The Intersection Equation (Venn / Equation Layout)
export function CinematicStandardInfographic() {
  return (
    <div className={styles.infographicWrapper}>
      <div className={styles.infographicTitle}>The Value Equation</div>
      <div className={styles.equationContainer}>
        
        <div className={styles.eqCard}>
          <div className={styles.eqIconWrapper}>
            <Cpu className={styles.eqIcon} size={24} />
          </div>
          <div className={styles.eqCardTitle}>AI Automation</div>
          <div className={styles.eqCardDesc}>Heavy lifting, data synthesis, and scale efficiency</div>
        </div>

        <div className={styles.eqOperator}>+</div>

        <div className={styles.eqCard}>
          <div className={styles.eqIconWrapper}>
            <Layers className={styles.eqIcon} size={24} />
          </div>
          <div className={styles.eqCardTitle}>Human Taste</div>
          <div className={styles.eqCardDesc}>Design thinking, storytelling, editorial curation</div>
        </div>

        <div className={styles.eqOperator}>=</div>

        <div className={`${styles.eqCard} ${styles.eqCardHighlight}`}>
          <div className={styles.eqIconWrapperHighlight}>
            <Zap className={styles.eqIconGold} size={24} />
          </div>
          <div className={styles.eqCardTitleGold}>Cinematic Standard</div>
          <div className={styles.eqCardDescGold}>Undeniably premium, self-optimizing brand output</div>
        </div>

      </div>
    </div>
  );
}

// 4. The Capability Matrix (Comparison Table Grid)
export function AgenticWorkflowsInfographic() {
  return (
    <div className={styles.infographicWrapper}>
      <div className={styles.infographicTitle}>Paradigm Comparison</div>
      <div className={styles.matrixScrollWrapper}>
        <table className={styles.matrixTable}>
          <thead>
            <tr>
              <th className={styles.matrixColHeader}>Dimension</th>
              <th className={styles.matrixColHeader}>Basic Automation (Zapier)</th>
              <th className={`${styles.matrixColHeader} ${styles.matrixColHeaderHighlight}`}>Agentic Workflows</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className={styles.matrixCellLabel}>Input Type</td>
              <td className={styles.matrixCell}>Rigid fields / Structured data</td>
              <td className={`${styles.matrixCell} ${styles.matrixCellHighlight}`}>Ambiguous, unstructured context</td>
            </tr>
            <tr>
              <td className={styles.matrixCellLabel}>Core Logic</td>
              <td className={styles.matrixCell}>&quot;If X happens, then do Y&quot; (Rigid)</td>
              <td className={`${styles.matrixCell} ${styles.matrixCellHighlight}`}>Autonomous reasoning & execution plans</td>
            </tr>
            <tr>
              <td className={styles.matrixCellLabel}>Ambiguity Handling</td>
              <td className={styles.matrixCell}>Breaks/fails immediately</td>
              <td className={`${styles.matrixCell} ${styles.matrixCellHighlight}`}>Adapts, infers intent, runs feedback loop</td>
            </tr>
            <tr>
              <td className={styles.matrixCellLabel}>Value Realized</td>
              <td className={styles.matrixCell}>Saves manual copy-paste time</td>
              <td className={`${styles.matrixCell} ${styles.matrixCellHighlight}`}>Scales expert human decision-making</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

// 5. The Horizontal Pipeline (Flow Loop)
export function SpatialAcquisitionInfographic() {
  return (
    <div className={styles.infographicWrapper}>
      <div className={styles.infographicTitle}>Spatial Acquisition Pipeline</div>
      <div className={styles.pipelineContainer}>
        
        <div className={styles.pipelineNode}>
          <div className={styles.pipelineStep}>01</div>
          <div className={styles.pipelineContent}>
            <div className={styles.pipelineNodeTitle}>Generative Render</div>
            <p className={styles.pipelineNodeDesc}>Digital staging replaces high-cost shoots at 1/10th the cost</p>
          </div>
        </div>

        <div className={styles.pipelineArrow}>
          <ArrowRight className={styles.arrowIconDesktop} size={20} />
          <ArrowDown className={styles.arrowIconMobile} size={20} />
        </div>

        <div className={styles.pipelineNode}>
          <div className={styles.pipelineStep}>02</div>
          <div className={styles.pipelineContent}>
            <div className={styles.pipelineNodeTitle}>Personalized CRM Layout</div>
            <p className={styles.pipelineNodeDesc}>Dynamically staged layouts matched to custom prospect specs</p>
          </div>
        </div>

        <div className={styles.pipelineArrow}>
          <ArrowRight className={styles.arrowIconDesktop} size={20} />
          <ArrowDown className={styles.arrowIconMobile} size={20} />
        </div>

        <div className={`${styles.pipelineNode} ${styles.pipelineNodeHighlight}`}>
          <div className={styles.pipelineStepHighlight}>03</div>
          <div className={styles.pipelineContent}>
            <div className={styles.pipelineNodeTitleHighlight}>Autonomous Leasing</div>
            <p className={styles.pipelineNodeDescHighlight}>AI agents pre-qualify and nurture CRM leads 24/7</p>
          </div>
        </div>

      </div>
    </div>
  );
}

export function WorkflowRedesignGapInfographic() {
  return (
    <div className={styles.infographicWrapper}>
      <div className={styles.infographicTitle}>The Workflow Redesign Gap</div>
      <div className={styles.signalGrid}>
        <div className={styles.signalCard}>
          <div className={styles.signalIcon}>
            <Radar size={20} />
          </div>
          <div className={styles.signalMetric}>82%</div>
          <div className={styles.signalLabel}>Leadership urgency</div>
          <p className={styles.signalCopy}>Leaders saying this is a pivotal year to rethink strategy and operations.</p>
        </div>

        <div className={styles.signalCard}>
          <div className={styles.signalIcon}>
            <Workflow size={20} />
          </div>
          <div className={styles.signalMetric}>21%</div>
          <div className={styles.signalLabel}>Workflow redesign</div>
          <p className={styles.signalCopy}>Organizations that say they have fundamentally redesigned at least some workflows.</p>
        </div>

        <div className={`${styles.signalCard} ${styles.signalCardHighlight}`}>
          <div className={styles.signalIconHighlight}>
            <Zap size={20} />
          </div>
          <div className={styles.signalMetricGold}>Biggest EBIT lever</div>
          <div className={styles.signalLabelGold}>Workflow logic, not tool count</div>
          <p className={styles.signalCopyGold}>The operating lift appears when AI is wired into redesigned execution paths.</p>
        </div>
      </div>
    </div>
  );
}

export function AgentOversightGapInfographic() {
  return (
    <div className={styles.infographicWrapper}>
      <div className={styles.infographicTitle}>Agent Use vs. Oversight</div>
      <div className={styles.oversightRail}>
        <div className={styles.oversightPanel}>
          <div className={styles.oversightHeading}>
            <CircleAlert className={styles.labelIconDanger} size={18} />
            Adoption pressure
          </div>
          <ul className={styles.oversightList}>
            <li>Agents are moving from pilots into real workflow decisions.</li>
            <li>Teams want faster routing, drafting, qualification, and follow-up.</li>
            <li>Activation often happens before the business defines review rules.</li>
          </ul>
        </div>

        <div className={styles.oversightDivider}>
          <ArrowRight className={styles.arrowIconDesktop} size={18} />
          <ArrowDown className={styles.arrowIconMobile} size={18} />
        </div>

        <div className={`${styles.oversightPanel} ${styles.oversightPanelHighlight}`}>
          <div className={styles.oversightHeadingGold}>
            <ShieldCheck className={styles.labelIconGold} size={18} />
            Governance floor
          </div>
          <div className={styles.oversightMetric}>1 in 5</div>
          <p className={styles.oversightCopy}>Companies reporting a mature governance model for autonomous AI agents.</p>
          <div className={styles.oversightRule}>Define approvals, audit trails, fallback paths, and human override points before scale.</div>
        </div>
      </div>
    </div>
  );
}

export function ReinventionPressureInfographic() {
  return (
    <div className={styles.infographicWrapper}>
      <div className={styles.infographicTitle}>The Reinvention Pressure Trap</div>
      <div className={styles.pressureRail}>
        <div className={styles.pressureCard}>
          <div className={styles.pressureMetric}>65%</div>
          <div className={styles.pressureLabel}>Pressure to adapt</div>
          <p className={styles.pressureCopy}>AI users who fear falling behind if they do not adapt quickly.</p>
        </div>

        <div className={styles.pressureConnector}>
          <ArrowRight className={styles.arrowIconDesktop} size={18} />
          <ArrowDown className={styles.arrowIconMobile} size={18} />
        </div>

        <div className={styles.pressureCard}>
          <div className={styles.pressureMetric}>45%</div>
          <div className={styles.pressureLabel}>Safety bias</div>
          <p className={styles.pressureCopy}>Workers who say it feels safer to focus on current goals than redesign work with AI.</p>
        </div>

        <div className={styles.pressureConnector}>
          <ArrowRight className={styles.arrowIconDesktop} size={18} />
          <ArrowDown className={styles.arrowIconMobile} size={18} />
        </div>

        <div className={`${styles.pressureCard} ${styles.pressureCardHighlight}`}>
          <div className={styles.pressureMetricGold}>13%</div>
          <div className={styles.pressureLabelGold}>Reinvention rewarded</div>
          <p className={styles.pressureCopyGold}>Workers who say they are rewarded for reinventing work with AI even if results are not met yet.</p>
        </div>
      </div>
    </div>
  );
}

export function OperatingReadinessStackInfographic() {
  return (
    <div className={styles.infographicWrapper}>
      <div className={styles.infographicTitle}>Operating Readiness Stack</div>
      <div className={styles.readinessGrid}>
        <div className={styles.readinessCard}>
          <div className={styles.readinessIcon}>
            <BrainCircuit size={20} />
          </div>
          <div className={styles.readinessHeading}>Strategic intent</div>
          <p className={styles.readinessCopy}>Leadership can see the opportunity and often funds experimentation early.</p>
        </div>

        <div className={styles.readinessCard}>
          <div className={styles.readinessIcon}>
            <Settings2 size={20} />
          </div>
          <div className={styles.readinessHeading}>Workflow design</div>
          <p className={styles.readinessCopy}>Roles, approvals, escalation paths, and quality thresholds have to be made explicit.</p>
        </div>

        <div className={`${styles.readinessCard} ${styles.readinessCardHighlight}`}>
          <div className={styles.readinessIconHighlight}>
            <DatabaseZap size={20} />
          </div>
          <div className={styles.readinessHeadingGold}>Operational spine</div>
          <p className={styles.readinessCopyGold}>Data integrity, system controls, and governance determine whether AI can compound into leverage.</p>
        </div>
      </div>
    </div>
  );
}

export function ReadinessBalanceInfographic() {
  return (
    <div className={styles.infographicWrapper}>
      <div className={styles.infographicTitle}>The Readiness Balance</div>
      <div className={styles.balanceGrid}>
        <div className={styles.balanceCard}>
          <div className={styles.balanceIcon}>
            <Settings2 size={20} />
          </div>
          <div className={styles.balanceTitle}>Technology only</div>
          <p className={styles.balanceCopy}>
            More tools, pilots, and access, but weak adoption because the workflow owner,
            review rules, and success metrics are still unclear.
          </p>
        </div>

        <div className={styles.balanceCard}>
          <div className={styles.balanceIcon}>
            <ShieldCheck size={20} />
          </div>
          <div className={styles.balanceTitle}>Governance only</div>
          <p className={styles.balanceCopy}>
            Strong caution and policy language, but little operational lift because the
            platform, data path, and build sequence never catch up.
          </p>
        </div>

        <div className={`${styles.balanceCard} ${styles.balanceCardHighlight}`}>
          <div className={styles.balanceIconHighlight}>
            <Scale size={20} />
          </div>
          <div className={styles.balanceMetric}>17.7%</div>
          <div className={styles.balanceLabel}>Balanced leaders</div>
          <p className={styles.balanceCopyHighlight}>
            The small share of organizations that align technology and organizational
            readiness are the ones reporting materially higher AI value.
          </p>
        </div>
      </div>
    </div>
  );
}

export function OperatingSpineInfographic() {
  return (
    <div className={styles.infographicWrapper}>
      <div className={styles.infographicTitle}>The Operating Spine</div>
      <div className={styles.spineGrid}>
        <div className={styles.spineCard}>
          <div className={styles.spineStep}>01</div>
          <div className={styles.spineTitle}>Context source</div>
          <p className={styles.spineCopy}>
            One trusted record for the workflow: CRM, project board, knowledge base, or
            reporting sheet.
          </p>
        </div>

        <div className={styles.spineConnector}>
          <ArrowRight className={styles.arrowIconDesktop} size={20} />
          <ArrowDown className={styles.arrowIconMobile} size={20} />
        </div>

        <div className={styles.spineCard}>
          <div className={styles.spineStep}>02</div>
          <div className={styles.spineTitle}>Decision rules</div>
          <p className={styles.spineCopy}>
            Define what AI can draft, what it can update, and which conditions force human
            review.
          </p>
        </div>

        <div className={styles.spineConnector}>
          <ArrowRight className={styles.arrowIconDesktop} size={20} />
          <ArrowDown className={styles.arrowIconMobile} size={20} />
        </div>

        <div className={styles.spineCard}>
          <div className={styles.spineStep}>03</div>
          <div className={styles.spineTitle}>Write-back path</div>
          <p className={styles.spineCopy}>
            The workflow must return updates to the system of record instead of leaving value
            trapped in a chat thread.
          </p>
        </div>

        <div className={styles.spineConnector}>
          <ArrowRight className={styles.arrowIconDesktop} size={20} />
          <ArrowDown className={styles.arrowIconMobile} size={20} />
        </div>

        <div className={`${styles.spineCard} ${styles.spineCardHighlight}`}>
          <div className={styles.spineStepHighlight}>04</div>
          <div className={styles.spineTitleHighlight}>Review signal</div>
          <p className={styles.spineCopyHighlight}>
            Quality checks, exceptions, and feedback loops keep the system useful as the
            workflow scales.
          </p>
        </div>
      </div>
      <div className={styles.spineLegend}>
        <div className={styles.spineLegendItem}>
          <FolderSync size={16} />
          System of record
        </div>
        <div className={styles.spineLegendItem}>
          <GitBranch size={16} />
          Escalation logic
        </div>
        <div className={styles.spineLegendItem}>
          <FileCheck2 size={16} />
          Output accountability
        </div>
        <div className={styles.spineLegendItem}>
          <DatabaseZap size={16} />
          Durable operating memory
        </div>
      </div>
    </div>
  );
}

export function GovernanceSidecarGapInfographic() {
  return (
    <div className={styles.infographicWrapper}>
      <div className={styles.infographicTitle}>Governance Placement Gap</div>
      <div className={styles.comparisonGrid}>
        <div className={styles.wrongWay}>
          <div className={styles.wayLabel}>
            <CircleAlert className={styles.labelIconDanger} size={16} />
            Sidecar governance
          </div>
          <div className={styles.flow}>
            <div className={`${styles.node} ${styles.nodeBroken}`}>Policy deck and workshop</div>
            <ArrowDown className={styles.arrow} size={18} />
            <div className={`${styles.node} ${styles.nodeBroken}`}>Workflow ships with vague handoffs</div>
            <ArrowDown className={styles.arrow} size={18} />
            <div className={`${styles.node} ${styles.nodeDanger}`}>Outputs move faster than oversight</div>
          </div>
        </div>

        <div className={styles.rightWay}>
          <div className={styles.wayLabel}>
            <ShieldCheck className={styles.labelIconGold} size={16} />
            Embedded governance
          </div>
          <div className={styles.flow}>
            <div className={`${styles.node} ${styles.nodeGold}`}>Permissions and source of truth defined</div>
            <ArrowDown className={styles.arrowGold} size={18} />
            <div className={`${styles.node} ${styles.nodeGold}`}>Approval and exception rules in-route</div>
            <ArrowDown className={styles.arrowGold} size={18} />
            <div className={`${styles.node} ${styles.nodeSolid}`}>AI can move with accountable control</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function WorkflowGovernanceLoopInfographic() {
  return (
    <div className={styles.infographicWrapper}>
      <div className={styles.infographicTitle}>Workflow Governance Loop</div>
      <div className={styles.spineGrid}>
        <div className={styles.spineCard}>
          <div className={styles.spineStep}>01</div>
          <div className={styles.spineTitle}>Trusted record</div>
          <p className={styles.spineCopy}>
            Define the system of record the workflow reads from and writes back to.
          </p>
        </div>

        <div className={styles.spineConnector}>
          <ArrowRight className={styles.arrowIconDesktop} size={20} />
          <ArrowDown className={styles.arrowIconMobile} size={20} />
        </div>

        <div className={styles.spineCard}>
          <div className={styles.spineStep}>02</div>
          <div className={styles.spineTitle}>Action boundary</div>
          <p className={styles.spineCopy}>
            Make explicit what the system may draft, decide, update, or trigger.
          </p>
        </div>

        <div className={styles.spineConnector}>
          <ArrowRight className={styles.arrowIconDesktop} size={20} />
          <ArrowDown className={styles.arrowIconMobile} size={20} />
        </div>

        <div className={styles.spineCard}>
          <div className={styles.spineStep}>03</div>
          <div className={styles.spineTitle}>Review signal</div>
          <p className={styles.spineCopy}>
            Thresholds, exceptions, and approvals decide when humans re-enter the route.
          </p>
        </div>

        <div className={styles.spineConnector}>
          <ArrowRight className={styles.arrowIconDesktop} size={20} />
          <ArrowDown className={styles.arrowIconMobile} size={20} />
        </div>

        <div className={`${styles.spineCard} ${styles.spineCardHighlight}`}>
          <div className={styles.spineStepHighlight}>04</div>
          <div className={styles.spineTitleHighlight}>Retained trace</div>
          <p className={styles.spineCopyHighlight}>
            Durable logs, updated records, and feedback signals keep the workflow governable over time.
          </p>
        </div>
      </div>
      <div className={styles.spineLegend}>
        <div className={styles.spineLegendItem}>
          <FolderSync size={16} />
          System memory
        </div>
        <div className={styles.spineLegendItem}>
          <ShieldCheck size={16} />
          Human control
        </div>
        <div className={styles.spineLegendItem}>
          <GitBranch size={16} />
          Escalation path
        </div>
        <div className={styles.spineLegendItem}>
          <FileCheck2 size={16} />
          Auditability
        </div>
      </div>
    </div>
  );
}

export function ReviewCapacityGapInfographic() {
  return (
    <div className={styles.infographicWrapper}>
      <div className={styles.infographicTitle}>Review Capacity Gap</div>
      <div className={styles.signalGrid}>
        <div className={styles.signalCard}>
          <div className={styles.signalIcon}>
            <Settings2 size={20} />
          </div>
          <div className={styles.signalMetric}>85%</div>
          <div className={styles.signalLabel}>Agent customization</div>
          <p className={styles.signalCopy}>Companies expecting to tailor agents to the unique needs of their business.</p>
        </div>

        <div className={styles.signalCard}>
          <div className={styles.signalIcon}>
            <ShieldCheck size={20} />
          </div>
          <div className={styles.signalMetric}>21%</div>
          <div className={styles.signalLabel}>Mature governance</div>
          <p className={styles.signalCopy}>Organizations reporting a mature model for autonomous agent governance.</p>
        </div>

        <div className={`${styles.signalCard} ${styles.signalCardHighlight}`}>
          <div className={styles.signalIconHighlight}>
            <FileCheck2 size={20} />
          </div>
          <div className={styles.signalMetricGold}>Review system</div>
          <div className={styles.signalLabelGold}>What closes the gap</div>
          <p className={styles.signalCopyGold}>Checks, dashboards, escalation logic, and write-back rules keep higher AI output commercially usable.</p>
        </div>
      </div>
    </div>
  );
}

export function ReviewOperatingLoopInfographic() {
  return (
    <div className={styles.infographicWrapper}>
      <div className={styles.infographicTitle}>Review Operating Loop</div>
      <div className={styles.spineGrid}>
        <div className={styles.spineCard}>
          <div className={styles.spineStep}>01</div>
          <div className={styles.spineTitle}>Draft at speed</div>
          <p className={styles.spineCopy}>
            Let AI handle the first pass where repetition is high and the commercial context is well defined.
          </p>
        </div>

        <div className={styles.spineConnector}>
          <ArrowRight className={styles.arrowIconDesktop} size={20} />
          <ArrowDown className={styles.arrowIconMobile} size={20} />
        </div>

        <div className={styles.spineCard}>
          <div className={styles.spineStep}>02</div>
          <div className={styles.spineTitle}>Score and route</div>
          <p className={styles.spineCopy}>
            Use thresholds, dashboards, and exception rules to decide what advances and what needs human review.
          </p>
        </div>

        <div className={styles.spineConnector}>
          <ArrowRight className={styles.arrowIconDesktop} size={20} />
          <ArrowDown className={styles.arrowIconMobile} size={20} />
        </div>

        <div className={styles.spineCard}>
          <div className={styles.spineStep}>03</div>
          <div className={styles.spineTitle}>Write back context</div>
          <p className={styles.spineCopy}>
            Approved decisions, corrections, and next actions return to the system of record instead of staying trapped in chat.
          </p>
        </div>

        <div className={styles.spineConnector}>
          <ArrowRight className={styles.arrowIconDesktop} size={20} />
          <ArrowDown className={styles.arrowIconMobile} size={20} />
        </div>

        <div className={`${styles.spineCard} ${styles.spineCardHighlight}`}>
          <div className={styles.spineStepHighlight}>04</div>
          <div className={styles.spineTitleHighlight}>Improve the route</div>
          <p className={styles.spineCopyHighlight}>
            Feedback turns into stronger prompts, safer boundaries, and a more reliable operating pipeline over time.
          </p>
        </div>
      </div>
      <div className={styles.spineLegend}>
        <div className={styles.spineLegendItem}>
          <Radar size={16} />
          Live monitoring
        </div>
        <div className={styles.spineLegendItem}>
          <GitBranch size={16} />
          Escalation rules
        </div>
        <div className={styles.spineLegendItem}>
          <FolderSync size={16} />
          System memory
        </div>
        <div className={styles.spineLegendItem}>
          <DatabaseZap size={16} />
          Continuous improvement
        </div>
      </div>
    </div>
  );
}

export function PromptSprawlVsOrchestrationInfographic() {
  return (
    <div className={styles.infographicWrapper}>
      <div className={styles.infographicTitle}>Prompt Sprawl vs. Orchestrated Work</div>
      <div className={styles.matrixScrollWrapper}>
        <table className={styles.matrixTable}>
          <thead>
            <tr>
              <th className={styles.matrixColHeader}>Dimension</th>
              <th className={styles.matrixColHeader}>Prompt sprawl</th>
              <th className={`${styles.matrixColHeader} ${styles.matrixColHeaderHighlight}`}>Orchestrated workflow</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className={styles.matrixCellLabel}>Context</td>
              <td className={styles.matrixCell}>Lives across chats, tabs, and personal notes.</td>
              <td className={`${styles.matrixCell} ${styles.matrixCellHighlight}`}>Pulled from a defined source of truth at the right step.</td>
            </tr>
            <tr>
              <td className={styles.matrixCellLabel}>Routing</td>
              <td className={styles.matrixCell}>Humans keep deciding what happens next by memory.</td>
              <td className={`${styles.matrixCell} ${styles.matrixCellHighlight}`}>Branching, approvals, and handoffs are explicit.</td>
            </tr>
            <tr>
              <td className={styles.matrixCellLabel}>Memory</td>
              <td className={styles.matrixCell}>Corrections stay trapped in one-off conversations.</td>
              <td className={`${styles.matrixCell} ${styles.matrixCellHighlight}`}>Decisions and updates write back into the workflow.</td>
            </tr>
            <tr>
              <td className={styles.matrixCellLabel}>Scale effect</td>
              <td className={styles.matrixCell}>More output creates more coordination drag.</td>
              <td className={`${styles.matrixCell} ${styles.matrixCellHighlight}`}>More output compounds into a clearer operating pipeline.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function OrchestrationControlPlaneInfographic() {
  return (
    <div className={styles.infographicWrapper}>
      <div className={styles.infographicTitle}>The Orchestration Control Plane</div>
      <div className={styles.spineGrid}>
        <div className={styles.spineCard}>
          <div className={styles.spineStep}>01</div>
          <div className={styles.spineTitle}>Context intake</div>
          <p className={styles.spineCopy}>
            Pull the right records, references, and constraints into the route before work begins.
          </p>
        </div>

        <div className={styles.spineConnector}>
          <ArrowRight className={styles.arrowIconDesktop} size={20} />
          <ArrowDown className={styles.arrowIconMobile} size={20} />
        </div>

        <div className={styles.spineCard}>
          <div className={styles.spineStep}>02</div>
          <div className={styles.spineTitle}>Routing logic</div>
          <p className={styles.spineCopy}>
            Define which step drafts, which step checks, and which condition escalates to a human owner.
          </p>
        </div>

        <div className={styles.spineConnector}>
          <ArrowRight className={styles.arrowIconDesktop} size={20} />
          <ArrowDown className={styles.arrowIconMobile} size={20} />
        </div>

        <div className={styles.spineCard}>
          <div className={styles.spineStep}>03</div>
          <div className={styles.spineTitle}>System action</div>
          <p className={styles.spineCopy}>
            Let the workflow update the CRM, project board, report, or content queue instead of stopping at output.
          </p>
        </div>

        <div className={styles.spineConnector}>
          <ArrowRight className={styles.arrowIconDesktop} size={20} />
          <ArrowDown className={styles.arrowIconMobile} size={20} />
        </div>

        <div className={`${styles.spineCard} ${styles.spineCardHighlight}`}>
          <div className={styles.spineStepHighlight}>04</div>
          <div className={styles.spineTitleHighlight}>Retained memory</div>
          <p className={styles.spineCopyHighlight}>
            Logs, corrections, and outcomes stay inside the operating system so the next cycle starts smarter.
          </p>
        </div>
      </div>
      <div className={styles.spineLegend}>
        <div className={styles.spineLegendItem}>
          <FolderSync size={16} />
          Source of truth
        </div>
        <div className={styles.spineLegendItem}>
          <GitBranch size={16} />
          Routing rules
        </div>
        <div className={styles.spineLegendItem}>
          <ShieldCheck size={16} />
          Human override
        </div>
        <div className={styles.spineLegendItem}>
          <DatabaseZap size={16} />
          Durable memory
        </div>
      </div>
    </div>
  );
}

export function TokenomicsTradeoffInfographic() {
  return (
    <div className={styles.infographicWrapper}>
      <div className={styles.infographicTitle}>Tokenomics Tradeoff</div>
      <div className={styles.matrixScrollWrapper}>
        <table className={styles.matrixTable}>
          <thead>
            <tr>
              <th className={styles.matrixColHeader}>Dimension</th>
              <th className={styles.matrixColHeader}>Software-budget view</th>
              <th className={`${styles.matrixColHeader} ${styles.matrixColHeaderHighlight}`}>Operating-economics view</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className={styles.matrixCellLabel}>Baseline</td>
              <td className={styles.matrixCell}>Measured like another SaaS subscription.</td>
              <td className={`${styles.matrixCell} ${styles.matrixCellHighlight}`}>Measured against the human time, quality, and delay it replaces.</td>
            </tr>
            <tr>
              <td className={styles.matrixCellLabel}>Waste source</td>
              <td className={styles.matrixCell}>Focus stays on model price alone.</td>
              <td className={`${styles.matrixCell} ${styles.matrixCellHighlight}`}>Waste includes reruns, weak routing, duplicated review, and missing write-back.</td>
            </tr>
            <tr>
              <td className={styles.matrixCellLabel}>Decision owner</td>
              <td className={styles.matrixCell}>IT or procurement manages the line item.</td>
              <td className={`${styles.matrixCell} ${styles.matrixCellHighlight}`}>Workflow owners decide where AI creates real operating leverage.</td>
            </tr>
            <tr>
              <td className={styles.matrixCellLabel}>Success signal</td>
              <td className={styles.matrixCell}>Usage rises and access expands.</td>
              <td className={`${styles.matrixCell} ${styles.matrixCellHighlight}`}>The workflow gets faster, safer, and commercially cheaper end to end.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function CostControlLoopInfographic() {
  return (
    <div className={styles.infographicWrapper}>
      <div className={styles.infographicTitle}>Cost Control Loop</div>
      <div className={styles.spineGrid}>
        <div className={styles.spineCard}>
          <div className={styles.spineStep}>01</div>
          <div className={styles.spineTitle}>Choose the route</div>
          <p className={styles.spineCopy}>
            Start with one workflow where time, quality, or turnaround visibly affects revenue, delivery, or trust.
          </p>
        </div>

        <div className={styles.spineConnector}>
          <ArrowRight className={styles.arrowIconDesktop} size={20} />
          <ArrowDown className={styles.arrowIconMobile} size={20} />
        </div>

        <div className={styles.spineCard}>
          <div className={styles.spineStep}>02</div>
          <div className={styles.spineTitle}>Constrain context</div>
          <p className={styles.spineCopy}>
            Pull in only the records, references, and rules the step actually needs instead of flooding every run with excess context.
          </p>
        </div>

        <div className={styles.spineConnector}>
          <ArrowRight className={styles.arrowIconDesktop} size={20} />
          <ArrowDown className={styles.arrowIconMobile} size={20} />
        </div>

        <div className={styles.spineCard}>
          <div className={styles.spineStep}>03</div>
          <div className={styles.spineTitle}>Route review</div>
          <p className={styles.spineCopy}>
            Use thresholds and exception rules so humans review the expensive or risky outputs, not every routine draft.
          </p>
        </div>

        <div className={styles.spineConnector}>
          <ArrowRight className={styles.arrowIconDesktop} size={20} />
          <ArrowDown className={styles.arrowIconMobile} size={20} />
        </div>

        <div className={`${styles.spineCard} ${styles.spineCardHighlight}`}>
          <div className={styles.spineStepHighlight}>04</div>
          <div className={styles.spineTitleHighlight}>Measure write-back</div>
          <p className={styles.spineCopyHighlight}>
            Track whether approved output updates the system of record and reduces repeat work in the next cycle.
          </p>
        </div>
      </div>
      <div className={styles.spineLegend}>
        <div className={styles.spineLegendItem}>
          <Workflow size={16} />
          Workflow value
        </div>
        <div className={styles.spineLegendItem}>
          <FolderSync size={16} />
          Lean context
        </div>
        <div className={styles.spineLegendItem}>
          <ShieldCheck size={16} />
          Review thresholds
        </div>
        <div className={styles.spineLegendItem}>
          <DatabaseZap size={16} />
          Durable savings
        </div>
      </div>
    </div>
  );
}

export function AgentObservabilityGapInfographic() {
  return (
    <div className={styles.infographicWrapper}>
      <div className={styles.infographicTitle}>Agent Observability Gap</div>
      <div className={styles.signalGrid}>
        <div className={styles.signalCard}>
          <div className={styles.signalIcon}>
            <ShieldCheck size={20} />
          </div>
          <div className={styles.signalMetric}>21%</div>
          <div className={styles.signalLabel}>Mature governance</div>
          <p className={styles.signalCopy}>Enterprises reporting a mature governance model for agentic AI.</p>
        </div>

        <div className={styles.signalCard}>
          <div className={styles.signalIcon}>
            <Workflow size={20} />
          </div>
          <div className={styles.signalMetric}>74%</div>
          <div className={styles.signalLabel}>Agent adoption</div>
          <p className={styles.signalCopy}>Respondents expecting at least moderate agent use by 2027.</p>
        </div>

        <div className={`${styles.signalCard} ${styles.signalCardHighlight}`}>
          <div className={styles.signalIconHighlight}>
            <Radar size={20} />
          </div>
          <div className={styles.signalMetricGold}>Visibility layer</div>
          <div className={styles.signalLabelGold}>What closes the gap</div>
          <p className={styles.signalCopyGold}>Traces, monitoring, review signals, and audit trails turn agent activity into operating evidence.</p>
        </div>
      </div>
    </div>
  );
}

export function TraceToTrustLoopInfographic() {
  return (
    <div className={styles.infographicWrapper}>
      <div className={styles.infographicTitle}>Trace To Trust Loop</div>
      <div className={styles.spineGrid}>
        <div className={styles.spineCard}>
          <div className={styles.spineStep}>01</div>
          <div className={styles.spineTitle}>Context trace</div>
          <p className={styles.spineCopy}>
            Capture which source records, constraints, and references entered the workflow.
          </p>
        </div>

        <div className={styles.spineConnector}>
          <ArrowRight className={styles.arrowIconDesktop} size={20} />
          <ArrowDown className={styles.arrowIconMobile} size={20} />
        </div>

        <div className={styles.spineCard}>
          <div className={styles.spineStep}>02</div>
          <div className={styles.spineTitle}>Action trace</div>
          <p className={styles.spineCopy}>
            Record the tool call, handoff, branch, or recommendation the agent selected.
          </p>
        </div>

        <div className={styles.spineConnector}>
          <ArrowRight className={styles.arrowIconDesktop} size={20} />
          <ArrowDown className={styles.arrowIconMobile} size={20} />
        </div>

        <div className={styles.spineCard}>
          <div className={styles.spineStep}>03</div>
          <div className={styles.spineTitle}>Review trace</div>
          <p className={styles.spineCopy}>
            Show which threshold, exception, or human checkpoint shaped the final decision.
          </p>
        </div>

        <div className={styles.spineConnector}>
          <ArrowRight className={styles.arrowIconDesktop} size={20} />
          <ArrowDown className={styles.arrowIconMobile} size={20} />
        </div>

        <div className={`${styles.spineCard} ${styles.spineCardHighlight}`}>
          <div className={styles.spineStepHighlight}>04</div>
          <div className={styles.spineTitleHighlight}>Trusted write-back</div>
          <p className={styles.spineCopyHighlight}>
            Approved outputs update the system of record with enough evidence to audit and improve the route.
          </p>
        </div>
      </div>
      <div className={styles.spineLegend}>
        <div className={styles.spineLegendItem}>
          <FolderSync size={16} />
          Source evidence
        </div>
        <div className={styles.spineLegendItem}>
          <GitBranch size={16} />
          Decision path
        </div>
        <div className={styles.spineLegendItem}>
          <FileCheck2 size={16} />
          Review proof
        </div>
        <div className={styles.spineLegendItem}>
          <DatabaseZap size={16} />
          Durable record
        </div>
      </div>
    </div>
  );
}

export function ContextSprawlVsEngineeringInfographic() {
  return (
    <div className={styles.infographicWrapper}>
      <div className={styles.infographicTitle}>Context Sprawl vs. Context Engineering</div>
      <div className={styles.matrixScrollWrapper}>
        <table className={styles.matrixTable}>
          <thead>
            <tr>
              <th className={styles.matrixColHeader}>Dimension</th>
              <th className={styles.matrixColHeader}>Context sprawl</th>
              <th className={`${styles.matrixColHeader} ${styles.matrixColHeaderHighlight}`}>Context engineering</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className={styles.matrixCellLabel}>Knowledge source</td>
              <td className={styles.matrixCell}>Lives across chats, docs, tickets, CRM notes, and personal memory.</td>
              <td className={`${styles.matrixCell} ${styles.matrixCellHighlight}`}>Pulled from defined systems of record at the moment of work.</td>
            </tr>
            <tr>
              <td className={styles.matrixCellLabel}>Permission model</td>
              <td className={styles.matrixCell}>Access is handled ad hoc by whoever is prompting the system.</td>
              <td className={`${styles.matrixCell} ${styles.matrixCellHighlight}`}>Context respects role, workflow, and data-boundary rules.</td>
            </tr>
            <tr>
              <td className={styles.matrixCellLabel}>Agent behavior</td>
              <td className={styles.matrixCell}>The agent guesses, overreads, or asks humans to rebuild context.</td>
              <td className={`${styles.matrixCell} ${styles.matrixCellHighlight}`}>The agent retrieves the right facts, constraints, and recent decisions.</td>
            </tr>
            <tr>
              <td className={styles.matrixCellLabel}>Scale effect</td>
              <td className={styles.matrixCell}>More agents create more context debt and review burden.</td>
              <td className={`${styles.matrixCell} ${styles.matrixCellHighlight}`}>Each approved cycle strengthens business memory and future routing.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function ContextQualityLoopInfographic() {
  return (
    <div className={styles.infographicWrapper}>
      <div className={styles.infographicTitle}>Context Quality Loop</div>
      <div className={styles.spineGrid}>
        <div className={styles.spineCard}>
          <div className={styles.spineStep}>01</div>
          <div className={styles.spineTitle}>Map the work</div>
          <p className={styles.spineCopy}>
            Identify the workflow where better context changes speed, judgment, or client trust.
          </p>
        </div>

        <div className={styles.spineConnector}>
          <ArrowRight className={styles.arrowIconDesktop} size={20} />
          <ArrowDown className={styles.arrowIconMobile} size={20} />
        </div>

        <div className={styles.spineCard}>
          <div className={styles.spineStep}>02</div>
          <div className={styles.spineTitle}>Define the source</div>
          <p className={styles.spineCopy}>
            Decide which CRM, knowledge base, project board, or approved document owns each fact.
          </p>
        </div>

        <div className={styles.spineConnector}>
          <ArrowRight className={styles.arrowIconDesktop} size={20} />
          <ArrowDown className={styles.arrowIconMobile} size={20} />
        </div>

        <div className={styles.spineCard}>
          <div className={styles.spineStep}>03</div>
          <div className={styles.spineTitle}>Retrieve with rules</div>
          <p className={styles.spineCopy}>
            Give agents only the records, constraints, and permissions the workflow step needs.
          </p>
        </div>

        <div className={styles.spineConnector}>
          <ArrowRight className={styles.arrowIconDesktop} size={20} />
          <ArrowDown className={styles.arrowIconMobile} size={20} />
        </div>

        <div className={`${styles.spineCard} ${styles.spineCardHighlight}`}>
          <div className={styles.spineStepHighlight}>04</div>
          <div className={styles.spineTitleHighlight}>Write back learning</div>
          <p className={styles.spineCopyHighlight}>
            Corrections, approvals, and outcomes return to the system so context improves over time.
          </p>
        </div>
      </div>
      <div className={styles.spineLegend}>
        <div className={styles.spineLegendItem}>
          <Workflow size={16} />
          Workflow context
        </div>
        <div className={styles.spineLegendItem}>
          <FolderSync size={16} />
          Source of truth
        </div>
        <div className={styles.spineLegendItem}>
          <ShieldCheck size={16} />
          Permission boundary
        </div>
        <div className={styles.spineLegendItem}>
          <DatabaseZap size={16} />
          Business memory
        </div>
      </div>
    </div>
  );
}

export function WorkAsDoneAuditInfographic() {
  const auditSignals = [
    {
      label: 'Trigger',
      title: 'Where work starts',
      copy: 'The request, event, or friction point that actually begins the workflow.',
      icon: <Radar size={18} />,
    },
    {
      label: 'Handoff',
      title: 'How work moves',
      copy: 'The real route across people, tools, meetings, chats, and approvals.',
      icon: <GitBranch size={18} />,
    },
    {
      label: 'Decision',
      title: 'Who owns judgment',
      copy: 'The person, rule, or threshold that decides what can move forward.',
      icon: <ShieldCheck size={18} />,
    },
    {
      label: 'Record',
      title: 'What is retained',
      copy: 'The source of truth that stores the approved result for the next cycle.',
      icon: <FolderSync size={18} />,
    },
  ];

  return (
    <div className={styles.infographicWrapper}>
      <div className={styles.infographicTitle}>Work-As-Done Audit Map</div>
      <div className={styles.auditMapShell}>
        <div className={styles.auditMapCenter}>
          <span className={styles.auditCenterLabel}>Audit focus</span>
          <strong>One workflow worth building</strong>
          <p>Observed in the business before the tool is selected.</p>
        </div>

        {auditSignals.map((signal, index) => (
          <div
            key={signal.label}
            className={`${styles.auditSignal} ${styles[`auditSignal${index + 1}` as keyof typeof styles] || ''}`}
          >
            <div className={styles.auditSignalIcon}>{signal.icon}</div>
            <span className={styles.auditSignalLabel}>{signal.label}</span>
            <strong>{signal.title}</strong>
            <p>{signal.copy}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function AuditToAdoptionMapInfographic() {
  return (
    <div className={styles.infographicWrapper}>
      <div className={styles.infographicTitle}>Audit To Adoption Map</div>
      <div className={styles.adoptionMap}>
        <div className={styles.adoptionColumn}>
          <span className={styles.adoptionStep}>01</span>
          <h4>Map the real route</h4>
          <p>Capture the actual trigger, handoff, decision owner, source record, and exception path.</p>
          <div className={styles.adoptionCheck}>
            <FileCheck2 size={15} />
            Work-as-done is visible.
          </div>
        </div>

        <div className={styles.adoptionDivider}></div>

        <div className={styles.adoptionColumn}>
          <span className={styles.adoptionStep}>02</span>
          <h4>Build the smallest support</h4>
          <p>Add the document, workflow, AI assistance, intake form, or integration that removes one ambiguity.</p>
          <div className={styles.adoptionCheck}>
            <Workflow size={15} />
            The build serves the route.
          </div>
        </div>

        <div className={styles.adoptionDivider}></div>

        <div className={`${styles.adoptionColumn} ${styles.adoptionColumnHighlight}`}>
          <span className={styles.adoptionStepHighlight}>03</span>
          <h4>Prove adoption</h4>
          <p>Check whether people use the support layer, records improve, and external communication becomes clearer.</p>
          <div className={styles.adoptionCheckHighlight}>
            <CheckCircle2 size={15} />
            The system becomes daily work.
          </div>
        </div>
      </div>
    </div>
  );
}

export function PresenceReadinessGateInfographic() {
  return (
    <div className={styles.infographicWrapper}>
      <div className={styles.infographicTitle}>Presence Readiness Gate</div>
      <div className={styles.presenceGate}>
        <div className={styles.gatePanel}>
          <div className={styles.gatePanelLabel}>
            <CircleAlert className={styles.labelIconDanger} size={16} />
            Hold the insight
          </div>
          <div className={styles.gateIssue}>Only lives in a call, chat, or founder memory</div>
          <div className={styles.gateIssue}>No retained source of truth</div>
          <div className={styles.gateIssue}>Claim owner is unclear</div>
        </div>

        <div className={styles.gateCore}>
          <div className={styles.gateCoreIcon}>
            <FileCheck2 size={22} />
          </div>
          <div className={styles.gateCoreTitle}>Publish?</div>
          <p className={styles.gateCoreCopy}>Only after the signal can survive operational review.</p>
        </div>

        <div className={`${styles.gatePanel} ${styles.gatePanelReady}`}>
          <div className={styles.gatePanelLabelGold}>
            <CheckCircle2 className={styles.labelIconGold} size={16} />
            Ready for presence
          </div>
          <div className={styles.gateReadyItem}>Signal came from real work</div>
          <div className={styles.gateReadyItem}>Evidence is retained and current</div>
          <div className={styles.gateReadyItem}>Message has a clear owner</div>
        </div>
      </div>
    </div>
  );
}

export function IntelligenceToPresenceBriefInfographic() {
  const stages = [
    {
      icon: Radar,
      label: 'Operational signal',
      copy: 'A repeated question, objection, bottleneck, or delivery lesson appears in real work.',
    },
    {
      icon: FolderSync,
      label: 'Retained evidence',
      copy: 'The team can point to the record, source, or documented workflow behind the insight.',
    },
    {
      icon: MessageSquareText,
      label: 'Owned interpretation',
      copy: 'A founder or subject owner decides what the signal means and what claim is safe.',
    },
    {
      icon: Megaphone,
      label: 'Public presence',
      copy: 'The approved insight becomes a post, article, sales note, deck, or website message.',
    },
  ];

  return (
    <div className={styles.infographicWrapper}>
      <div className={styles.infographicTitle}>Intelligence To Presence Brief</div>
      <div className={styles.briefBoard}>
        {stages.map((stage, index) => {
          const Icon = stage.icon;

          return (
            <React.Fragment key={stage.label}>
              <div className={`${styles.briefCard} ${index === stages.length - 1 ? styles.briefCardHighlight : ''}`}>
                <div className={index === stages.length - 1 ? styles.briefIconHighlight : styles.briefIcon}>
                  <Icon size={18} />
                </div>
                <div className={index === stages.length - 1 ? styles.briefLabelGold : styles.briefLabel}>{stage.label}</div>
                <p className={index === stages.length - 1 ? styles.briefCopyGold : styles.briefCopy}>{stage.copy}</p>
              </div>
              {index < stages.length - 1 ? (
                <div className={styles.briefConnector}>
                  <ArrowRight className={styles.arrowIconDesktop} size={18} />
                  <ArrowDown className={styles.arrowIconMobile} size={18} />
                </div>
              ) : null}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

export function AdoptionPacketChecklistInfographic() {
  const packetItems = [
    {
      icon: Radar,
      label: 'Workflow purpose',
      copy: 'Which recurring route is being supported, and why it matters commercially.',
    },
    {
      icon: ShieldCheck,
      label: 'Human owner',
      copy: 'Who remains accountable for quality, judgment, exceptions, and approval.',
    },
    {
      icon: GitBranch,
      label: 'Override rule',
      copy: 'The condition that stops the system and brings a person back into the route.',
    },
    {
      icon: FolderSync,
      label: 'Retained record',
      copy: 'Where the approved output, correction, or next action is stored for reuse.',
    },
  ];

  return (
    <div className={styles.infographicWrapper}>
      <div className={styles.infographicTitle}>Adoption Packet Checklist</div>
      <div className={styles.packetChecklist}>
        {packetItems.map((item, index) => {
          const Icon = item.icon;

          return (
            <div className={`${styles.packetItem} ${index === packetItems.length - 1 ? styles.packetItemHighlight : ''}`} key={item.label}>
              <div className={index === packetItems.length - 1 ? styles.packetIconHighlight : styles.packetIcon}>
                <Icon size={18} />
              </div>
              <div className={styles.packetContent}>
                <span className={styles.packetNumber}>{String(index + 1).padStart(2, '0')}</span>
                <h4>{item.label}</h4>
                <p>{item.copy}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function AssistLeadOverrideMapInfographic() {
  return (
    <div className={styles.infographicWrapper}>
      <div className={styles.infographicTitle}>Assist, Lead, Override Map</div>
      <div className={styles.boundaryMap}>
        <div className={styles.boundaryColumn}>
          <span className={styles.boundaryStep}>01</span>
          <h4>Automated where useful</h4>
          <p>Repetitive routing, formatting, reminders, extraction, and low-risk updates can move without adding judgment debt.</p>
          <div className={styles.boundaryTag}>System handles repetition</div>
        </div>

        <div className={styles.boundaryDivider}></div>

        <div className={`${styles.boundaryColumn} ${styles.boundaryColumnAssist}`}>
          <span className={styles.boundaryStepAssist}>02</span>
          <h4>AI-assisted where judgment needs support</h4>
          <p>Drafting, summarizing, classification, proposal prep, research, and content planning should support a human decision owner.</p>
          <div className={styles.boundaryTagAssist}>AI supports the decision</div>
        </div>

        <div className={styles.boundaryDivider}></div>

        <div className={`${styles.boundaryColumn} ${styles.boundaryColumnHighlight}`}>
          <span className={styles.boundaryStepHighlight}>03</span>
          <h4>Human-led where trust matters</h4>
          <p>Pricing judgment, client promises, sensitive communication, taste, exceptions, and final approvals stay with accountable people.</p>
          <div className={styles.boundaryTagHighlight}>People own the standard</div>
        </div>
      </div>
    </div>
  );
}

export function FrontstageBackstageBridgeInfographic() {
  return (
    <div className={styles.infographicWrapper}>
      <div className={styles.infographicTitle}>Frontstage / Backstage Alignment</div>
      <div className={styles.presenceGate}>
        <div className={styles.gatePanel}>
          <div className={styles.gatePanelLabel}>
            <Megaphone className={styles.labelIconDanger} size={16} />
            Frontstage promise
          </div>
          <div className={styles.gateIssue}>Website message</div>
          <div className={styles.gateIssue}>Sales conversation</div>
          <div className={styles.gateIssue}>Customer expectation</div>
        </div>

        <div className={styles.gateCore}>
          <div className={styles.gateCoreIcon}>
            <GitBranch size={22} />
          </div>
          <div className={styles.gateCoreTitle}>Handoff?</div>
          <p className={styles.gateCoreCopy}>The promise is only safe when the internal route can support it.</p>
        </div>

        <div className={`${styles.gatePanel} ${styles.gatePanelReady}`}>
          <div className={styles.gatePanelLabelGold}>
            <CheckCircle2 className={styles.labelIconGold} size={16} />
            Backstage system
          </div>
          <div className={styles.gateReadyItem}>Workflow owner is clear</div>
          <div className={styles.gateReadyItem}>Source record is current</div>
          <div className={styles.gateReadyItem}>Exception path is known</div>
        </div>
      </div>
    </div>
  );
}

export function AlignmentReviewRhythmInfographic() {
  const stages = [
    {
      icon: Radar,
      label: 'Observed friction',
      copy: 'A customer question, handoff delay, repeated correction, or unclear promise appears in real work.',
    },
    {
      icon: Workflow,
      label: 'Backstage route',
      copy: 'The team maps which workflow, owner, record, and decision point created the visible issue.',
    },
    {
      icon: FileCheck2,
      label: 'Updated standard',
      copy: 'The operating note, review rule, intake field, or handoff is revised where the work actually runs.',
    },
    {
      icon: Megaphone,
      label: 'Sharper presence',
      copy: 'The brand message, sales language, or content angle now reflects a route the business can repeat.',
    },
  ];

  return (
    <div className={styles.infographicWrapper}>
      <div className={styles.infographicTitle}>Alignment Review Rhythm</div>
      <div className={styles.briefBoard}>
        {stages.map((stage, index) => {
          const Icon = stage.icon;

          return (
            <React.Fragment key={stage.label}>
              <div className={`${styles.briefCard} ${index === stages.length - 1 ? styles.briefCardHighlight : ''}`}>
                <div className={index === stages.length - 1 ? styles.briefIconHighlight : styles.briefIcon}>
                  <Icon size={18} />
                </div>
                <div className={index === stages.length - 1 ? styles.briefLabelGold : styles.briefLabel}>{stage.label}</div>
                <p className={index === stages.length - 1 ? styles.briefCopyGold : styles.briefCopy}>{stage.copy}</p>
              </div>
              {index < stages.length - 1 ? (
                <div className={styles.briefConnector}>
                  <ArrowRight className={styles.arrowIconDesktop} size={18} />
                  <ArrowDown className={styles.arrowIconMobile} size={18} />
                </div>
              ) : null}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

export function DecisionRouteMapInfographic() {
  const routeSteps = [
    {
      label: '01',
      title: 'Trigger',
      copy: 'What event, gap, risk, or opportunity forces the decision now.',
    },
    {
      label: '02',
      title: 'Owner',
      copy: 'The person accountable for judgment, tradeoffs, and final call.',
    },
    {
      label: '03',
      title: 'Options',
      copy: 'The real alternatives compared before the route is locked.',
    },
    {
      label: '04',
      title: 'Reversal',
      copy: 'Whether the choice is easy to unwind or expensive to change.',
    },
    {
      label: '05',
      title: 'Record',
      copy: 'Where the rationale, standard, and approved next step are retained.',
    },
  ];

  return (
    <div className={styles.infographicWrapper}>
      <div className={styles.infographicTitle}>Decision Route Map</div>
      <div className={styles.spineGrid}>
        {routeSteps.map((step, index) => (
          <React.Fragment key={step.title}>
            <div className={`${styles.spineCard} ${index === routeSteps.length - 1 ? styles.spineCardHighlight : ''}`}>
              <span className={index === routeSteps.length - 1 ? styles.spineStepHighlight : styles.spineStep}>{step.label}</span>
              <div className={index === routeSteps.length - 1 ? styles.spineTitleHighlight : styles.spineTitle}>{step.title}</div>
              <p className={index === routeSteps.length - 1 ? styles.spineCopyHighlight : styles.spineCopy}>{step.copy}</p>
            </div>
            {index < routeSteps.length - 1 ? (
              <div className={styles.spineConnector}>
                <ArrowRight className={styles.arrowIconDesktop} size={18} />
                <ArrowDown className={styles.arrowIconMobile} size={18} />
              </div>
            ) : null}
          </React.Fragment>
        ))}
      </div>
      <div className={styles.spineLegend}>
        <span className={styles.spineLegendItem}>
          <GitBranch size={14} />
          Decision logic before system logic
        </span>
        <span className={styles.spineLegendItem}>
          <FolderSync size={14} />
          Reasoning retained for the next cycle
        </span>
      </div>
    </div>
  );
}

export function DecisionRecordCardInfographic() {
  const recordItems = [
    {
      icon: Radar,
      label: 'Current friction',
      copy: 'The repeated debate, delay, exception, or handoff issue that exposes the decision gap.',
    },
    {
      icon: ShieldCheck,
      label: 'Chosen standard',
      copy: 'The operating rule the business will use until new evidence says it should change.',
    },
    {
      icon: Scale,
      label: 'Accepted tradeoff',
      copy: 'The cost, constraint, risk, or slower path the team knowingly accepts.',
    },
    {
      icon: FileCheck2,
      label: 'Retained rationale',
      copy: 'The short record that lets future work understand why the route exists.',
    },
  ];

  return (
    <div className={styles.infographicWrapper}>
      <div className={styles.infographicTitle}>Decision Record Card</div>
      <div className={styles.packetChecklist}>
        {recordItems.map((item, index) => {
          const Icon = item.icon;

          return (
            <div className={`${styles.packetItem} ${index === recordItems.length - 1 ? styles.packetItemHighlight : ''}`} key={item.label}>
              <div className={index === recordItems.length - 1 ? styles.packetIconHighlight : styles.packetIcon}>
                <Icon size={18} />
              </div>
              <div className={styles.packetContent}>
                <span className={styles.packetNumber}>{String(index + 1).padStart(2, '0')}</span>
                <h4>{item.label}</h4>
                <p>{item.copy}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function WorkflowDecisionLedgerInfographic() {
  return (
    <div className={styles.infographicWrapper}>
      <div className={styles.infographicTitle}>Workflow Decision Ledger</div>
      <div className={styles.matrixScrollWrapper}>
        <table className={styles.matrixTable}>
          <thead>
            <tr>
              <th className={styles.matrixColHeader}>Workflow moment</th>
              <th className={styles.matrixColHeader}>What usually drifts</th>
              <th className={`${styles.matrixColHeader} ${styles.matrixColHeaderHighlight}`}>Decision to retain</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className={styles.matrixCellLabel}>Lead qualification</td>
              <td className={styles.matrixCell}>Fit rules stay inside founder judgment.</td>
              <td className={`${styles.matrixCell} ${styles.matrixCellHighlight}`}>Who is accepted, why, and which tradeoff is allowed.</td>
            </tr>
            <tr>
              <td className={styles.matrixCellLabel}>Content approval</td>
              <td className={styles.matrixCell}>Claims move faster than source confidence.</td>
              <td className={`${styles.matrixCell} ${styles.matrixCellHighlight}`}>The claim boundary and final approval owner.</td>
            </tr>
            <tr>
              <td className={styles.matrixCellLabel}>System build</td>
              <td className={styles.matrixCell}>Tool choices hide workflow assumptions.</td>
              <td className={`${styles.matrixCell} ${styles.matrixCellHighlight}`}>The option chosen, alternatives rejected, and review trigger.</td>
            </tr>
            <tr>
              <td className={styles.matrixCellLabel}>Service handoff</td>
              <td className={styles.matrixCell}>Exceptions restart in chat or meetings.</td>
              <td className={`${styles.matrixCell} ${styles.matrixCellHighlight}`}>The next owner, context packet, and escalation reason.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function OnePageDecisionPacketInfographic() {
  const packetItems = [
    {
      icon: Radar,
      label: 'Question',
      copy: 'The operating choice the team keeps debating, delaying, or reconstructing.',
    },
    {
      icon: GitBranch,
      label: 'Options',
      copy: 'The realistic paths considered, including the path intentionally rejected.',
    },
    {
      icon: Scale,
      label: 'Tradeoff',
      copy: 'The constraint, risk, cost, or slower route the business accepts on purpose.',
    },
    {
      icon: ShieldCheck,
      label: 'Owner',
      copy: 'The one person accountable for the decision and the people who must be informed.',
    },
    {
      icon: FileCheck2,
      label: 'Review trigger',
      copy: 'The condition that tells the team when the decision should be revisited.',
    },
  ];

  return (
    <div className={styles.infographicWrapper}>
      <div className={styles.infographicTitle}>One-Page Decision Packet</div>
      <div className={styles.packetChecklist}>
        {packetItems.map((item, index) => {
          const Icon = item.icon;
          const isFinal = index === packetItems.length - 1;

          return (
            <div className={`${styles.packetItem} ${isFinal ? styles.packetItemHighlight : ''}`} key={item.label}>
              <div className={isFinal ? styles.packetIconHighlight : styles.packetIcon}>
                <Icon size={18} />
              </div>
              <div className={styles.packetContent}>
                <span className={styles.packetNumber}>{String(index + 1).padStart(2, '0')}</span>
                <h4>{item.label}</h4>
                <p>{item.copy}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function QuestionToSystemRouteInfographic() {
  const stages = [
    {
      icon: MessageSquareText,
      label: 'Repeated question',
      copy: 'The same customer, team, or founder question returns across calls, chats, content, or delivery.',
    },
    {
      icon: Radar,
      label: 'Workflow moment',
      copy: 'The team names where the question appears: intake, scoping, onboarding, handoff, review, or follow-up.',
    },
    {
      icon: Workflow,
      label: 'System support',
      copy: 'The smallest useful artifact is added: field, note, route, owner, source, checklist, or tool.',
    },
    {
      icon: Megaphone,
      label: 'Clearer presence',
      copy: 'The public explanation now reflects an answer the internal route can support.',
    },
  ];

  return (
    <div className={styles.infographicWrapper}>
      <div className={styles.infographicTitle}>Question-To-System Route</div>
      <div className={styles.briefBoard}>
        {stages.map((stage, index) => {
          const Icon = stage.icon;
          const isFinal = index === stages.length - 1;

          return (
            <React.Fragment key={stage.label}>
              <div className={`${styles.briefCard} ${isFinal ? styles.briefCardHighlight : ''}`}>
                <div className={isFinal ? styles.briefIconHighlight : styles.briefIcon}>
                  <Icon size={18} />
                </div>
                <div className={isFinal ? styles.briefLabelGold : styles.briefLabel}>{stage.label}</div>
                <p className={isFinal ? styles.briefCopyGold : styles.briefCopy}>{stage.copy}</p>
              </div>
              {index < stages.length - 1 ? (
                <div className={styles.briefConnector}>
                  <ArrowRight className={styles.arrowIconDesktop} size={18} />
                  <ArrowDown className={styles.arrowIconMobile} size={18} />
                </div>
              ) : null}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

export function QuestionLibraryCompassInfographic() {
  const directions = [
    {
      step: '01',
      title: 'Decide',
      copy: 'The question changes fit, pricing, priority, approval, or promise.',
      tag: 'Decision record',
    },
    {
      step: '02',
      title: 'Do',
      copy: 'The person needs the route, fields, owner, and next action.',
      tag: 'Workflow note',
    },
    {
      step: '03',
      title: 'Understand',
      copy: 'The audience needs a plain explanation before the work makes sense.',
      tag: 'Presence copy',
    },
    {
      step: '04',
      title: 'Recover',
      copy: 'The normal route has failed and the next owner needs context.',
      tag: 'Exception path',
    },
  ];

  return (
    <div className={styles.infographicWrapper}>
      <div className={styles.infographicTitle}>Question Library Compass</div>
      <div className={styles.packetChecklist}>
        {directions.map((direction, index) => {
          const isHighlight = index === directions.length - 1;

          return (
            <div className={`${styles.packetItem} ${isHighlight ? styles.packetItemHighlight : ''}`} key={direction.title}>
              <div className={isHighlight ? styles.packetIconHighlight : styles.packetIcon}>
                <MessageSquareText size={18} />
              </div>
              <div className={styles.packetContent}>
                <span className={styles.packetNumber}>{direction.step} / {direction.tag}</span>
                <h4>{direction.title}</h4>
                <p>{direction.copy}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function WorkflowNoteLibraryInfographic() {
  const stages = [
    {
      icon: MessageSquareText,
      label: 'Question',
      copy: 'A repeated question, exception, or handoff gap appears in real work.',
    },
    {
      icon: Workflow,
      label: 'Workflow moment',
      copy: 'The note is placed beside the intake, review, support, delivery, or presence route.',
    },
    {
      icon: FileCheck2,
      label: 'Reusable note',
      copy: 'The answer records context, owner, decision, boundary, and next action.',
    },
    {
      icon: ShieldCheck,
      label: 'Working system',
      copy: 'People can act without reconstructing the same logic from memory.',
    },
  ];

  return (
    <div className={styles.infographicWrapper}>
      <div className={styles.infographicTitle}>Workflow Note Library</div>
      <div className={styles.threadMap}>
        <div className={styles.threadLine} aria-hidden="true" />
        {stages.map((stage, index) => {
          const Icon = stage.icon;
          const isFinal = index === stages.length - 1;

          return (
            <div className={`${styles.threadStage} ${isFinal ? styles.threadStageHighlight : ''}`} key={stage.label}>
              <div className={isFinal ? styles.threadIconHighlight : styles.threadIcon}>
                <Icon size={18} />
              </div>
              <span className={styles.threadStep}>{String(index + 1).padStart(2, '0')}</span>
              <h4>{stage.label}</h4>
              <p>{stage.copy}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function DocumentationModeSelectorInfographic() {
  return (
    <div className={styles.infographicWrapper}>
      <div className={styles.infographicTitle}>Documentation Mode Selector</div>
      <div className={styles.matrixScrollWrapper}>
        <table className={styles.matrixTable}>
          <thead>
            <tr>
              <th className={styles.matrixColHeader}>Workflow need</th>
              <th className={styles.matrixColHeader}>Wrong habit</th>
              <th className={`${styles.matrixColHeader} ${styles.matrixColHeaderHighlight}`}>Useful artifact</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className={styles.matrixCellLabel}>Someone must learn the route</td>
              <td className={styles.matrixCell}>Send them a scattered chat history.</td>
              <td className={`${styles.matrixCell} ${styles.matrixCellHighlight}`}>A guided onboarding note or walkthrough.</td>
            </tr>
            <tr>
              <td className={styles.matrixCellLabel}>Someone must complete a task</td>
              <td className={styles.matrixCell}>Describe the whole system again.</td>
              <td className={`${styles.matrixCell} ${styles.matrixCellHighlight}`}>A short how-to with fields, owner, and done state.</td>
            </tr>
            <tr>
              <td className={styles.matrixCellLabel}>Someone must check the source</td>
              <td className={styles.matrixCell}>Depend on founder memory.</td>
              <td className={`${styles.matrixCell} ${styles.matrixCellHighlight}`}>A reference note with source, status, and proof boundary.</td>
            </tr>
            <tr>
              <td className={styles.matrixCellLabel}>Someone must understand why</td>
              <td className={styles.matrixCell}>Argue the decision again in meetings.</td>
              <td className={`${styles.matrixCell} ${styles.matrixCellHighlight}`}>A decision note with context, options, tradeoff, and review trigger.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
