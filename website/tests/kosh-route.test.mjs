import { test, mock, beforeEach } from "node:test";
import { registerHooks } from "node:module";
import assert from "node:assert/strict";
registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier.startsWith("@/"))
      return nextResolve(
        new URL(`../src/${specifier.slice(2)}.ts`, import.meta.url).href,
        context,
      );
    return nextResolve(specifier, context);
  },
});
let state;
const reset = () => {
  state = {
    user: { id: "test-owner" },
    allowed: true,
    quotaError: null,
    profile: {
      context: JSON.stringify({
        personal: "Personal only",
        professional: "Professional only",
      }),
    },
    calls: [],
    finish: "stop",
    output:
      "# Working draft\n\n## Human review\nApproval pending. [Name the owner].",
  };
};
reset();
const fakeClient = {
  auth: { getUser: async () => ({ data: { user: state.user }, error: null }) },
  from: () => ({
    select: () => ({
      eq: (_column, id) => {
        assert.equal(id, "test-owner");
        return {
          maybeSingle: async () => ({ data: state.profile, error: null }),
        };
      },
    }),
  }),
  rpc: async () => ({ data: state.allowed, error: state.quotaError }),
};
mock.module("@supabase/supabase-js", {
  namedExports: { createClient: () => fakeClient },
});
mock.module("groq-sdk", {
  defaultExport: class FakeGroq {
    chat = {
      completions: {
        create: async (request) => {
          state.calls.push(request);
          return {
            choices: [
              {
                finish_reason: state.finish,
                message: { content: state.output },
              },
            ],
          };
        },
      },
    };
  },
});
process.env.NEXT_PUBLIC_KOSH_SUPABASE_URL = "https://test.invalid";
process.env.NEXT_PUBLIC_KOSH_SUPABASE_PUBLISHABLE_KEY = "test-public-key";
process.env.GROQ_API_KEY = "test-provider-key";
const { POST } = await import("../src/app/api/kosh/adapt/route.ts");
beforeEach(reset);
const request = (body, token = "test-session") =>
  new Request("http://localhost/api/kosh/adapt", {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
const valid = {
  templateId: "research-synthesis-agent",
  contextKind: "professional",
};
test("unauthenticated, malformed and unknown resources never reach a provider", async () => {
  assert.equal((await POST(request(valid, ""))).status, 401);
  assert.equal((await POST(request("null"))).status, 400);
  assert.equal((await POST(request("{"))).status, 400);
  assert.equal(
    (await POST(request({ ...valid, templateId: "../../private" }))).status,
    400,
  );
  assert.equal(state.calls.length, 0);
});
test("expired sessions and empty custom context cannot generate", async () => {
  state.user = null;
  assert.equal((await POST(request(valid))).status, 401);
  state.user = { id: "test-owner" };
  assert.equal(
    (await POST(request({ ...valid, contextKind: "custom", context: " " })))
      .status,
    400,
  );
  assert.equal(
    (
      await POST(
        request({ ...valid, contextKind: "custom", context: "a".repeat(4001) }),
      )
    ).status,
    400,
  );
  assert.equal(state.calls.length, 0);
});
test("missing quota setup and exhausted quota fail closed before generation", async () => {
  state.quotaError = { message: "Missing function" };
  assert.equal((await POST(request(valid))).status, 503);
  state.quotaError = null;
  state.allowed = false;
  assert.equal((await POST(request(valid))).status, 429);
  assert.equal(state.calls.length, 0);
});
test("only the selected saved profile and template are sent, never sample evidence", async () => {
  const result = await POST(request(valid));
  assert.equal(result.status, 200);
  assert.equal(result.headers.get("cache-control"), "no-store");
  const prompt = state.calls[0].messages[1].content;
  assert.ok(prompt.includes("Professional only"));
  assert.ok(!prompt.includes("Personal only"));
  assert.ok(!prompt.includes("sample calendar"));
  assert.ok(!prompt.includes("Demonstration"));
  assert.equal((await result.json()).templateVersion, "1.1");
});
test("per-resource context does not require or mix a saved profile", async () => {
  state.profile = null;
  assert.equal(
    (
      await POST(
        request({ ...valid, contextKind: "custom", context: "My single task" }),
      )
    ).status,
    200,
  );
  assert.ok(state.calls[0].messages[1].content.includes("My single task"));
});
test("truncated and structurally incomplete generation is not returned as a valid copy", async () => {
  state.finish = "length";
  assert.equal((await POST(request(valid))).status, 500);
  state.finish = "stop";
  state.output = "# Incomplete without review";
  assert.equal((await POST(request(valid))).status, 500);
});
