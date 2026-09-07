import { strToU8, zipSync } from "fflate";
import { parseSkill } from "./schema.ts";
import type { HumanReview, Sample, SkillDraft } from "./schema";
import {
  canonical,
  detectsSecret,
  digest,
  reviewIsCurrent,
  validate,
} from "./validation.ts";

export function skillMarkdown(draft: SkillDraft) {
  const c = draft.content;
  return `# ${draft.title}\n\n## Purpose\n${c.purpose}\n\n## Use when\n${c.useWhen}\n\n## Inputs\n${c.inputs.map((x) => `- ${x.name} (${x.type}, ${x.required ? "required" : "optional"}): ${x.description}`).join("\n")}\n\n## Method\n${c.steps.map((s, i) => `${i + 1}. ${s.instruction}`).join("\n")}\n\n## Output\n${c.output}\n\n## Quality checks\n${c.qualityChecks}\n\n## Limitations\n${c.limitations}\n`;
}
export async function packageSkill(
  draft: SkillDraft,
  sample: Sample,
  review: HumanReview | null,
  options: {
    reviewed: boolean;
    acknowledgedDigest: string | null;
    includeSamples: boolean;
  },
) {
  parseSkill(draft);
  const findings = validate(draft);
  if (findings.some((x) => x.blocking))
    throw new Error(
      findings
        .filter((x) => x.blocking)
        .map((x) => x.message)
        .join(" "),
    );
  if (options.includeSamples && detectsSecret(canonical(sample)))
    throw new Error(
      "Possible credential in sample data. Remove it or exclude sample data.",
    );
  if (
    new TextEncoder().encode(canonical(sample)).length > 40000 &&
    options.includeSamples
  )
    throw new Error("Sample data exceeds the 40 KB export limit.");
  const contentDigest = await digest(draft);
  const current = await reviewIsCurrent(draft, sample, review);
  const passed =
    current &&
    review &&
    Object.values(review.assessments).every((x) => x === "pass");
  if (
    options.reviewed &&
    (findings.length || !passed || options.acknowledgedDigest !== contentDigest)
  )
    throw new Error(
      "Reviewed export requires complete structure, passing current human assessments and acknowledgment for this exact content.",
    );
  const status = options.reviewed ? "human-reviewed" : "draft";
  const json = (value: unknown) => JSON.stringify(value, null, 2) + "\n";
  const g = draft.governance;
  const files: Record<string, string> = {
    "kosh.json": json({
      schemaVersion: 1,
      kind: "skill",
      title: draft.title,
      slug: draft.slug,
      summary: draft.summary,
      revision: null,
      snapshot: "unsaved-local",
      contentDigest,
      source: draft.source ?? null,
      dependencies: [],
      reviewStatus: status,
      artifact: draft,
    }),
    "README.md": `# ${draft.title}\n\nPortable Kosh package · ${status}\n\nThis is an unsaved local snapshot, not a server revision.\nContent SHA-256: ${contentDigest}\n\n## Use\nRead skill.md and governance.md. Supply the declared inputs in a destination you trust. Review the output yourself. No host integration or installation has been tested.\n\n## Limits\nGovernance rules are instructions only, not runtime enforcement. Structural and credential-pattern checks cannot establish factual accuracy, safety or the absence of secrets. No scripts or connectors are included.\n\n${draft.source ? `## Source\nKramaniti Kosh: ${draft.source.resourceId}, version ${draft.source.version}.\n\n` : ""}${options.includeSamples ? "You explicitly included sample input and output.\n" : "Sample input and output are excluded.\n"}`,
    "skill.md": skillMarkdown(draft),
    "governance.md": `# Boundaries\n\nStatus: Instruction only. Kosh has no tool executor. The destination must enforce permissions and approval gates.\n\n## Allowed sources\n${g.sources}\n\n## Permitted actions\n${g.permitted}\n\n## Prohibited actions\n${g.prohibited}\n\n## Human approval required\n${g.approvalRequired}\n\n## Missing information\n${g.missingInformation}\n\n## Escalation owner\n${g.escalationOwner || "Unresolved"}\n`,
    "checks.json": json({
      contentDigest,
      status,
      structure: findings,
      checksPerformed: [
        "required-fields",
        "safe-path",
        "size",
        "credential-patterns",
        "schema-and-stable-ids",
      ],
      humanReview: current ? review : null,
      acknowledgedDigest: options.reviewed ? options.acknowledgedDigest : null,
      limitations:
        "Pattern checks are incomplete. No runtime enforcement or destination test.",
    }),
  };
  if (options.includeSamples) files["tests/examples.json"] = json(sample);
  // Fixed ZIP timestamp makes the same snapshot/options byte-identical.
  const zip = zipSync(
    Object.fromEntries(
      Object.entries(files).map(([path, text]) => [
        `${draft.slug}/${path}`,
        [strToU8(text), { mtime: new Date(1980, 0, 1) }],
      ]),
    ),
    { level: 6 },
  );
  return { files, zip, contentDigest, status };
}
