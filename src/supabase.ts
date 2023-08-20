import { SupabaseClient, createClient } from "@supabase/supabase-js";
import { Database } from "./types";

/**
 * Creates a Supabase client using the provided Supabase URL and key.
 *
 * @param {string} supabaseUrl - The URL of the Supabase API.
 * @param {string} supabaseKey - The key used to authenticate requests to the Supabase API.
 * @return {SupabaseClient} The Supabase client.
 */
export const createSupabaseClient = (
  supabaseUrl: string,
  supabaseKey: string
) => {
  return createClient<Database>(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
    },
  });
};

/**
 * Retrieves all members from the database.
 *
 * @param {SupabaseClient<Database>} supabase - The Supabase client used to connect to the database.
 * @return {Promise<Array<any> | null>} The array of member data or null if an error occurred.
 */
export const getAllMembers = async (supabase: SupabaseClient<Database>) => {
  const { data, error } = await supabase.from("members").select("*");
  if (error) {
    if (error.details.includes("Results contain 0 rows")) {
      return null;
    }
    throw error;
  }
  return data;
};

/**
 * Retrieves a member from the "members" table in the database based on their Telegram ID.
 *
 * @param {SupabaseClient<Database>} supabase - The Supabase client object used to interact with the database.
 * @param {string} tgId - The Telegram ID of the member to retrieve.
 * @return {Promise<any>} A promise that resolves to the retrieved member data, or throws an error if there was an error retrieving the member.
 */
export const getMembersByTgId = async (
  supabase: SupabaseClient<Database>,
  tgId: number
) => {
  const { data, error } = await supabase
    .from("members")
    .select("*")
    .eq("tg_id", tgId)
    .single();
  if (error) {
    if (error.details.includes("Results contain 0 rows")) {
      return null;
    }
    throw error;
  }
  return data;
};

/**
 * Retrieves a member from the database by their ID.
 *
 * @param {SupabaseClient<Database>} supabase - The Supabase client instance.
 * @param {number} id - The ID of the member to retrieve.
 * @return {Promise<SupabaseSingleResponse<Member> | null>} The data of the member if found, or null if not found.
 */
export const getMemberById = async (
  supabase: SupabaseClient<Database>,
  id: number
) => {
  const { data, error } = await supabase
    .from("members")
    .select("*")
    .eq("id", id)
    .single();
  if (error) {
    if (error.details.includes("Results contain 0 rows")) {
      return null;
    }
    throw error;
  }
  return data;
};

/**
 * Inserts a new member into the "members" table in the Supabase database.
 *
 * @param {SupabaseClient<Database>} supabase - The Supabase client object used to connect to the database.
 * @param {any} member - The member object to be inserted into the "members" table.
 * @return {Promise<any>} - A promise that resolves to the data object returned from the database after the insert operation is completed successfully.
 */
export const insertMember = async (
  supabase: SupabaseClient<Database>,
  member: any
) => {
  const { data, error } = await supabase.from("members").insert(member);
  if (error) {
    throw error;
  }
  return data;
};

/**
 * Updates a member in the database.
 *
 * @param {SupabaseClient<Database>} supabase - The Supabase client used to interact with the database.
 * @param {any} member - The member object to be updated.
 * @return {Promise<any>} - The updated member data.
 */
export const updateMember = async (
  supabase: SupabaseClient<Database>,
  member: any
) => {
  const { data, error } = await supabase
    .from("members")
    .update(member)
    .eq("tg_id", member.tg_id);
  if (error) {
    throw error;
  }
  return data;
};

/**
 * Inserts a new meetup into the database.
 *
 * @param {SupabaseClient<Database>} supabase - The Supabase client used to interact with the database.
 * @param {any} meetup - The meetup object to be inserted.
 * @return {Promise<any>} The inserted meetup data.
 */
export const insertMeetup = async (
  supabase: SupabaseClient<Database>,
  meetup: any
) => {
  const { data, error } = await supabase.from("meetups").insert(meetup);
  if (error) {
    throw error;
  }
  return data;
};

/**
 * Updates a meetup in the Supabase database.
 *
 * @param {SupabaseClient<Database>} supabase - The Supabase client.
 * @param {any} meetup - The meetup object to be updated.
 * @return {Promise<any>} - The updated meetup object.
 */
export const updateMeetup = async (
  supabase: SupabaseClient<Database>,
  meetup: any
) => {
  const { data, error } = await supabase
    .from("meetups")
    .update(meetup)
    .eq("id", meetup.id);
  if (error) {
    throw error;
  }
  return data;
};

/**
 * Retrieve a meetup by its date.
 *
 * @param {SupabaseClient<Database>} supabase - The Supabase client.
 * @param {string} date - The date of the meetup in the format YYYY-MM-DD.
 * @return {Promise<Record<string, any> | null>} The data of the meetup if found, or null if not found.
 */
export const getMeetupByDate = async (
  supabase: SupabaseClient<Database>,
  date: string // YYYY-MM-DD
) => {
  const { data, error } = await supabase
    .from("meetups")
    .select("*")
    .eq("date", date);
  if (error) {
    if (error.details.includes("Results contain 0 rows")) {
      return null;
    }
    throw error;
  }
  return data[0];
};

/**
 * Inserts attendance data into the "attendances" table.
 *
 * @param {SupabaseClient<Database>} supabase - The Supabase client.
 * @param {any} attendance - The attendance data to be inserted.
 * @return {any} The inserted attendance data.
 */
export const insertAttendance = async (
  supabase: SupabaseClient<Database>,
  attendance: any
) => {
  const { data, error } = await supabase.from("attendances").insert(attendance);
  if (error) {
    throw error;
  }
  return data;
};

/**
 * Retrieves the attendance information for a specific meetup by its ID.
 *
 * @param {SupabaseClient<Database>} supabase - The Supabase client used to interact with the database.
 * @param {number} meetupId - The ID of the meetup to retrieve attendance for.
 * @return {Promise<Array<{ name: string, email: string, phone: string, linkedin_username: string }>>} - An array of attendance members, each containing the name, email, phone, and LinkedIn username.
 */
export const getAttendanceByMeetupId = async (
  supabase: SupabaseClient<Database>,
  meetupId: number
) => {
  const { data, error } = await supabase
    .from("attendances")
    .select("members ( name, email, phone, linkedin_username )")
    .eq("meetup_id", meetupId);
  if (error) {
    if (error.details.includes("Results contain 0 rows")) {
      return null;
    }
    throw error;
  }
  return data?.map((row) => row.members).flat();
};
