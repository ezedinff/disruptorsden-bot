require('dotenv').config()

import createBot from "./bot";
import commands from "./commands";


const TelegramBot = createBot(process.env.BOT_TOKEN || "", commands);

TelegramBot.start();