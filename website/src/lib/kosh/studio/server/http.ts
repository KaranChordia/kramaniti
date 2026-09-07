import { createClient } from "@supabase/supabase-js";
export class StudioError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}
export const json = (data: unknown, status = 200) =>
  Response.json(data, {
    status,
    headers: { "Cache-Control": "private, no-store" },
  });
export function failure(error: unknown) {
  return error instanceof StudioError
    ? json({ error: error.message }, error.status)
    : json(
        {
          error:
            "Studio request could not be completed. Your draft is unchanged.",
        },
        503,
      );
}
export async function readJson(
  request: Request,
  limit = 72000,
): Promise<Record<string, unknown>> {
  if (Number(request.headers.get("content-length")) > limit)
    throw new StudioError(413, "The request is too large.");
  if (!request.body) throw new StudioError(400, "A request body is required.");
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.length;
      if (size > limit) {
        await reader.cancel();
        throw new StudioError(413, "The request is too large.");
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.length;
  }
  try {
    const body = JSON.parse(new TextDecoder().decode(bytes));
    if (!body || typeof body !== "object" || Array.isArray(body))
      throw new Error();
    return body;
  } catch {
    throw new StudioError(400, "The request is not valid JSON.");
  }
}
export function exactFields(body: Record<string, unknown>, allowed: string[]) {
  if (Object.keys(body).some((key) => !allowed.includes(key)))
    throw new StudioError(400, "Unexpected request fields.");
}
export function artifactId(id: string) {
  if (
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      id,
    )
  )
    throw new StudioError(404, "Artifact unavailable.");
  return id;
}
export function expectedRevision(value: unknown) {
  if (!Number.isSafeInteger(value) || (value as number) < 0)
    throw new StudioError(400, "A valid expected revision is required.");
  return value as number;
}
export async function authenticate(request: Request) {
  const token = request.headers
    .get("authorization")
    ?.match(/^Bearer ([^\s]+)$/)?.[1];
  if (!token || token.length > 8192)
    throw new StudioError(401, "Sign in to use private Studio versions.");
  const url = process.env.NEXT_PUBLIC_KOSH_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_KOSH_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key)
    throw new StudioError(
      503,
      "Private Studio storage is not configured. Your draft remains available for export.",
    );
  // Never accidentally route Studio data to the separately configured Platform project.
  const host = new URL(url).hostname;
  if (
    host !== "sqrhwxjgyuqmjsclgmvt.supabase.co" &&
    !(
      process.env.KOSH_STUDIO_ALLOW_LOCAL_DB === "true" &&
      ["localhost", "127.0.0.1"].includes(host)
    )
  )
    throw new StudioError(
      503,
      "The configured destination is not the Kosh project.",
    );
  const client = createClient(url, key, {
    db: { schema: "kosh" },
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
    global: { headers: { Authorization: `Bearer ${token}` } },
  });
  const { data, error } = await client.auth.getUser(token);
  if (error || !data.user)
    throw new StudioError(
      401,
      "Your session expired. Sign in again; your draft is unchanged.",
    );
  return { client, ownerId: data.user.id };
}
export function databaseError(error: { code?: string } | null) {
  if (!error) return;
  if (error.code === "40001")
    throw new StudioError(
      409,
      "A newer version exists. Compare it before saving, or save a separate copy.",
    );
  if (error.code === "P0002")
    throw new StudioError(404, "Artifact unavailable.");
  if (error.code === "22023" || error.code === "23514")
    throw new StudioError(400, "The artifact or evidence is not valid.");
  throw new StudioError(
    503,
    "Private Studio storage is unavailable. Your draft remains available for export.",
  );
}
