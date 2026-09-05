export type ResourceDetail = {
  outcome: string;
  question: string;
  requires: string[];
  check: string;
  limit: string;
  related: string[];
};

export const RESOURCE_VERSION = "1.1";
export const resourceDetails: Record<string, ResourceDetail> = {
  "research-synthesis-agent": {
    outcome:
      "A research brief with evidence you can trace and a decision someone can own.",
    question:
      "What decision will this research support, and which sources may it use?",
    requires: [
      "One specific decision question",
      "Approved documents or source links",
      "A decision owner and deadline",
    ],
    check:
      "Every material claim has a source or uncertainty label; the recommendation stays within the evidence; a named person owns the decision.",
    limit:
      "This template cannot verify sources that you have not supplied or that your chosen assistant cannot access.",
    related: ["source-checking-skill", "human-review-gate"],
  },
  "workflow-diagnostic-skill": {
    outcome:
      "A clear process map and the smallest useful improvement to investigate.",
    question:
      "Which recurring process is causing friction, and where does work wait or repeat?",
    requires: [
      "The current steps and handoffs",
      "People responsible for each step",
      "Examples of delays or exceptions",
    ],
    check:
      "The map reflects a real instance; observed friction is separate from suspected causes; the next intervention has an owner and a review point.",
    limit:
      "A process description alone does not establish the cause, cost, or frequency of a delay.",
    related: ["agent-brief-template", "human-review-gate"],
  },
  "source-checking-skill": {
    outcome: "A draft whose claims are traceable, qualified, or removed.",
    question:
      "Which draft needs checking, and what evidence is approved for its claims?",
    requires: [
      "The exact draft to check",
      "Source documents or links",
      "A named reviewer for public or sensitive claims",
    ],
    check:
      "No stronger claim survives than the source supports; source links are retained; public permission and factual support are considered separately.",
    limit:
      "A source can support a claim without granting permission to publish it. This method is not specialist legal or financial review.",
    related: ["research-synthesis-agent", "human-review-gate"],
  },
  "plugin-evaluation-guide": {
    outcome:
      "A recorded connection decision with permissions, ownership and a failure plan.",
    question:
      "What job would this connection perform, and what access does it request?",
    requires: [
      "The specific plugin and current documentation",
      "Requested permissions and intended data",
      "An owner who can approve and revoke access",
    ],
    check:
      "Every permission has a reason; unknown retention or access behaviour stays visible; a named owner can disable the connection.",
    limit:
      "Permissions and provider behaviour change. Recheck current documentation before connecting; no plugin compatibility is implied.",
    related: ["agent-brief-template", "human-review-gate"],
  },
  "agent-brief-template": {
    outcome:
      "An accountable agent brief with a bounded job and a clear handoff.",
    question:
      "What recurring job should the agent support, and what must remain with a person?",
    requires: [
      "One recurring job and its outcome",
      "Approved inputs and exclusions",
      "An owner and a receiving person or team",
    ],
    check:
      "The job is specific; inputs and exclusions are explicit; the sample test includes a stop condition; the receiving owner is named.",
    limit:
      "A well-written brief does not prove runtime reliability or grant access to tools. Test it in the intended environment.",
    related: ["plugin-evaluation-guide", "human-review-gate"],
  },
  "human-review-gate": {
    outcome: "An explicit approval decision with evidence and a next owner.",
    question:
      "What exact action needs approval, and who is authorised to decide?",
    requires: [
      "The proposed action or final wording",
      "Evidence, assumptions and unresolved questions",
      "An authorised decision owner",
    ],
    check:
      "The exact action is visible; recommendations and approvals are distinct; the decision record is completed by the authorised owner.",
    limit:
      "The template records a decision. It does not establish a person\u2019s authority or replace approval required by the organisation.",
    related: ["source-checking-skill", "workflow-diagnostic-skill"],
  },
};

export const researchCollection = [
  {
    id: "research-synthesis-agent",
    step: "Frame the decision",
    handoff: "Produce the evidence brief and name what is still unknown.",
  },
  {
    id: "source-checking-skill",
    step: "Check the claims",
    handoff: "Carry the brief forward. Verify the wording against its sources.",
  },
  {
    id: "human-review-gate",
    step: "Make the human call",
    handoff:
      "Present the checked brief and exact next action to the decision owner.",
  },
];
