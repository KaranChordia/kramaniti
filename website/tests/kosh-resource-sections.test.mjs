import assert from "node:assert/strict";
import { test } from "node:test";
import { readFile, readdir } from "node:fs/promises";
import { resourceSections } from "../src/lib/kosh/resourceSections.ts";
test("all public resource sections preserve their exact wording and nested demonstration headings", async () => {
  const directory = new URL("../public/library/", import.meta.url);
  for (const filename of (await readdir(directory)).filter((name) =>
    name.endsWith(".md"),
  )) {
    const markdown = await readFile(new URL(filename, directory), "utf8");
    const sections = resourceSections(markdown);
    const fromFirstSection = markdown
      .slice(markdown.indexOf("## Intended outcome"))
      .trim();
    assert.equal(
      sections
        .map(
          (section) =>
            `## ${section.title}${section.body ? `\n\n${section.body}` : ""}`,
        )
        .join("\n\n"),
      fromFirstSection,
      filename,
    );
    for (const id of [
      "intended-outcome",
      "before-you-begin",
      "how-to-use",
      "working-template",
      "demonstration",
      "quality-check",
      "limits-and-human-review",
      "edition-notes",
    ])
      assert.ok(
        sections.some((section) => section.id === id),
        `${filename}: ${id}`,
      );
    assert.match(
      sections.find((section) => section.id === "demonstration").body,
      /### Sample inputs/,
    );
  }
});
