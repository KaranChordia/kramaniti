import {
  artifactId,
  authenticate,
  databaseError,
  failure,
  json,
} from "@/lib/kosh/studio/server/http";
import { saveVersion } from "@/lib/kosh/studio/server/persistence";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
type Context = { params: Promise<{ id: string }> };
export async function POST(request: Request, context: Context) {
  try {
    return await saveVersion(request, artifactId((await context.params).id));
  } catch (error) {
    return failure(error);
  }
}
export async function GET(request: Request, context: Context) {
  try {
    const id = artifactId((await context.params).id);
    const { client, ownerId } = await authenticate(request);
    const { data, error } = await client
      .from("artifact_versions")
      .select("revision,content_digest,created_at,snapshot")
      .eq("artifact_id", id)
      .eq("owner_id", ownerId)
      .order("revision", { ascending: false })
      .limit(100);
    databaseError(error);
    return json({ versions: data });
  } catch (error) {
    return failure(error);
  }
}
