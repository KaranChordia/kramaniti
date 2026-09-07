import {
  authenticate,
  databaseError,
  failure,
  json,
} from "@/lib/kosh/studio/server/http";
import { saveVersion } from "@/lib/kosh/studio/server/persistence";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function POST(request: Request) {
  try {
    return await saveVersion(request, null);
  } catch (error) {
    return failure(error);
  }
}
export async function GET(request: Request) {
  try {
    const { client, ownerId } = await authenticate(request);
    const { data, error } = await client
      .from("artifacts")
      .select("id,title,kind,latest_revision,updated_at")
      .eq("owner_id", ownerId)
      .order("updated_at", { ascending: false })
      .limit(100);
    databaseError(error);
    return json({ artifacts: data });
  } catch (error) {
    return failure(error);
  }
}
