import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import {
  defaultLibrarySort,
  formatCreatedDate,
  libraryItems,
  librarySortOptions,
  parseLibrarySort,
  sortLibraryItems,
} from "../src/lib/library/libraryData.ts";
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
test("every resource sets a real created date and it formats without locale drift", () => {
  for (const item of libraryItems) {
    assert.match(
      item.created ?? "",
      /^\d{4}-\d{2}-\d{2}$/,
      `${item.id} needs created: 'YYYY-MM-DD'`,
    );
    assert.equal(
      new Date(`${item.created}T00:00:00Z`).toISOString().slice(0, 10),
      item.created,
      `${item.id} has an impossible created date`,
    );
  }
  assert.equal(formatCreatedDate("2026-10-04"), "4 Oct 2026");
  assert.equal(formatCreatedDate("2026-08-29"), "29 Aug 2026");
  assert.equal(formatCreatedDate("2027-01-01"), "1 Jan 2027");
  assert.throws(() => formatCreatedDate("04/10/2026"), /Invalid created date/);
});
test("library sorts by date added, newest first by default, with stable ties", () => {
  assert.equal(defaultLibrarySort, "newest");
  assert.equal(librarySortOptions[0].value, "newest");
  assert.equal(librarySortOptions[0].label, "Newest first");
  assert.equal(parseLibrarySort(undefined), "newest");
  assert.equal(parseLibrarySort("nonsense"), "newest");
  assert.equal(parseLibrarySort("oldest"), "oldest");
  for (const option of librarySortOptions) {
    assert.doesNotMatch(option.label, /[\u2013\u2014]/);
  }

  const item = (id, created, title = id, category = "Client work") => ({
    id,
    created,
    title,
    category,
  });
  // Added in this order. b and c share a date, as do d and e.
  const added = [
    item("a", "2026-08-29", "Zebra"),
    item("b", "2026-09-25", "Apple"),
    item("c", "2026-09-25", "Mango"),
    item("d", "2026-10-01", "Apple"),
    item("e", "2026-10-01", "Kiwi"),
  ];
  const ids = (list) => list.map((entry) => entry.id).join(",");
  const shuffled = [added[3], added[0], added[4], added[2], added[1]];

  assert.equal(ids(sortLibraryItems(shuffled, undefined, added)), "e,d,c,b,a");
  assert.equal(ids(sortLibraryItems(shuffled, "newest", added)), "e,d,c,b,a");
  assert.equal(ids(sortLibraryItems(shuffled, "oldest", added)), "a,b,c,d,e");
  assert.equal(ids(sortLibraryItems(shuffled, "az", added)), "b,d,e,c,a");
  assert.equal(ids(sortLibraryItems(added, "newest", added)), ids(sortLibraryItems(shuffled, "newest", added)));
  assert.equal(ids(shuffled), "d,a,e,c,b", "sorting must not change the input list");

  const newest = sortLibraryItems(libraryItems);
  assert.equal(newest.length, libraryItems.length);
  for (let index = 1; index < newest.length; index += 1) {
    const before = newest[index - 1];
    const after = newest[index];
    assert.ok(before.created >= after.created, `${before.id} should come before ${after.id}`);
    if (before.created === after.created) {
      assert.ok(libraryItems.indexOf(before) > libraryItems.indexOf(after));
    }
  }
  const oldest = sortLibraryItems(libraryItems, "oldest");
  for (let index = 1; index < oldest.length; index += 1) {
    const before = oldest[index - 1];
    const after = oldest[index];
    assert.ok(before.created <= after.created, `${before.id} should come before ${after.id}`);
    if (before.created === after.created) {
      assert.ok(libraryItems.indexOf(before) < libraryItems.indexOf(after));
    }
  }
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
