import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export type KoshProfile = {
  user_id: string;
  email: string | null;
  display_name: string | null;
  context: string | null;
  context_updated_at: string | null;
  created_at: string;
  updated_at: string;
};

export type KoshTemplateBookmark = {
  user_id: string;
  template_id: string;
  created_at: string;
};

export type KoshWorkingCopy = {
  id: string;
  user_id: string;
  template_id: string;
  template_version: string;
  title: string;
  content: string;
  context_kind: "personal" | "professional" | "custom" | "manual";
  created_at: string;
  updated_at: string;
};

export type KoshDatabase = {
  public: {
    Tables: Record<string, never>;
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
  kosh: {
    Tables: {
      profiles: {
        Row: KoshProfile;
        Insert: {
          user_id: string;
          email?: string | null;
          display_name?: string | null;
          context?: string | null;
          context_updated_at?: string | null;
        };
        Update: Partial<
          Omit<KoshProfile, "user_id" | "created_at" | "updated_at">
        >;
        Relationships: [];
      };
      working_copies: {
        Row: KoshWorkingCopy;
        Insert: Omit<KoshWorkingCopy, "id" | "created_at" | "updated_at"> & {
          id?: string;
          updated_at?: string;
        };
        Update: Partial<
          Pick<KoshWorkingCopy, "title" | "content" | "updated_at">
        >;
        Relationships: [];
      };
      template_bookmarks: {
        Row: KoshTemplateBookmark;
        Insert: {
          user_id: string;
          template_id: string;
        };
        Update: never;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      consume_adaptation_attempt: {
        Args: Record<string, never>;
        Returns: boolean;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

let browserClient: SupabaseClient<KoshDatabase, "kosh"> | null = null;

export const getKoshPublicKey = () =>
  process.env.NEXT_PUBLIC_KOSH_SUPABASE_PUBLISHABLE_KEY ?? "";

export const isKoshSupabaseConfigured = () =>
  Boolean(process.env.NEXT_PUBLIC_KOSH_SUPABASE_URL && getKoshPublicKey());

export const getKoshSupabase = () => {
  if (!isKoshSupabaseConfigured()) return null;

  if (!browserClient) {
    browserClient = createClient<KoshDatabase, "kosh">(
      process.env.NEXT_PUBLIC_KOSH_SUPABASE_URL as string,
      getKoshPublicKey(),
      {
        db: { schema: "kosh" },
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
        },
      },
    );
  }

  return browserClient;
};
