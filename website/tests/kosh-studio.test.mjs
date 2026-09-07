import { test } from "node:test";
import assert from "node:assert/strict";
import { unzipSync, strFromU8 } from "fflate";
import {
  blankSkill,
  researchFixture,
  researchSample,
} from "../src/lib/kosh/studio/schema.ts";
import {
  canonical,
  digest,
  validate,
  reviewIsCurrent,
} from "../src/lib/kosh/studio/validation.ts";
import { packageSkill } from "../src/lib/kosh/studio/export.ts";
const options = {
  reviewed: false,
  acknowledgedDigest: null,
  includeSamples: false,
};
const sample = {
  ...researchSample,
  output:
    "Two participants completed a trial (Source A). Costs are unknown (Source B). A human must decide.",
};
async function review(draft) {
  return {
    contentDigest: await digest(draft),
    sampleDigest: await digest(sample),
    assessments: { output: "pass", evidence: "pass", boundaries: "pass" },
    reviewedAt: "2026-09-06T00:00:00Z",
  };
}
test("blank structure is incomplete; synthetic fixture has all required fields", () => {
  assert.ok(validate(blankSkill()).length >= 7);
  assert.deepEqual(validate(researchFixture()), []);
});
test("canonical digest is independent of object key order and changes with content", async () => {
  assert.equal(canonical({ b: 2, a: 1 }), '{"a":1,"b":2}');
  assert.equal(await digest({ b: 2, a: 1 }), await digest({ a: 1, b: 2 }));
  assert.notEqual(
    await digest(researchFixture()),
    await digest({ ...researchFixture(), title: "Other" }),
  );
});
test("artifact and sample edits invalidate current human review; earlier evidence is retained", async () => {
  const draft = researchFixture();
  const r = await review(draft);
  assert.equal(await reviewIsCurrent(draft, sample, r), true);
  assert.equal(
    await reviewIsCurrent({ ...draft, title: "Edited" }, sample, r),
    false,
  );
  assert.equal(
    await reviewIsCurrent(draft, { ...sample, output: "Changed" }, r),
    false,
  );
  assert.equal(r.contentDigest, await digest(draft));
});
test("ZIP bytes are deterministic, open, match file content and exclude samples by default", async () => {
  const draft = researchFixture();
  const a = await packageSkill(draft, sample, null, options);
  const b = await packageSkill(draft, sample, null, options);
  assert.deepEqual(a.zip, b.zip);
  const files = unzipSync(a.zip);
  assert.equal(Object.keys(files).length, 5);
  for (const [name, contents] of Object.entries(a.files))
    assert.equal(strFromU8(files[`research-brief/${name}`]), contents);
  const all = Object.values(files).map(strFromU8).join("\n");
  assert.ok(!all.includes("Two participants completed a trial"));
  assert.ok(!all.includes("ownerId"));
  assert.equal(
    JSON.parse(strFromU8(files["research-brief/kosh.json"])).revision,
    null,
  );
  assert.match(
    strFromU8(files["research-brief/governance.md"]),
    /Instruction only/,
  );
  const included = await packageSkill(draft, sample, null, {
    ...options,
    includeSamples: true,
  });
  assert.deepEqual(
    JSON.parse(
      strFromU8(unzipSync(included.zip)["research-brief/tests/examples.json"]),
    ),
    sample,
  );
});
test("reviewed download needs passing exact-version evidence and explicit acknowledgment", async () => {
  const draft = researchFixture();
  const r = await review(draft);
  await assert.rejects(
    packageSkill(draft, sample, null, { ...options, reviewed: true }),
    /requires/,
  );
  await assert.rejects(
    packageSkill(draft, sample, r, { ...options, reviewed: true }),
    /requires/,
  );
  const good = {
    ...options,
    reviewed: true,
    acknowledgedDigest: await digest(draft),
  };
  assert.equal(
    (await packageSkill(draft, sample, r, good)).status,
    "human-reviewed",
  );
  await assert.rejects(
    packageSkill(draft, { ...sample, input: "Changed" }, r, good),
    /requires/,
  );
  await assert.rejects(
    packageSkill({ ...draft, title: "Changed" }, sample, r, good),
    /requires/,
  );
  await assert.rejects(
    packageSkill(
      draft,
      sample,
      { ...r, assessments: { ...r.assessments, boundaries: "fail" } },
      good,
    ),
    /requires/,
  );
});
test("unsafe paths, credentials, unsupported enforcement and duplicate stable ids block exports", async () => {
  for (const slug of ["../escape", "/root", "bad\\name", "con", "a--b"])
    await assert.rejects(
      packageSkill({ ...researchFixture(), slug }, sample, null, options),
      /safe package/,
    );
  const secret = researchFixture();
  secret.content.purpose = "api_key=1234567890123456789012345";
  await assert.rejects(
    packageSkill(secret, sample, null, options),
    /credential/,
  );
  const enforcement = researchFixture();
  enforcement.governance.enforcement = "runtime";
  await assert.rejects(
    packageSkill(enforcement, sample, null, options),
    /enforcement/,
  );
  const duplicate = researchFixture();
  duplicate.content.steps[1].id = duplicate.content.steps[0].id;
  await assert.rejects(
    packageSkill(duplicate, sample, null, options),
    /identifiers/,
  );
  await assert.rejects(
    packageSkill(
      researchFixture(),
      { ...sample, input: "password=12345678901234567890" },
      null,
      { ...options, includeSamples: true },
    ),
    /credential/,
  );
});
test("incomplete drafts can be recovered without being labelled reviewed", async () => {
  const result = await packageSkill(blankSkill(), sample, null, options);
  assert.equal(result.status, "draft");
  assert.ok(JSON.parse(result.files["checks.json"]).structure.length > 0);
});
test("hidden private metadata and malformed nested fields never enter a package", async () => {
  await assert.rejects(
    packageSkill(
      { ...researchFixture(), ownerId: "private-owner" },
      sample,
      null,
      options,
    ),
    /fields/,
  );
  const nested = researchFixture();
  nested.governance.privateContext = "Must never be exported";
  await assert.rejects(packageSkill(nested, sample, null, options), /fields/);
  const malformed = researchFixture();
  malformed.content.steps = [{ id: "step-1", instruction: 42 }];
  await assert.rejects(packageSkill(malformed, sample, null, options), /text/);
});
