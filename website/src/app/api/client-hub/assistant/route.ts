import Groq from 'groq-sdk';
import type { ChatCompletionMessageParam } from 'groq-sdk/resources/chat/completions';
import { requireClientHubUser } from '@/lib/client-hub/server';
import type {
  ClientHubAssistantAction,
  ClientHubAssistantActionType,
  ClientHubProject,
  ClientHubTask,
  ClientHubTaskPriority,
  ClientHubTaskStatus,
} from '@/lib/client-hub/supabase';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type AssistantMode = 'chat' | 'decompose_task';

type AssistantRequest = {
  workspaceId?: string;
  projectId?: string | null;
  message?: string;
  mode?: AssistantMode;
  task?: {
    id?: string;
    projectId?: string | null;
    title?: string;
    description?: string;
    priority?: ClientHubTaskPriority;
    dueDate?: string | null;
  } | null;
};

type ProposedAction = {
  type: ClientHubAssistantActionType;
  summary: string;
  payload: Record<string, unknown>;
};

type AssistantPayload = {
  response: string;
  actions: ProposedAction[];
};

const MODEL_NAME = process.env.GROQ_CHAT_MODEL || 'openai/gpt-oss-120b';
const MAX_MESSAGE_LENGTH = 2400;
const MAX_RESPONSE_LENGTH = 3000;
const MAX_ACTIONS = 6;

const asText = (value: unknown, max = 1000) =>
  (typeof value === 'string' ? value : '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, max);

const isRecord = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === 'object' && !Array.isArray(value);

const validStatus = (value: unknown): ClientHubTaskStatus | null => {
  const status = asText(value, 32) as ClientHubTaskStatus;
  return ['todo', 'in_progress', 'waiting', 'review', 'done', 'archived'].includes(status) ? status : null;
};

const validPriority = (value: unknown): ClientHubTaskPriority => {
  const priority = asText(value, 16) as ClientHubTaskPriority;
  return ['low', 'normal', 'high', 'urgent'].includes(priority) ? priority : 'normal';
};

const parsePayload = (content: string): AssistantPayload | null => {
  try {
    const fenced = content.match(/```(?:json)?\s*([\s\S]*?)```/i)?.[1];
    const raw = fenced ?? content.slice(content.indexOf('{'), content.lastIndexOf('}') + 1);
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    const response = asText(parsed.response, MAX_RESPONSE_LENGTH);
    const actions = Array.isArray(parsed.actions) ? parsed.actions : [];

    return {
      response: response || 'I prepared a reviewable next step from the workspace context.',
      actions: actions
        .filter(isRecord)
        .map((action) => ({
          type: asText(action.type, 40) as ClientHubAssistantActionType,
          summary: asText(action.summary, 300),
          payload: isRecord(action.payload) ? action.payload : {},
        }))
        .slice(0, MAX_ACTIONS),
    };
  } catch {
    return null;
  }
};

const decomposeLocally = (body: AssistantRequest): AssistantPayload => {
  const taskTitle = asText(body.task?.title, 220) || 'the task';
  const description = asText(body.task?.description, 1200);
  const projectId = body.task?.projectId ?? body.projectId ?? null;
  const parentTaskId = asText(body.task?.id, 80) || null;
  const lower = `${taskTitle} ${description}`.toLowerCase();

  const middleSteps = lower.match(/content|video|campaign|post|article|website/)
    ? [
        ['Prepare the source brief and working inputs', 'Collect the audience, message, references, formats, and approval boundaries before production starts.'],
        ['Create the first working version', 'Produce the smallest complete draft that can be reviewed against the brief.'],
      ]
    : lower.match(/research|report|audit|analysis|strategy/)
      ? [
          ['Gather evidence and current-state inputs', 'Collect the relevant source material, stakeholder context, and constraints before drawing conclusions.'],
          ['Synthesize findings into a decision-ready draft', 'Turn the evidence into a structured working output with assumptions kept visible.'],
        ]
      : lower.match(/build|develop|implement|integrate|automation|system/)
        ? [
            ['Map the workflow and dependencies', 'Confirm the inputs, owners, data boundaries, integration points, and human review step.'],
            ['Build the smallest working path', 'Implement the core end-to-end flow before adding secondary states or polish.'],
          ]
        : [
            ['Gather the required inputs and owners', 'Confirm the source material, dependencies, decision owner, and anyone needed for review.'],
            ['Complete the first working pass', 'Produce a concrete version that can be checked rather than extending planning indefinitely.'],
          ];

  const steps = [
    [
      `Define success for ${taskTitle}`,
      description
        ? `Turn the task description into a clear completion test: ${description}`
        : 'Write the expected outcome, constraints, decision owner, and the evidence required to call this complete.',
    ],
    ...middleSteps,
    ['Run the human review checkpoint', 'Review the working output with the responsible owner, record changes, and confirm what remains open.'],
    ['Close the handoff and record decisions', 'Complete the approved changes, capture the final decision, and make the next owner or follow-up explicit.'],
  ];

  return {
    response: `I analysed “${taskTitle}” as an operating sequence and drafted ${steps.length} subtasks. Review them before they are added.`,
    actions: steps.map(([title, detail], index) => ({
      type: 'create_task',
      summary: `Add subtask ${index + 1}: ${title}`,
      payload: {
        title,
        description: detail,
        projectId,
        parentTaskId,
        priority: index === 0 ? body.task?.priority ?? 'normal' : 'normal',
        status: 'todo',
      },
    })),
  };
};

const buildLocalChatPayload = (
  message: string,
  counts: { projects: number; openTasks: number; notes: number; messages: number; repositoryItems: number },
  projectId: string | null
): AssistantPayload => {
  const taskMatch = message.match(/(?:create|add|make)\s+(?:a\s+)?(?:task|todo)(?:\s+(?:to|for|called))?\s*[:\-]?\s*(.+)/i);
  if (taskMatch?.[1]) {
    const title = asText(taskMatch[1], 220);
    return {
      response: `I drafted “${title}” as a task. Review it before it enters the shared plan.`,
      actions: [
        {
          type: 'create_task',
          summary: `Create task: ${title}`,
          payload: { title, description: '', projectId, priority: 'normal', status: 'todo' },
        },
      ],
    };
  }

  const noteMatch = message.match(/(?:create|add|save|write)\s+(?:a\s+)?note(?:\s+(?:that|called|about))?\s*[:\-]?\s*(.+)/i);
  if (noteMatch?.[1]) {
    const body = asText(noteMatch[1], 4000);
    return {
      response: 'I drafted that as a shared note so it stays visible beside the work. Review it before saving.',
      actions: [
        {
          type: 'create_note',
          summary: `Save note: ${body.slice(0, 90)}`,
          payload: { title: body.slice(0, 80), body, projectId, visibility: 'shared' },
        },
      ],
    };
  }

  const messageMatch = message.match(/(?:send|post|draft)\s+(?:a\s+)?message(?:\s+(?:that|saying))?\s*[:\-]?\s*(.+)/i);
  if (messageMatch?.[1]) {
    const body = asText(messageMatch[1], 4000);
    return {
      response: 'I prepared that as a workspace update. Review the wording before it is posted to the client thread.',
      actions: [
        {
          type: 'send_message',
          summary: `Post update: ${body.slice(0, 90)}`,
          payload: { body, projectId },
        },
      ],
    };
  }

  return {
    response: `This workspace currently has ${counts.projects} project${counts.projects === 1 ? '' : 's'}, ${counts.openTasks} open task${counts.openTasks === 1 ? '' : 's'}, ${counts.notes} visible note${counts.notes === 1 ? '' : 's'}, ${counts.messages} recent message${counts.messages === 1 ? '' : 's'}, and ${counts.repositoryItems} reflected repository item${counts.repositoryItems === 1 ? '' : 's'}. Ask me to plan a task, draft a note, prepare a message, or identify what is blocked.`,
    actions: [],
  };
};

const sanitizeActions = (
  payload: AssistantPayload,
  context: {
    projects: ClientHubProject[];
    tasks: ClientHubTask[];
    fallbackProjectId: string | null;
    fallbackParentTaskId: string | null;
    clientRole: string;
  }
) => {
  const projectIds = new Set(context.projects.map((project) => project.id));
  const tasksById = new Map(context.tasks.map((task) => [task.id, task]));

  return payload.actions
    .filter((action) =>
      ['create_project', 'create_task', 'create_note', 'update_task', 'send_message'].includes(action.type)
    )
    .map((action): ProposedAction | null => {
      const raw = isRecord(action.payload) ? action.payload : {};

      if (action.type === 'create_project') {
        const title = asText(raw.title, 180);
        if (!title) return null;
        return {
          type: action.type,
          summary: asText(action.summary, 300) || `Create project: ${title}`,
          payload: {
            title,
            description: asText(raw.description, 6000),
            status: ['planned', 'active'].includes(asText(raw.status, 20)) ? asText(raw.status, 20) : 'planned',
          },
        };
      }

      if (action.type === 'create_task') {
        const title = asText(raw.title, 220);
        if (!title) return null;
        const requestedProjectId = asText(raw.projectId, 80) || context.fallbackProjectId;
        const projectId = requestedProjectId && projectIds.has(requestedProjectId) ? requestedProjectId : null;
        const requestedParentId = asText(raw.parentTaskId, 80) || context.fallbackParentTaskId;
        const parent = requestedParentId ? tasksById.get(requestedParentId) : null;

        return {
          type: action.type,
          summary: asText(action.summary, 300) || `Create task: ${title}`,
          payload: {
            title,
            description: asText(raw.description, 6000),
            projectId,
            parentTaskId: parent && parent.workspace_id ? parent.id : null,
            priority: validPriority(raw.priority),
            status: validStatus(raw.status) ?? 'todo',
            dueDate: /^\d{4}-\d{2}-\d{2}$/.test(asText(raw.dueDate, 10)) ? asText(raw.dueDate, 10) : null,
          },
        };
      }

      if (action.type === 'create_note') {
        const body = asText(raw.body, 20000);
        if (!body) return null;
        const requestedProjectId = asText(raw.projectId, 80) || context.fallbackProjectId;
        return {
          type: action.type,
          summary: asText(action.summary, 300) || 'Create workspace note',
          payload: {
            title: asText(raw.title, 180) || body.slice(0, 80),
            body,
            projectId: requestedProjectId && projectIds.has(requestedProjectId) ? requestedProjectId : null,
            visibility: context.clientRole === 'client' ? 'shared' : asText(raw.visibility, 20) === 'internal' ? 'internal' : 'shared',
          },
        };
      }

      if (action.type === 'update_task') {
        const taskId = asText(raw.taskId, 80);
        const task = tasksById.get(taskId);
        if (!task) return null;
        const status = validStatus(raw.status);
        if (!status) return null;
        return {
          type: action.type,
          summary: asText(action.summary, 300) || `Update task: ${task.title}`,
          payload: { taskId, status },
        };
      }

      const body = asText(raw.body, 8000);
      if (!body) return null;
      const requestedProjectId = asText(raw.projectId, 80) || context.fallbackProjectId;
      return {
        type: 'send_message',
        summary: asText(action.summary, 300) || 'Post workspace update',
        payload: {
          body,
          projectId: requestedProjectId && projectIds.has(requestedProjectId) ? requestedProjectId : null,
        },
      };
    })
    .filter((action): action is ProposedAction => Boolean(action))
    .slice(0, MAX_ACTIONS);
};

const buildModelMessages = (
  body: AssistantRequest,
  workspaceContext: string,
  history: Array<{ role: 'user' | 'assistant'; content: string }>
): ChatCompletionMessageParam[] => [
  {
    role: 'system',
    content: `You are the private Kramaniti Client Hub assistant. You help Kramaniti and its clients keep shared delivery clear.

Operating rules:
- Strategy before tools. Systems before scale. Content after clarity.
- Read only the workspace context supplied below. Never imply that you read file contents when only a repository index is present.
- Treat private project, task, note, and message context as confidential.
- Do not invent client claims, metrics, outcomes, deadlines, approvals, or people.
- Draft changes as actions. Never claim that a change was saved; the user must approve every action.
- Keep the response concise, practical, and business-first.
- When decomposing a task, create 3-6 ordered subtasks that include success criteria, inputs/dependencies, execution, human review, and handoff where useful.
- Do not create busywork. Every subtask must materially advance completion.

Return valid JSON only:
{
  "response": "short explanation",
  "actions": [
    {
      "type": "create_project | create_task | create_note | update_task | send_message",
      "summary": "what will change",
      "payload": {
        "title": "when relevant",
        "description": "when relevant",
        "projectId": "existing project id or null",
        "parentTaskId": "existing parent task id or null",
        "taskId": "existing task id for updates",
        "status": "todo | in_progress | waiting | review | done",
        "priority": "low | normal | high | urgent",
        "body": "note or message content",
        "visibility": "shared | internal"
      }
    }
  ]
}

Mode: ${body.mode ?? 'chat'}
Workspace context:
${workspaceContext}`,
  },
  ...history.slice(-10).map((message) => ({ role: message.role, content: asText(message.content, 1800) })),
  {
    role: 'user',
    content:
      body.mode === 'decompose_task'
        ? `Analyse and decompose this parent task. Keep every action as create_task and preserve parentTaskId ${body.task?.id ?? 'null'}: ${JSON.stringify(body.task ?? {})}`
        : asText(body.message, MAX_MESSAGE_LENGTH),
  },
];

export async function POST(request: Request) {
  try {
    const auth = await requireClientHubUser(request);
    if ('error' in auth) {
      return Response.json({ error: auth.error }, { status: auth.status });
    }

    const body = (await request.json()) as AssistantRequest;
    const workspaceId = asText(body.workspaceId, 80);
    const mode: AssistantMode = body.mode === 'decompose_task' ? 'decompose_task' : 'chat';
    const message = asText(body.message, MAX_MESSAGE_LENGTH);

    if (!workspaceId || (mode === 'chat' && !message) || (mode === 'decompose_task' && !body.task?.id)) {
      return Response.json({ error: 'Workspace and assistant input are required.' }, { status: 400 });
    }

    const { data: workspace, error: workspaceError } = await auth.userClient
      .from('workspaces')
      .select('*')
      .eq('id', workspaceId)
      .maybeSingle();

    if (workspaceError || !workspace) {
      return Response.json({ error: 'This workspace is not available to your account.' }, { status: 403 });
    }

    const [projectsResult, tasksResult, notesResult, messagesResult, repositoryResult, historyResult] = await Promise.all([
      auth.userClient.from('projects').select('*').eq('workspace_id', workspaceId).neq('status', 'archived').order('updated_at', { ascending: false }).limit(24),
      auth.userClient.from('tasks').select('*').eq('workspace_id', workspaceId).neq('status', 'archived').order('updated_at', { ascending: false }).limit(100),
      auth.userClient.from('notes').select('*').eq('workspace_id', workspaceId).order('updated_at', { ascending: false }).limit(30),
      auth.userClient.from('messages').select('*').eq('workspace_id', workspaceId).order('created_at', { ascending: false }).limit(30),
      auth.userClient.from('repository_items').select('*').eq('workspace_id', workspaceId).order('last_synced_at', { ascending: false }).limit(40),
      auth.userClient.from('assistant_messages').select('role, content').eq('workspace_id', workspaceId).order('created_at', { ascending: false }).limit(10),
    ]);

    const firstError = [projectsResult.error, tasksResult.error, notesResult.error, messagesResult.error, repositoryResult.error, historyResult.error].find(Boolean);
    if (firstError) {
      return Response.json({ error: 'The assistant could not read the current workspace.' }, { status: 500 });
    }

    const projects = projectsResult.data ?? [];
    const tasks = tasksResult.data ?? [];
    const notes = notesResult.data ?? [];
    const messages = messagesResult.data ?? [];
    const repositoryItems = repositoryResult.data ?? [];
    const history = [...(historyResult.data ?? [])].reverse();
    const selectedProjectId = asText(body.projectId, 80) || asText(body.task?.projectId, 80) || null;
    const selectedProject = projects.find((project) => project.id === selectedProjectId) ?? null;

    const workspaceContext = JSON.stringify(
      {
        workspace: {
          id: workspace.id,
          name: workspace.name,
          repositorySummary: workspace.repository_summary,
        },
        selectedProject,
        projects: projects.map((project) => ({
          id: project.id,
          title: project.title,
          description: project.description,
          status: project.status,
          dueDate: project.due_date,
          repositoryPath: project.repository_path,
        })),
        tasks: tasks.map((task) => ({
          id: task.id,
          projectId: task.project_id,
          parentTaskId: task.parent_task_id,
          title: task.title,
          description: task.description,
          status: task.status,
          priority: task.priority,
          dueDate: task.due_date,
        })),
        notes: notes.map((note) => ({
          title: note.title,
          body: note.body.slice(0, 1200),
          projectId: note.project_id,
          visibility: note.visibility,
        })),
        recentMessages: messages.map((item) => ({ body: item.body.slice(0, 900), createdAt: item.created_at })),
        repositoryIndex: repositoryItems.map((item) => ({
          title: item.title,
          path: item.repository_path,
          summary: item.summary,
          visibility: item.visibility,
          revision: item.source_hash,
        })),
      },
      null,
      2
    ).slice(0, 24000);

    let assistantPayload: AssistantPayload;
    let source: 'groq' | 'local' = 'local';

    if (!process.env.GROQ_API_KEY) {
      assistantPayload =
        mode === 'decompose_task'
          ? decomposeLocally(body)
          : buildLocalChatPayload(
              message,
              {
                projects: projects.length,
                openTasks: tasks.filter((task) => !['done', 'archived'].includes(task.status)).length,
                notes: notes.length,
                messages: messages.length,
                repositoryItems: repositoryItems.length,
              },
              selectedProjectId
            );
    } else {
      try {
        const groq = new Groq({ apiKey: process.env.GROQ_API_KEY, maxRetries: 1, timeout: 45_000 });
        const completion = await groq.chat.completions.create({
          model: MODEL_NAME,
          messages: buildModelMessages({ ...body, mode }, workspaceContext, history),
          temperature: 0.25,
          max_completion_tokens: 1200,
          top_p: 0.9,
          stream: false,
          response_format: { type: 'json_object' },
        });
        assistantPayload =
          parsePayload(completion.choices[0]?.message?.content ?? '') ??
          (mode === 'decompose_task'
            ? decomposeLocally(body)
            : buildLocalChatPayload(
                message,
                {
                  projects: projects.length,
                  openTasks: tasks.filter((task) => !['done', 'archived'].includes(task.status)).length,
                  notes: notes.length,
                  messages: messages.length,
                  repositoryItems: repositoryItems.length,
                },
                selectedProjectId
              ));
        source = 'groq';
      } catch (error) {
        console.error('Client Hub Groq assistant failed', error);
        assistantPayload =
          mode === 'decompose_task'
            ? decomposeLocally(body)
            : buildLocalChatPayload(
                message,
                {
                  projects: projects.length,
                  openTasks: tasks.filter((task) => !['done', 'archived'].includes(task.status)).length,
                  notes: notes.length,
                  messages: messages.length,
                  repositoryItems: repositoryItems.length,
                },
                selectedProjectId
              );
      }
    }

    const actions = sanitizeActions(assistantPayload, {
      projects,
      tasks,
      fallbackProjectId: selectedProjectId,
      fallbackParentTaskId: asText(body.task?.id, 80) || null,
      clientRole: auth.profile?.role ?? 'client',
    });

    const userContent = mode === 'decompose_task' ? `Plan task: ${asText(body.task?.title, 220)}` : message;
    const { error: userMessageError } = await auth.userClient.from('assistant_messages').insert({
      workspace_id: workspaceId,
      project_id: selectedProjectId,
      role: 'user',
      content: userContent,
      created_by: auth.user.id,
      metadata: { mode, source: 'user' },
    });
    if (userMessageError) throw userMessageError;

    const { error: assistantMessageError } = await auth.userClient.from('assistant_messages').insert({
      workspace_id: workspaceId,
      project_id: selectedProjectId,
      role: 'assistant',
      content: assistantPayload.response,
      created_by: auth.user.id,
      metadata: { mode, source, actionCount: actions.length },
    });
    if (assistantMessageError) throw assistantMessageError;

    let savedActions: ClientHubAssistantAction[] = [];
    if (actions.length) {
      const { data, error } = await auth.userClient
        .from('assistant_actions')
        .insert(
          actions.map((action) => ({
            workspace_id: workspaceId,
            project_id: asText(action.payload.projectId, 80) || selectedProjectId,
            requested_by: auth.user.id,
            action_type: action.type,
            summary: action.summary,
            payload: action.payload,
            status: 'pending' as const,
          }))
        )
        .select('*');
      if (error) throw error;
      savedActions = data ?? [];
    }

    return Response.json({
      response: assistantPayload.response,
      actions: savedActions,
      source,
      model: MODEL_NAME,
    });
  } catch (error) {
    console.error('Client Hub assistant route failed', error);
    return Response.json({ error: 'The Client Hub assistant could not complete that request.' }, { status: 500 });
  }
}
