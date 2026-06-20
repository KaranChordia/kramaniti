import Groq from 'groq-sdk';
import { NextResponse } from 'next/server';
import {
  buildStudioFallbackTasks,
  buildStudioFallbackResponse,
  buildStudioSystemPrompt,
  getRouteById,
  routeFounderRequest,
  type StudioAgentTask,
} from '../../../../lib/studio/agentOS';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type RequestBody = {
  request?: string;
  context?: string;
  routeId?: string;
  stream?: boolean;
};

const MODEL_NAME = process.env.GROQ_STUDIO_MODEL || process.env.GROQ_CLARITY_MODEL || 'llama-3.3-70b-versatile';

type StudioGroqPayload = {
  summary?: string;
  agentTasks?: StudioAgentTask[];
  approvalGate?: string;
  memoryNote?: string;
};

export async function POST(request: Request) {
  let body: RequestBody;

  try {
    body = (await request.json()) as RequestBody;
  } catch {
    return NextResponse.json({ error: 'Invalid request payload.' }, { status: 400 });
  }

  const founderRequest = body.request?.trim() ?? '';
  const context = body.context?.trim() ?? '';
  const selectedRoute = body.routeId ? getRouteById(body.routeId) : routeFounderRequest(founderRequest, context);
  const fallback = buildStudioFallbackResponse(founderRequest, selectedRoute);
  const fallbackTasks = buildStudioFallbackTasks(founderRequest, selectedRoute);

  if (!founderRequest) {
    return NextResponse.json({ error: 'Founder request is required.' }, { status: 400 });
  }

  if (!process.env.GROQ_API_KEY) {
    if (body.stream) {
      return streamLocalResponse(selectedRoute, fallbackTasks, fallback);
    }

    return NextResponse.json({
      route: selectedRoute,
      content: fallback,
      agentTasks: fallbackTasks,
      source: 'local',
    });
  }

  try {
    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
      maxRetries: 1,
      timeout: 45_000,
    });

    if (body.stream) {
      return streamGroqResponse(groq, founderRequest, context, selectedRoute, fallback, fallbackTasks);
    }

    const completion = await groq.chat.completions.create({
      model: MODEL_NAME,
      temperature: 0.7,
      max_completion_tokens: 1600,
      messages: [
        {
          role: 'system',
          content: buildStudioSystemPrompt(selectedRoute),
        },
        {
          role: 'user',
          content: [
            `Founder request:\n${founderRequest}`,
            context ? `Additional context:\n${context}` : '',
          ]
            .filter(Boolean)
            .join('\n\n'),
        },
      ],
    });

    const raw = completion.choices[0]?.message?.content?.trim() || '';
    const parsed = parseStudioPayload(raw);
    const delegatedTasks = normalizeAgentTasks(parsed?.agentTasks, fallbackTasks);
    const agentTasks = await runDelegatedAgentTasks(groq, founderRequest, context, selectedRoute.label, delegatedTasks);
    const content =
      parsed?.summary ||
      agentTasks.map((task) => `${task.agentName}: ${task.output}`).join('\n') ||
      fallback;

    return NextResponse.json({
      route: selectedRoute,
      content,
      agentTasks,
      approvalGate: parsed?.approvalGate || selectedRoute.approvalGate,
      memoryNote: parsed?.memoryNote || '',
      source: 'groq',
    });
  } catch (error) {
    console.error('Studio Groq route failed:', error);

    return NextResponse.json({
      route: selectedRoute,
      content: fallback,
      agentTasks: fallbackTasks,
      source: 'local',
    });
  }
}

function parseStudioPayload(raw: string): StudioGroqPayload | null {
  try {
    return JSON.parse(raw) as StudioGroqPayload;
  } catch {
    const match = raw.match(/\{[\s\S]*\}/);
    if (!match) return null;

    try {
      return JSON.parse(match[0]) as StudioGroqPayload;
    } catch {
      return null;
    }
  }
}

function normalizeAgentTasks(tasks: StudioAgentTask[] | undefined, fallbackTasks: StudioAgentTask[]) {
  if (!Array.isArray(tasks) || tasks.length === 0) return fallbackTasks;

  return tasks.slice(0, 3).map((task, index) => ({
    agentName: task.agentName || fallbackTasks[index]?.agentName || `Agent ${index + 1}`,
    role: task.role || fallbackTasks[index]?.role || 'Specialist',
    task: task.task || fallbackTasks[index]?.task || 'Complete assigned work.',
    output: '',
  }));
}

async function runDelegatedAgentTasks(
  groq: Groq,
  founderRequest: string,
  context: string,
  routeLabel: string,
  tasks: StudioAgentTask[]
) {
  const completedTasks: StudioAgentTask[] = [];

  for (const task of tasks) {
    completedTasks.push(await runSingleAgentTask(groq, founderRequest, context, routeLabel, task));
  }

  return completedTasks;
}

async function createDelegatedTasks(
  groq: Groq,
  founderRequest: string,
  context: string,
  route: ReturnType<typeof getRouteById>,
  fallbackTasks: StudioAgentTask[]
) {
  const completion = await groq.chat.completions.create({
    model: MODEL_NAME,
    temperature: 0.7,
    max_completion_tokens: 1600,
    messages: [
      {
        role: 'system',
        content: buildStudioSystemPrompt(route),
      },
      {
        role: 'user',
        content: [
          `Founder request:\n${founderRequest}`,
          context ? `Additional context:\n${context}` : '',
        ]
          .filter(Boolean)
          .join('\n\n'),
      },
    ],
  });

  const raw = completion.choices[0]?.message?.content?.trim() || '';
  const parsed = parseStudioPayload(raw);

  return {
    parsed,
    tasks: normalizeAgentTasks(parsed?.agentTasks, fallbackTasks),
  };
}

async function runSingleAgentTask(
  groq: Groq,
  founderRequest: string,
  context: string,
  routeLabel: string,
  task: StudioAgentTask
) {
  try {
    const completion = await groq.chat.completions.create({
      model: MODEL_NAME,
      temperature: 0.62,
      max_completion_tokens: 220,
      messages: [
        {
          role: 'system',
          content: buildAgentExecutionPrompt(task, routeLabel),
        },
        {
          role: 'user',
          content: [
            `Founder request:\n${founderRequest}`,
            context ? `Additional context:\n${context}` : '',
            `Delegated task:\n${task.task}`,
          ]
            .filter(Boolean)
            .join('\n\n'),
        },
      ],
    });

    const output = cleanAgentOutput(completion.choices[0]?.message?.content);
    return {
      ...task,
      output: output || `Completed: ${task.task}`,
    };
  } catch (error) {
    console.error(`Studio delegated agent failed for ${task.agentName}:`, error);
    return {
      ...task,
      output: `Local fallback: ${task.task}`,
    };
  }
}

function streamLocalResponse(route: ReturnType<typeof getRouteById>, tasks: StudioAgentTask[], content: string) {
  return streamResponse(async (send) => {
    send({ type: 'route', route, source: 'local' });
    send({ type: 'agents_planned', tasks });

    for (const [index, task] of tasks.entries()) {
      send({ type: 'agent_started', index });
      send({ type: 'agent_completed', index, task });
    }

    send({
      type: 'complete',
      content,
      tasks,
      source: 'local',
      memoryNote: '',
    });
  });
}

function streamGroqResponse(
  groq: Groq,
  founderRequest: string,
  context: string,
  route: ReturnType<typeof getRouteById>,
  fallback: string,
  fallbackTasks: StudioAgentTask[]
) {
  return streamResponse(async (send) => {
    send({ type: 'route', route, source: 'groq' });

    let parsed: StudioGroqPayload | null = null;
    let delegatedTasks = fallbackTasks.map((task) => ({ ...task, output: '' }));

    try {
      const delegation = await createDelegatedTasks(groq, founderRequest, context, route, fallbackTasks);
      parsed = delegation.parsed;
      delegatedTasks = delegation.tasks;
    } catch (error) {
      console.error('Studio Groq delegation failed:', error);
    }

    send({ type: 'agents_planned', tasks: delegatedTasks });

    const completedTasks: StudioAgentTask[] = [];
    for (const [index, task] of delegatedTasks.entries()) {
      send({ type: 'agent_started', index });
      const completedTask = await runSingleAgentTask(groq, founderRequest, context, route.label, task);
      completedTasks.push(completedTask);
      send({ type: 'agent_completed', index, task: completedTask });
    }

    const content =
      parsed?.summary ||
      completedTasks.map((task) => `${task.agentName}: ${task.output}`).join('\n') ||
      fallback;

    send({
      type: 'complete',
      content,
      tasks: completedTasks,
      source: 'groq',
      approvalGate: parsed?.approvalGate || route.approvalGate,
      memoryNote: parsed?.memoryNote || '',
    });
  });
}

function streamResponse(run: (send: (event: Record<string, unknown>) => void) => Promise<void> | void) {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const send = (event: Record<string, unknown>) => {
        controller.enqueue(encoder.encode(`${JSON.stringify(event)}\n`));
      };

      try {
        await run(send);
      } catch (error) {
        console.error('Studio stream failed:', error);
        send({ type: 'error', error: 'Studio orchestration failed.' });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'application/x-ndjson; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
    },
  });
}

function buildAgentExecutionPrompt(task: StudioAgentTask, routeLabel: string) {
  return `You are ${task.agentName} inside Kramaniti Studio.

Role: ${task.role}
Route: ${routeLabel}

Complete only your delegated task.

Rules:
- Return the work itself, not process commentary.
- Keep the output short: one compact sentence under 32 words.
- Do not use markdown bullets, headings, labels, or numbered lists.
- Do not invent client names, testimonials, metrics, proof, permissions, pricing, or outcomes.
- Do not publish, schedule, send, or create external commitments.
- Use business-first Kramaniti language: strategy, systems, workflows, clarity, brand growth, practical AI.
- Avoid generic hype such as revolutionary, cutting-edge, unlock the future, automate everything, or next-gen.`;
}

function cleanAgentOutput(output: string | null | undefined) {
  return (output ?? '')
    .trim()
    .replace(/^["'`]+|["'`]+$/g, '')
    .slice(0, 280);
}
