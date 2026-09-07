// Local-only PostgreSQL verification. Never connects to a remote project.
import assert from "node:assert/strict";
import { readFile, writeFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import {
  researchFixture,
  researchSample,
} from "../src/lib/kosh/studio/schema.ts";
import { digest } from "../src/lib/kosh/studio/validation.ts";
if (!process.env.KOSH_PGLITE_MODULE)
  throw new Error("Set KOSH_PGLITE_MODULE to a local PGlite installation.");
const { PGlite } = await import(
  pathToFileURL(process.env.KOSH_PGLITE_MODULE).href
);
const db = new PGlite();
const first = "00000000-0000-4000-8000-000000000001";
const second = "00000000-0000-4000-8000-000000000002";
const checks = [];
try {
  await db.exec(`create role anon; create role authenticated; create schema auth; create schema kosh;
    create table auth.users(id uuid primary key);
    create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;
    grant usage on schema auth,kosh to anon,authenticated;
    grant execute on function auth.uid() to anon,authenticated;
    insert into auth.users values('${first}'),('${second}');`);
  const sql = await readFile(
    new URL(
      "../../docs/kosh/migrations/20260906152335_creation_studio.sql",
      import.meta.url,
    ),
    "utf8",
  );
  await db.exec(sql);
  await db.exec(sql);
  const asUser = (user) =>
    db.exec(
      `reset role; set role authenticated; select set_config('request.jwt.claim.sub','${user}',false);`,
    );
  const save = async (draft, id = null, revision = 0) =>
    (
      await db.query(
        "select kosh.save_artifact($1::jsonb,$2::uuid,$3) as result",
        [JSON.stringify(draft), id, revision],
      )
    ).rows[0].result;
  await asUser(first);
  const draft = researchFixture();
  const v1 = await save(draft);
  assert.equal(v1.revision, 1);
  assert.equal(v1.contentDigest, await digest(draft));
  assert.equal(
    (await db.query("select snapshot from kosh.artifact_versions")).rows[0]
      .snapshot.title,
    draft.title,
  );
  const edited = { ...draft, title: "Updated research brief" };
  const v2 = await save(edited, v1.id, 1);
  assert.equal(v2.revision, 2);
  await assert.rejects(save(draft, v1.id, 1), { code: "40001" });
  assert.equal(
    (await db.query("select count(*)::int as n from kosh.artifact_versions"))
      .rows[0].n,
    2,
  );
  const restored = await save(draft, v1.id, 2);
  assert.equal(restored.revision, 3);
  assert.equal(
    (
      await db.query(
        "select snapshot from kosh.artifact_versions where revision=2",
      )
    ).rows[0].snapshot.title,
    edited.title,
  );
  checks.push(
    "Atomic create/update, server digest matches application, stale save rejected, restore appends without rewriting history",
  );
  for (const query of [
    "update kosh.artifact_versions set revision=9",
    "update kosh.artifact_versions set snapshot='{}'::jsonb",
    `update kosh.artifacts set owner_id='${second}'`,
    "delete from kosh.artifact_versions",
    "insert into kosh.artifacts(owner_id,title) values (auth.uid(),'Direct')",
  ])
    await assert.rejects(db.query(query), { code: "42501" });
  checks.push(
    "Direct snapshot insert/update/delete and owner reassignment denied, including to the owner",
  );
  const sample = {
    ...researchSample,
    output: "A human decides after reviewing missing costs.",
  };
  const assessments = {
    output: "pass",
    evidence: "pass",
    boundaries: "needs-review",
  };
  const evidence = (
    await db.query(
      "select kosh.save_test_evidence($1,1,$2,$3::jsonb,$4::jsonb) as id",
      [
        v1.id,
        v1.contentDigest,
        JSON.stringify(sample),
        JSON.stringify(assessments),
      ],
    )
  ).rows[0].id;
  assert.equal(
    (await db.query("select sample_digest from kosh.artifact_test_results"))
      .rows[0].sample_digest,
    await digest(sample),
  );
  await assert.rejects(
    db.query("select kosh.save_test_evidence($1,1,$2,$3::jsonb,$4::jsonb)", [
      v1.id,
      "0".repeat(64),
      JSON.stringify(sample),
      JSON.stringify(assessments),
    ]),
    { code: "P0002" },
  );
  await assert.rejects(
    db.query("update kosh.artifact_test_results set assessments='{}'::jsonb"),
    { code: "42501" },
  );
  checks.push(
    "Explicit evidence save binds exact content and sample digests; wrong version digest and direct evidence rewrite rejected",
  );
  await asUser(second);
  for (const table of [
    "artifacts",
    "artifact_versions",
    "artifact_test_results",
  ])
    assert.equal(
      (await db.query(`select count(*)::int as n from kosh.${table}`)).rows[0]
        .n,
      0,
    );
  await assert.rejects(save(draft, v1.id, 3), { code: "P0002" });
  await assert.rejects(db.query("select kosh.delete_artifact($1,3)", [v1.id]), {
    code: "P0002",
  });
  assert.equal(
    (
      await db.query("select kosh.remove_test_evidence($1) as removed", [
        evidence,
      ])
    ).rows[0].removed,
    false,
  );
  await assert.rejects(
    db.query("select kosh.save_test_evidence($1,1,$2,$3::jsonb,$4::jsonb)", [
      v1.id,
      v1.contentDigest,
      JSON.stringify(sample),
      JSON.stringify(assessments),
    ]),
    { code: "P0002" },
  );
  const owned = await save({ ...draft, title: "Second owner" });
  assert.notEqual(owned.id, v1.id);
  checks.push(
    "Cross-user artifact/version/evidence reads return no rows; save/delete/evidence operations cannot target another owner",
  );
  await db.exec(
    "reset role; set role anon; select set_config('request.jwt.claim.sub','',false);",
  );
  for (const table of [
    "artifacts",
    "artifact_versions",
    "artifact_test_results",
  ])
    await assert.rejects(db.query(`select * from kosh.${table}`), {
      code: "42501",
    });
  await assert.rejects(save(draft), { code: "42501" });
  await asUser("");
  await assert.rejects(save(draft), { code: "42501" });
  checks.push(
    "Anonymous table/function access and authenticated role without auth identity denied",
  );
  await asUser(first);
  assert.equal(
    (
      await db.query("select kosh.remove_test_evidence($1) as removed", [
        evidence,
      ])
    ).rows[0].removed,
    true,
  );
  await assert.rejects(db.query("select kosh.delete_artifact($1,2)", [v1.id]), {
    code: "40001",
  });
  assert.equal(
    (await db.query("select kosh.delete_artifact($1,3) as removed", [v1.id]))
      .rows[0].removed,
    true,
  );
  assert.equal(
    (await db.query("select count(*)::int as n from kosh.artifact_versions"))
      .rows[0].n,
    0,
  );
  await assert.rejects(save({ ...draft, ownerId: second }), { code: "22023" });
  await assert.rejects(
    save({
      ...draft,
      governance: { ...draft.governance, enforcement: "runtime" },
    }),
    { code: "22023" },
  );
  checks.push(
    "Evidence withdrawal, stale-delete protection, owner deletion cascade and top-level owner injection rejection",
  );
  const result = {
    runtime: "isolated PGlite PostgreSQL, synthetic auth identities",
    checks,
    limits:
      "Not live Supabase, PostgREST, email, multi-connection concurrency or authenticated-browser verification.",
  };
  await writeFile(
    new URL("../../docs/kosh/evidence/database-results.json", import.meta.url),
    JSON.stringify(result, null, 2) + "\n",
  );
  console.log(JSON.stringify(result, null, 2));
} finally {
  await db.close();
}
