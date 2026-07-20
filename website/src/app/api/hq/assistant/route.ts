import Groq from 'groq-sdk';
import type { ChatCompletionMessageParam } from 'groq-sdk/resources/chat/completions';
import { requireClientHubOwner } from '@/lib/client-hub/server';
import type {
  ClientHubTask,
  ClientHubTaskPriority,
  ClientHubTaskStatus,
} from '@/lib/client-hub/supabase';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type AssistantRequest = {
  workspaceId?: string;
  message?: string;
};

type TaskOperation = {
  type: 'create_task' | 'update_task';
  summary: string;
  taskId?: string | null;
  title?: string;
  description?: string;
  priority?: ClientHubTaskPriority;
  status?: ClientHubTaskStatus;
  dueDate?: string | null;
  projectId?: string | null;
};

type AssistantPayload = {
  response: string;
  operations: TaskOperation[];
};

const MODEL_NAME = process.env.GROQ_CHAT_MODEL || 'openai/gpt-oss-120b';
const MAX_MESSAGE_LENGTH = 2400;
const MAX_RESPONSE_LENGTH = 2400;
const MAX_OPERATIONS = 8;

const asText = (value: unknown, max = 1000) =>
  (typeof value === 'string' ? value : '').replace(/\s+/g, ' ').trim().slice(0, max);

const isRecord = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === 'object' && !Array.isArray(value);

const validPriority = (value: unknown): ClientHubTaskPriority | null => {
  const priority = asText(value, 16) as ClientHubTaskPriority;
  return ['low', 'normal', 'high', 'urgent'].includes(priority) ? priority : null;
};

const validStatus = (value: unknown): ClientHubTaskStatus | null => {
  const status = asText(value, 24) as ClientHubTaskStatus;
  return ['todo', 'in_progress', 'waiting', 'review', 'done', 'archived'].includes(status) ? status : null;
};

const validDate = (value: unknown) => {
  if (value === null) return null;
  const date = asText(value, 10);
  return /^\d{4}-\d{2}-\d{2}$/.test(date) ? date : undefined;
};

const parsePayload = (content: string): AssistantPayload | null => {
  try {
    const fenced = content.match(/```(?:json)?\s*([\s\S]*?)```/i)?.[1];
    const raw = fenced ?? content.slice(content.indexOf('{'), content.lastIndexOf('}') + 1);
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    const operations = Array.isArray(parsed.operations) ? parsed.operations : [];
    return {
      response: asText(parsed.response, MAX_RESPONSE_LENGTH) || 'I reviewed the selected task list.',
      operations: operations
        .filter(isRecord)
        .map((operation): TaskOperation | null => {
          const type = asText(operation.type, 24);
          if (type !== 'create_task' && type !== 'update_task') return null;
          return {
            type,
            summary: asText(operation.summary, 280),
            taskId: asText(operation.taskId, 80) || null,
            title: asText(operation.title, 220),
            description: asText(operation.description, 6000),
            priority: validPriority(operation.priority) ?? undefined,
            status: validStatus(operation.status) ?? undefined,
            dueDate: validDate(operation.dueDate),
            projectId: asText(operation.projectId, 80) || null,
          };
        })
        .filter((operation): operation is TaskOperation => Boolean(operation))
        .slice(0, MAX_OPERATIONS),
    };
  } catch {
    return null;
  }
};

const buildLocalFallback = (message: string, tasks: ClientHubTask[]): AssistantPayload => {
  const createMatch = message.match(/(?:create|add|make)\s+(?:a\s+)?(?:task|todo)(?:\s+(?:to|for|called))?\s*[:\-]?\s*(.+)/i);
  if (createMatch?.[1]) {
    const title = asText(createMatch[1], 220);
    return {
      response: `Created “${title}”.`,
      operations: [{ type: 'create_task', title, summary: `Create task: ${title}`, priority: 'normal', status: 'todo' }],
    };
  }

  const statusMatch = message.match(/\b(complete|finish|reopen|start)\b\s+(?:the\s+)?(?:task\s+)?[“"']?(.+?)[”"']?\s*$/i);
  if (statusMatch?.[2]) {
    const query = asText(statusMatch[2], 220).toLowerCase();
    const matches = tasks.filter((task) => task.title.toLowerCase().includes(query));
    if (matches.length === 1) {
      const status: ClientHubTaskStatus = ['complete', 'finish'].includes(statusMatch[1].toLowerCase())
        ? 'done'
        : statusMatch[1].toLowerCase() === 'start' ? 'in_progress' : 'todo';
      return {
        response: `${status === 'done' ? 'Completed' : status === 'in_progress' ? 'Started' : 'Reopened'} “${matches[0].title}”.`,
        operations: [{ type: 'update_task', taskId: matches[0].id, status, summary: `Set ${matches[0].title} to ${status}` }],
      };
    }
  }

  return {
    response: 'I could not safely identify one exact task change. Please name the task and the action—for example, “Complete the website review task.”',
    operations: [],
  };
};

const buildMessages = (
  message: string,
  workspaceName: string,
  tasks: ClientHubTask[],
  projects: Array<{ id: string; title: string }>,
  history: Array<{ role: 'user' | 'assistant'; content: string }>
): ChatCompletionMessageParam[] => [
  {
    role: 'system',
    content: `You are the private Kramaniti HQ task assistant for the selected workspace “${workspaceName}”.

You may manage only the tasks supplied in the workspace context. Your available operations are:
- create_task: create one new task in this workspace.
- update_task: modify an existing task, including title, description, priority, dueDate, projectId, or status.

Status meanings: todo, in_progress, waiting, review, done, archived.

Safety and behaviour rules:
- Execute clear user intent. Do not merely propose a change when the instruction is unambiguous.
- Never invent a taskId or projectId. Copy IDs exactly from the supplied context.
- If a task name matches more than one task, ask one short clarifying question and return no operations.
- If the user asks a question, answer from the supplied task list and return no operations unless they also request a change.
- Never access or imply access to another workspace.
- Do not create busywork, messages, notes, projects, repository changes, financial actions, or client communications.
- Archive is the reversible removal action; never claim a task was permanently deleted.
- Resolve relative dates using today in Asia/Kolkata: ${new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date())}.
- Keep responses concise and confirm exactly what changed.

Return valid JSON only:
{
  "response": "short natural-language reply",
  "operations": [
    {
      "type": "create_task | update_task",
      "summary": "short audit summary",
      "taskId": "required for update_task",
      "title": "new or modified title when relevant",
      "description": "when relevant",
      "priority": "low | normal | high | urgent",
      "status": "todo | in_progress | waiting | review | done | archived",
      "dueDate": "YYYY-MM-DD or null when relevant",
      "projectId": "existing project id or null when relevant"
    }
  ]
}

Workspace context:
${JSON.stringify({
  workspace: workspaceName,
  projects,
  tasks: tasks.map((task) => ({
    id: task.id,
    projectId: task.project_id,
    title: task.title,
    description: task.description,
    status: task.status,
    priority: task.priority,
    dueDate: task.due_date,
  })),
})}`,
  },
  ...history.slice(-8).map((item) => ({ role: item.role, content: asText(item.content, 1400) })),
  { role: 'user', content: message },
];

export async function POST(request: Request) {
  try {
    const auth = await requireClientHubOwner(request);
    if ('error' in auth) return Response.json({ error: auth.error }, { status: auth.status });

    const body = (await request.json()) as AssistantRequest;
    const workspaceId = asText(body.workspaceId, 80);
    const message = asText(body.message, MAX_MESSAGE_LENGTH);
    if (!workspaceId || !message) {
      return Response.json({ error: 'Select one workspace and enter a task request.' }, { status: 400 });
    }

    const [workspaceResult, projectsResult, tasksResult, historyResult] = await Promise.all([
      auth.userClient.from('workspaces').select('*').eq('id', workspaceId).maybeSingle(),
      auth.userClient.from('projects').select('id, title').eq('workspace_id', workspaceId).neq('status', 'archived').limit(40),
      auth.userClient.from('tasks').select('*').eq('workspace_id', workspaceId).neq('status', 'archived').order('updated_at', { ascending: false }).limit(160),
      auth.userClient.from('assistant_messages').select('role, content').eq('workspace_id', workspaceId).order('created_at', { ascending: false }).limit(8),
    ]);

    const firstError = [workspaceResult.error, projectsResult.error, tasksResult.error, historyResult.error].find(Boolean);
    if (firstError || !workspaceResult.data) {
      return Response.json({ error: 'The selected workspace is not available.' }, { status: 403 });
    }

    const workspace = workspaceResult.data;
    const projects = projectsResult.data ?? [];
    const tasks = tasksResult.data ?? [];
    const taskMap = new Map(tasks.map((task) => [task.id, task]));
    const projectIds = new Set(projects.map((project) => project.id));
    const history = [...(historyResult.data ?? [])].reverse();

    let payload: AssistantPayload;
    let source: 'groq' | 'local' = 'local';
    if (process.env.GROQ_API_KEY) {
      try {
        const groq = new Groq({ apiKey: process.env.GROQ_API_KEY, maxRetries: 1, timeout: 45_000 });
        const completion = await groq.chat.completions.create({
          model: MODEL_NAME,
          messages: buildMessages(message, workspace.name, tasks, projects, history),
          temperature: 0.15,
          max_completion_tokens: 1400,
          top_p: 0.9,
          stream: false,
          response_format: { type: 'json_object' },
        });
        payload = parsePayload(completion.choices[0]?.message?.content ?? '') ?? buildLocalFallback(message, tasks);
        source = 'groq';
      } catch (error) {
        console.error('HQ task assistant model call failed', error);
        payload = buildLocalFallback(message, tasks);
      }
    } else {
      payload = buildLocalFallback(message, tasks);
    }

    const applied: Array<{ type: TaskOperation['type']; task: ClientHubTask; summary: string }> = [];
    for (const operation of payload.operations) {
      if (operation.type === 'create_task') {
        const title = asText(operation.title, 220);
        if (!title) continue;
        const projectId = operation.projectId && projectIds.has(operation.projectId) ? operation.projectId : null;
        const { data, error } = await auth.userClient.from('tasks').insert({
          workspace_id: workspaceId,
          project_id: projectId,
          title,
          description: asText(operation.description, 6000),
          priority: operation.priority ?? 'normal',
          status: operation.status ?? 'todo',
          due_date: operation.dueDate ?? null,
          source: 'assistant',
          created_by: auth.user.id,
        }).select('*').single();
        if (error || !data) throw error ?? new Error('Task creation did not return a row.');
        applied.push({ type: operation.type, task: data, summary: operation.summary || `Created task: ${title}` });
        continue;
      }

      const taskId = asText(operation.taskId, 80);
      const currentTask = taskMap.get(taskId);
      if (!currentTask) continue;
      const update: Partial<Pick<ClientHubTask, 'title' | 'description' | 'priority' | 'status' | 'due_date' | 'project_id'>> = {};
      if (operation.title) update.title = asText(operation.title, 220);
      if (operation.description !== undefined) update.description = asText(operation.description, 6000);
      if (operation.priority) update.priority = operation.priority;
      if (operation.status) update.status = operation.status;
      if (operation.dueDate !== undefined) update.due_date = operation.dueDate;
      if (operation.projectId !== undefined) update.project_id = operation.projectId && projectIds.has(operation.projectId) ? operation.projectId : null;
      if (!Object.keys(update).length) continue;

      const { data, error } = await auth.userClient.from('tasks').update(update).eq('id', taskId).eq('workspace_id', workspaceId).select('*').single();
      if (error || !data) throw error ?? new Error('Task update did not return a row.');
      applied.push({ type: operation.type, task: data, summary: operation.summary || `Updated task: ${data.title}` });
    }

    const { error: userMessageError } = await auth.userClient.from('assistant_messages').insert({
      workspace_id: workspaceId,
      role: 'user',
      content: message,
      created_by: auth.user.id,
      metadata: { surface: 'hq', source: 'user' },
    });
    if (userMessageError) throw userMessageError;

    const { error: assistantMessageError } = await auth.userClient.from('assistant_messages').insert({
      workspace_id: workspaceId,
      role: 'assistant',
      content: payload.response,
      created_by: auth.user.id,
      metadata: { surface: 'hq', source, appliedCount: applied.length },
    });
    if (assistantMessageError) throw assistantMessageError;

    if (applied.length) {
      const { data: auditRows, error: auditError } = await auth.userClient.from('assistant_actions').insert(
        applied.map((item) => ({
          workspace_id: workspaceId,
          project_id: item.task.project_id,
          requested_by: auth.user.id,
          action_type: item.type,
          summary: item.summary,
          payload: {
            taskId: item.task.id,
            title: item.task.title,
            status: item.task.status,
            priority: item.task.priority,
            dueDate: item.task.due_date,
          },
          status: 'pending' as const,
        }))
      ).select('id');
      if (auditError) throw auditError;

      const auditIds = (auditRows ?? []).map((item) => item.id);
      if (auditIds.length) {
        const { error: auditUpdateError } = await auth.userClient.from('assistant_actions').update({
          status: 'applied',
          reviewed_by: auth.user.id,
        }).in('id', auditIds);
        if (auditUpdateError) throw auditUpdateError;
      }
    }

    return Response.json({
      response: payload.response,
      applied: applied.map((item) => ({ type: item.type, summary: item.summary, task: item.task })),
      source,
      model: MODEL_NAME,
    });
  } catch (error) {
    console.error('HQ task assistant route failed', error);
    return Response.json({ error: 'The HQ task assistant could not complete that request.' }, { status: 500 });
  }
}
