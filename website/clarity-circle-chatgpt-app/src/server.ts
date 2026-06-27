import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import cors from "cors";
import express from "express";
import type { IncomingHttpHeaders } from "node:http";
import { createKramanitiMcpServer } from "./mcp.js";
import { handleOAuth } from "./oauth.js";

const port = Number.parseInt(process.env.PORT ?? "8010", 10);
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res
    .type("text/plain")
    .send("Kramaniti Clarity Circle Manager MCP server. Connect ChatGPT to /mcp.");
});

app.all(/^\/\.well-known\/.*$/, (req, res) => {
  void handleOAuth(req, res);
});

app.all(/^\/oauth\/.*$/, (req, res) => {
  void handleOAuth(req, res);
});

function toWebHeaders(headers: IncomingHttpHeaders) {
  const result = new Headers();
  for (const [name, value] of Object.entries(headers)) {
    if (Array.isArray(value)) {
      for (const item of value) result.append(name, item);
    } else if (value !== undefined) {
      result.set(name, value);
    }
  }
  return result;
}

app.all("/mcp", async (req, res) => {
  const server = createKramanitiMcpServer(toWebHeaders(req.headers));
  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
  });

  res.on("close", () => {
    transport.close();
    server.close();
  });

  try {
    await server.connect(transport);
    await transport.handleRequest(req, res, req.body);
  } catch (error) {
    console.error("MCP request failed", error);
    if (!res.headersSent) {
      res.status(500).json({
        jsonrpc: "2.0",
        error: { code: -32603, message: "Internal server error" },
        id: null,
      });
    }
  }
});

app.listen(port, () => {
  console.log(`Clarity Circle Manager MCP server listening on http://localhost:${port}/mcp`);
});
