// Local-only SQL verification; never connects to Supabase.
// KOSH_PGLITE_MODULE=/absolute/path/to/pglite/dist/index.js node tests/kosh-database.mjs
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";
if (!process.env.KOSH_PGLITE_MODULE)
  throw new Error("Set KOSH_PGLITE_MODULE to an isolated PGlite module path.");
const { PGlite } = await import(
  pathToFileURL(process.env.KOSH_PGLITE_MODULE).href
);
const db = new PGlite();
const first = "00000000-0000-4000-8000-000000000001";
const second = "00000000-0000-4000-8000-000000000002";
try {
  await db.exec(`create role anon; create role authenticated; create schema auth; create schema kosh;
    create table auth.users (id uuid primary key);
    create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
    grant usage on schema auth, kosh to anon, authenticated;
    grant execute on function auth.uid() to anon, authenticated;
    insert into auth.users values ('${first}'), ('${second}');`);
  const migration = await readFile(
    new URL(
      "../../docs/kosh/migrations/20260905_working_copies.sql",
      import.meta.url,
    ),
    "utf8",
  );
  await db.exec(migration);
  await db.exec(migration);
  async function asUser(id) {
    await db.exec(
      `reset role; set role authenticated; select set_config('request.jwt.claim.sub', '${id}', false);`,
    );
  }
  await asUser(first);
  const inserted = await db.query(
    `insert into kosh.working_copies(user_id, template_id, template_version, title, content, context_kind) values ($1,'research-synthesis-agent','1.1','Private draft','# Private draft','manual') returning id`,
    [first],
  );
  const copyId = inserted.rows[0].id;
  assert.equal(
    (await db.query("select count(*)::int as count from kosh.working_copies"))
      .rows[0].count,
    1,
  );
  await assert.rejects(
    db.query(
      `insert into kosh.working_copies(user_id,template_id,template_version,title,content,context_kind) values ($1,'research-synthesis-agent','1.1','Wrong owner','Content','manual')`,
      [second],
    ),
  );
  await assert.rejects(
    db.query("update kosh.working_copies set user_id=$1 where id=$2", [
      second,
      copyId,
    ]),
  );
  const attempts = await db.query(
    "select kosh.consume_adaptation_attempt() as allowed from generate_series(1,11)",
  );
  assert.equal(attempts.rows.filter((row) => row.allowed).length, 10);
  assert.equal(attempts.rows.at(-1).allowed, false);
  await assert.rejects(db.query("select * from kosh_private.adaptation_usage"));
  await asUser(second);
  assert.equal(
    (await db.query("select count(*)::int as count from kosh.working_copies"))
      .rows[0].count,
    0,
  );
  assert.equal(
    (
      await db.query(
        "update kosh.working_copies set title=$1 where id=$2 returning id",
        ["Other user edit", copyId],
      )
    ).rows.length,
    0,
  );
  assert.equal(
    (
      await db.query(
        "delete from kosh.working_copies where id=$1 returning id",
        [copyId],
      )
    ).rows.length,
    0,
  );
  assert.equal(
    (await db.query("select kosh.consume_adaptation_attempt() as allowed"))
      .rows[0].allowed,
    true,
  );
  await db.exec("reset role; set role anon;");
  await assert.rejects(db.query("select * from kosh.working_copies"));
  await assert.rejects(db.query("select kosh.consume_adaptation_attempt()"));
  await asUser(first);
  assert.equal(
    (
      await db.query(
        "update kosh.working_copies set title=$1 where id=$2 returning title",
        ["Renamed draft", copyId],
      )
    ).rows[0].title,
    "Renamed draft",
  );
  assert.equal(
    (
      await db.query(
        "delete from kosh.working_copies where id=$1 returning id",
        [copyId],
      )
    ).rows.length,
    1,
  );
  console.log(
    "PASS: migration execution/re-run, owner CRUD, cross-user read/write/delete denial, ownership reassignment denial, anonymous denial, private ledger protection, ten-attempt cap and per-user quota isolation.",
  );
} finally {
  await db.close();
}
