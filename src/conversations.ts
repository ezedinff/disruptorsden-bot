import { Conversation, createConversation } from "@grammyjs/conversations";
import questions from "./questions";
import { SupabaseClient } from "@supabase/supabase-js";
import { Database, DistuptiveDenContext } from "./types";
import { insertMember } from "./supabase";


export const REGISTRATION = "Registration";

export const registration = (supabase: SupabaseClient<Database>) => {
  return createConversation(
    async (conversation: Conversation<DistuptiveDenContext>, ctx: DistuptiveDenContext) => {
        const newQuestions = [...questions];
        let member = {tg_id: ctx.from?.id};
        for(const question of newQuestions) {
            await ctx.reply(question.question);
            let answer = (await conversation.waitFor(":text")).msg.text;
            if (!question.validation(answer)) {
                await ctx.reply(question.errorMessage);
                answer = (await conversation.waitFor(":text")).msg.text;
            }
            question.answer = answer;
            member = { ...member, [question.key]: answer };
        }
        await insertMember(supabase, member);
        await ctx.reply("Thank you for registering!");
        return;
    },
    REGISTRATION
  );
};
