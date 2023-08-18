import { Conversation, createConversation } from "@grammyjs/conversations";
import questions from "./questions";
import { SupabaseClient } from "@supabase/supabase-js";
import { Database, DistuptiveDenContext, Question } from "./types";
import { insertMeetup, insertMember } from "./supabase";

export const REGISTRATION = "Registration";
export const CREATE_MEETUP = "Create Meetup";

export const form = async (
  questions: Question[],
  conversation: Conversation<DistuptiveDenContext>,
  ctx: DistuptiveDenContext,
  startWith = {}
) => {
  const newQuestions = [...questions];
  let responses = { ...startWith };
  for (const question of newQuestions) {
    let answer;
    do {
      await ctx.reply(question.question);
      answer = (await conversation.waitFor(":text")).msg.text;
      if (!question.validation(answer)) {
        await ctx.reply(question.errorMessage);
      }
    } while (!question.validation(answer));
    question.answer = answer;
    responses = { ...responses, [question.key]: answer };
  }
  return responses;
}

export const registration = (supabase: SupabaseClient<Database>) => {
  return createConversation(
    async (conversation: Conversation<DistuptiveDenContext>, ctx: DistuptiveDenContext) => {
        const newQuestions = [...questions.memberForm];
        const member = await form(newQuestions, conversation, ctx, {tg_id: ctx.from?.id});
        await insertMember(supabase, member);
        await ctx.reply("Thank you for registering!");
        return;
    },
    REGISTRATION
  );
};

export const createMeetup = (supabase: SupabaseClient<Database>) => {
  return createConversation(
    async (conversation: Conversation<DistuptiveDenContext>, ctx: DistuptiveDenContext) => {
      const newQuestions = [...questions.meetupForm];
      const meetup = await form(newQuestions, conversation, ctx);
      await insertMeetup(supabase, meetup);
      await ctx.reply("Thank you for creating a meetup!");
      return;
    },
    CREATE_MEETUP
  );
}