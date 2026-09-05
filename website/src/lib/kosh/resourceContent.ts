/** Only this section is sent for adaptation; demonstration facts stay out of real work. */
export function workingTemplate(markdown: string) {
  const section = markdown
    .split("## Working template\n")[1]
    ?.split("\n## Demonstration")[0]
    ?.trim();
  if (!section) throw new Error("The working template is missing.");
  return section;
}

export function validateAdaptation(content: string) {
  const trimmed = content
    .trim()
    .replace(/^```(?:markdown|md)?\s*/i, "")
    .replace(/\s*```$/, "")
    .trim();
  if (
    !trimmed ||
    trimmed.length > 24000 ||
    !/^# /m.test(trimmed) ||
    !/^## Human review\s*$/m.test(trimmed)
  ) {
    throw new Error("The draft was incomplete. Please try again.");
  }
  return trimmed;
}
