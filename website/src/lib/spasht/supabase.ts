import { createClient, type SupabaseClient } from '@supabase/supabase-js';

export type SpashtTrack = 'founder' | 'builder';

export type SpashtProject = {
  id: string;
  user_id: string;
  folder_id: string | null;
  track: SpashtTrack;
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

export type SpashtProjectTask = {
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

export type SpashtProjectReport = {
  id: string;
  project_id: string;
  user_id: string;
  report_type: 'strategy' | 'systems' | 'presence';
  title: string;
  content: string;
  source: 'clarity_engine';
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
};

export type SpashtProjectFolder = {
  id: string;
  user_id: string;
  name: string;
  sort_order: number;
  status: 'active' | 'archived';
  created_at: string;
  updated_at: string;
};

export type SpashtContextEntry = {
  id: string;
  project_id: string;
  user_id: string;
  entry_type: 'intent' | 'note' | 'digest' | 'brief' | 'engine_handoff';
  payload: Record<string, unknown>;
  created_at: string;
};

export type SpashtAssistantMessage = {
  id: string;
  user_id: string;
  project_id: string | null;
  role: 'user' | 'assistant';
  content: string;
  metadata: Record<string, unknown>;
  created_at: string;
};

export type SpashtAssistantMemory = {
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

export type SpashtProfile = {
  user_id: string;
  email: string | null;
  username: string | null;
  full_name: string | null;
  preferred_track: SpashtTrack | null;
  assistant_settings: Record<string, unknown>;
  created_at: string;
  updated_at: string;
};

export type SpashtProductEventName =
  | 'page_view'
  | 'return_visit'
  | 'path_chosen'
  | 'context_started'
  | 'context_completed'
  | 'assistant_first_message'
  | 'clarity_brief_produced'
  | 'project_created'
  | 'task_drafted'
  | 'task_approved'
  | 'community_post'
  | 'response_saved'
  | 'loop_completed';

export type SpashtProductEvent = {
  id: string;
  user_id: string;
  event_name: SpashtProductEventName;
  metadata: Record<string, unknown>;
  created_at: string;
};

export type SpashtDatabase = {
  spasht: {
    Tables: {
      profiles: {
        Row: SpashtProfile;
        Insert: {
          user_id: string;
          email?: string | null;
          username?: string | null;
          full_name?: string | null;
          preferred_track?: SpashtTrack | null;
          assistant_settings?: Record<string, unknown>;
        };
        Update: Partial<Omit<SpashtProfile, 'user_id' | 'created_at' | 'updated_at'>>;
      };
      projects: {
        Row: SpashtProject;
        Insert: {
          user_id: string;
          folder_id?: string | null;
          track: SpashtTrack;
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
        Update: Partial<Omit<SpashtProject, 'id' | 'user_id' | 'created_at' | 'updated_at'>>;
      };
      project_tasks: {
        Row: SpashtProjectTask;
        Insert: {
          project_id: string;
          user_id: string;
          title: string;
          detail?: string | null;
          source?: SpashtProjectTask['source'];
          status?: SpashtProjectTask['status'];
          sort_order?: number;
        };
        Update: Partial<
          Omit<SpashtProjectTask, 'id' | 'project_id' | 'user_id' | 'created_at' | 'updated_at'>
        >;
      };
      project_reports: {
        Row: SpashtProjectReport;
        Insert: {
          project_id: string;
          user_id: string;
          report_type: SpashtProjectReport['report_type'];
          title: string;
          content: string;
          source?: SpashtProjectReport['source'];
          metadata?: Record<string, unknown>;
        };
        Update: Partial<
          Omit<SpashtProjectReport, 'id' | 'project_id' | 'user_id' | 'created_at' | 'updated_at'>
        >;
      };
      project_folders: {
        Row: SpashtProjectFolder;
        Insert: {
          user_id: string;
          name: string;
          sort_order?: number;
          status?: SpashtProjectFolder['status'];
        };
        Update: Partial<Omit<SpashtProjectFolder, 'id' | 'user_id' | 'created_at' | 'updated_at'>>;
      };
      context_entries: {
        Row: SpashtContextEntry;
        Insert: {
          project_id: string;
          user_id: string;
          entry_type: SpashtContextEntry['entry_type'];
          payload?: Record<string, unknown>;
        };
        Update: Partial<Omit<SpashtContextEntry, 'id' | 'project_id' | 'user_id' | 'created_at'>>;
      };
      assistant_messages: {
        Row: SpashtAssistantMessage;
        Insert: {
          id?: string;
          user_id: string;
          project_id?: string | null;
          role: SpashtAssistantMessage['role'];
          content: string;
          metadata?: Record<string, unknown>;
        };
        Update: never;
      };
      assistant_memories: {
        Row: SpashtAssistantMemory;
        Insert: {
          user_id: string;
          project_id?: string | null;
          memory_type?: SpashtAssistantMemory['memory_type'];
          title: string;
          content: string;
          source?: SpashtAssistantMemory['source'];
          status?: SpashtAssistantMemory['status'];
        };
        Update: Partial<
          Omit<SpashtAssistantMemory, 'id' | 'user_id' | 'created_at' | 'updated_at'>
        >;
      };
      product_events: {
        Row: SpashtProductEvent;
        Insert: {
          user_id: string;
          event_name: SpashtProductEventName;
          metadata?: Record<string, unknown>;
        };
        Update: never;
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

let browserClient: SupabaseClient<SpashtDatabase> | null = null;

export const getSpashtPublicKey = () =>
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

export const isSpashtSupabaseConfigured = () =>
  Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && getSpashtPublicKey());

export const getSpashtSupabase = () => {
  if (!isSpashtSupabaseConfigured()) return null;

  if (!browserClient) {
    browserClient = createClient<SpashtDatabase>(
      process.env.NEXT_PUBLIC_SUPABASE_URL as string,
      getSpashtPublicKey(),
      {
        db: { schema: 'spasht' },
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
