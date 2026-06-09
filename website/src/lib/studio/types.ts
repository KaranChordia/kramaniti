export type StudioLayerId = 'intake' | 'clarity' | 'systems' | 'content' | 'tools' | 'dossier';

export type StudioPlanStatus = 'draft' | 'ready' | 'approved';

export type StudioIntake = {
  companyName: string;
  website: string;
  industry: string;
  companyStage: string;
  knownContext: string;
  currentTools: string;
  priorityQuestion: string;
  researchMode: 'manual' | 'mock-web';
};

export type ResearchSignal = {
  label: string;
  detail: string;
  confidence: 'manual' | 'inferred' | 'mock';
};

export type Bottleneck = {
  title: string;
  observation: string;
  impact: string;
  priority: 'High' | 'Medium' | 'Low';
};

export type SystemBlueprint = {
  name: string;
  purpose: string;
  workflowChange: string;
  humanApproval: string;
  buildOrder: number;
};

export type ContentDirection = {
  title: string;
  angle: string;
  formats: string[];
  proofNeeded: string;
};

export type StudioPlan = {
  id: string;
  createdAt: string;
  status: StudioPlanStatus;
  intake: StudioIntake;
  researchSignals: ResearchSignal[];
  clarity: {
    summary: string;
    bottlenecks: Bottleneck[];
    operatingLogic: string;
    nextDiscoveryQuestions: string[];
  };
  systems: {
    thesis: string;
    blueprints: SystemBlueprint[];
    sequence: string[];
  };
  content: {
    narrative: string;
    directions: ContentDirection[];
    approvalGate: string;
  };
  dossier: {
    executiveSummary: string;
    recommendedOffer: string;
    nextStep: string;
  };
};
