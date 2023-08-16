import { SupabaseClient } from "@supabase/supabase-js";
import { CommandContext, Context } from "grammy";

export interface Database {
  public: {
    Tables: {
      members: {
        Row: {
          created_at: string;
          email: string | null;
          id: number;
          linkedin_username: string | null;
          name: string | null;
          phone: string | null;
          tg_id: string | null;
        };
        Insert: {
          created_at?: string;
          email?: string | null;
          id?: number;
          linkedin_username?: string | null;
          name?: string | null;
          phone?: string | null;
          tg_id?: string | null;
        };
        Update: {
          created_at?: string;
          email?: string | null;
          id?: number;
          linkedin_username?: string | null;
          name?: string | null;
          phone?: string | null;
          tg_id?: string | null;
        };
      };
    };
  };
}

export type Command = {
  [key: string]: (
    supabase: SupabaseClient<Database>
  ) => (ctx: CommandContext<Context>) => void;
};
