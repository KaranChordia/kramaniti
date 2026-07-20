import { createClient, type SupabaseClient } from '@supabase/supabase-js';

export type ClaritySquareTrack = 'founder' | 'builder';

export type ClaritySquareProject = {
  id: string;
  user_id: string;
  folder_id: string | null;
  track: ClaritySquareTrack;
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

export type ClaritySquareProjectTask = {
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

export type ClaritySquareProjectReport = {
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

export type ClaritySquareProjectFolder = {
  id: string;
  user_id: string;
  name: string;
  sort_order: number;
  status: 'active' | 'archived';
  created_at: string;
  updated_at: string;
};

export type ClaritySquareContextEntry = {
  id: string;
  project_id: string;
  user_id: string;
  entry_type: 'intent' | 'note' | 'digest' | 'brief' | 'engine_handoff';
  payload: Record<string, unknown>;
  created_at: string;
};

export type ClaritySquareAssistantMessage = {
  id: string;
  user_id: string;
  project_id: string | null;
  role: 'user' | 'assistant';
  content: string;
  metadata: Record<string, unknown>;
  created_at: string;
};

export type ClaritySquareAssistantMemory = {
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

export type ClaritySquareProfile = {
  user_id: string;
  email: string | null;
  username: string | null;
  full_name: string | null;
  preferred_track: ClaritySquareTrack | null;
  assistant_settings: Record<string, unknown>;
  created_at: string;
  updated_at: string;
};

export type ClaritySquareProductEventName =
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
  | 'square_post'
  | 'response_saved'
  | 'loop_completed';

export type ClaritySquareProductEvent = {
  id: string;
  user_id: string;
  event_name: ClaritySquareProductEventName;
  metadata: Record<string, unknown>;
  created_at: string;
};

type ClaritySquareDatabase = {
  clarity_square: {
    Tables: {
      profiles: {
        Row: ClaritySquareProfile;
        Insert: {
          user_id: string;
          email?: string | null;
          username?: string | null;
          full_name?: string | null;
          preferred_track?: ClaritySquareTrack | null;
          assistant_settings?: Record<string, unknown>;
        };
        Update: Partial<Omit<ClaritySquareProfile, 'user_id' | 'created_at' | 'updated_at'>>;
      };
      projects: {
        Row: ClaritySquareProject;
        Insert: {
          user_id: string;
          folder_id?: string | null;
          track: ClaritySquareTrack;
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
        Update: Partial<Omit<ClaritySquareProject, 'id' | 'user_id' | 'created_at' | 'updated_at'>>;
      };
      project_tasks: {
        Row: ClaritySquareProjectTask;
        Insert: {
          project_id: string;
          user_id: string;
          title: string;
          detail?: string | null;
          source?: ClaritySquareProjectTask['source'];
          status?: ClaritySquareProjectTask['status'];
          sort_order?: number;
        };
        Update: Partial<
          Omit<ClaritySquareProjectTask, 'id' | 'project_id' | 'user_id' | 'created_at' | 'updated_at'>
        >;
      };
      project_reports: {
        Row: ClaritySquareProjectReport;
        Insert: {
          project_id: string;
          user_id: string;
          report_type: ClaritySquareProjectReport['report_type'];
          title: string;
          content: string;
          source?: ClaritySquareProjectReport['source'];
          metadata?: Record<string, unknown>;
        };
        Update: Partial<
          Omit<ClaritySquareProjectReport, 'id' | 'project_id' | 'user_id' | 'created_at' | 'updated_at'>
        >;
      };
      project_folders: {
        Row: ClaritySquareProjectFolder;
        Insert: {
          user_id: string;
          name: string;
          sort_order?: number;
          status?: ClaritySquareProjectFolder['status'];
        };
        Update: Partial<Omit<ClaritySquareProjectFolder, 'id' | 'user_id' | 'created_at' | 'updated_at'>>;
      };
      context_entries: {
        Row: ClaritySquareContextEntry;
        Insert: {
          project_id: string;
          user_id: string;
          entry_type: ClaritySquareContextEntry['entry_type'];
          payload?: Record<string, unknown>;
        };
        Update: Partial<Omit<ClaritySquareContextEntry, 'id' | 'project_id' | 'user_id' | 'created_at'>>;
      };
      assistant_messages: {
        Row: ClaritySquareAssistantMessage;
        Insert: {
          user_id: string;
          project_id?: string | null;
          role: ClaritySquareAssistantMessage['role'];
          content: string;
          metadata?: Record<string, unknown>;
        };
        Update: never;
      };
      assistant_memories: {
        Row: ClaritySquareAssistantMemory;
        Insert: {
          user_id: string;
          project_id?: string | null;
          memory_type?: ClaritySquareAssistantMemory['memory_type'];
          title: string;
          content: string;
          source?: ClaritySquareAssistantMemory['source'];
          status?: ClaritySquareAssistantMemory['status'];
        };
        Update: Partial<
          Omit<ClaritySquareAssistantMemory, 'id' | 'user_id' | 'created_at' | 'updated_at'>
        >;
      };
      product_events: {
        Row: ClaritySquareProductEvent;
        Insert: {
          user_id: string;
          event_name: ClaritySquareProductEventName;
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

let browserClient: SupabaseClient<ClaritySquareDatabase> | null = null;

export const isClaritySquareSupabaseConfigured = () =>
  Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export const getClaritySquareSupabase = () => {
  if (!isClaritySquareSupabaseConfigured()) return null;

  if (!browserClient) {
    browserClient = createClient<ClaritySquareDatabase>(
      process.env.NEXT_PUBLIC_SUPABASE_URL as string,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string,
      {
        db: { schema: 'clarity_square' },
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
