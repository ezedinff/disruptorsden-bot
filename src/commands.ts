import { Command } from "./types"

const commands: Command = {
    start: (ctx) => ctx.reply("Welcome! Up and running.")
}

export default commands