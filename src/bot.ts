import { Bot, session } from "grammy";
import { Command, DistuptiveDenContext } from "./types";
import { SupabaseClient } from "@supabase/supabase-js";
import { conversations } from "@grammyjs/conversations";
import { createMeetup, registration } from "./conversations";
import buttons from "./buttons";
import { register } from "./commands";

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
  bot.use(createMeetup(supabase));

  // register commands
  Object.keys(commands).forEach((key) => {
    bot.command(key, commands[key](supabase));
  });

  const { register : registerButton } = buttons;
  bot.callbackQuery(registerButton.callback_data, async (ctx) => {
    await ctx.answerCallbackQuery();
    await register(supabase)(ctx as any);
  });

  bot.on("message", (ctx) => ctx.reply("Something nice is coming soon!"));
  return bot;
};

export default createBot;
