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
  CircleAlert
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
