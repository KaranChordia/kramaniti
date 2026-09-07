import { parseSkill } from "../schema.ts";
import { validate } from "../validation.ts";
import { libraryItems } from "../../../library/libraryData.ts";
import {
  authenticate,
  databaseError,
  exactFields,
  expectedRevision,
  json,
  readJson,
  StudioError,
} from "./http.ts";
export function validatedSnapshot(value: unknown) {
  try {
    const draft = parseSkill(value);
    const blocking = validate(draft).filter((finding) => finding.blocking);
    if (blocking.length)
      throw new Error(blocking.map((f) => f.message).join(" "));
    if (
      draft.source &&
      !libraryItems.some((item) => item.id === draft.source?.resourceId)
    )
      throw new Error("Unknown public source.");
    return draft;
  } catch (error) {
    throw new StudioError(
      400,
      error instanceof Error ? error.message : "Invalid skill.",
    );
  }
}
export async function saveVersion(request: Request, id: string | null) {
  const { client } = await authenticate(request);
  const body = await readJson(request);
  exactFields(body, ["snapshot", "expectedRevision"]);
  const snapshot = validatedSnapshot(body.snapshot);
  const expected = expectedRevision(body.expectedRevision);
  if (id === null && expected !== 0)
    throw new StudioError(400, "New artifacts start at revision zero.");
  const { data, error } = await client.rpc("save_artifact", {
    p_snapshot: snapshot,
    p_id: id,
    p_expected: expected,
  });
  databaseError(error);
  if (
    !data ||
    typeof data.id !== "string" ||
    !Number.isSafeInteger(data.revision) ||
    typeof data.contentDigest !== "string"
  )
    throw new StudioError(
      503,
      "Storage did not acknowledge a saved version. Keep your draft and retry carefully.",
    );
  return json(data, id ? 200 : 201);
}
