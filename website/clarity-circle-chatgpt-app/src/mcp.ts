import {
  registerAppResource,
  registerAppTool,
  RESOURCE_MIME_TYPE,
} from "@modelcontextprotocol/ext-apps/server";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { z } from "zod";
import { wwwAuthenticateHeaderFromHeaders } from "./oauth.js";
import {
  AuthError,
  createCircleClient,
  getBearerToken,
  getCurrentUserId,
  resolveBearerToSupabaseAccessToken,
  type AssistantMemory,
  type CircleClient,
  type Project,
  type ProjectFolder,
  type ProjectReport,
  type ProjectTask,
  type Track,
} from "./supabase.js";

const SERVER_VERSION = "0.1.0";
const WORKSPACE_URI = "ui://kramaniti/clarity-circle-manager.html";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const widgetHtml = fs.readFileSync(path.resolve(__dirname, "../widgets/manager.html"), "utf8");

type ManagerOutput = {
  mode: string;
  title: string;
  summary: string;
  stats: Array<{ label: string; value: string; detail: string }>;
  projects: Array<{ id: string; title: string; detail: string; meta: string }>;
  tasks: Array<{ id: string; title: string; detail: string; meta: string }>;
  memories: Array<{ id: string; title: string; detail: string; meta: string }>;
  reports: Array<{ id: string; title: string; detail: string; meta: string }>;
  draft?: Record<string, unknown> | null;
  guardrails: string[];
};

type ToolResponse = {
  structuredContent: ManagerOutput;
  content: Array<{ type: "text"; text: string }>;
  isError?: boolean;
  _meta?: Record<string, unknown>;
};

const readSecuritySchemes = [{ type: "oauth2", scopes: ["clarity_circle.read"] }] as const;
const writeSecuritySchemes = [{ type: "oauth2", scopes: ["clarity_circle.read", "clarity_circle.write"] }] as const;

const itemSchema = z.object({
  id: z.string(),
  title: z.string(),
  detail: z.string(),
  meta: z.string(),
});

const outputSchema = {
  mode: z.string(),
  title: z.string(),
  summary: z.string(),
  stats: z.array(z.object({ label: z.string(), value: z.string(), detail: z.string() })),
  projects: z.array(itemSchema),
  tasks: z.array(itemSchema),
  memories: z.array(itemSchema),
  reports: z.array(itemSchema),
  draft: z.record(z.unknown()).nullable().optional(),
  guardrails: z.array(z.string()),
};

function clean(value: string | undefined | null, fallback = "") {
  const normalized = String(value || "").replace(/\s+/g, " ").trim();
  return normalized || fallback;
}

function truncate(value: string, max = 180) {
  return value.length > max ? `${value.slice(0, max - 3).trim()}...` : value;
}

async function authClient(headers: Headers) {
  const token = getBearerToken(headers);
  const supabaseAccessToken = await resolveBearerToSupabaseAccessToken(token);
  return createCircleClient(supabaseAccessToken);
}

function authResponse(message: string): ManagerOutput {
  return {
    mode: "auth_required",
    title: "Connect your Clarity Circle account",
    summary: message,
    stats: [],
    projects: [],
    tasks: [],
    memories: [],
    reports: [],
    draft: null,
    guardrails: [
      "This manager only works after the user connects a Clarity Circle account through OAuth.",
      "Supabase RLS enforces row ownership.",
      "No service-role key is used by this app.",
    ],
  };
}

function toolResponse(output: ManagerOutput, text?: string): ToolResponse {
  return {
    structuredContent: output,
    content: [
      {
        type: "text",
        text: text ?? output.summary,
      },
    ],
  };
}

function authChallengeResponse(headers: Headers, message: string, scope = "clarity_circle.read"): ToolResponse {
  return {
    ...toolResponse(authResponse(message), "Connect your Clarity Circle account to use this manager."),
    isError: true,
    _meta: {
      "mcp/www_authenticate": wwwAuthenticateHeaderFromHeaders(headers, scope),
    },
  };
}

function mapProject(project: Project, folders: ProjectFolder[] = []) {
  const folderName = project.folder_id
    ? folders.find((folder) => folder.id === project.folder_id)?.name ?? "Folder"
    : "Unfiled";
  return {
    id: project.id,
    title: project.title,
    detail: truncate(project.summary || project.context || "No summary saved."),
    meta: `${project.track} / ${folderName} / ${project.status}`,
  };
}

function mapTask(task: ProjectTask, projects: Project[] = []) {
  const project = projects.find((item) => item.id === task.project_id);
  return {
    id: task.id,
    title: task.title,
    detail: truncate(task.detail || "No task detail saved."),
    meta: `${task.status} / ${project?.title ?? "Project"} / ${task.source}`,
  };
}

function mapMemory(memory: AssistantMemory, projects: Project[] = []) {
  const project = memory.project_id ? projects.find((item) => item.id === memory.project_id) : null;
  return {
    id: memory.id,
    title: memory.title,
    detail: truncate(memory.content),
    meta: `${memory.memory_type} / ${project?.title ?? "workspace"} / ${memory.status}`,
  };
}

function mapReport(report: ProjectReport, projects: Project[] = []) {
  const project = projects.find((item) => item.id === report.project_id);
  return {
    id: report.id,
    title: report.title,
    detail: truncate(report.content),
    meta: `${report.report_type} / ${project?.title ?? "Project"}`,
  };
}

async function loadWorkspace(client: CircleClient) {
  const [projectResult, folderResult, taskResult, reportResult, memoryResult] = await Promise.all([
    client.from("projects").select("*").eq("status", "active").order("updated_at", { ascending: false }).limit(60),
    client.from("project_folders").select("*").eq("status", "active").order("sort_order", { ascending: true }).limit(50),
    client.from("project_tasks").select("*").neq("status", "archived").order("updated_at", { ascending: false }).limit(120),
    client.from("project_reports").select("*").order("created_at", { ascending: false }).limit(50),
    client.from("assistant_memories").select("*").eq("status", "active").order("updated_at", { ascending: false }).limit(50),
  ]);

  for (const result of [projectResult, folderResult, taskResult, reportResult, memoryResult]) {
    if (result.error) throw result.error;
  }

  return {
    projects: projectResult.data ?? [],
    folders: folderResult.data ?? [],
    tasks: taskResult.data ?? [],
    reports: reportResult.data ?? [],
    memories: memoryResult.data ?? [],
  };
}

function workspaceOutput(mode: string, title: string, summary: string, data: Awaited<ReturnType<typeof loadWorkspace>>, draft?: Record<string, unknown> | null): ManagerOutput {
  const openTasks = data.tasks.filter((task) => task.status === "open");
  const doneTasks = data.tasks.filter((task) => task.status === "done");
  const thinProjects = data.projects.filter((project) => !project.project_instruction || data.tasks.every((task) => task.project_id !== project.id));

  return {
    mode,
    title,
    summary,
    stats: [
      { label: "Projects", value: String(data.projects.length), detail: `${data.folders.length} active folders` },
      { label: "Open tasks", value: String(openTasks.length), detail: `${doneTasks.length} completed tasks` },
      { label: "Memories", value: String(data.memories.length), detail: "Active assistant memories" },
      { label: "Reports", value: String(data.reports.length), detail: "Saved Clarity Engine reports" },
      { label: "Needs attention", value: String(thinProjects.length), detail: "Projects with thin instruction or no task structure" },
    ],
    projects: data.projects.slice(0, 12).map((project) => mapProject(project, data.folders)),
    tasks: openTasks.slice(0, 12).map((task) => mapTask(task, data.projects)),
    memories: data.memories.slice(0, 8).map((memory) => mapMemory(memory, data.projects)),
    reports: data.reports.slice(0, 8).map((report) => mapReport(report, data.projects)),
    draft: draft ?? null,
    guardrails: [
      "Signed-in Supabase user data only.",
      "Supabase RLS enforces ownership.",
      "Project, task, and memory changes should be approved by the user before saving.",
    ],
  };
}

async function withAuth(
  headers: Headers,
  fn: (client: CircleClient, userId: string) => Promise<ManagerOutput>,
  scope = "clarity_circle.read"
): Promise<ToolResponse> {
  try {
    const client = await authClient(headers);
    const userId = await getCurrentUserId(client);
    return toolResponse(await fn(client, userId));
  } catch (error) {
    if (error instanceof AuthError) {
      return authChallengeResponse(headers, error.message, scope);
    }
    throw error;
  }
}

function buildProjectDraft(input: {
  roughIdea: string;
  track?: Track;
  audience?: string;
  blocker?: string;
  outcome?: string;
}) {
  const firstSentence = clean(input.roughIdea).split(/[.!?\n]/)[0] || "New clarity project";
  const title = truncate(firstSentence.replace(/\b(i want|i need|we need|build|create|make)\b/gi, "").trim() || firstSentence, 90);
  return {
    title,
    track: input.track ?? "founder",
    context: clean(input.roughIdea, "A new Clarity Circle project."),
    project_instruction: [
      `Project: ${title}`,
      `Context: ${clean(input.roughIdea, "A new Clarity Circle project.")}`,
      input.audience ? `Audience: ${input.audience}` : "",
      input.blocker ? `Blocker: ${input.blocker}` : "",
      input.outcome ? `Outcome: ${input.outcome}` : "",
      "Operating rule: keep future work tied to this project, separate human-led from AI-assisted steps, and turn suggestions into reviewable tasks.",
    ].filter(Boolean).join("\n"),
    audience: input.audience ?? null,
    blocker: input.blocker ?? "The first decision is still unclear.",
    outcome: input.outcome ?? "A clearer next action and useful project structure.",
  };
}

export function createKramanitiMcpServer(requestHeaders = new Headers()): McpServer {
  const server = new McpServer({
    name: "kramaniti-clarity-circle-manager",
    version: SERVER_VERSION,
  });

  registerAppTool(
    server,
    "get_workspace_overview",
    {
      title: "Get Workspace Overview",
      description: "Read the signed-in user's Clarity Circle workspace and summarize projects, tasks, memories, reports, and items needing attention.",
      inputSchema: {},
      outputSchema,
      annotations: { readOnlyHint: true, destructiveHint: false, openWorldHint: false },
      _meta: { ui: { resourceUri: WORKSPACE_URI }, securitySchemes: readSecuritySchemes },
    },
    async () => withAuth(requestHeaders, async (client) => {
      const data = await loadWorkspace(client);
      return workspaceOutput("overview", "Clarity Circle workspace", "Current signed-in workspace state from Supabase.", data);
    })
  );

  registerAppTool(
    server,
    "list_projects",
    {
      title: "List Projects",
      description: "List the signed-in user's active Clarity Circle projects, optionally filtered by search text.",
      inputSchema: { search: z.string().optional().describe("Optional project search text.") },
      outputSchema,
      annotations: { readOnlyHint: true, destructiveHint: false, openWorldHint: false },
      _meta: { ui: { resourceUri: WORKSPACE_URI }, securitySchemes: readSecuritySchemes },
    },
    async ({ search }) => withAuth(requestHeaders, async (client) => {
      const data = await loadWorkspace(client);
      const term = clean(search).toLowerCase();
      if (term) {
        data.projects = data.projects.filter((project) =>
          [project.title, project.context, project.audience, project.blocker, project.outcome].some((value) => clean(value).toLowerCase().includes(term))
        );
      }
      return workspaceOutput("projects", "Projects", term ? `Projects matching "${term}".` : "Active Clarity Circle projects.", data);
    })
  );

  registerAppTool(
    server,
    "get_project_detail",
    {
      title: "Get Project Detail",
      description: "Open one Clarity Circle project with related tasks, memories, and reports.",
      inputSchema: { projectId: z.string().describe("The project ID to inspect.") },
      outputSchema,
      annotations: { readOnlyHint: true, destructiveHint: false, openWorldHint: false },
      _meta: { ui: { resourceUri: WORKSPACE_URI }, securitySchemes: readSecuritySchemes },
    },
    async ({ projectId }) => withAuth(requestHeaders, async (client) => {
      const data = await loadWorkspace(client);
      const project = data.projects.find((item) => item.id === projectId);
      if (!project) {
        return workspaceOutput("project_detail", "Project not found", "No active project with that ID was visible for the signed-in user.", data);
      }
      data.projects = [project];
      data.tasks = data.tasks.filter((task) => task.project_id === projectId);
      data.reports = data.reports.filter((report) => report.project_id === projectId);
      data.memories = data.memories.filter((memory) => memory.project_id === projectId || memory.project_id === null);
      return workspaceOutput("project_detail", project.title, project.project_instruction || project.summary || project.context, data);
    })
  );

  registerAppTool(
    server,
    "create_project_draft",
    {
      title: "Create Project Draft",
      description: "Draft a new Clarity Circle project from a rough idea. This does not save until the user approves and a later write action is run.",
      inputSchema: {
        roughIdea: z.string().describe("The rough idea, workflow, or project context."),
        track: z.enum(["founder", "builder"]).optional(),
        audience: z.string().optional(),
        blocker: z.string().optional(),
        outcome: z.string().optional(),
      },
      outputSchema,
      annotations: { readOnlyHint: true, destructiveHint: false, openWorldHint: false },
      _meta: { ui: { resourceUri: WORKSPACE_URI }, securitySchemes: readSecuritySchemes },
    },
    async (input) => withAuth(requestHeaders, async (client) => {
      const data = await loadWorkspace(client);
      return workspaceOutput("project_draft", "Project draft ready", "Review this draft before saving it to Clarity Circle.", data, buildProjectDraft(input));
    })
  );

  registerAppTool(
    server,
    "update_project_draft",
    {
      title: "Update Project Draft",
      description: "Draft updates for an existing project. This does not save directly; use it to review the proposed patch first.",
      inputSchema: {
        projectId: z.string(),
        title: z.string().optional(),
        context: z.string().optional(),
        projectInstruction: z.string().optional(),
        audience: z.string().optional(),
        blocker: z.string().optional(),
        outcome: z.string().optional(),
        summary: z.string().optional(),
      },
      outputSchema,
      annotations: { readOnlyHint: true, destructiveHint: false, openWorldHint: false },
      _meta: { ui: { resourceUri: WORKSPACE_URI }, securitySchemes: readSecuritySchemes },
    },
    async (input) => withAuth(requestHeaders, async (client) => {
      const data = await loadWorkspace(client);
      return workspaceOutput("project_update_draft", "Project update draft", "Review this patch before saving it through an approved write flow.", data, input);
    })
  );

  registerAppTool(
    server,
    "list_project_tasks",
    {
      title: "List Project Tasks",
      description: "List tasks for all projects or one selected Clarity Circle project.",
      inputSchema: {
        projectId: z.string().optional(),
        status: z.enum(["open", "done", "all"]).optional(),
      },
      outputSchema,
      annotations: { readOnlyHint: true, destructiveHint: false, openWorldHint: false },
      _meta: { ui: { resourceUri: WORKSPACE_URI }, securitySchemes: readSecuritySchemes },
    },
    async ({ projectId, status }) => withAuth(requestHeaders, async (client) => {
      const data = await loadWorkspace(client);
      if (projectId) data.tasks = data.tasks.filter((task) => task.project_id === projectId);
      if (status && status !== "all") data.tasks = data.tasks.filter((task) => task.status === status);
      return workspaceOutput("tasks", "Project tasks", "Current task movement across the selected scope.", data);
    })
  );

  registerAppTool(
    server,
    "create_task_draft",
    {
      title: "Create Task Draft",
      description: "Draft one or more tasks for a selected project. This does not save directly.",
      inputSchema: {
        projectId: z.string(),
        taskTitle: z.string(),
        taskDetail: z.string().optional(),
      },
      outputSchema,
      annotations: { readOnlyHint: true, destructiveHint: false, openWorldHint: false },
      _meta: { ui: { resourceUri: WORKSPACE_URI }, securitySchemes: readSecuritySchemes },
    },
    async (input) => withAuth(requestHeaders, async (client) => {
      const data = await loadWorkspace(client);
      return workspaceOutput("task_draft", "Task draft ready", "Review this task before saving it to the selected project.", data, {
        project_id: input.projectId,
        title: input.taskTitle,
        detail: input.taskDetail ?? null,
        source: "assistant",
        status: "open",
      });
    })
  );

  registerAppTool(
    server,
    "update_task_status",
    {
      title: "Update Task Status",
      description: "Update a task status after explicit user approval. Only call when the user clearly approves the change.",
      inputSchema: {
        taskId: z.string(),
        status: z.enum(["open", "done", "archived"]),
        confirmed: z.boolean().describe("Must be true only after explicit user approval."),
      },
      outputSchema,
      annotations: { readOnlyHint: false, destructiveHint: false, openWorldHint: false },
      _meta: { ui: { resourceUri: WORKSPACE_URI }, securitySchemes: writeSecuritySchemes },
    },
    async ({ taskId, status, confirmed }) => withAuth(requestHeaders, async (client) => {
      const data = await loadWorkspace(client);
      if (!confirmed) {
        return workspaceOutput("task_update_needs_approval", "Approval required", "The task status was not changed because confirmation was not provided.", data, {
          task_id: taskId,
          status,
          confirmed: false,
        });
      }
      const { error } = await client.from("project_tasks").update({ status }).eq("id", taskId);
      if (error) throw error;
      const refreshed = await loadWorkspace(client);
      return workspaceOutput("task_updated", "Task status updated", `Task was marked ${status}.`, refreshed);
    }, "clarity_circle.write")
  );

  registerAppTool(
    server,
    "list_memories",
    {
      title: "List Memories",
      description: "List active assistant memories for the signed-in user's Clarity Circle workspace.",
      inputSchema: {
        projectId: z.string().optional(),
        memoryType: z.enum(["insight", "preference", "project_signal", "boundary"]).optional(),
      },
      outputSchema,
      annotations: { readOnlyHint: true, destructiveHint: false, openWorldHint: false },
      _meta: { ui: { resourceUri: WORKSPACE_URI }, securitySchemes: readSecuritySchemes },
    },
    async ({ projectId, memoryType }) => withAuth(requestHeaders, async (client) => {
      const data = await loadWorkspace(client);
      if (projectId) data.memories = data.memories.filter((memory) => memory.project_id === projectId || memory.project_id === null);
      if (memoryType) data.memories = data.memories.filter((memory) => memory.memory_type === memoryType);
      return workspaceOutput("memories", "Assistant memories", "Active memories visible to the signed-in user.", data);
    })
  );

  registerAppTool(
    server,
    "save_memory_draft",
    {
      title: "Save Memory Draft",
      description: "Draft an assistant memory note. This does not save directly; review before adding it to Clarity Circle.",
      inputSchema: {
        title: z.string(),
        content: z.string(),
        memoryType: z.enum(["insight", "preference", "project_signal", "boundary"]),
        projectId: z.string().optional(),
      },
      outputSchema,
      annotations: { readOnlyHint: true, destructiveHint: false, openWorldHint: false },
      _meta: { ui: { resourceUri: WORKSPACE_URI }, securitySchemes: readSecuritySchemes },
    },
    async (input) => withAuth(requestHeaders, async (client) => {
      const data = await loadWorkspace(client);
      return workspaceOutput("memory_draft", "Memory draft ready", "Review this memory before saving it to Clarity Circle.", data, {
        title: input.title,
        content: input.content,
        memory_type: input.memoryType,
        project_id: input.projectId ?? null,
        source: "assistant",
      });
    })
  );

  registerAppResource(
    server,
    "Kramaniti Clarity Circle Manager Widget",
    WORKSPACE_URI,
    {
      mimeType: RESOURCE_MIME_TYPE,
      description: "Interactive Clarity Circle manager workspace HTML.",
    },
    async () => ({
      contents: [
        {
          uri: WORKSPACE_URI,
          mimeType: RESOURCE_MIME_TYPE,
          text: widgetHtml,
        },
      ],
    })
  );

  return server;
}
