import { ConversationFlavor } from "@grammyjs/conversations";
import { SupabaseClient } from "@supabase/supabase-js";
import { CommandContext, Context, SessionFlavor } from "grammy";

export interface Database {
  public: {
    Tables: {
      attendances: {
        Row: {
          created_at: string;
          id: number;
          meetup_id: number | null;
          member_id: number | null;
          status: boolean;
        };
        Insert: {
          created_at?: string;
          id?: number;
          meetup_id?: number | null;
          member_id?: number | null;
          status?: boolean;
        };
        Update: {
          created_at?: string;
          id?: number;
          meetup_id?: number | null;
          member_id?: number | null;
          status?: boolean;
        };
        Relationships: [
          {
            foreignKeyName: "attendances_meetup_id_fkey";
            columns: ["meetup_id"];
            referencedRelation: "meetups";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "attendances_member_id_fkey";
            columns: ["member_id"];
            referencedRelation: "members";
            referencedColumns: ["id"];
          }
        ];
      };
      meetups: {
        Row: {
          created_at: string;
          date: string | null;
          id: number;
          location: string | null;
          start_time: string | null;
          topics: string | null;
        };
        Insert: {
          created_at?: string;
          date?: string | null;
          id?: number;
          location?: string | null;
          start_time?: string | null;
          topics?: string | null;
        };
        Update: {
          created_at?: string;
          date?: string | null;
          id?: number;
          location?: string | null;
          start_time?: string | null;
          topics?: string | null;
        };
        Relationships: [];
      };
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
        Relationships: [];
      };
    };
  };
}

export type Command = {
  [key: string]: (
    supabase: SupabaseClient<Database>
  ) => (ctx: CommandContext<DistuptiveDenContext>) => void;
};

export type SessionData = {
  // field?: string;
};

export type DistuptiveDenContext = Context &
  SessionFlavor<SessionData> &
  ConversationFlavor;

export type Question = {
  question: string;
  answer: string;
  key: string;
  validation: (answer: string) => boolean;
  errorMessage: string;
};
