import { Bot } from "grammy";
import { Command } from "./types";
import { SupabaseClient } from "@supabase/supabase-js";

const createBot = (token: string, commands: Command, supabase: SupabaseClient) => {
    const bot = new Bot(token);
    // register commands
    Object.keys(commands).forEach((key) => {
        bot.command(key, commands[key](supabase));
    });

    bot.on("message", (ctx) => ctx.reply("Got another message!"));
    return bot;
}

export default createBot;