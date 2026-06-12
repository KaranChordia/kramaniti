export type AgentLayer = 'leadership' | 'strategy' | 'growth' | 'delivery' | 'governance';

export type AgentStatus = 'active' | 'standby' | 'planned';

export type AgentTaskStatus = 'Draft' | 'Routed' | 'In review' | 'Approved';

export type AgentOSAgent = {
  id: string;
  name: string;
  analogue: string;
  layer: AgentLayer;
  status: AgentStatus;
  description: string;
  memory: string[];
  outputs: string[];
  constraints: string[];
};

export type AgentTaskType = {
  id: string;
  label: string;
  leadAgentId: string;
  supportingAgentIds: string[];
  approvalGate: string;
};

export type AgentTask = {
  id: string;
  title: string;
  goal: string;
  context: string;
  taskTypeId: string;
  leadAgentId: string;
  supportingAgentIds: string[];
  status: AgentTaskStatus;
  createdAt: string;
  lastUpdatedAt: string;
};

export const AGENT_OS_STORAGE_KEY = 'kramaniti-agent-os-tasks-v1';
export const LM_STUDIO_CONFIG_STORAGE_KEY = 'kramaniti-lm-studio-config-v1';
export const DEFAULT_LM_STUDIO_BASE_URL = 'http://127.0.0.1:1234/v1';
export const DEFAULT_LM_STUDIO_MODEL = 'nvidia/nemotron-3-nano-4b';

export const AGENT_OS_ROSTER: AgentOSAgent[] = [
  {
    id: 'master_coordinator',
    name: 'Master Coordinator',
    analogue: 'Chief of Staff',
    layer: 'leadership',
    status: 'active',
    description: 'Routes requests, protects continuity, and keeps ownership clear across the agent team.',
    memory: ['Priorities', 'project status', 'handoff log', 'decision history'],
    outputs: ['Task briefs', 'handoff notes', 'priority lists'],
    constraints: ['Does not publish', 'does not change pricing', 'does not override founder decisions'],
  },
  {
    id: 'digital_presence_orchestrator',
    name: 'Digital Presence Orchestrator',
    analogue: 'Digital presence director',
    layer: 'growth',
    status: 'active',
    description: 'Owns Kramaniti public presence across brand system, content, website direction, assets, distribution, and proof review.',
    memory: ['Brand operating kit', 'campaign briefs', 'content calendar', 'proof register'],
    outputs: ['Digital presence plans', 'campaign briefs', 'agent assignments', 'publishing review paths'],
    constraints: ['Does not publish', 'does not invent proof', 'routes public claims through governance'],
  },
  {
    id: 'brand_identity_agent',
    name: 'Brand Identity Agent',
    analogue: 'Brand design system lead',
    layer: 'strategy',
    status: 'active',
    description: 'Maintains visual rules, brand kit, logo usage, color, typography, and design consistency.',
    memory: ['Brand identity guidelines', 'visual system palette', 'asset registry'],
    outputs: ['Brand kit updates', 'visual direction notes', 'asset requirements'],
    constraints: ['Does not approve third-party assets without permission clarity'],
  },
  {
    id: 'brand_strategist',
    name: 'Brand Strategist',
    analogue: 'Head of Strategy',
    layer: 'strategy',
    status: 'active',
    description: 'Maintains positioning, audience clarity, offer framing, and campaign angles.',
    memory: ['Positioning analysis', 'brand narrative', 'service packages'],
    outputs: ['Messaging maps', 'positioning memos', 'copy direction'],
    constraints: ['Does not approve public proof, pricing, or client claims alone'],
  },
  {
    id: 'content_director',
    name: 'Content Director',
    analogue: 'Head of Content',
    layer: 'growth',
    status: 'standby',
    description: 'Turns clarity and systems thinking into useful content pillars, calendars, posts, scripts, and newsletters.',
    memory: ['Content pillars', 'content calendar', 'content ideas backlog'],
    outputs: ['Editorial calendars', 'post drafts', 'scripts', 'article outlines'],
    constraints: ['No invented results', 'no publishing without review'],
  },
  {
    id: 'narrative_editor',
    name: 'Narrative Editor',
    analogue: 'Editorial Director',
    layer: 'strategy',
    status: 'standby',
    description: 'Turns strategy into polished public copy, founder voice, captions, bios, and proposal language.',
    memory: ['Brand narrative', 'founder background', 'website copy sections'],
    outputs: ['Polished copy blocks', 'voice notes', 'headline options'],
    constraints: ['Does not invent proof or inflate outcomes'],
  },
  {
    id: 'website_steward',
    name: 'Website Steward',
    analogue: 'Website and conversion owner',
    layer: 'growth',
    status: 'active',
    description: 'Keeps website messaging, CTA flow, page structure, conversion clarity, and public proof rules aligned.',
    memory: ['Website implementation plan', 'public page structure', 'CTA flow'],
    outputs: ['Website updates', 'section copy', 'QA notes'],
    constraints: ['Does not add logos, testimonials, metrics, or live form assumptions without verification'],
  },
  {
    id: 'distribution_analytics_agent',
    name: 'Distribution & Analytics Agent',
    analogue: 'Distribution and performance lead',
    layer: 'growth',
    status: 'active',
    description: 'Tracks publishing, channel fit, performance signals, and repeat/revise/stop decisions.',
    memory: ['Publishing checklist', 'analytics log', 'content calendar'],
    outputs: ['Channel notes', 'analytics log entries', 'repeat-revise-stop recommendations'],
    constraints: ['Does not publish without approval', 'does not invent performance metrics'],
  },
  {
    id: 'asset_librarian',
    name: 'Asset Librarian',
    analogue: 'Brand asset manager',
    layer: 'governance',
    status: 'planned',
    description: 'Keeps assets findable, labeled, provenance-aware, and safe for approved use.',
    memory: ['Asset registry', 'brand assets', 'screenshots', 'exports'],
    outputs: ['Source notes', 'public-use flags', 'organized asset folders'],
    constraints: ['Does not publish third-party assets without permission clarity'],
  },
  {
    id: 'proof_governance_auditor',
    name: 'Proof and Governance Auditor',
    analogue: 'Trust and risk reviewer',
    layer: 'governance',
    status: 'standby',
    description: 'Reviews public claims, proof, client names, metrics, testimonials, and hype language before publication.',
    memory: ['Decision log', 'proof register', 'claim audits'],
    outputs: ['Risk notes', 'approval checklists', 'decision-log entries'],
    constraints: ['Does not approve claims just because they are useful for sales'],
  },
  {
    id: 'agent_ops_architect',
    name: 'Agent Operations Architect',
    analogue: 'Internal agent systems designer',
    layer: 'governance',
    status: 'planned',
    description: 'Maintains agent definitions, prompts, routing logic, protocols, and operating-system continuity.',
    memory: ['Agent roster', 'routing', 'protocols', 'master context'],
    outputs: ['Agent specs', 'prompt updates', 'operating rules'],
    constraints: ['Does not create agents for novelty or grant autonomous public authority'],
  },
];

export const AGENT_TASK_TYPES: AgentTaskType[] = [
  {
    id: 'digital_presence_plan',
    label: 'Digital presence plan',
    leadAgentId: 'digital_presence_orchestrator',
    supportingAgentIds: ['brand_strategist', 'brand_identity_agent', 'content_director', 'website_steward', 'proof_governance_auditor'],
    approvalGate: 'Founder approval before publishing or major public-facing changes.',
  },
  {
    id: 'campaign_brief',
    label: 'Campaign brief',
    leadAgentId: 'digital_presence_orchestrator',
    supportingAgentIds: ['brand_strategist', 'content_director', 'narrative_editor', 'distribution_analytics_agent', 'proof_governance_auditor'],
    approvalGate: 'Proof review and founder approval before distribution.',
  },
  {
    id: 'brand_design_kit',
    label: 'Brand design kit',
    leadAgentId: 'brand_identity_agent',
    supportingAgentIds: ['brand_strategist', 'asset_librarian', 'website_steward'],
    approvalGate: 'Founder approval before changing reusable brand direction.',
  },
  {
    id: 'content_calendar',
    label: 'Content calendar',
    leadAgentId: 'content_director',
    supportingAgentIds: ['digital_presence_orchestrator', 'brand_strategist', 'narrative_editor', 'proof_governance_auditor'],
    approvalGate: 'Founder approval before scheduled publication.',
  },
  {
    id: 'website_messaging',
    label: 'Website messaging',
    leadAgentId: 'website_steward',
    supportingAgentIds: ['brand_strategist', 'narrative_editor', 'proof_governance_auditor'],
    approvalGate: 'Governance review before public copy goes live.',
  },
  {
    id: 'proof_review',
    label: 'Proof review',
    leadAgentId: 'proof_governance_auditor',
    supportingAgentIds: ['founder_archivist', 'asset_librarian', 'website_steward'],
    approvalGate: 'No claim leaves draft state until approved or softened.',
  },
  {
    id: 'publishing_review',
    label: 'Publishing and analytics review',
    leadAgentId: 'distribution_analytics_agent',
    supportingAgentIds: ['content_director', 'website_steward', 'proof_governance_auditor'],
    approvalGate: 'No direct publishing from the agent OS.',
  },
  {
    id: 'agent_framework',
    label: 'Agent framework update',
    leadAgentId: 'agent_ops_architect',
    supportingAgentIds: ['master_coordinator', 'proof_governance_auditor'],
    approvalGate: 'Record structural changes in the decision log.',
  },
];

export const AGENT_STATUS_COLUMNS: AgentTaskStatus[] = ['Draft', 'Routed', 'In review', 'Approved'];

export const AGENT_OS_SEED_TASKS: AgentTask[] = [
  {
    id: 'agent-task-digital-presence',
    title: 'Prepare first digital presence operating cycle',
    goal: 'Turn the new Digital Presence Orchestrator system into a first 30-day operating cadence.',
    context: 'Confirm active channels, approval cadence, and reusable assets before any public content leaves draft status.',
    taskTypeId: 'digital_presence_plan',
    leadAgentId: 'digital_presence_orchestrator',
    supportingAgentIds: ['brand_strategist', 'content_director', 'distribution_analytics_agent', 'proof_governance_auditor'],
    status: 'Routed',
    createdAt: '2026-06-11T00:00:00.000Z',
    lastUpdatedAt: '2026-06-11T00:00:00.000Z',
  },
];

export const LM_STUDIO_SETUP_STEPS = [
  'Open LM Studio and load Nemotron 3 Nano 4B or another local chat model that fits your Mac memory.',
  'Go to the Developer tab and start the local server. Keep the server running while Studio is open.',
  `Use the OpenAI-compatible base URL shown by LM Studio. Current local default: ${DEFAULT_LM_STUDIO_BASE_URL}.`,
  `Use the loaded model identifier. Current local default: ${DEFAULT_LM_STUDIO_MODEL}.`,
  'Run Test Server from this screen. If models load, run a prompt against the selected agent.',
  'Keep publishing, proof claims, pricing, credentials, and external commitments behind human approval.',
];

export const LM_STUDIO_PROMPT_TEMPLATE = `You are operating inside the Kramaniti Agent OS.

Follow Kramaniti sequence:
1. Strategy before tools.
2. Systems before scale.
3. Content after clarity.

Do not invent client proof, metrics, testimonials, or public claims.
Return a concise response with:
- lead agent reasoning
- supporting agents
- first three tasks
- approval gate`;

export function getAgentById(agentId: string) {
  return AGENT_OS_ROSTER.find((agent) => agent.id === agentId);
}

export function getTaskTypeById(taskTypeId: string) {
  return AGENT_TASK_TYPES.find((taskType) => taskType.id === taskTypeId);
}
