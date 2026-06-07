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
  GitBranch
} from 'lucide-react';
import styles from './Infographics.module.css';

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
