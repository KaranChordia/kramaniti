import type { StudioIntake, StudioPlan } from './types';

const clean = (value: string, fallback: string) => value.trim() || fallback;

const splitTools = (value: string) =>
  value
    .split(',')
    .map((tool) => tool.trim())
    .filter(Boolean);

export function createMockStudioPlan(intake: StudioIntake): StudioPlan {
  const companyName = clean(intake.companyName, 'Target Company');
  const industry = clean(intake.industry, 'business operations');
  const stage = clean(intake.companyStage, 'growth stage');
  const knownContext = clean(
    intake.knownContext,
    'The company has visible operating complexity but needs a clearer discovery brief before implementation.'
  );
  const tools = splitTools(intake.currentTools);
  const toolPhrase = tools.length > 0 ? tools.slice(0, 3).join(', ') : 'existing internal tools';
  const priorityQuestion = clean(
    intake.priorityQuestion,
    'Which workflow should be clarified before any AI system is built?'
  );

  return {
    id: `studio-${Date.now()}`,
    createdAt: new Date().toISOString(),
    status: 'ready',
    intake: {
      ...intake,
      companyName,
      industry,
      companyStage: stage,
      knownContext,
      priorityQuestion,
    },
    researchSignals: [
      {
        label: 'Business Context',
        detail: `${companyName} appears to need a planning pass across ${industry}, with the founder question centered on: ${priorityQuestion}`,
        confidence: intake.researchMode === 'manual' ? 'manual' : 'mock',
      },
      {
        label: 'Tool Surface',
        detail: `Current operating surface includes ${toolPhrase}. The first planning risk is tool sprawl before workflow clarity.`,
        confidence: tools.length > 0 ? 'manual' : 'inferred',
      },
      {
        label: 'Planning Boundary',
        detail: 'This mock pass creates a planning dossier only. It does not claim verified public research, client outcomes, or implementation feasibility.',
        confidence: 'mock',
      },
    ],
    clarity: {
      summary: `${companyName} should begin with a clarity layer that separates business intent, current workflow reality, and the first decision loop worth improving.`,
      bottlenecks: [
        {
          title: 'Unclear Operating Priority',
          observation: `${knownContext} The available context does not yet isolate the single workflow that creates the most drag.`,
          impact: 'The team may discuss AI tools before agreeing on the business process that needs support.',
          priority: 'High',
        },
        {
          title: 'Scattered Inputs',
          observation: `Information likely sits across ${toolPhrase}, founder memory, and informal team conversations.`,
          impact: 'Planning quality drops when discovery data is not converted into a shared operating map.',
          priority: 'High',
        },
        {
          title: 'Weak Content Linkage',
          observation: 'External communication can drift if it is not tied back to the workflow and system choices.',
          impact: 'Content may describe ambition without proving the operational clarity behind it.',
          priority: 'Medium',
        },
      ],
      operatingLogic: `${companyName} needs a planning system that first clarifies the priority workflow, then designs lightweight intelligence support around the human decision points, and only then translates the improved logic into content.`,
      nextDiscoveryQuestions: [
        'Which recurring workflow consumes the most founder or team attention every week?',
        'Where does work currently pause because someone needs context, approval, or judgment?',
        'Which internal documents, tools, or inboxes contain the strongest evidence for the diagnosis?',
        'What public claim should the company avoid until proof and permission are clear?',
      ],
    },
    systems: {
      thesis: `The systems layer for ${companyName} should stay narrow: build support around the highest-friction workflow before expanding into agent pipelines.`,
      blueprints: [
        {
          name: 'Discovery Intelligence Workspace',
          purpose: 'Convert founder notes, website context, and manual research into a structured operating diagnosis.',
          workflowChange: 'Moves discovery from scattered notes to a reusable clarity map with bottlenecks and assumptions.',
          humanApproval: 'Founder approves the final diagnosis before any system or content plan is generated.',
          buildOrder: 1,
        },
        {
          name: 'Workflow Blueprint Generator',
          purpose: 'Translate bottlenecks into practical system concepts, data requirements, and human approval gates.',
          workflowChange: 'Turns abstract AI ideas into concrete internal tool candidates and a build sequence.',
          humanApproval: 'Kramaniti reviews system candidates before proposing implementation to a client.',
          buildOrder: 2,
        },
        {
          name: 'Content Alignment Planner',
          purpose: 'Create content directions that reflect the clarity and systems thesis instead of generic campaign ideas.',
          workflowChange: 'Connects operational substance to founder-led posts, video ideas, and campaign briefs.',
          humanApproval: 'Founder approves content angles before any future content agent drafts assets.',
          buildOrder: 3,
        },
      ],
      sequence: [
        'Capture manual context and optional web-research signals.',
        'Generate Layer 1 clarity diagnosis with evidence labels.',
        'Generate Layer 2 system plan with build order and approval gates.',
        'Generate Layer 3 content plan connected to the operating thesis.',
        'Export a planning dossier for proposal, audit, or internal follow-up.',
      ],
    },
    content: {
      narrative: `${companyName}'s content should communicate clearer operating thinking first, then show how practical systems support that clarity. The tone should feel grounded, specific, and useful rather than tool-led.`,
      directions: [
        {
          title: 'Founder Clarity Post',
          angle: `A concise post on the business cost of unclear workflows in ${industry}.`,
          formats: ['LinkedIn post', 'newsletter opener'],
          proofNeeded: 'Founder-approved workflow examples and no unverified performance claims.',
        },
        {
          title: 'System Blueprint Explainer',
          angle: 'A visual breakdown of the first internal system worth building and the human approval points around it.',
          formats: ['carousel', 'short-form video script'],
          proofNeeded: 'Approved screenshots or anonymized workflow diagrams.',
        },
        {
          title: 'Operating Pipeline Story',
          angle: 'A narrative showing how strategy, systems, and content become one connected growth pipeline.',
          formats: ['website section', 'proposal page', 'brand film outline'],
          proofNeeded: 'Permission-cleared experience or category-level credibility only.',
        },
      ],
      approvalGate: 'No content asset should be generated or published until the clarity diagnosis and systems thesis are approved by a human.',
    },
    dossier: {
      executiveSummary: `${companyName} is best served by a planning engagement that clarifies the priority workflow, designs practical intelligence support, and converts the result into content that reflects real operational substance.`,
      recommendedOffer: 'Foundation Strategy, with a clear path into Systems Engineering if the blueprint is approved.',
      nextStep: 'Run a founder-led discovery session, validate the bottleneck map, and approve one system candidate for prototype specification.',
    },
  };
}
