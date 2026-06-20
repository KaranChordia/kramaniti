export type AgentLayer = 'leadership' | 'strategy' | 'growth' | 'delivery' | 'governance';

export type AgentTaskStatus = 'Input' | 'Routed' | 'Drafted' | 'In review' | 'Approved';

export type AgentConsoleNavItem = {
  id: 'input' | 'route' | 'review' | 'memory';
  label: string;
  status: AgentTaskStatus;
};

export type AgentConsoleAgent = {
  id: string;
  name: string;
  analogue: string;
  layer: AgentLayer;
  description: string;
};

export type AgentRoute = {
  id: string;
  label: string;
  keywords: string[];
  leadAgent: AgentConsoleAgent;
  supportingAgents: AgentConsoleAgent[];
  reason: string;
  approvalGate: string;
  draftOutputs: string[];
  governanceChecks: string[];
  nextAction: string;
};

export type AgentConsoleState = {
  request: string;
  context: string;
  routeId: string;
  status: AgentTaskStatus;
  draftResponse: string;
  responseSource: 'groq' | 'local' | '';
  agentTasks: StudioAgentTask[];
  memoryNote: string;
  updatedAt: string;
};

export type StudioAgentTask = {
  agentName: string;
  role: string;
  task: string;
  output: string;
};

export const AGENT_CONSOLE_STORAGE_KEY = 'kramaniti-agent-console-v1';
export const DEFAULT_LM_STUDIO_BASE_URL = 'http://127.0.0.1:1234/v1';

export const AGENT_CONSOLE_NAV: AgentConsoleNavItem[] = [
  { id: 'input', label: 'Input', status: 'Input' },
  { id: 'route', label: 'Route', status: 'Routed' },
  { id: 'review', label: 'Review', status: 'In review' },
  { id: 'memory', label: 'Memory', status: 'Approved' },
];

export const AGENTS: Record<string, AgentConsoleAgent> = {
  master_coordinator: {
    id: 'master_coordinator',
    name: 'Master Coordinator',
    analogue: 'Chief of Staff',
    layer: 'leadership',
    description: 'Routes requests, protects continuity, and keeps ownership clear across the agent team.',
  },
  brand_strategist: {
    id: 'brand_strategist',
    name: 'Brand Strategist',
    analogue: 'Head of Strategy',
    layer: 'strategy',
    description: 'Maintains positioning, audience clarity, offer framing, and campaign angles.',
  },
  workflow_architect: {
    id: 'workflow_architect',
    name: 'Workflow Architect',
    analogue: 'Principal systems consultant',
    layer: 'delivery',
    description: 'Diagnoses business workflows and defines practical systems that improve real operations.',
  },
  systems_designer: {
    id: 'systems_designer',
    name: 'Systems Designer',
    analogue: 'Technical systems designer',
    layer: 'delivery',
    description: 'Turns workflow clarity into buildable internal tools, integrations, and adoption paths.',
  },
  content_director: {
    id: 'content_director',
    name: 'Content Director',
    analogue: 'Head of Content',
    layer: 'growth',
    description: 'Turns clarity and systems thinking into content pillars, calendars, posts, scripts, and newsletters.',
  },
  narrative_editor: {
    id: 'narrative_editor',
    name: 'Narrative Editor',
    analogue: 'Editorial Director',
    layer: 'strategy',
    description: 'Turns strategy into polished public copy, founder voice, captions, bios, and proposal language.',
  },
  website_steward: {
    id: 'website_steward',
    name: 'Website Steward',
    analogue: 'Website and conversion owner',
    layer: 'growth',
    description: 'Keeps website messaging, CTA flow, page structure, conversion clarity, and public proof rules aligned.',
  },
  digital_presence_orchestrator: {
    id: 'digital_presence_orchestrator',
    name: 'Digital Presence Orchestrator',
    analogue: 'Digital presence director',
    layer: 'growth',
    description: 'Owns Kramaniti public presence across brand system, content, website direction, assets, distribution, and proof review.',
  },
  proof_governance_auditor: {
    id: 'proof_governance_auditor',
    name: 'Proof and Governance Auditor',
    analogue: 'Trust and risk reviewer',
    layer: 'governance',
    description: 'Reviews public claims, proof, client names, metrics, testimonials, and hype language before publication.',
  },
  agent_ops_architect: {
    id: 'agent_ops_architect',
    name: 'Agent Operations Architect',
    analogue: 'Internal agent systems designer',
    layer: 'governance',
    description: 'Maintains agent definitions, prompts, routing logic, protocols, and operating-system continuity.',
  },
};

export const AGENT_ROUTES: AgentRoute[] = [
  {
    id: 'strategy_positioning',
    label: 'Strategy and positioning',
    keywords: ['strategy', 'positioning', 'offer', 'icp', 'brand', 'narrative', 'market', 'pricing', 'service'],
    leadAgent: AGENTS.brand_strategist,
    supportingAgents: [AGENTS.narrative_editor, AGENTS.proof_governance_auditor],
    reason: 'The request appears to affect positioning, offers, audience clarity, or strategic language.',
    approvalGate: 'Founder approval before major public positioning, offer, or pricing changes.',
    draftOutputs: ['Positioning recommendation', 'Messaging direction', 'Offer or audience implications'],
    governanceChecks: ['Avoid generic AI agency language', 'Flag pricing or offer changes', 'Keep claims evidence-aware'],
    nextAction: 'Prepare a strategy draft and mark strategic decisions for review.',
  },
  {
    id: 'systems_workflow',
    label: 'Systems and workflow',
    keywords: ['workflow', 'system', 'automation', 'process', 'tool', 'crm', 'integration', 'handoff', 'operations'],
    leadAgent: AGENTS.workflow_architect,
    supportingAgents: [AGENTS.systems_designer, AGENTS.proof_governance_auditor],
    reason: 'The request appears to involve operating workflows, system design, implementation paths, or adoption risk.',
    approvalGate: 'Founder approval before client-facing promises, credentials, external integrations, or irreversible workflow changes.',
    draftOutputs: ['Workflow diagnosis', 'System blueprint', 'Human review and adoption checkpoints'],
    governanceChecks: ['Start from workflow before tools', 'Separate automated, assisted, and human-led steps', 'Do not handle private client data without approval'],
    nextAction: 'Map the current workflow and define the smallest useful system step.',
  },
  {
    id: 'content_campaigns',
    label: 'Content and campaigns',
    keywords: ['content', 'campaign', 'post', 'linkedin', 'newsletter', 'script', 'article', 'insight', 'reel', 'video'],
    leadAgent: AGENTS.content_director,
    supportingAgents: [AGENTS.narrative_editor, AGENTS.digital_presence_orchestrator, AGENTS.proof_governance_auditor],
    reason: 'The request appears to involve content planning, editorial output, campaign structure, or distribution.',
    approvalGate: 'Proof review and founder approval before publishing or scheduled distribution.',
    draftOutputs: ['Content brief', 'Narrative angle', 'Publishing review path'],
    governanceChecks: ['No invented metrics or testimonials', 'Keep content after clarity', 'Check proof-sensitive claims before publication'],
    nextAction: 'Draft a content brief and route claims through governance.',
  },
  {
    id: 'website_public_copy',
    label: 'Website and public copy',
    keywords: ['website', 'homepage', 'page', 'copy', 'cta', 'section', 'seo', 'public', 'conversion', 'studio'],
    leadAgent: AGENTS.website_steward,
    supportingAgents: [AGENTS.brand_strategist, AGENTS.narrative_editor, AGENTS.proof_governance_auditor],
    reason: 'The request appears to affect the public website, conversion flow, public copy, or page structure.',
    approvalGate: 'Governance review before public copy, proof, CTA, or structural changes go live.',
    draftOutputs: ['Website change brief', 'Copy or section direction', 'QA and proof review notes'],
    governanceChecks: ['No unsupported client logos or proof', 'Do not add live booking/form assumptions', 'Keep first impression business-first'],
    nextAction: 'Prepare the website change and verify the public-risk surface.',
  },
  {
    id: 'digital_presence',
    label: 'Digital presence',
    keywords: ['digital presence', 'distribution', 'calendar', 'assets', 'brand system', 'social', 'presence', 'analytics'],
    leadAgent: AGENTS.digital_presence_orchestrator,
    supportingAgents: [AGENTS.brand_strategist, AGENTS.content_director, AGENTS.website_steward, AGENTS.proof_governance_auditor],
    reason: 'The request appears to cross brand, content, website, assets, and distribution ownership.',
    approvalGate: 'Founder approval before publishing, campaign launches, or major public-facing changes.',
    draftOutputs: ['Digital presence plan', 'Agent assignment', 'Approval cadence'],
    governanceChecks: ['Keep one clear owner', 'Route proof-sensitive claims', 'Avoid turning the system into an agent maze'],
    nextAction: 'Scope the operating cycle and assign owners.',
  },
  {
    id: 'proof_risk',
    label: 'Proof and risk',
    keywords: ['proof', 'claim', 'client', 'testimonial', 'metric', 'logo', 'case study', 'permission', 'risk', 'legal'],
    leadAgent: AGENTS.proof_governance_auditor,
    supportingAgents: [AGENTS.website_steward, AGENTS.brand_strategist],
    reason: 'The request appears to involve public claims, client proof, permission, metrics, testimonials, or trust risk.',
    approvalGate: 'No claim leaves draft state until it is approved, softened, or moved to internal-only use.',
    draftOutputs: ['Claim classification', 'Risk note', 'Approved or softened wording'],
    governanceChecks: ['Use Fact, Inference, Unverified, and Recommendation labels', 'No invented proof', 'Flag permission gaps'],
    nextAction: 'Classify the claim and decide whether it is public-safe.',
  },
  {
    id: 'agent_framework',
    label: 'Agent framework',
    keywords: ['agent', 'agents', 'framework', 'operating console', 'routing', 'memory', 'protocol', 'roster', 'studio'],
    leadAgent: AGENTS.agent_ops_architect,
    supportingAgents: [AGENTS.master_coordinator, AGENTS.proof_governance_auditor],
    reason: 'The request appears to affect the agent operating model, routing, memory, protocols, or Studio agent surface.',
    approvalGate: 'Record structural changes in the decision log and keep agents scoped to recurring business functions.',
    draftOutputs: ['Operating protocol update', 'Routing or memory recommendation', 'Decision-log note'],
    governanceChecks: ['Do not create novelty agents', 'Keep Master Coordinator as router', 'Preserve founder approval gates'],
    nextAction: 'Update the agent operating model and document the structural decision.',
  },
];

export const DEFAULT_CONSOLE_STATE: AgentConsoleState = {
  request: '',
  context: '',
  routeId: 'strategy_positioning',
  status: 'Input',
  draftResponse: '',
  responseSource: '',
  agentTasks: [],
  memoryNote: '',
  updatedAt: '',
};

export function createDefaultAgentTasks(route: AgentRoute, request: string): StudioAgentTask[] {
  const supportingAgents = route.supportingAgents.slice(0, 2);
  const team = [route.leadAgent, ...supportingAgents];

  return team.map((agent, index) => ({
    agentName: agent.name,
    role: agent.analogue,
    task:
      index === 0
        ? `Create the main working draft for this request.`
        : `Complete the ${agent.layer === 'governance' ? 'review and risk' : 'specialist support'} task delegated by ${route.leadAgent.name}.`,
    output:
      index === 0
        ? `Awaiting ${agent.name} output for: ${request.trim() || 'the founder request'}.`
        : `Awaiting ${agent.name} support output.`,
  }));
}

export function getRouteById(routeId: string) {
  return AGENT_ROUTES.find((route) => route.id === routeId) ?? AGENT_ROUTES[0];
}

export function routeFounderRequest(request: string, context = '') {
  const haystack = `${request} ${context}`.toLowerCase();
  const scoredRoutes = AGENT_ROUTES.map((route) => ({
    route,
    score: route.keywords.reduce((score, keyword) => (haystack.includes(keyword) ? score + 1 : score), 0),
  })).sort((a, b) => b.score - a.score);

  return scoredRoutes[0]?.score ? scoredRoutes[0].route : AGENT_ROUTES[0];
}

export function buildStudioFallbackResponse(request: string, route: AgentRoute) {
  const cleanRequest = request.trim() || 'No request supplied.';

  return [
    `Lead agent: ${route.leadAgent.name}`,
    `Why this route: ${route.reason}`,
    '',
    'Recommended draft:',
    `1. Clarify the founder request: ${cleanRequest}`,
    `2. Prepare ${route.draftOutputs.join(', ').toLowerCase()} before execution.`,
    `3. Apply governance checks: ${route.governanceChecks.join('; ')}.`,
    '',
    `Approval gate: ${route.approvalGate}`,
    `Next action: ${route.nextAction}`,
  ].join('\n');
}

export function buildStudioFallbackTasks(request: string, route: AgentRoute) {
  const cleanRequest = request.trim() || 'the founder request';

  return createDefaultAgentTasks(route, request).map((task, index) => ({
    ...task,
    output:
      index === 0
        ? `Drafted a short next step for ${cleanRequest}: ${route.nextAction}`
        : `Completed support check: ${route.governanceChecks[index - 1] ?? route.approvalGate}`,
  }));
}

export function buildStudioSystemPrompt(route: AgentRoute) {
  return `You are operating inside Kramaniti Studio.

Kramaniti is a first-principles AI systems partner, not a generic AI automation agency.

Follow this sequence:
1. Strategy before tools.
2. Systems before scale.
3. Content after clarity.

Active route: ${route.label}
Lead agent: ${route.leadAgent.name}
Lead role: ${route.leadAgent.description}
Supporting agents: ${route.supportingAgents.map((agent) => agent.name).join(', ')}
Approval gate: ${route.approvalGate}

Rules:
- Do not invent client proof, testimonials, metrics, case studies, permissions, or outcomes.
- Do not publish, change pricing, handle credentials, or create external commitments.
- Use business-first language.
- Choose exactly three agents from the lead and supporting agents listed above.
- Assign one concrete task to each agent.
- Keep task wording short and outcome-focused.
- Do not write the completed outputs here. Outputs are produced by each agent after delegation.

Return strict JSON only with this shape:
{
  "summary": "one short sentence explaining the delegation",
  "agentTasks": [
    { "agentName": "Name", "role": "Role", "task": "Short delegated task", "output": "" }
  ],
  "approvalGate": "short approval gate",
  "memoryNote": "short memory note"
}`;
}
