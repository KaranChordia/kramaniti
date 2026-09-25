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
  "exception-log": {
    outcome:
      "A shared record of overrides, corrections and odd cases that turns repeats into owned changes to the normal route.",
    question:
      "Which live workflow keeps needing correction, and who will review what gets logged?",
    requires: [
      "One live workflow where people regularly correct, override or escalate",
      "A shared table or sheet placed beside that workflow",
      "A named owner who reviews the log on a fixed day",
    ],
    check:
      "Every entry says what was expected and what happened; each reviewed pattern ends in one outcome with an owner; urgent cases went to a person the same day rather than waiting for review.",
    limit:
      "A log shows what people noticed and recorded, not everything that went wrong, so treat counts as signals rather than measurements. It does not decide which changes are worth making; the named owner does.",
    related: ["human-review-gate", "workflow-diagnostic-skill"],
  },
  "enquiry-triage-agent": {
    outcome:
      "Every incoming enquiry is sorted, answered from approved information or passed to the right person, with nothing sent that a person has not agreed to.",
    question:
      "Which enquiries can be answered from approved information, and which must always reach a person?",
    requires: [
      "A sample of recent real enquiries from WhatsApp and email",
      "The approved answers you already give (price list, stock rules, timings, delivery areas)",
      "A named person for each type of enquiry that needs a human call",
    ],
    check:
      "Every reply is built only from the approved information; money, complaints and delivery promises always reach a person; nothing is sent without approval during the trial; the weekly log shows which drafts were edited and why.",
    limit:
      "This brief does not connect to WhatsApp or email by itself, and it cannot check stock, orders or payments it has not been given. Check your messaging provider’s current rules on automated and business messages, and your obligations for customer data, before connecting any tool.",
    related: ["agent-brief-template", "human-review-gate"],
  },
  "builder-exit-handover-test": {
    outcome:
      "A clear answer to whether a workflow can run, stop safely and be corrected without the person who built it, plus a short list of what to fix before it grows.",
    question:
      "If the builder stepped away tomorrow, could the operator run, stop and fix this workflow?",
    requires: [
      "One workflow already in use, manual or AI-assisted",
      "The person who runs it day to day, and someone who has not built it",
      "An hour when the builder can stay present but silent",
    ],
    check:
      "The test was run with the operator, not the builder, doing the work; every No or Partly answer has a fix with an owner; recovery cards have safe actions that do not depend on the builder; the decision owner signed the result.",
    limit:
      "This test checks whether ownership, instructions and recovery steps exist. It does not prove the workflow is accurate, secure or compliant, and a few practice cases will not show every failure.",
    related: ["exception-log", "human-review-gate"],
  },
  "founder-memory-sop-agent": {
    outcome:
      "A draft standard operating procedure built only from what the founder actually said, with gaps returned as questions and nothing treated as the rule until the founder approves it.",
    question:
      "Which routine task keeps coming back to the founder, and who will follow the written version?",
    requires: [
      "A recorded walkthrough, voice note transcript or written notes from the founder about one routine task",
      "The person who will follow the procedure day to day",
      "Time set aside for the founder to review the draft and answer its questions",
    ],
    check:
      "Every step traces back to something the founder said; guesses appear as open questions rather than rules; judgment calls are marked as decision points; the founder has approved the version in use and it is stored where the team works.",
    limit:
      "The extractor can only capture what the founder said in one walkthrough, and a single example rarely covers every case. It does not check whether the procedure meets legal, regulatory or professional requirements; that stays with the responsible professional.",
    related: ["workflow-diagnostic-skill", "source-checking-skill"],
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
