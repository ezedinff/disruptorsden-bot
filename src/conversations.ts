import { Conversation, createConversation } from "@grammyjs/conversations";
import questions from "./questions";
import { SupabaseClient } from "@supabase/supabase-js";
import { Database, DistuptiveDenContext, Question } from "./types";
import {
  getAttendanceByMeetupId,
  getMeetupByDate,
  getMemberById,
  insertMeetup,
  insertMember,
} from "./supabase";
import buttons from "./buttons";
import { Keyboard } from "grammy";

export const REGISTRATION = "Registration";
export const CREATE_MEETUP = "Create Meetup";
export const GET_ATTENDANCE = "Get Attendance";
export const REGISTRATION_ADMIN = "Registration Admin";

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
};

export const registration = (supabase: SupabaseClient<Database>) => {
  return createConversation(
    async (
      conversation: Conversation<DistuptiveDenContext>,
      ctx: DistuptiveDenContext
    ) => {
      const newQuestions = [...questions.memberForm];
      const member = await form(newQuestions, conversation, ctx, {
        tg_id: ctx.from?.id,
      });
      await insertMember(supabase, member);
      await ctx.reply("Thank you for registering!");
      return;
    },
    REGISTRATION
  );
};

export const createMeetup = (supabase: SupabaseClient<Database>) => {
  return createConversation(
    async (
      conversation: Conversation<DistuptiveDenContext>,
      ctx: DistuptiveDenContext
    ) => {
      const newQuestions = [...questions.meetupForm];
      const meetup = await form(newQuestions, conversation, ctx);
      await insertMeetup(supabase, meetup);
      await ctx.reply("Thank you for creating a meetup!");
      return;
    },
    CREATE_MEETUP
  );
};

export const getAttendance = (supabase: SupabaseClient<Database>) => {
  return createConversation(
    async (
      conversation: Conversation<DistuptiveDenContext>,
      ctx: DistuptiveDenContext
    ) => {
      const newQuestions = [...questions.getAttendanceForm];
      const response = await form(newQuestions, conversation, ctx);
      if ("date" in response) {
        const meetup = await getMeetupByDate(supabase, response.date as string);
        if (meetup) {
          await ctx.reply(
            "Here is the attendance for the meetup on " + response.date
          );
          const attendendedMembers = await getAttendanceByMeetupId(
            supabase,
            meetup.id
          );

          const attendance = attendendedMembers
            ?.map((member, index) => {
              return `${index + 1}. ${member.name} - ${
                member.linkedin_username
              } - ${member.phone}`;
            })
            .join("\n");

          await ctx.reply(attendance || "No one attended this meetup yet.");
        }
        return;
      }
    },
    GET_ATTENDANCE
  );
};

export const registration_admin = (supabase: SupabaseClient<Database>) => {
  return createConversation(
    async (
      conversation: Conversation<DistuptiveDenContext>,
      ctx: DistuptiveDenContext
    ) => {
      const newQuestions = [...questions.registerAdminForm];
      const response = await form(newQuestions, conversation, ctx);
      if ("member_id" in response) {
        await supabase
          .from("members")
          .update({ is_admin: true })
          .eq("id", response.member_id);
        
        const member = await getMemberById(supabase, response.member_id as number);
        await sendAdminButtons(ctx, member.tg_id, "You are now an admin!");
      }
      await ctx.reply("Thank you for registering!");
      return;
    },
    REGISTRATION_ADMIN
  );
};

export const sendAdminButtons = async (
  ctx: DistuptiveDenContext,
  tg_id: number,
  message: string
) => {
  const { getAttendance, createMeetup, sendAttendance } = buttons;
  const adminKeyboard = new Keyboard()
    .text(getAttendance.text)
    .row()
    .text(createMeetup.text).row()
    .text(sendAttendance.text).row()
    .persistent();
  await ctx.api.sendMessage(tg_id, message, {
    reply_markup: adminKeyboard,
  });
};
