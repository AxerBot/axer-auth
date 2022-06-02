import dotenv from "dotenv";
dotenv.config();
const token = process.env.DISCORD_BOT_TOKEN;
import "colors";
import { Client, Intents, Message } from "discord.js";
import { consoleCheck } from "./logger";
import express from "express";
import path from "path";
dotenv.config();
import getVerification from "./helpers/getVerification";
import validateUser from "./helpers/validateUser";
import ".";

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

  const server = express();

  server.use(
    "/static",
    express.static(path.resolve(__dirname.concat("/static")))
  );

  server.get("/authorize/", (req, res) =>
    res
      .status(200)
      .sendFile(path.resolve(__dirname.concat("/pages/SaveCredentials.html")))
  );

  server.get("/getVerification/:user/:code", getVerification);

  server.get("/validate", (req, res) =>
    res
      .status(200)
      .sendFile(
        path.resolve(__dirname.concat("/pages/ValidateCredentials.html"))
      )
  );

  server.post("/validateUser/:user/:guild", validateUser);

  server.listen(process.env.PORT || 3000, () => {
    consoleCheck("server", "Server running!");
  });
});

export default bot;
