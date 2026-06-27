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

const SERVER_VERSION = "0.2.0";
const CLARITY_WORKSPACE_URI = "ui://kramaniti/clarity-workspace.html";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const widgetHtml = fs.readFileSync(
  path.resolve(__dirname, "../widgets/clarity-map.html"),
  "utf8"
);

type LabeledItem = {
  label: string;
  detail: string;
};

type ClarityOutput = {
  mode: "analysis" | "operating_map";
  title: string;
  summary: string;
  memoryBoundary: string;
  contextSignals: LabeledItem[];
  clarityGaps: LabeledItem[];
  strategy: string;
  systems: string;
  content: string;
  humanAiBoundary: LabeledItem[];
  nextMoves: LabeledItem[];
  reflectionQuestions: string[];
  correctionPrompts: string[];
  guardrails: string[];
};

function normalize(value: string | undefined, fallback: string): string {
  const trimmed = value?.trim();
  return trimmed && trimmed.length > 0 ? trimmed : fallback;
}

function splitSignals(value: string | undefined, fallback: string[]): string[] {
  const text = value?.trim();
  if (!text) {
    return fallback;
  }

  const parts = text
    .split(/\n|;|\.\s+/)
    .map((part) => part.replace(/^[-*]\s*/, "").trim())
    .filter(Boolean);

  return parts.length > 0 ? parts.slice(0, 5) : fallback;
}

function asItems(labels: string[], details: string[]): LabeledItem[] {
  return labels.map((label, index) => ({
    label,
    detail: details[index] ?? details[details.length - 1] ?? "",
  }));
}

function buildContextAnalysis(input: {
  statedGoal: string;
  conversationContext?: string;
  rememberedContext?: string;
  currentFriction?: string;
  constraints?: string;
}): ClarityOutput {
  const goal = normalize(input.statedGoal, "the current goal");
  const contextSignals = splitSignals(input.conversationContext, [
    "The app only sees context included in this conversation or tool call.",
    "Useful memory should be restated or confirmed before decisions are made.",
  ]);
  const rememberedSignals = splitSignals(input.rememberedContext, [
    "No external ChatGPT memory was directly read by this MCP server.",
  ]);
  const friction = normalize(input.currentFriction, "the point where action feels unclear");
  const constraints = normalize(input.constraints, "time, attention, proof, trust, or adoption constraints");

  return {
    mode: "analysis",
    title: `Clarify the pattern behind ${goal}.`,
    summary:
      "This is a session-based read of the context ChatGPT passed into the app. It organizes signals before recommending tools, automation, or public-facing content.",
    memoryBoundary:
      "Kramaniti cannot directly read private ChatGPT memories. It can work with context the user or ChatGPT includes in the current conversation, and the user should correct anything that feels wrong.",
    contextSignals: [
      ...contextSignals.slice(0, 3).map((signal, index) => ({
        label: `Signal ${index + 1}`,
        detail: signal,
      })),
      ...rememberedSignals.slice(0, 2).map((signal, index) => ({
        label: index === 0 ? "Memory-Like Context" : "Additional Context",
        detail: signal,
      })),
    ],
    clarityGaps: asItems(
      ["Goal Shape", "Operating Friction", "Constraint", "Decision Gap"],
      [
        `The goal is visible, but it needs to be converted into a concrete operating outcome: ${goal}.`,
        `The most useful starting point is the friction: ${friction}.`,
        `The plan should respect these constraints: ${constraints}.`,
        "The next step should name what must be decided before a system, tool, or content path is chosen.",
      ]
    ),
    strategy:
      "Start by naming the user, outcome, proof standard, and decision owner. Do not turn memory/context into advice until the goal and constraints are confirmed.",
    systems:
      "Map the repeated workflow, the handoffs, and the points where AI should assist rather than replace human judgment.",
    content:
      "Only after the operating path is clear, convert the insight into a note, brief, or content angle that reflects what is actually true.",
    humanAiBoundary: asItems(
      ["Human-Led", "AI-Assisted", "Automated Later"],
      [
        "Confirm personal context, priorities, sensitive constraints, and final decisions.",
        "Summarize patterns, compare options, draft maps, and surface overlooked questions.",
        "Only repeatable low-risk steps should be automated after the workflow is understood.",
      ]
    ),
    nextMoves: asItems(
      ["Confirm", "Sort", "Choose"],
      [
        "Ask the user to correct or confirm the memory/context signals before acting on them.",
        "Sort the goal into strategy, systems, content, proof, or adoption friction.",
        "Pick the smallest next move that reduces ambiguity within the current constraints.",
      ]
    ),
    reflectionQuestions: [
      "What did the app assume about me that is not true?",
      "Which part of this goal is a strategy question rather than a tool question?",
      "What would make this feel clear enough to act on this week?",
    ],
    correctionPrompts: [
      "Correct the context signals and rebuild the map.",
      "Remove any memory-like detail I did not explicitly approve.",
      "Focus only on my current goal and ignore older context.",
    ],
    guardrails: [
      "Session-only context; no persistent memory is stored by this app.",
      "No private ChatGPT memory is directly read by the MCP server.",
      "User correction should override inferred context.",
    ],
  };
}

function buildOperatingMap(input: {
  statedGoal: string;
  confirmedContext?: string;
  primaryClarityGap?: string;
  audience?: string;
  currentWorkflow?: string;
  desiredOutcome?: string;
}): ClarityOutput {
  const goal = normalize(input.statedGoal, "the current goal");
  const confirmedContext = normalize(
    input.confirmedContext,
    "the context the user has confirmed in the current conversation"
  );
  const clarityGap = normalize(input.primaryClarityGap, "workflow clarity");
  const audience = normalize(input.audience, "the person or team affected by the workflow");
  const currentWorkflow = normalize(input.currentWorkflow, "the current informal workflow");
  const desiredOutcome = normalize(input.desiredOutcome, "a clearer operating pipeline");

  return {
    mode: "operating_map",
    title: `Build the operating map for ${goal}.`,
    summary: `Kramaniti would treat ${clarityGap} as the lead problem. The practical outcome is ${desiredOutcome}, with strategy, systems, and content sequenced in that order.`,
    memoryBoundary:
      "This map uses only confirmed or conversation-provided context. It should not be treated as a permanent profile or a substitute for user approval.",
    contextSignals: asItems(
      ["Goal", "Confirmed Context", "Audience", "Current Workflow"],
      [goal, confirmedContext, audience, currentWorkflow]
    ),
    clarityGaps: asItems(
      ["Primary Gap", "Proof Gap", "Adoption Gap"],
      [
        `Resolve ${clarityGap} before adding tools or automation.`,
        "Define what evidence, behavior, or output would prove the map is useful.",
        "Make the handoff simple enough that the user or team can actually repeat it.",
      ]
    ),
    strategy: `Define the purpose, audience (${audience}), decision owner, and proof standard for ${goal}.`,
    systems: `Turn ${currentWorkflow} into a visible path with inputs, handoffs, review checkpoints, and the smallest useful support tool.`,
    content:
      "Translate the clarified workflow into a practical explanation only after the operating path is stable enough to communicate.",
    humanAiBoundary: asItems(
      ["Human-Led", "AI-Assisted", "Automated Later"],
      [
        "Goals, tradeoffs, sensitive context, approvals, and final judgment.",
        "Context sorting, option comparison, first drafts, scenario maps, and checklists.",
        "Low-risk recurring reminders, formatting, routing, and status updates after the process works manually.",
      ]
    ),
    nextMoves: asItems(
      ["Name the Decision", "Draw the Workflow", "Choose the First System", "Make It Explainable"],
      [
        `Write one sentence that defines the decision ${goal} depends on.`,
        "List the steps from trigger to outcome, including every handoff or pause.",
        "Prototype one support surface that improves the highest-friction step.",
        "Create one concise explanation that helps the audience understand the new operating path.",
      ]
    ),
    reflectionQuestions: [
      "What decision is still being avoided?",
      "Which part should stay human-led even if AI can assist?",
      "What is the smallest system that would make progress visible?",
    ],
    correctionPrompts: [
      "Rebuild this with a different primary clarity gap.",
      "Make the plan more personal to my current constraints.",
      "Remove the content layer until the workflow is clearer.",
    ],
    guardrails: [
      "Strategy before tools.",
      "Systems before scale.",
      "Content after clarity.",
      "No unsupported proof or automation-first promise.",
    ],
  };
}

const outputSchema = {
  mode: z.enum(["analysis", "operating_map"]),
  title: z.string(),
  summary: z.string(),
  memoryBoundary: z.string(),
  contextSignals: z.array(z.object({ label: z.string(), detail: z.string() })),
  clarityGaps: z.array(z.object({ label: z.string(), detail: z.string() })),
  strategy: z.string(),
  systems: z.string(),
  content: z.string(),
  humanAiBoundary: z.array(z.object({ label: z.string(), detail: z.string() })),
  nextMoves: z.array(z.object({ label: z.string(), detail: z.string() })),
  reflectionQuestions: z.array(z.string()),
  correctionPrompts: z.array(z.string()),
  guardrails: z.array(z.string()),
};

export function createKramanitiMcpServer(): McpServer {
  const server = new McpServer({
    name: "kramaniti-clarity-companion",
    version: SERVER_VERSION,
  });

  registerAppTool(
    server,
    "analyze_clarity_context",
    {
      title: "Analyze Clarity Context",
      description:
        "Analyze the user's stated goal and conversation-provided context into memory-like signals, clarity gaps, boundaries, and correction prompts. Use this before creating a plan when the user wants Kramaniti to use what ChatGPT knows or remembers about them.",
      inputSchema: {
        statedGoal: z.string().describe("The goal, project, decision, or problem the user wants clarity on."),
        conversationContext: z
          .string()
          .optional()
          .describe("Relevant context from the current conversation. Do not invent private memory."),
        rememberedContext: z
          .string()
          .optional()
          .describe("Any user-approved memory-like context ChatGPT included in the conversation."),
        currentFriction: z
          .string()
          .optional()
          .describe("The current blocker, repeated confusion, or point where progress slows down."),
        constraints: z
          .string()
          .optional()
          .describe("Known limits such as time, budget, attention, proof, trust, privacy, or adoption."),
      },
      outputSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        openWorldHint: false,
      },
      _meta: {
        ui: {
          resourceUri: CLARITY_WORKSPACE_URI,
        },
      },
    },
    async (input) => {
      const analysis = buildContextAnalysis(input);

      return {
        structuredContent: analysis,
        content: [
          {
            type: "text",
            text:
              "I analyzed the conversation-provided context into memory signals, clarity gaps, and correction prompts. Open the workspace to inspect or correct the map.",
          },
        ],
      };
    }
  );

  registerAppTool(
    server,
    "create_operating_map",
    {
      title: "Create Operating Map",
      description:
        "Create a Kramaniti operating map from confirmed context: strategy before tools, systems before scale, and content after clarity. Use after the user confirms the goal or context.",
      inputSchema: {
        statedGoal: z.string().describe("The confirmed goal, project, decision, or workflow to map."),
        confirmedContext: z
          .string()
          .optional()
          .describe("Context the user has confirmed or corrected in the current conversation."),
        primaryClarityGap: z
          .string()
          .optional()
          .describe("The main clarity gap: strategy, workflow, audience, proof, system boundary, content, or adoption."),
        audience: z
          .string()
          .optional()
          .describe("The person, team, buyer, or user affected by the operating map."),
        currentWorkflow: z
          .string()
          .optional()
          .describe("The current workflow, tool stack, or informal process."),
        desiredOutcome: z
          .string()
          .optional()
          .describe("The concrete outcome the user wants from the map."),
      },
      outputSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        openWorldHint: false,
      },
      _meta: {
        ui: {
          resourceUri: CLARITY_WORKSPACE_URI,
        },
      },
    },
    async (input) => {
      const map = buildOperatingMap(input);

      return {
        structuredContent: map,
        content: [
          {
            type: "text",
            text:
              "I created a Kramaniti operating map from the confirmed context. Open the workspace to inspect the strategy, systems, content, and next moves.",
          },
        ],
      };
    }
  );

  registerAppResource(
    server,
    "Kramaniti Clarity Companion Workspace",
    CLARITY_WORKSPACE_URI,
    {
      mimeType: RESOURCE_MIME_TYPE,
      description: "Interactive Kramaniti clarity companion workspace HTML.",
    },
    async () => ({
      contents: [
        {
          uri: CLARITY_WORKSPACE_URI,
          mimeType: RESOURCE_MIME_TYPE,
          text: widgetHtml,
        },
      ],
    })
  );

  return server;
}
