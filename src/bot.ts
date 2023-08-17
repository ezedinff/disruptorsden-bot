import { Bot, session } from "grammy";
import { Command, DistuptiveDenContext } from "./types";
import { SupabaseClient } from "@supabase/supabase-js";
import { conversations } from "@grammyjs/conversations";
import { registration } from "./conversations";

const createBot = (
  token: string,
  commands: Command,
  supabase: SupabaseClient
) => {
  const bot = new Bot<DistuptiveDenContext>(token);

  // register middleware
  bot.use(session({
    initial: () => ({}),
  }));
  bot.use(conversations());
  bot.use(registration(supabase));

  // register commands
  Object.keys(commands).forEach((key) => {
    bot.command(key, commands[key](supabase));
  });

  bot.on("message", (ctx) => ctx.reply("Something nice is coming soon!"));
  return bot;
};

export default createBot;
