import { CommandContext, Context } from "grammy"

export type Command = {
    [key: string]: (ctx: CommandContext<Context>) => void
}