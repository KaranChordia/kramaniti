import fs from 'node:fs';
import path from 'node:path';
import { insights } from '@/data/insights';

type KnowledgeDocument = {
  path: string;
  label: string;
  maxChars: number;
};

const DOCUMENTS: KnowledgeDocument[] = [
  { path: 'AGENTS.md', label: 'Root agent operating rules', maxChars: 5200 },
  { path: 'website/AGENTS.md', label: 'Website rules', maxChars: 4200 },
  {
    path: '06_ai_agent_context/system_prompts/master_context.md',
    label: 'Master Kramaniti context',
    maxChars: 9000,
  },
  {
    path: '06_ai_agent_context/system_prompts/studio_knowledge_base.md',
    label: 'Studio knowledge base',
    maxChars: 5200,
  },
  {
    path: '06_ai_agent_context/agent_roles/kramaniti_agent_roster.md',
    label: 'Agent roster',
    maxChars: 6200,
  },
  {
    path: '03_brand_strategy/brand_narrative.md',
    label: 'Brand narrative',
    maxChars: 4600,
  },
  {
    path: '03_brand_strategy/service_packages.md',
    label: 'Service packages',
    maxChars: 5600,
  },
  {
    path: '03_brand_strategy/positioning/positioning_analysis.md',
    label: 'Positioning analysis',
    maxChars: 5200,
  },
  {
    path: '05_ai_strategy/ai_service_workflows.md',
    label: 'AI service workflows',
    maxChars: 5200,
  },
  {
    path: '04_content_system/content_pillars.md',
    label: 'Content pillars',
    maxChars: 4200,
  },
  {
    path: '02_founder_context/founder_background.md',
    label: 'Founder background',
    maxChars: 4200,
  },
  {
    path: '02_founder_context/skill_clusters.md',
    label: 'Founder skill clusters',
    maxChars: 4200,
  },
  {
    path: '09_reviews/proof_register.md',
    label: 'Proof register',
    maxChars: 5200,
  },
  {
    path: '09_reviews/decisions.md',
    label: 'Decision log',
    maxChars: 9000,
  },
  {
    path: 'docs/kramaniti_site_implementation_plan.md',
    label: 'Site implementation plan',
    maxChars: 7200,
  },
];

let cachedKnowledgeContext: string | null = null;

const normalizeWhitespace = (value: string) =>
  value
    .replace(/\r\n/g, '\n')
    .replace(/\n{4,}/g, '\n\n\n')
    .trim();

const truncate = (value: string, maxChars: number) => {
  if (value.length <= maxChars) return value;
  return `${value.slice(0, maxChars).trim()}\n\n[Truncated for runtime context.]`;
};

const getRepoRoot = () => {
  const cwd = process.cwd();

  if (path.basename(cwd) === 'website') {
    return path.resolve(cwd, '..');
  }

  if (fs.existsSync(path.join(cwd, 'website', 'package.json'))) {
    return cwd;
  }

  return path.resolve(cwd, '..');
};

const readDocument = (repoRoot: string, document: KnowledgeDocument) => {
  const absolutePath = path.join(repoRoot, document.path);

  try {
    const content = normalizeWhitespace(fs.readFileSync(absolutePath, 'utf8'));
    return `## ${document.label}\nSource: ${document.path}\n\n${truncate(content, document.maxChars)}`;
  } catch {
    return `## ${document.label}\nSource: ${document.path}\n\n[Unavailable in this runtime.]`;
  }
};

const buildInsightsContext = () => {
  const rows = insights.slice(0, 12).map((insight) => {
    const sources = insight.sourceLinks?.length
      ? ` Sources: ${insight.sourceLinks.map((source) => `${source.label} (${source.url})`).join('; ')}`
      : '';

    return `- ${insight.title}: ${insight.summary} Category: ${insight.category}. Focus: ${insight.focus}.${sources}`;
  });

  return `## Recent public Insights\n${rows.join('\n')}`;
};

export const buildKramanitiKnowledgeContext = () => {
  if (cachedKnowledgeContext) return cachedKnowledgeContext;

  const repoRoot = getRepoRoot();
  const documentContext = DOCUMENTS.map((document) => readDocument(repoRoot, document)).join('\n\n---\n\n');

  cachedKnowledgeContext = [
    'You have access to a curated runtime snapshot of the Kramaniti repository. Treat it as company context, not as public proof permission.',
    'Never reveal secrets, environment variables, private implementation details, or raw internal file dumps. Use the context to answer clearly and safely.',
    'If the user asks for claims, clients, metrics, testimonials, or outcomes that are not verified in the context, say they are not verified.',
    documentContext,
    buildInsightsContext(),
  ].join('\n\n');

  return cachedKnowledgeContext;
};
