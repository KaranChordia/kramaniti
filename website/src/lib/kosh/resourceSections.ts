/** Split only level-two headings. Nested examples and all source wording stay intact. */
export type ResourceSection = { id: string; title: string; body: string };
export function sectionId(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
export function resourceSections(markdown: string): ResourceSection[] {
  const headings = [...markdown.matchAll(/^## (.+)\r?$/gm)];
  return headings.map((match, index) => ({
    id: sectionId(match[1]),
    title: match[1],
    body: markdown
      .slice(
        match.index! + match[0].length,
        headings[index + 1]?.index ?? markdown.length,
      )
      .trim(),
  }));
}
