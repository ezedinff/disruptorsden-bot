import { serve } from "https://deno.land/std@0.131.0/http/server.ts";
import createBot from "./bot.ts";
import commands from "./commands.ts";
import {createSupabaseClient} from "./supabase.ts";
import { webhookCallback } from "https://deno.land/x/grammy@v1.18.1/mod.ts";


const TELEGRAM_BOT_TOKEN = Deno.env.get('TELEGRAM_BOT_TOKEN') || '';
const SUPABASE_KEY = Deno.env.get('SUPABASE_KEY') || '';
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
const FUNCTION_SECRET = Deno.env.get('FUNCTION_SECRET') || '';

const Supabase = createSupabaseClient(SUPABASE_URL, SUPABASE_KEY);
const TelegramBot = createBot(TELEGRAM_BOT_TOKEN, commands, Supabase);

const handleUpdate = webhookCallback(TelegramBot, "std/http", "throw", 40_000);

serve(async (req) => {
  try {
    const url = new URL(req.url);
    const isAllowed =
      url.searchParams.get("secret") === FUNCTION_SECRET;

    if (!isAllowed) {
      return new Response("not allowed", { status: 405 });
    }

    return await handleUpdate(req);
  } catch (err) {
    console.error(err);
  }
});