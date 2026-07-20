import { createClient, type SupabaseClient } from '@supabase/supabase-js';

export type ClientHubRole = 'owner' | 'collaborator' | 'client';
export type ClientHubWorkspaceStatus = 'active' | 'paused' | 'archived';
export type ClientHubProjectStatus = 'planned' | 'active' | 'blocked' | 'review' | 'done' | 'archived';
export type ClientHubTaskStatus = 'todo' | 'in_progress' | 'waiting' | 'review' | 'done' | 'archived';
export type ClientHubTaskPriority = 'low' | 'normal' | 'high' | 'urgent';
export type ClientHubSource = 'manual' | 'assistant' | 'repository';
export type ClientHubVisibility = 'shared' | 'internal';
export type ClientHubAssistantActionType =
  | 'create_project'
  | 'create_task'
  | 'create_note'
  | 'update_task'
  | 'send_message';
export type ClientHubAssistantActionStatus = 'pending' | 'applied' | 'declined' | 'failed';
export type KramanitiHqKind = 'company' | 'client' | 'relationship';
export type KramanitiHqStage =
  | 'internal_build'
  | 'relationship'
  | 'discovery'
  | 'proposal'
  | 'commercial_sent'
  | 'approval'
  | 'delivery'
  | 'paused'
  | 'closed';
export type KramanitiHqHealth = 'moving' | 'steady' | 'waiting' | 'attention';
export type KramanitiHqActionStatus = 'todo' | 'in_progress' | 'waiting' | 'done' | 'archived';

export type ClientHubProfile = {
  user_id: string;
  username: string;
  display_name: string;
  role: ClientHubRole;
  must_change_password: boolean;
  created_at: string;
  updated_at: string;
};

export type ClientHubWorkspace = {
  id: string;
  slug: string;
  name: string;
  status: ClientHubWorkspaceStatus;
  repository_summary: Record<string, unknown>;
  created_by: string;
  created_at: string;
  updated_at: string;
};

export type ClientHubWorkspaceMember = {
  workspace_id: string;
  user_id: string;
  role: ClientHubRole;
  created_at: string;
};

export type ClientHubProject = {
  id: string;
  workspace_id: string;
  title: string;
  description: string;
  status: ClientHubProjectStatus;
  source: ClientHubSource;
  repository_path: string | null;
  owner_id: string | null;
  created_by: string;
  start_date: string | null;
  due_date: string | null;
  created_at: string;
  updated_at: string;
};

export type ClientHubTask = {
  id: string;
  workspace_id: string;
  project_id: string | null;
  parent_task_id: string | null;
  title: string;
  description: string;
  status: ClientHubTaskStatus;
  priority: ClientHubTaskPriority;
  source: ClientHubSource;
  assignee_id: string | null;
  created_by: string;
  due_date: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type ClientHubNote = {
  id: string;
  workspace_id: string;
  project_id: string | null;
  title: string;
  body: string;
  visibility: ClientHubVisibility;
  source: ClientHubSource;
  created_by: string;
  created_at: string;
  updated_at: string;
};

export type ClientHubMessage = {
  id: string;
  workspace_id: string;
  project_id: string | null;
  body: string;
  created_by: string;
  created_at: string;
};

export type ClientHubAssistantMessage = {
  id: string;
  workspace_id: string;
  project_id: string | null;
  role: 'user' | 'assistant';
  content: string;
  created_by: string;
  metadata: Record<string, unknown>;
  created_at: string;
};

export type ClientHubAssistantAction = {
  id: string;
  workspace_id: string;
  project_id: string | null;
  requested_by: string;
  reviewed_by: string | null;
  action_type: ClientHubAssistantActionType;
  summary: string;
  payload: Record<string, unknown>;
  status: ClientHubAssistantActionStatus;
  created_at: string;
  updated_at: string;
};

export type ClientHubRepositoryItem = {
  id: string;
  workspace_id: string;
  source_key: string;
  repository_label: string;
  repository_path: string;
  item_type: 'repository' | 'directory' | 'project';
  title: string;
  summary: string;
  visibility: ClientHubVisibility;
  source_hash: string | null;
  metadata: Record<string, unknown>;
  last_synced_at: string;
  created_at: string;
  updated_at: string;
};

export type KramanitiHqPortfolioItem = {
  id: string;
  workspace_id: string;
  owner_id: string;
  kind: KramanitiHqKind;
  stage: KramanitiHqStage;
  health: KramanitiHqHealth;
  priority: number;
  summary: string;
  next_action: string;
  waiting_on: string;
  primary_contact: string;
  last_contact_at: string | null;
  next_follow_up_at: string | null;
  commercial_value: string;
  repository_key: string;
  repository_snapshot: Record<string, unknown>;
  created_at: string;
  updated_at: string;
};

export type KramanitiHqAction = {
  id: string;
  portfolio_item_id: string;
  owner_id: string;
  title: string;
  notes: string;
  status: KramanitiHqActionStatus;
  priority: ClientHubTaskPriority;
  due_at: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
};

export type ClientHubDatabase = {
  kramaniti_hub: {
    Tables: {
      profiles: {
        Row: ClientHubProfile;
        Insert: {
          user_id: string;
          username: string;
          display_name: string;
          role?: ClientHubRole;
          must_change_password?: boolean;
        };
        Update: Partial<Pick<ClientHubProfile, 'display_name' | 'must_change_password'>>;
        Relationships: [];
      };
      workspaces: {
        Row: ClientHubWorkspace;
        Insert: {
          slug: string;
          name: string;
          status?: ClientHubWorkspaceStatus;
          repository_summary?: Record<string, unknown>;
          created_by: string;
        };
        Update: Partial<Pick<ClientHubWorkspace, 'name' | 'status' | 'repository_summary'>>;
        Relationships: [];
      };
      workspace_members: {
        Row: ClientHubWorkspaceMember;
        Insert: {
          workspace_id: string;
          user_id: string;
          role?: ClientHubRole;
        };
        Update: Pick<ClientHubWorkspaceMember, 'role'>;
        Relationships: [];
      };
      projects: {
        Row: ClientHubProject;
        Insert: {
          workspace_id: string;
          title: string;
          description?: string;
          status?: ClientHubProjectStatus;
          source?: ClientHubSource;
          repository_path?: string | null;
          owner_id?: string | null;
          created_by: string;
          start_date?: string | null;
          due_date?: string | null;
        };
        Update: Partial<
          Pick<
            ClientHubProject,
            'title' | 'description' | 'status' | 'repository_path' | 'owner_id' | 'start_date' | 'due_date'
          >
        >;
        Relationships: [];
      };
      tasks: {
        Row: ClientHubTask;
        Insert: {
          workspace_id: string;
          project_id?: string | null;
          parent_task_id?: string | null;
          title: string;
          description?: string;
          status?: ClientHubTaskStatus;
          priority?: ClientHubTaskPriority;
          source?: ClientHubSource;
          assignee_id?: string | null;
          created_by: string;
          due_date?: string | null;
          sort_order?: number;
        };
        Update: Partial<
          Pick<
            ClientHubTask,
            | 'project_id'
            | 'parent_task_id'
            | 'title'
            | 'description'
            | 'status'
            | 'priority'
            | 'assignee_id'
            | 'due_date'
            | 'sort_order'
          >
        >;
        Relationships: [];
      };
      notes: {
        Row: ClientHubNote;
        Insert: {
          workspace_id: string;
          project_id?: string | null;
          title: string;
          body: string;
          visibility?: ClientHubVisibility;
          source?: ClientHubSource;
          created_by: string;
        };
        Update: Partial<Pick<ClientHubNote, 'project_id' | 'title' | 'body' | 'visibility'>>;
        Relationships: [];
      };
      messages: {
        Row: ClientHubMessage;
        Insert: {
          workspace_id: string;
          project_id?: string | null;
          body: string;
          created_by: string;
        };
        Update: never;
        Relationships: [];
      };
      assistant_messages: {
        Row: ClientHubAssistantMessage;
        Insert: {
          workspace_id: string;
          project_id?: string | null;
          role: 'user' | 'assistant';
          content: string;
          created_by: string;
          metadata?: Record<string, unknown>;
        };
        Update: never;
        Relationships: [];
      };
      assistant_actions: {
        Row: ClientHubAssistantAction;
        Insert: {
          workspace_id: string;
          project_id?: string | null;
          requested_by: string;
          action_type: ClientHubAssistantActionType;
          summary: string;
          payload?: Record<string, unknown>;
          status?: ClientHubAssistantActionStatus;
        };
        Update: Partial<Pick<ClientHubAssistantAction, 'status' | 'reviewed_by'>>;
        Relationships: [];
      };
      repository_items: {
        Row: ClientHubRepositoryItem;
        Insert: {
          workspace_id: string;
          source_key: string;
          repository_label: string;
          repository_path: string;
          item_type: ClientHubRepositoryItem['item_type'];
          title: string;
          summary?: string;
          visibility?: ClientHubVisibility;
          source_hash?: string | null;
          metadata?: Record<string, unknown>;
          last_synced_at?: string;
        };
        Update: Partial<
          Pick<
            ClientHubRepositoryItem,
            | 'repository_label'
            | 'repository_path'
            | 'item_type'
            | 'title'
            | 'summary'
            | 'visibility'
            | 'source_hash'
            | 'metadata'
            | 'last_synced_at'
          >
        >;
        Relationships: [];
      };
      hq_portfolio_items: {
        Row: KramanitiHqPortfolioItem;
        Insert: {
          workspace_id: string;
          owner_id: string;
          kind?: KramanitiHqKind;
          stage?: KramanitiHqStage;
          health?: KramanitiHqHealth;
          priority?: number;
          summary?: string;
          next_action?: string;
          waiting_on?: string;
          primary_contact?: string;
          last_contact_at?: string | null;
          next_follow_up_at?: string | null;
          commercial_value?: string;
          repository_key?: string;
          repository_snapshot?: Record<string, unknown>;
        };
        Update: Partial<
          Pick<
            KramanitiHqPortfolioItem,
            | 'kind'
            | 'stage'
            | 'health'
            | 'priority'
            | 'summary'
            | 'next_action'
            | 'waiting_on'
            | 'primary_contact'
            | 'last_contact_at'
            | 'next_follow_up_at'
            | 'commercial_value'
            | 'repository_key'
            | 'repository_snapshot'
          >
        >;
        Relationships: [];
      };
      hq_actions: {
        Row: KramanitiHqAction;
        Insert: {
          portfolio_item_id: string;
          owner_id: string;
          title: string;
          notes?: string;
          status?: KramanitiHqActionStatus;
          priority?: ClientHubTaskPriority;
          due_at?: string | null;
          completed_at?: string | null;
        };
        Update: Partial<
          Pick<KramanitiHqAction, 'title' | 'notes' | 'status' | 'priority' | 'due_at' | 'completed_at'>
        >;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
};

let browserClient: SupabaseClient<ClientHubDatabase> | null = null;

export const getClientHubPublicKey = () =>
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

export const isClientHubSupabaseConfigured = () =>
  Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && getClientHubPublicKey());

export const getClientHubSupabase = () => {
  if (!isClientHubSupabaseConfigured()) return null;

  if (!browserClient) {
    browserClient = createClient<ClientHubDatabase>(
      process.env.NEXT_PUBLIC_SUPABASE_URL as string,
      getClientHubPublicKey(),
      {
        db: { schema: 'kramaniti_hub' },
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
        },
      }
    );
  }

  return browserClient;
};

export const normalizeClientHubLogin = (login: string) => {
  const normalized = login.trim().toLowerCase();
  if (normalized.includes('@')) return normalized;
  return `${normalized}@client-hub.kramaniti.com`;
};
