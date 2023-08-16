require('dotenv').config()

import createBot from "./bot";
import commands from "./commands";
import {createSupabaseClient} from "./supabase";

const Supabase = createSupabaseClient(process.env.SUPABASE_URL || "", process.env.SUPABASE_KEY || "");

const TelegramBot = createBot(process.env.BOT_TOKEN || "", commands, Supabase);

TelegramBot.start();