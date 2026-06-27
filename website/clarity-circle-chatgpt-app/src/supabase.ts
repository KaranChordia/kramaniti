import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { verifyOAuthAccessToken } from "./tokens.js";

export type Track = "founder" | "builder";

export type Project = {
  id: string;
  user_id: string;
  folder_id: string | null;
  track: Track;
  title: string;
  context: string;
  project_instruction: string | null;
  audience: string | null;
  blocker: string | null;
  outcome: string | null;
  summary: string | null;
  questions: string[];
  actions: string[];
  status: "active" | "archived";
  created_at: string;
  updated_at: string;
};

export type ProjectFolder = {
  id: string;
  user_id: string;
  name: string;
  sort_order: number;
  status: "active" | "archived";
  created_at: string;
  updated_at: string;
};

export type ProjectTask = {
  id: string;
  project_id: string;
  user_id: string;
  title: string;
  detail: string | null;
  source: "auto" | "assistant" | "user";
  status: "open" | "done" | "archived";
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type ProjectReport = {
  id: string;
  project_id: string;
  user_id: string;
  report_type: "strategy" | "systems" | "presence";
  title: string;
  content: string;
  source: "clarity_engine";
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
};

export type AssistantMemory = {
  id: string;
  user_id: string;
  project_id: string | null;
  memory_type: "insight" | "preference" | "project_signal" | "boundary";
  title: string;
  content: string;
  source: "assistant" | "user";
  status: "active" | "archived";
  created_at: string;
  updated_at: string;
};

export type ContextEntry = {
  id: string;
  project_id: string;
  user_id: string;
  entry_type: "intent" | "note" | "digest" | "brief" | "engine_handoff";
  payload: Record<string, unknown>;
  created_at: string;
};

type Table<Row> = {
  Row: Row;
  Insert: Partial<Row>;
  Update: Partial<Row>;
  Relationships: [];
};

type CircleDatabase = {
  clarity_circle: {
    Tables: {
      projects: Table<Project>;
      project_folders: Table<ProjectFolder>;
      project_tasks: Table<ProjectTask>;
      project_reports: Table<ProjectReport>;
      assistant_memories: Table<AssistantMemory>;
      context_entries: Table<ContextEntry>;
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
  public: {
    Tables: Record<string, never>;
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

export type CircleClient = SupabaseClient<CircleDatabase, "clarity_circle">;
type PublicClient = SupabaseClient<any, any, any>;

export class AuthError extends Error {
  constructor(message = "A Clarity Circle account connection is required.") {
    super(message);
    this.name = "AuthError";
  }
}

export function getBearerToken(headers: Headers): string {
  const header = headers.get("authorization") || headers.get("Authorization");
  const token = header?.match(/^Bearer\s+(.+)$/i)?.[1]?.trim();
  if (!token) {
    throw new AuthError();
  }
  return token;
}

export function createCircleClient(accessToken: string): CircleClient {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error("Supabase URL and anon key must be configured for the Clarity Circle manager.");
  }

  return createClient<CircleDatabase, "clarity_circle">(url, anonKey, {
    db: { schema: "clarity_circle" },
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
    global: {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  });
}

export function createPublicSupabaseClient(): PublicClient {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error("Supabase URL and anon key must be configured for the Clarity Circle manager.");
  }

  return createClient(url, anonKey, {
    db: { schema: "clarity_circle" },
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

export async function resolveLoginEmail(login: string): Promise<string | null> {
  const normalized = login.trim();
  if (!normalized) return null;
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) return normalized;

  const client = createPublicSupabaseClient();
  const { data, error } = await client.rpc("resolve_login_email", { login: normalized });
  if (error) throw error;
  return typeof data === "string" && data ? data : null;
}

export async function signInForOAuth(login: string, password: string) {
  const email = await resolveLoginEmail(login);
  if (!email) {
    throw new AuthError("No Clarity Circle account was found for that username or email.");
  }

  const client = createPublicSupabaseClient();
  const { data, error } = await client.auth.signInWithPassword({ email, password });
  if (error || !data.session || !data.user) {
    throw new AuthError(error?.message ?? "Clarity Circle sign-in failed.");
  }

  return {
    accessToken: data.session.access_token,
    expiresAt: data.session.expires_at ?? Math.floor(Date.now() / 1000) + data.session.expires_in,
    userId: data.user.id,
    email: data.user.email ?? email,
  };
}

export async function resolveBearerToSupabaseAccessToken(bearerToken: string): Promise<string> {
  try {
    const appToken = await verifyOAuthAccessToken(bearerToken);
    return appToken.supabaseAccessToken;
  } catch {
    throw new AuthError("The Clarity Circle ChatGPT authorization is invalid or expired.");
  }
}

export async function getCurrentUserId(client: CircleClient): Promise<string> {
  const { data, error } = await client.auth.getUser();
  if (error || !data.user) {
    throw new AuthError("The supplied Supabase access token is invalid or expired.");
  }
  return data.user.id;
}
