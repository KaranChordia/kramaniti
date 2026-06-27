import type { IncomingMessage, ServerResponse } from "node:http";
import { handleOAuth } from "../src/oauth.js";

type VercelLikeRequest = IncomingMessage & {
  body?: unknown;
};

function restoreRewrittenUrl(req: VercelLikeRequest) {
  const url = new URL(req.url || "/", "http://internal");
  const path = url.searchParams.get("path");
  if (!path) return;

  url.searchParams.delete("path");
  const query = url.searchParams.toString();
  req.url = `${path}${query ? `?${query}` : ""}`;
}

export default async function handler(req: VercelLikeRequest, res: ServerResponse) {
  restoreRewrittenUrl(req);
  return handleOAuth(req, res);
}
