import type { IncomingMessage, ServerResponse } from "node:http";

export default function handler(_req: IncomingMessage, res: ServerResponse) {
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/plain");
  res.end("Kramaniti Clarity Square Manager MCP server. Connect ChatGPT to /mcp.");
}
