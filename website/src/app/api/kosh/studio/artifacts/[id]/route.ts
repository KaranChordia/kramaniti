import {
  artifactId,
  authenticate,
  databaseError,
  exactFields,
  expectedRevision,
  failure,
  json,
  readJson,
  StudioError,
} from "@/lib/kosh/studio/server/http";
import { validatedSnapshot } from "@/lib/kosh/studio/server/persistence";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
type Context = { params: Promise<{ id: string }> };
export async function GET(request: Request, context: Context) {
  try {
    const id = artifactId((await context.params).id);
    const { client, ownerId } = await authenticate(request);
    const { data: item, error } = await client
      .from("artifacts")
      .select("id,title,kind,latest_revision,updated_at")
      .eq("id", id)
      .eq("owner_id", ownerId)
      .maybeSingle();
    databaseError(error);
    if (!item) throw new StudioError(404, "Artifact unavailable.");
    const { data: version, error: versionError } = await client
      .from("artifact_versions")
      .select("snapshot,revision,content_digest,created_at")
      .eq("artifact_id", id)
      .eq("owner_id", ownerId)
      .eq("revision", item.latest_revision)
      .maybeSingle();
    databaseError(versionError);
    if (!version) throw new StudioError(404, "Artifact unavailable.");
    validatedSnapshot(version.snapshot);
    return json({ artifact: item, version });
  } catch (error) {
    return failure(error);
  }
}
export async function DELETE(request: Request, context: Context) {
  try {
    const id = artifactId((await context.params).id);
    const { client } = await authenticate(request);
    const body = await readJson(request, 1000);
    exactFields(body, ["expectedRevision", "confirmedArtifactId"]);
    if (body.confirmedArtifactId !== id)
      throw new StudioError(400, "Confirm the exact artifact before deleting.");
    const { data, error } = await client.rpc("delete_artifact", {
      p_id: id,
      p_expected: expectedRevision(body.expectedRevision),
    });
    databaseError(error);
    return json({ deleted: data === true });
  } catch (error) {
    return failure(error);
  }
}
