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
 * Retrieves a member from the "members" table in the database based on their Telegram ID.
 *
 * @param {SupabaseClient<Database>} supabase - The Supabase client object used to interact with the database.
 * @param {string} tgId - The Telegram ID of the member to retrieve.
 * @return {Promise<any>} A promise that resolves to the retrieved member data, or throws an error if there was an error retrieving the member.
 */
export const getMembersByTgId = async (
  supabase: SupabaseClient<Database>,
  tgId: string
) => {
  const { data, error } = await supabase
    .from("members")
    .select("*")
    .eq("tg_id", tgId)
    .single();
  if (error) {
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
