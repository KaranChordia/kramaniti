import type { ClaritySquareProject, ClaritySquareProjectTask, ClaritySquareProjectFolder, ClaritySquareAssistantMemory } from './supabase';

export const emptyClarityIntent = () => ({ headline: '', context: '', audience: '', blocker: '', outcome: '' });

export type RevisionWorkspace = {
  projects: ClaritySquareProject[];
  folders: ClaritySquareProjectFolder[];
  tasks: ClaritySquareProjectTask[];
  memories: ClaritySquareAssistantMemory[];
};

// A change detector, not an authorization token. Ownership is checked separately.
export const workspaceRevision = (workspace: RevisionWorkspace) => {
  const rows = [workspace.projects.filter((project) => project.status !== 'archived'), workspace.folders, workspace.tasks, workspace.memories]
    .map((items) => items.map((item) => `${item.id}:${item.updated_at}`).sort().join('|'))
    .join(';');
  let hash = 2166136261;
  for (let i = 0; i < rows.length; i++) hash = Math.imul(hash ^ rows.charCodeAt(i), 16777619);
  return (hash >>> 0).toString(16);
};

export const taskSourceLabel = (source: ClaritySquareProjectTask['source']) =>
  ({ auto: 'Starter suggestion', assistant: 'Assistant draft, approved by you', user: 'Added by you' })[source];

// The message table's primary key provides an atomic, immutable claim across tabs.
export const actionClaimId = async (messageId: string) => {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(`clarity-square:action-claim:${messageId}`));
  const bytes = new Uint8Array(digest).slice(0, 16);
  bytes[6] = (bytes[6] & 15) | 128;
  bytes[8] = (bytes[8] & 63) | 128;
  const hex = Array.from(bytes, (value) => value.toString(16).padStart(2, '0')).join('');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
};
