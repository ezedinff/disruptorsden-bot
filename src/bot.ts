import { Bot } from "grammy";
import { Command } from "./types";

const createBot = (token: string, commands: Command) => {
    const bot = new Bot(token);
    // register commands
    Object.keys(commands).forEach((key) => {
        bot.command(key, commands[key]);
    });

    bot.on("message", (ctx) => ctx.reply("Got another message!"));
    return bot;
}

export default createBot;