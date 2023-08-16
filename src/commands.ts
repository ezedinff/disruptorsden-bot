import { Command } from "./types"

const commands: Command = {
    start: (supabase) => (ctx) => {
        ctx.reply("Hello, I'm a bot!");
    }
}

export default commands