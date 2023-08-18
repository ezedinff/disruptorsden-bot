import { Command, Database, DistuptiveDenContext } from "./types"
import { CommandContext, InlineKeyboard } from "grammy";
import { REGISTRATION, CREATE_MEETUP } from "./conversations";
import { getMembersByTgId } from "./supabase";
import { SupabaseClient } from "@supabase/supabase-js";
import buttons from "./buttons";

const isUserExists = async (
    supabase: SupabaseClient<Database>,
    ctx: CommandContext<DistuptiveDenContext>,
    messages: {
        no_tg_id?: string;
        already_registered?: string;
    }
) => {
    if(!ctx.from?.id) {
        if(messages.no_tg_id){
            await ctx.reply(messages.no_tg_id);
        }
        return false;
    }
    const user = await getMembersByTgId(supabase, ctx.from?.id);
    if(user) {
        if (messages.already_registered) {
            await ctx.reply(messages.already_registered.replace("{name}", user.name));
        }
        return true;
    }
    return false;
}



const start = (supabase: SupabaseClient<Database>) => async (ctx: CommandContext<DistuptiveDenContext>) => {
    const userExists = await isUserExists(supabase, ctx, { 
        no_tg_id: "Sorry, Something went wrong. Please, try again later.",
        already_registered: "Hello, {name}! what's up?"
    });

    if (userExists) {
        return;
    }

    const { register } = buttons;

    ctx.reply("Hello, I'm a bot!", {
        reply_markup: new InlineKeyboard().text(register.text, register.callback_data)
    });
}

export const register = (supabase: SupabaseClient<Database>) => async (ctx: CommandContext<DistuptiveDenContext>) => {
    const userExists = await isUserExists(supabase, ctx, {
        no_tg_id: "Sorry, I can't register you. Please, try again later.",
        already_registered: "You are already registered as {name}!"
    });
    if (userExists) {
        return;
    }
    await ctx.conversation.enter(REGISTRATION);
}

const ceateMeetup = () => async (ctx: CommandContext<DistuptiveDenContext>) => {
    await ctx.conversation.enter(CREATE_MEETUP);
}

const commands: Command = {
    start,
    register,
    meetup: ceateMeetup
}

export default commands;
