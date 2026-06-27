import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import cors from "cors";
import express from "express";
import { createKramanitiMcpServer } from "./mcp.js";

const port = Number.parseInt(process.env.PORT ?? "8000", 10);
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.type("text/plain").send("Kramaniti ChatGPT app MCP server. Connect ChatGPT to /mcp.");
});

app.all("/mcp", async (req, res) => {
  const server = createKramanitiMcpServer();
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
        error: {
          code: -32603,
          message: "Internal server error",
        },
        id: null,
      });
    }
  }
});

app.listen(port, () => {
  console.log(`Kramaniti ChatGPT app MCP server listening on http://localhost:${port}/mcp`);
});
