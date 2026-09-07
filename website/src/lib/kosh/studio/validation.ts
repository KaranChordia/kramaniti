import type { Finding, HumanReview, Sample, SkillDraft } from "./schema";

export function canonical(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(canonical).join(",")}]`;
  if (value && typeof value === "object")
    return `{${Object.entries(value)
      .filter(([, v]) => v !== undefined)
      .sort(([a], [b]) => a.localeCompare(b, "en"))
      .map(([k, v]) => `${JSON.stringify(k)}:${canonical(v)}`)
      .join(",")}}`;
  return JSON.stringify(value);
}
export async function digest(value: unknown): Promise<string> {
  const hash = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(canonical(value)),
  );
  return Array.from(new Uint8Array(hash), (b) =>
    b.toString(16).padStart(2, "0"),
  ).join("");
}
export function detectsSecret(text: string) {
  return /(?:sk[-_](?:proj[-_])?[A-Za-z0-9_-]{16,}|gsk_[A-Za-z0-9]{16,}|gh[pousr]_[A-Za-z0-9]{20,}|AKIA[A-Z0-9]{16}|-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----|(?:api[_ -]?key|password|secret|token)\s*[=:]\s*["']?[A-Za-z0-9_+\/-]{16,}|eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,})/i.test(
    text,
  );
}
export function validate(draft: SkillDraft): Finding[] {
  const findings: Finding[] = [];
  const add = (code: string, message: string, blocking = false) =>
    findings.push({ code, message, blocking });
  if (
    !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(draft.slug) ||
    draft.slug.length > 64 ||
    /^(con|prn|aux|nul|com[0-9]|lpt[0-9])$/i.test(draft.slug)
  )
    add(
      "unsafe-path",
      "Use a safe package name with lowercase letters, numbers and single hyphens.",
      true,
    );
  if (new TextEncoder().encode(canonical(draft)).length > 65536)
    add("size", "The artifact exceeds the 64 KB limit.", true);
  if (detectsSecret(canonical(draft)))
    add(
      "secret",
      "A possible credential was detected. Remove it before exporting.",
      true,
    );
  if (
    draft.schemaVersion !== 1 ||
    draft.kind !== "skill" ||
    draft.dependencies.length ||
    draft.governance.enforcement !== "instruction-only"
  )
    add("schema", "Unsupported schema, dependency or enforcement claim.", true);
  if (!draft.title.trim() || draft.title.length > 100)
    add("title", "Give the skill a title of 1–100 characters.");
  if (draft.summary.length > 500)
    add("summary", "Keep the summary within 500 characters.");
  const required = {
    Purpose: draft.content.purpose,
    "Use when": draft.content.useWhen,
    Output: draft.content.output,
    "Quality checks": draft.content.qualityChecks,
    Limitations: draft.content.limitations,
    "Allowed sources": draft.governance.sources,
    "Permitted actions": draft.governance.permitted,
    "Prohibited actions": draft.governance.prohibited,
    "Approval required": draft.governance.approvalRequired,
    "Missing information": draft.governance.missingInformation,
    "Escalation owner": draft.governance.escalationOwner,
  };
  for (const [label, value] of Object.entries(required))
    if (!value.trim()) add(label, `${label} is unresolved.`);
  if (
    !draft.content.inputs.length ||
    draft.content.inputs.some(
      (x) => !x.name.trim() || !x.description.trim() || x.type !== "text",
    )
  )
    add("inputs", "Name and describe each input.");
  if (
    !draft.content.steps.length ||
    draft.content.steps.some((x) => !x.instruction.trim())
  )
    add("method", "Describe each step in the method.");
  for (const items of [draft.content.inputs, draft.content.steps])
    if (
      new Set(items.map((x) => x.id)).size !== items.length ||
      items.some((x) => !/^[a-z0-9-]+$/.test(x.id))
    )
      add(
        "stable-ids",
        "Input and step identifiers must be unique and safe.",
        true,
      );
  return findings;
}
export async function reviewIsCurrent(
  draft: SkillDraft,
  sample: Sample,
  review: HumanReview | null,
) {
  return (
    !!review &&
    review.contentDigest === (await digest(draft)) &&
    review.sampleDigest === (await digest(sample))
  );
}
