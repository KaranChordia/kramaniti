import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { libraryItems } from "../src/lib/library/libraryData.ts";
import {
  resourceDetails,
  researchCollection,
} from "../src/lib/library/resourceDetails.ts";
import {
  workingTemplate,
  validateAdaptation,
} from "../src/lib/kosh/resourceContent.ts";
import {
  parseKoshContext,
  serializeKoshContext,
} from "../src/lib/kosh/context.ts";

test("every resource has a usable, separate template and labelled demonstration", async () => {
  for (const item of libraryItems) {
    const text = await readFile(
      new URL(`../public${item.download}`, import.meta.url),
      "utf8",
    );
    assert.ok(text.includes("## How to use"));
    assert.ok(text.includes("## Quality check"));
    assert.ok(text.includes("illustrative scenario, not a client case study"));
    assert.ok(text.includes("## Limits and human review"));
    assert.ok(
      resourceDetails[item.id].related.every((id) =>
        libraryItems.some((item) => item.id === id),
      ),
    );
    const template = workingTemplate(text);
    assert.ok(template.length > 200);
    assert.ok(!template.includes("Demonstration inputs"));
    assert.ok(!template.includes("Fact within this demonstration"));
  }
  assert.equal(
    new Set(libraryItems.map((item) => item.id)).size,
    libraryItems.length,
  );
  assert.ok(
    researchCollection.every((step) =>
      libraryItems.some((item) => item.id === step.id),
    ),
  );
});
test("missing template cannot accidentally send example data for generation", () => {
  assert.throws(
    () => workingTemplate("# Only a demonstration\nInvented example"),
    /missing/,
  );
});
test("incomplete generation is rejected and valid fenced Markdown is accepted", () => {
  assert.throws(() => validateAdaptation(""), /incomplete/);
  assert.throws(
    () => validateAdaptation("# Draft\nNo review gate"),
    /incomplete/,
  );
  assert.throws(
    () =>
      validateAdaptation("# Draft\n" + "x".repeat(24001) + "\n## Human review"),
    /incomplete/,
  );
  assert.equal(
    validateAdaptation(
      "```markdown\n# Draft\n\n## Human review\nApproval pending.\n```",
    ),
    "# Draft\n\n## Human review\nApproval pending.",
  );
});
test("profiles remain separate and legacy context remains professional only", () => {
  assert.deepEqual(
    parseKoshContext(
      serializeKoshContext({ personal: " Personal ", professional: " Work " }),
    ),
    { personal: "Personal", professional: "Work" },
  );
  assert.deepEqual(parseKoshContext("Legacy work notes"), {
    personal: "",
    professional: "Legacy work notes",
  });
  assert.deepEqual(
    parseKoshContext('{"personal": 42, "professional": "Work"}'),
    { personal: "", professional: "Work" },
  );
});
