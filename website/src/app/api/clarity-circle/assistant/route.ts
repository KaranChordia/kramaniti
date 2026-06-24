import Groq from 'groq-sdk';
import type { ChatCompletionMessageParam } from 'groq-sdk/resources/chat/completions';
import { NextResponse } from 'next/server';
import { buildKramanitiKnowledgeContext } from '@/lib/kramaniti-assistant/knowledge';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type Track = 'founder' | 'builder';
type ChatRole = 'assistant' | 'user';

type AssistantMessage = {
  role: ChatRole;
  content: string;
};

type CircleProjectContext = {
  id?: string;
  folder_id?: string | null;
  folderName?: string;
  title: string;
  track: Track;
  context: string;
  project_instruction?: string | null;
  audience?: string | null;
  blocker?: string | null;
  outcome?: string | null;
  summary?: string | null;
  questions?: string[];
  actions?: string[];
};

type CircleProjectTaskContext = {
  project_id: string;
  title: string;
  detail?: string | null;
  source?: 'auto' | 'assistant' | 'user';
  status?: 'open' | 'done' | 'archived';
};

type CircleFolderContext = {
  id: string;
  name: string;
};

type CircleContextEntry = {
  project_id: string;
  entry_type: string;
  payload: Record<string, unknown>;
  created_at: string;
};

type CircleMemoryContext = {
  title: string;
  content: string;
  memory_type?: 'insight' | 'preference' | 'project_signal' | 'boundary';
};

type AssistantRequestBody = {
  message?: string;
  messages?: AssistantMessage[];
  track?: Track;
  savedContext?: {
    track: Track;
    headline: string;
    context: string;
    audience: string;
    blocker: string;
    outcome: string;
    summary: string;
  } | null;
  projects?: CircleProjectContext[];
  folders?: CircleFolderContext[];
  contextEntries?: CircleContextEntry[];
  selectedProjectId?: string | null;
  projectTasks?: CircleProjectTaskContext[];
  memories?: CircleMemoryContext[];
};

type ProjectDraft = {
  title: string;
  track: Track;
  context: string;
  audience: string;
  blocker: string;
  outcome: string;
};

type FolderDraft = {
  name: string;
};

type MemoryDraft = {
  title: string;
  content: string;
  memory_type: 'insight' | 'preference' | 'project_signal' | 'boundary';
};

type TaskDraft = {
  title: string;
  detail?: string;
};

type AssistantPayload = {
  response: string;
  projectDraft?: ProjectDraft | null;
  folderDraft?: FolderDraft | null;
  memoryDraft?: MemoryDraft | null;
  taskDrafts?: TaskDraft[] | null;
};

const MODEL_NAME = process.env.GROQ_CHAT_MODEL || 'openai/gpt-oss-120b';
const MAX_HISTORY_MESSAGES = 8;
const MAX_MESSAGE_CHARS = 1400;
const MAX_CONTEXT_CHARS = 16000;

const clean = (value: string) => value.replace(/\s+/g, ' ').trim();
const truncate = (value: string, maxChars: number) => (value.length > maxChars ? `${value.slice(0, maxChars).trim()}...` : value);

const normalizeMessages = (body: AssistantRequestBody): AssistantMessage[] => {
  const messages = Array.isArray(body.messages)
    ? body.messages
        .filter((message) => message?.role === 'assistant' || message?.role === 'user')
        .map((message) => ({
          role: message.role,
          content: truncate(clean(String(message.content || '')), MAX_MESSAGE_CHARS),
        }))
        .filter((message) => message.content)
    : [];

  if (messages.length > 0) return messages.slice(-MAX_HISTORY_MESSAGES);

  const singleMessage = truncate(clean(String(body.message || '')), MAX_MESSAGE_CHARS);
  return singleMessage ? [{ role: 'user', content: singleMessage }] : [];
};

const buildCircleContext = (body: AssistantRequestBody) => {
  const savedContext = body.savedContext
    ? [
        `Track: ${body.savedContext.track}`,
        `Headline: ${body.savedContext.headline}`,
        `Context: ${body.savedContext.context}`,
        `Audience: ${body.savedContext.audience}`,
        `Blocker: ${body.savedContext.blocker}`,
        `Outcome: ${body.savedContext.outcome}`,
        `Current summary: ${body.savedContext.summary}`,
      ].join('\n')
    : 'No saved starting context was supplied.';

  const projects = (body.projects || [])
    .slice(0, 20)
    .map(
      (project, index) => {
        const entries = (body.contextEntries || [])
          .filter((entry) => entry.project_id === project.id)
          .slice(0, 8)
          .map(
            (entry) =>
              `- ${entry.entry_type} (${entry.created_at}): ${JSON.stringify(entry.payload).slice(0, 900)}`,
          )
          .join('\n');

        return `${index + 1}. ${project.title} (${project.track})${
          body.selectedProjectId === project.id ? ' [currently selected]' : ''
        }\nFolder: ${project.folderName || 'Unfiled'}\nProject instruction: ${
          project.project_instruction || project.context
        }\nContext: ${project.context}\nAudience: ${
          project.audience || 'Not stated'
        }\nBlocker: ${project.blocker || 'Not stated'}\nOutcome: ${project.outcome || 'Not stated'}\nSummary: ${
          project.summary || 'Not stated'
        }\nQuestions: ${(project.questions || []).join(' | ') || 'Not stated'}\nActions: ${
          (project.actions || []).join(' | ') || 'Not stated'
        }\nTasks:\n${(body.projectTasks || [])
          .filter((task) => task.project_id === project.id)
          .slice(0, 12)
          .map((task) => `- [${task.status || 'open'}] ${task.title}${task.detail ? `: ${task.detail}` : ''}`)
          .join('\n') || 'No tasks supplied.'}\nSaved entries:\n${entries || 'No saved entries supplied.'}`;
      },
    )
    .join('\n\n');

  const folders = (body.folders || [])
    .slice(0, 30)
    .map((folder, index) => `${index + 1}. ${folder.name} (${folder.id})`)
    .join('\n');

  const memories = (body.memories || [])
    .slice(0, 20)
    .map((memory, index) => `${index + 1}. ${memory.title}: ${memory.content}`)
    .join('\n');

  return truncate(
    [
      `Preferred current track: ${body.track || 'founder'}`,
      'Saved Circle context:',
      savedContext,
      'User folders:',
      folders || 'No folders supplied.',
      'Known user projects:',
      projects || 'No projects supplied.',
      'User-visible assistant memories:',
      memories || 'No assistant memories supplied.',
    ].join('\n\n'),
    MAX_CONTEXT_CHARS,
  );
};

const wantsProject = (message: string) =>
  /\b(create|start|make|add|open|set up|new)\b/i.test(message) && /\b(project|idea|workspace|plan)\b/i.test(message);

const wantsFolder = (message: string) =>
  /\b(create|start|make|add|set up|new)\b/i.test(message) && /\b(folder|directory|collection)\b/i.test(message);

const wantsMemory = (message: string) =>
  /\b(remember|save this|keep this|note this|store this)\b/i.test(message) ||
  /\b(my preference|important context|don't forget|do not forget)\b/i.test(message);

const wantsTask = (message: string) =>
  /\b(create|start|make|add|set up|new|turn this into)\b/i.test(message) && /\b(task|todo|to-do|next step|action item)\b/i.test(message);

const inferTrack = (message: string, fallback: Track): Track =>
  /\b(individual|builder|idea|validate|exploring)\b/i.test(message) ? 'builder' : fallback;

const buildLocalPayload = (latestMessage: string, body: AssistantRequestBody): AssistantPayload => {
  const fallbackTrack = body.track || body.savedContext?.track || 'founder';
  const track = inferTrack(latestMessage, fallbackTrack);
  const topic = truncate(latestMessage || body.savedContext?.headline || 'New clarity project', 90);
  const folderName = truncate(
    clean(
      latestMessage
        .replace(/\b(create|start|make|add|set up|new)\b/gi, '')
        .replace(/\b(folder|directory|collection)\b/gi, '')
        .replace(/\b(for|called|named|as)\b/gi, ' ')
    ) || 'New folder',
    80,
  );

  const payload: AssistantPayload = {
    response:
      'I have the Circle context. The useful next move is to keep the request tied to one project, one audience, one blocker, and one decision boundary before choosing tools or publishing content.',
    memoryDraft: {
      title: 'Current clarity signal',
      content: body.savedContext?.summary || topic,
      memory_type: 'insight',
    },
    taskDrafts: null,
  };

  if (wantsProject(latestMessage)) {
    payload.response =
      'I can turn this into a working project. I drafted it as a private Circle project so you can refine the audience, blocker, and desired outcome before moving into a Clarity Brief.';
    payload.projectDraft = {
      title: topic || 'New clarity project',
      track,
      context:
        latestMessage ||
        body.savedContext?.context ||
        'A new project created from the Circle assistant conversation.',
      audience: body.savedContext?.audience || '',
      blocker: body.savedContext?.blocker || 'The clearest first decision is still open.',
      outcome: body.savedContext?.outcome || 'A sharper next step and a practical clarity brief.',
    };
  }

  if (wantsTask(latestMessage)) {
    payload.response =
      'I turned this into a project task. Keep the next step small enough that you can review it before the project moves forward.';
    payload.taskDrafts = [
      {
        title: truncate(latestMessage.replace(/\b(create|start|make|add|set up|new|turn this into|task|todo|to-do)\b/gi, '').trim() || 'Clarify next action', 120),
        detail: 'Assistant-created from the current project conversation.',
      },
    ];
    payload.memoryDraft = null;
  }

  if (wantsFolder(latestMessage)) {
    payload.response = 'I prepared a private project folder for this Circle workspace. Use it to group related projects and keep the assistant context easier to read.';
    payload.folderDraft = {
      name: folderName,
    };
    payload.memoryDraft = null;
  }

  if (wantsMemory(latestMessage)) {
    payload.memoryDraft = {
      title: 'User preference',
      content: latestMessage,
      memory_type: 'preference',
    };
    payload.response = 'Saved as a memory note for this Circle workspace. You can review or archive it from the Memory panel.';
  }

  return payload;
};

const parseAssistantPayload = (raw: string): AssistantPayload | null => {
  const trimmed = raw.trim();
  const jsonText = trimmed.match(/\{[\s\S]*\}/)?.[0] || trimmed;

  try {
    const parsed = JSON.parse(jsonText) as Partial<AssistantPayload>;
    if (!parsed.response || typeof parsed.response !== 'string') return null;

    return {
      response: clean(parsed.response),
      projectDraft: parsed.projectDraft || null,
      folderDraft: parsed.folderDraft || null,
      memoryDraft: parsed.memoryDraft || null,
      taskDrafts: Array.isArray(parsed.taskDrafts) ? parsed.taskDrafts.slice(0, 6) : null,
    };
  } catch {
    return null;
  }
};

const buildMessages = (
  history: AssistantMessage[],
  body: AssistantRequestBody,
): ChatCompletionMessageParam[] => {
  const latestMessage = [...history].reverse().find((message) => message.role === 'user')?.content || '';
  const shouldDraftProject = wantsProject(latestMessage);
  const shouldDraftFolder = wantsFolder(latestMessage);
  const shouldDraftMemory = wantsMemory(latestMessage);
  const shouldDraftTask = wantsTask(latestMessage);

  return [
    {
      role: 'user',
      content: `You are the dedicated Kramaniti Clarity Circle assistant.

Your job:
- Help signed-in Clarity Circle users turn rough business or idea context into clearer projects, memories, next actions, and Clarity Engine-ready thinking.
- Use the supplied private Circle context, projects, and assistant memories as the active user context.
- Use the Kramaniti repository context as company training context.
- Follow Kramaniti's sequence: strategy before tools, systems before scale, content after clarity.
- Keep language premium, simple, practical, and non-technical.
- AI assists, humans lead. Do not make founder decisions for the user.
- Do not call this an AI social network.
- Do not invent tool availability, market updates, client claims, metrics, testimonials, pricing, or outcomes.
- If external or current-market facts are needed, say that dated source checks are required before the recommendation is final.
- If the user asks you to create a project, return a projectDraft object.
- If the user asks you to create a folder, return a folderDraft object.
- If the user asks for a task, todo, or concrete action item for the selected project, return taskDrafts.
- If the user asks you to remember something, or if a durable preference or useful signal emerges, return a memoryDraft object.
- When a selected project exists, answer as that project's assistant: use the selected project's instruction, context, tasks, messages, and memories first, while keeping the broader Clarity Circle behavior.
- Keep the public answer under 120 words unless the user asks for a deeper breakdown.
- Return valid JSON only with this shape:
{
  "response": "plain language answer",
  "projectDraft": null or {
    "title": "short project title",
    "track": "founder" or "builder",
    "context": "what the project is about",
    "projectInstruction": "how future outputs in this project should behave",
    "audience": "who this is for",
    "blocker": "what is unclear",
    "outcome": "what should become clearer"
  },
  "folderDraft": null or {
    "name": "short folder name"
  },
  "memoryDraft": null or {
    "title": "short memory title",
    "content": "what should be remembered",
    "memory_type": "insight" or "preference" or "project_signal" or "boundary"
  },
  "taskDrafts": null or [
    {
      "title": "short task title",
      "detail": "optional task detail"
    }
  ]
}

Project draft expected from latest message: ${shouldDraftProject ? 'yes' : 'only if genuinely useful'}.
Folder draft expected from latest message: ${shouldDraftFolder ? 'yes' : 'only if genuinely useful'}.
Memory draft expected from latest message: ${shouldDraftMemory ? 'yes' : 'only if genuinely useful'}.
Task drafts expected from latest message: ${shouldDraftTask ? 'yes' : 'only if genuinely useful'}.

Private Circle context:
${buildCircleContext(body)}

Kramaniti company context:
${buildKramanitiKnowledgeContext()}`,
    },
    {
      role: 'assistant',
      content:
        '{"response":"Understood. I will use the private Circle context and Kramaniti operating rules, then return only structured JSON.","projectDraft":null,"folderDraft":null,"memoryDraft":null,"taskDrafts":null}',
    },
    ...history.map((message) => ({
      role: message.role,
      content: message.content,
    })),
  ];
};

export async function POST(request: Request) {
  let body: AssistantRequestBody;

  try {
    body = (await request.json()) as AssistantRequestBody;
  } catch {
    return NextResponse.json({ error: 'Invalid request payload.' }, { status: 400 });
  }

  const history = normalizeMessages(body);
  const latestUserMessage = [...history].reverse().find((message) => message.role === 'user')?.content || '';

  if (!latestUserMessage) {
    return NextResponse.json({ error: 'Message is required.' }, { status: 400 });
  }

  if (!process.env.GROQ_API_KEY) {
    return NextResponse.json({
      ...buildLocalPayload(latestUserMessage, body),
      source: 'local',
      model: MODEL_NAME,
    });
  }

  try {
    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
      maxRetries: 1,
      timeout: 45_000,
    });

    const completion = await groq.chat.completions.create({
      messages: buildMessages(history, body),
      model: MODEL_NAME,
      temperature: 0.35,
      max_completion_tokens: 850,
      top_p: 0.9,
      reasoning_effort: 'medium',
      include_reasoning: false,
      stream: false,
      stop: null,
      response_format: { type: 'json_object' },
    });

    const parsed = parseAssistantPayload(completion.choices[0]?.message?.content || '');

    if (!parsed) {
      throw new Error('Clarity Circle assistant returned invalid JSON.');
    }

    return NextResponse.json({
      ...parsed,
      source: 'groq',
      model: MODEL_NAME,
    });
  } catch (error) {
    console.error('Clarity Circle assistant route failed:', error);

    return NextResponse.json({
      ...buildLocalPayload(latestUserMessage, body),
      source: 'local',
      model: MODEL_NAME,
    });
  }
}
