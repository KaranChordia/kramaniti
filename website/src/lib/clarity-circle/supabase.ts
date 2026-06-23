import { createClient, type SupabaseClient } from '@supabase/supabase-js';

export type ClarityCircleTrack = 'founder' | 'builder';

export type ClarityCircleProject = {
  id: string;
  user_id: string;
  track: ClarityCircleTrack;
  title: string;
  context: string;
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

export type ClarityCircleContextEntry = {
  id: string;
  project_id: string;
  user_id: string;
  entry_type: 'intent' | 'note' | 'digest' | 'brief' | 'engine_handoff';
  payload: Record<string, unknown>;
  created_at: string;
};

type ClarityCircleDatabase = {
  clarity_circle: {
    Tables: {
      projects: {
        Row: ClarityCircleProject;
        Insert: {
          user_id: string;
          track: ClarityCircleTrack;
          title: string;
          context: string;
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
