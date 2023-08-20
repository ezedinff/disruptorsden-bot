import { Command, Database, DistuptiveDenContext } from "./types"
import { CommandContext, InlineKeyboard } from "grammy";
import { REGISTRATION, CREATE_MEETUP, GET_ATTENDANCE, REGISTRATION_ADMIN } from "./conversations";
import { getAllMembers, getMeetupByDate, getMembersByTgId, insertAttendance, insertMeetup } from "./supabase";
import { SupabaseClient } from "@supabase/supabase-js";
import buttons from "./buttons";

const isUserExists = async (
    supabase: SupabaseClient<Database>,
    ctx: CommandContext<DistuptiveDenContext>,
    messages: {
        no_tg_id?: string;
        already_registered?: string;
    },
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

export const isUserAdmin = async (
    supabase: SupabaseClient<Database>,
    ctx: CommandContext<DistuptiveDenContext>
) => {
    if(!ctx.from?.id) {
        return false;
    }
    const user = await getMembersByTgId(supabase, ctx.from?.id);
    if(user) {
        return user.is_admin;
    }
    return false;
}



const start = (supabase: SupabaseClient<Database>) => async (ctx: CommandContext<DistuptiveDenContext>) => {
    // const userExists = await isUserExists(supabase, ctx, { 
    //     no_tg_id: "Sorry, Something went wrong. Please, try again later.",
    //     already_registered: "Hello, {name}! what's up?"
    // });

    // if (userExists) {
    //     return;
    // }

    const { register } = buttons;

    ctx.reply("Hello, I'm Disruptive Den bot 🤖!\n\nDisruptive Den is to build a collaborative and inclusive community that goes beyond the pursuit of profit or success. We believe in embracing diversity and inclusivity, lifting each other up, and achieving greatness together. Through weekly meetings over a cup of coffee, we aim to foster meaningful connections, share knowledge, and push the boundaries of what's possible in business. Our community is open to entrepreneurs of all levels and backgrounds who share our values and are committed to driving innovation, collaboration, and growth.", {
        reply_markup: new InlineKeyboard().text(register.text, register.callback_data),
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

export const create_meetup = (supabase: SupabaseClient<Database>) => async (ctx: CommandContext<DistuptiveDenContext>) => {
    const isAdmin = await isUserAdmin(supabase, ctx);
    if (!isAdmin) {
        await ctx.reply("Sorry, you don't have permission to create meetup.");
        return;
    }
    await ctx.conversation.exit();
    await ctx.conversation.enter(CREATE_MEETUP);
}

export const attendance = (supabase: SupabaseClient<Database>) => async (ctx: CommandContext<DistuptiveDenContext>) => {
    const isAdmin = await isUserAdmin(supabase, ctx);
    if (!isAdmin) {
        await ctx.reply("Sorry, you don't have permission to send attendance.");
        return;
    }
    
    let meetup = await getMeetupByDate(supabase, new Date().toISOString().slice(0, 10));
    if (!meetup) {
        const isSaturday = new Date().getDay() === 6;
        if (!isSaturday) {
            await ctx.reply("There is no meetup today.");
        }

        const defaultMeetup = {
            date: new Date().toISOString().slice(0, 10),
            start_time: "02:00 PM",
            location: "Manyazewal Eshetu Gibi"
        }
        await insertMeetup(supabase, defaultMeetup);
        meetup = await getMeetupByDate(supabase, new Date().toISOString().slice(0, 10));
    }
    const members = await getAllMembers(supabase);

    if (!members) {
        await ctx.reply("There is no members.");
        return;
    }

    const { attendance } = buttons;
    const keyboard = new InlineKeyboard().text(attendance.text, attendance.callback_data.replace("{id}", meetup?.id.toString()));
    
    for (const member of members) {
        await ctx.api.sendMessage(member.tg_id, "Please, confirm your attendance.", {
            reply_markup: keyboard
        });
    }
}


export const registerAttendance = (supabase: SupabaseClient<Database>) => async (ctx: CommandContext<DistuptiveDenContext>) => {
    const meetupId = ctx.callbackQuery?.data?.split("/")[2];
    if (!meetupId) {
        await ctx.answerCallbackQuery();
        await ctx.reply("Sorry, I can't register your attendance. Please, try again later.");
        return;
    }

    let member;
    if (!ctx.from?.id) {
        await ctx.answerCallbackQuery();
        await ctx.reply("Sorry, I can't register your attendance. Please, try again later.");
        return;
    }

    member = await getMembersByTgId(supabase, ctx.from?.id);

    if (!member) {
        await ctx.answerCallbackQuery();
        await ctx.reply("Sorry, I can't register your attendance. Please, try again later.");
        return;
    }

    const newAttendance = {
        member_id: member.id,
        meetup_id: meetupId,
        status: true
    }

    await insertAttendance(supabase, newAttendance);
    await ctx.answerCallbackQuery();
    await ctx.reply("Thank you for confirming your attendance.");
}

export const get_attendance = (supabase: SupabaseClient<Database>) => async (ctx: CommandContext<DistuptiveDenContext>) => {
    const isAdmin = await isUserAdmin(supabase, ctx);
    if (!isAdmin) {
        await ctx.reply("Sorry, you don't have permission to get attendance.");
        return;
    }
    await ctx.conversation.exit();
    await ctx.conversation.enter(GET_ATTENDANCE);
}

export const register_admin = (supabase: SupabaseClient<Database>) => async (ctx: CommandContext<DistuptiveDenContext>) => {
    const tg_id = ctx.from?.id;
    if (!tg_id || tg_id !== 377316853) {
        await ctx.reply("Sorry, you don't have permission to register admin.");
        return;
    }
    await ctx.conversation.exit();
    await ctx.conversation.enter(REGISTRATION_ADMIN);
}

const commands: Command = {
    start,
    register,
    meetup: create_meetup,
    attendance,
    get_attendance,
    register_admin
}

export default commands;
