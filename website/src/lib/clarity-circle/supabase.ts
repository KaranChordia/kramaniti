import { createClient, type SupabaseClient } from '@supabase/supabase-js';

export type ClarityCircleTrack = 'founder' | 'builder';

export type ClarityCircleProject = {
  id: string;
  user_id: string;
  folder_id: string | null;
  track: ClarityCircleTrack;
  title: string;
  context: string;
  project_instruction: string | null;
  audience: string | null;
  blocker: string | null;
  outcome: string | null;
  summary: string | null;
  questions: string[];
  actions: string[];
  status: 'active' | 'archived';
  created_at: string;
  updated_at: string;
};

export type ClarityCircleProjectTask = {
  id: string;
  project_id: string;
  user_id: string;
  title: string;
  detail: string | null;
  source: 'auto' | 'assistant' | 'user';
  status: 'open' | 'done' | 'archived';
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type ClarityCircleProjectFolder = {
  id: string;
  user_id: string;
  name: string;
  sort_order: number;
  status: 'active' | 'archived';
  created_at: string;
  updated_at: string;
};

export type ClarityCircleContextEntry = {
  id: string;
  project_id: string;
  user_id: string;
  entry_type: 'intent' | 'note' | 'digest' | 'brief' | 'engine_handoff';
  payload: Record<string, unknown>;
  created_at: string;
};

export type ClarityCircleAssistantMessage = {
  id: string;
  user_id: string;
  project_id: string | null;
  role: 'user' | 'assistant';
  content: string;
  metadata: Record<string, unknown>;
  created_at: string;
};

export type ClarityCircleAssistantMemory = {
  id: string;
  user_id: string;
  project_id: string | null;
  memory_type: 'insight' | 'preference' | 'project_signal' | 'boundary';
  title: string;
  content: string;
  source: 'assistant' | 'user';
  status: 'active' | 'archived';
  created_at: string;
  updated_at: string;
};

export type ClarityCircleProfile = {
  user_id: string;
  email: string | null;
  username: string | null;
  full_name: string | null;
  preferred_track: ClarityCircleTrack | null;
  created_at: string;
  updated_at: string;
};

type ClarityCircleDatabase = {
  clarity_circle: {
    Tables: {
      profiles: {
        Row: ClarityCircleProfile;
        Insert: {
          user_id: string;
          email?: string | null;
          username?: string | null;
          full_name?: string | null;
          preferred_track?: ClarityCircleTrack | null;
        };
        Update: Partial<Omit<ClarityCircleProfile, 'user_id' | 'created_at' | 'updated_at'>>;
      };
      projects: {
        Row: ClarityCircleProject;
        Insert: {
          user_id: string;
          folder_id?: string | null;
          track: ClarityCircleTrack;
          title: string;
          context: string;
          project_instruction?: string | null;
          audience?: string | null;
          blocker?: string | null;
          outcome?: string | null;
          summary?: string | null;
          questions?: string[];
          actions?: string[];
          status?: 'active' | 'archived';
        };
        Update: Partial<Omit<ClarityCircleProject, 'id' | 'user_id' | 'created_at' | 'updated_at'>>;
      };
      project_tasks: {
        Row: ClarityCircleProjectTask;
        Insert: {
          project_id: string;
          user_id: string;
          title: string;
          detail?: string | null;
          source?: ClarityCircleProjectTask['source'];
          status?: ClarityCircleProjectTask['status'];
          sort_order?: number;
        };
        Update: Partial<
          Omit<ClarityCircleProjectTask, 'id' | 'project_id' | 'user_id' | 'created_at' | 'updated_at'>
        >;
      };
      project_folders: {
        Row: ClarityCircleProjectFolder;
        Insert: {
          user_id: string;
          name: string;
          sort_order?: number;
          status?: ClarityCircleProjectFolder['status'];
        };
        Update: Partial<Omit<ClarityCircleProjectFolder, 'id' | 'user_id' | 'created_at' | 'updated_at'>>;
      };
      context_entries: {
        Row: ClarityCircleContextEntry;
        Insert: {
          project_id: string;
          user_id: string;
          entry_type: ClarityCircleContextEntry['entry_type'];
          payload?: Record<string, unknown>;
        };
        Update: Partial<Omit<ClarityCircleContextEntry, 'id' | 'project_id' | 'user_id' | 'created_at'>>;
      };
      assistant_messages: {
        Row: ClarityCircleAssistantMessage;
        Insert: {
          user_id: string;
          project_id?: string | null;
          role: ClarityCircleAssistantMessage['role'];
          content: string;
          metadata?: Record<string, unknown>;
        };
        Update: never;
      };
      assistant_memories: {
        Row: ClarityCircleAssistantMemory;
        Insert: {
          user_id: string;
          project_id?: string | null;
          memory_type?: ClarityCircleAssistantMemory['memory_type'];
          title: string;
          content: string;
          source?: ClarityCircleAssistantMemory['source'];
          status?: ClarityCircleAssistantMemory['status'];
        };
        Update: Partial<
          Omit<ClarityCircleAssistantMemory, 'id' | 'user_id' | 'created_at' | 'updated_at'>
        >;
      };
    };
    Functions: {
      resolve_login_email: {
        Args: { login: string };
        Returns: string | null;
      };
    };
  };
};

let browserClient: SupabaseClient<ClarityCircleDatabase> | null = null;

export const isClarityCircleSupabaseConfigured = () =>
  Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export const getClarityCircleSupabase = () => {
  if (!isClarityCircleSupabaseConfigured()) return null;

  if (!browserClient) {
    browserClient = createClient<ClarityCircleDatabase>(
      process.env.NEXT_PUBLIC_SUPABASE_URL as string,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string,
      {
        db: { schema: 'clarity_circle' },
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
