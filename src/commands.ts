import { Command, DistuptiveDenContext } from "./types"
import { CommandContext } from "grammy";
import { REGISTRATION } from "./conversations";

const start = () => async (ctx: CommandContext<DistuptiveDenContext>) => {
    ctx.reply("Hello, I'm a bot!");
}

const register = () => async (ctx: CommandContext<DistuptiveDenContext>) => {
    await ctx.conversation.enter(REGISTRATION);
}



const commands: Command = {
    start,
    register
}

export default commands;
