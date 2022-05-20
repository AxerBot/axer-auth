import dotenv from "dotenv";
dotenv.config();
const token = process.env.DISCORD_BOT_TOKEN;
import "colors";
import { Client, Intents, Message } from "discord.js";
import { consoleCheck } from "./logger";

const bot = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    Intents.FLAGS.GUILD_MESSAGE_TYPING,
    Intents.FLAGS.DIRECT_MESSAGES,
    Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
    Intents.FLAGS.DIRECT_MESSAGE_TYPING,
  ],
});

bot.login(token).then(() => {
  consoleCheck("index.ts", "Running and listening to commands!");
});

export default bot;
