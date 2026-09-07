import { test, mock, beforeEach } from "node:test";
import { registerHooks } from "node:module";
import assert from "node:assert/strict";
import { researchFixture } from "../src/lib/kosh/studio/schema.ts";
registerHooks({
  resolve(specifier, context, next) {
    if (specifier.startsWith("@/"))
      return next(
        new URL(`../src/${specifier.slice(2)}.ts`, import.meta.url).href,
        context,
      );
    return next(specifier, context);
  },
});
let state;
const id = "00000000-0000-4000-8000-000000000001";
const reset = () => {
  state = {
    user: { id: "owner" },
    calls: [],
    error: null,
    ack: { id, revision: 1, contentDigest: "a".repeat(64) },
  };
  process.env.NEXT_PUBLIC_KOSH_SUPABASE_URL =
    "https://sqrhwxjgyuqmjsclgmvt.supabase.co";
  process.env.NEXT_PUBLIC_KOSH_SUPABASE_PUBLISHABLE_KEY =
    "synthetic-public-key";
};
reset();
mock.module("@supabase/supabase-js", {
  namedExports: {
    createClient: (url, key, options) => {
      assert.equal(options.db.schema, "kosh");
      return {
        auth: {
          getUser: async () => ({ data: { user: state.user }, error: null }),
        },
        rpc: async (name, args) => {
          state.calls.push({ name, args });
          return { data: state.ack, error: state.error };
        },
      };
    },
  },
});
const { POST } = await import("../src/app/api/kosh/studio/artifacts/route.ts");
const { POST: version } =
  await import("../src/app/api/kosh/studio/artifacts/[id]/versions/route.ts");
const { DELETE: remove } =
  await import("../src/app/api/kosh/studio/artifacts/[id]/route.ts");
const { readJson } = await import("../src/lib/kosh/studio/server/http.ts");
beforeEach(reset);
const request = (body, token = "synthetic-session", method = "POST") =>
  new Request("http://localhost/api/kosh/studio/artifacts", {
    method,
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
const valid = () => ({ snapshot: researchFixture(), expectedRevision: 0 });
test("private writes reject anonymous, expired, wrong-project and malformed input before RPC", async () => {
  assert.equal((await POST(request(valid(), ""))).status, 401);
  state.user = null;
  assert.equal((await POST(request(valid()))).status, 401);
  state.user = { id: "owner" };
  process.env.NEXT_PUBLIC_KOSH_SUPABASE_URL =
    "https://bpvbnxqtfwrsmrpvcepc.supabase.co";
  assert.equal((await POST(request(valid()))).status, 503);
  reset();
  assert.equal((await POST(request("{broken"))).status, 400);
  assert.equal(
    (await POST(request({ ...valid(), ownerId: "other" }))).status,
    400,
  );
  assert.equal(
    (
      await POST(
        request({
          snapshot: { ...researchFixture(), ownerId: "other" },
          expectedRevision: 0,
        }),
      )
    ).status,
    400,
  );
  assert.equal(
    (await POST(request({ ...valid(), expectedRevision: -1 }))).status,
    400,
  );
  assert.deepEqual(state.calls, []);
});
test("chunked oversized input is bounded even without Content-Length", async () => {
  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(new Uint8Array(73000));
      controller.close();
    },
  });
  await assert.rejects(
    readJson(
      new Request("http://localhost", {
        method: "POST",
        body: stream,
        duplex: "half",
      }),
    ),
    { status: 413 },
  );
});
test("saving sends only a validated snapshot and expected revision, reports actual acknowledgment", async () => {
  const response = await POST(request(valid()));
  assert.equal(response.status, 201);
  assert.equal(response.headers.get("cache-control"), "private, no-store");
  assert.deepEqual(await response.json(), state.ack);
  assert.deepEqual(state.calls[0], {
    name: "save_artifact",
    args: { p_snapshot: researchFixture(), p_id: null, p_expected: 0 },
  });
  state.ack = null;
  assert.equal((await POST(request(valid()))).status, 503);
});
test("stale, absent and unavailable persistence are distinct non-success states", async () => {
  for (const [code, status] of [
    ["40001", 409],
    ["P0002", 404],
    ["PGRST202", 503],
  ]) {
    state.error = { code };
    assert.equal(
      (
        await version(request({ ...valid(), expectedRevision: 2 }), {
          params: Promise.resolve({ id }),
        })
      ).status,
      status,
    );
  }
  assert.equal(
    (
      await version(request(valid()), {
        params: Promise.resolve({ id: "bad" }),
      })
    ).status,
    404,
  );
});
test("delete requires exact artifact confirmation and expected revision", async () => {
  assert.equal(
    (
      await remove(request({ expectedRevision: 1 }, "synthetic", "DELETE"), {
        params: Promise.resolve({ id }),
      })
    ).status,
    400,
  );
  state.ack = true;
  const result = await remove(
    request(
      { expectedRevision: 1, confirmedArtifactId: id },
      "synthetic",
      "DELETE",
    ),
    { params: Promise.resolve({ id }) },
  );
  assert.deepEqual(await result.json(), { deleted: true });
  assert.equal(state.calls[0].args.p_id, id);
});
