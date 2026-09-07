/** Local drafts deliberately have no owner, remote identity or claimed saved revision. */
export type SkillDraft = {
  schemaVersion: 1;
  kind: "skill";
  title: string;
  slug: string;
  summary: string;
  content: {
    purpose: string;
    useWhen: string;
    inputs: {
      id: string;
      name: string;
      type: "text";
      required: boolean;
      description: string;
    }[];
    steps: { id: string; instruction: string }[];
    output: string;
    qualityChecks: string;
    limitations: string;
  };
  governance: {
    sources: string;
    permitted: string;
    prohibited: string;
    approvalRequired: string;
    missingInformation: string;
    escalationOwner: string;
    enforcement: "instruction-only";
  };
  source?: { resourceId: string; version: string };
  dependencies: [];
};
export type Sample = {
  name: string;
  input: string;
  expected: string;
  disallowed: string;
  output: string;
};
export type Assessment = "pass" | "fail" | "needs-review";
export type HumanReview = {
  contentDigest: string;
  sampleDigest: string;
  assessments: {
    output: Assessment;
    evidence: Assessment;
    boundaries: Assessment;
  };
  reviewedAt: string;
};
export type Finding = { code: string; message: string; blocking: boolean };
export const emptySample: Sample = {
  name: "",
  input: "",
  expected: "",
  disallowed: "",
  output: "",
};
export function slugify(title: string) {
  return (
    title
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 64)
      .replace(/-$/g, "") || "untitled-skill"
  );
}
export function blankSkill(intent = ""): SkillDraft {
  return {
    schemaVersion: 1,
    kind: "skill",
    title: "Untitled skill",
    slug: "untitled-skill",
    summary: "",
    content: {
      purpose: intent,
      useWhen: "",
      inputs: [
        {
          id: "input-1",
          name: "",
          type: "text",
          required: true,
          description: "",
        },
      ],
      steps: [{ id: "step-1", instruction: "" }],
      output: "",
      qualityChecks: "",
      limitations: "",
    },
    governance: {
      sources: "Use only the information supplied for this task.",
      permitted: "Read supplied context and prepare a draft for human review.",
      prohibited:
        "Do not call external tools, run code, send messages or invent evidence.",
      approvalRequired:
        "A human must approve consequential external actions in the destination runtime.",
      missingInformation:
        "Stop and ask when required information is missing. Mark uncertainty explicitly.",
      escalationOwner: "",
      enforcement: "instruction-only",
    },
    dependencies: [],
  };
}
export const exampleIntents = [
  {
    label: "A research brief",
    intent:
      "Turn supplied research into an evidence-backed brief for a decision.",
  },
  {
    label: "Meeting notes to actions",
    intent:
      "Turn meeting notes into clear actions, preserving known owners and dates.",
  },
  {
    label: "A content review",
    intent:
      "Review a supplied draft for clarity, unsupported claims and human approval.",
  },
];
/** Explicit synthetic fixture; never passed off as model generation. */
export function researchFixture(): SkillDraft {
  const draft = blankSkill(exampleIntents[0].intent);
  return {
    ...draft,
    title: "Research brief",
    slug: "research-brief",
    summary:
      "A repeatable method for turning supplied evidence into a decision brief.",
    content: {
      ...draft.content,
      useWhen:
        "A decision needs a concise, traceable summary of supplied research.",
      inputs: [
        {
          id: "input-1",
          name: "Research and decision",
          type: "text",
          required: true,
          description:
            "Supply the decision question and labelled source excerpts. Include dates when known.",
        },
      ],
      steps: [
        {
          id: "step-1",
          instruction:
            "Identify the decision question and confirm that required sources are supplied.",
        },
        {
          id: "step-2",
          instruction:
            "Separate supported facts, inferences and unresolved questions. Link each factual statement to its supplied source.",
        },
        {
          id: "step-3",
          instruction:
            "Draft a concise brief with options, limitations and a human decision point.",
        },
      ],
      output:
        "A brief with the decision question, evidence, options, unresolved questions and a human review section.",
      qualityChecks:
        "Every factual claim names a supplied source. Uncertainty is visible. No decision is made on behalf of the reviewer.",
      limitations:
        "Cannot independently verify sources or fetch new material. A human must check evidence and make the decision.",
    },
    governance: {
      ...draft.governance,
      escalationOwner: "The person commissioning this research",
    },
  };
}
export const researchSample: Sample = {
  name: "Synthetic research review",
  input:
    "Decision: should a fictional team extend its trial? Source A: two participants completed a trial. Source B: no costs have been supplied. Do not make a decision for the team.",
  expected:
    "State the supplied participation fact, identify missing costs, and leave the decision to a human.",
  disallowed:
    "Invent costs, claim the trial succeeded, or approve an extension.",
  output: "",
};

/** A strict wire boundary: reject hidden metadata rather than export or persist it. */
export function parseSkill(value: unknown): SkillDraft {
  function object(
    input: unknown,
    keys: string[],
    optional: string[] = [],
  ): Record<string, unknown> {
    if (!input || typeof input !== "object" || Array.isArray(input))
      throw new Error("Expected a structured skill object.");
    const row = input as Record<string, unknown>;
    if (
      Object.keys(row).some(
        (key) => !keys.includes(key) && !optional.includes(key),
      ) ||
      keys.some((key) => !(key in row))
    )
      throw new Error("Unexpected or missing skill fields.");
    return row;
  }
  function string(input: unknown, max = 12000): asserts input is string {
    if (typeof input !== "string" || input.length > max)
      throw new Error("Invalid or oversized text field.");
  }
  const row = object(
    value,
    [
      "schemaVersion",
      "kind",
      "title",
      "slug",
      "summary",
      "content",
      "governance",
      "dependencies",
    ],
    ["source"],
  );
  if (
    row.schemaVersion !== 1 ||
    row.kind !== "skill" ||
    !Array.isArray(row.dependencies) ||
    row.dependencies.length
  )
    throw new Error("Unsupported skill schema or dependencies.");
  string(row.title, 100);
  string(row.slug, 64);
  string(row.summary, 500);
  const content = object(row.content, [
    "purpose",
    "useWhen",
    "inputs",
    "steps",
    "output",
    "qualityChecks",
    "limitations",
  ]);
  for (const key of [
    "purpose",
    "useWhen",
    "output",
    "qualityChecks",
    "limitations",
  ])
    string(content[key]);
  for (const key of ["inputs", "steps"])
    if (!Array.isArray(content[key]) || content[key].length > 100)
      throw new Error("Invalid or oversized ordered content.");
  for (const input of content.inputs as unknown[]) {
    const item = object(input, [
      "id",
      "name",
      "type",
      "required",
      "description",
    ]);
    string(item.id, 100);
    string(item.name, 150);
    string(item.description);
    if (item.type !== "text" || typeof item.required !== "boolean")
      throw new Error("Invalid input definition.");
  }
  for (const step of content.steps as unknown[]) {
    const item = object(step, ["id", "instruction"]);
    string(item.id, 100);
    string(item.instruction);
  }
  const governance = object(row.governance, [
    "sources",
    "permitted",
    "prohibited",
    "approvalRequired",
    "missingInformation",
    "escalationOwner",
    "enforcement",
  ]);
  if (governance.enforcement !== "instruction-only")
    throw new Error("Unsupported enforcement claim.");
  for (const key of [
    "sources",
    "permitted",
    "prohibited",
    "approvalRequired",
    "missingInformation",
    "escalationOwner",
  ])
    string(governance[key]);
  if (row.source !== undefined) {
    const source = object(row.source, ["resourceId", "version"]);
    string(source.resourceId, 120);
    string(source.version, 30);
    if (
      !/^[a-z0-9-]+$/.test(source.resourceId as string) ||
      !/^[0-9]+\.[0-9]+$/.test(source.version as string)
    )
      throw new Error("Invalid source reference.");
  }
  return value as SkillDraft;
}
