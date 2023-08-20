import { Bot, session } from "https://deno.land/x/grammy@v1.18.1/mod.ts";
import { Command, DistuptiveDenContext } from "./types.ts";
import { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.32.0";
import { conversations } from "https://deno.land/x/grammy_conversations@v1.1.2/mod.ts";
import { createMeetup, getAttendance, registration, registration_admin } from "./conversations.ts";
import buttons from "./buttons.ts";
import { attendance, create_meetup, get_attendance, register, registerAttendance, register_admin } from "./commands.ts";

const createBot = (
  token: string,
  commands: Command,
  supabase: SupabaseClient
) => {
  const bot = new Bot<DistuptiveDenContext>(token);

  // register middleware
  bot.use(
    session({
      initial: () => ({}),
    })
  );
  bot.use(conversations());
  bot.use(registration(supabase));
  bot.use(createMeetup(supabase));
  bot.use(getAttendance(supabase));
  bot.use(registration_admin(supabase));

  // register commands
  Object.keys(commands).forEach((key) => {
    bot.command(key, commands[key](supabase));
  });

  const { register: registerButton, attendance: attendanceButton } = buttons;
  bot.callbackQuery(registerButton.callback_data, async (ctx) => {
    await ctx.answerCallbackQuery();
    await register(supabase)(ctx as any);
  });

  bot.callbackQuery(
    attendanceButton.regex,
    async (ctx) => {
      console.log(ctx.match);
      await registerAttendance(supabase)(ctx as any);
    }
  );

  bot.on("message", async (ctx) => {
    if (ctx.message?.text === "Get Attendance") {
      return await get_attendance(supabase)(ctx as any);
    } else if (ctx.message?.text === "Create Meetup") {
      return await create_meetup(supabase)(ctx as any);
    } else if (ctx.message?.text === "Register Admin") {
      return await register_admin(supabase)(ctx as any);
    } else if (ctx.message?.text === "Send Attendance") {
      return await attendance(supabase)(ctx as any);
    } else {
      return await ctx.reply("Something nice is coming soon!")
    }
  });
  return bot;
};

export default createBot;
