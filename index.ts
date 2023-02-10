import dotenv from "dotenv";
dotenv.config();
const token = process.env.DISCORD_BOT_TOKEN;
import "colors";
import "./helpers/startConnection";
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

	// server.get("*", (req, res) => {
	// 	if (
	// 		req.headers["user-agent"] ==
	// 		"Mozilla/5.0 (compatible; Discordbot/2.0; +https://discordapp.com)"
	// 	)
	// 		return res.status(200).send(`<html lang="en">
	//     <head>
	//       <meta charset="UTF-8" />
	//       <meta name="viewport" content="width=device-width, initial-scale=1.0" />
	//       <meta property="og:title" content="AxerBot Verification">
	//       <meta property="og:site_name" content="AxerBot">
	//       <meta content="#f45592" data-react-helmet="true" name="theme-color" />
	//       <meta property="og:type" content="profile">
	//     </head>
	//   </html>`);
	// });

	server.use(
		"/static",
		express.static(path.resolve(__dirname.concat("/static")))
	);

	server.get("/authorize/", (req, res) =>
		res
			.status(200)
			.sendFile(
				process.env.NODE_ENV != "production"
					? path.resolve(
							__dirname.concat("/pages/SaveCredentialsDev.html")
					  )
					: path.resolve(
							__dirname.concat("/pages/SaveCredentials.html")
					  )
			)
	);

	server.get("/getVerification/:user/:code", getVerification);

	server.get("/validate", (req, res) =>
		res
			.status(200)
			.sendFile(
				path.resolve(
					__dirname.concat("/pages/ValidateCredentials.html")
				)
			)
	);

	server.post("/validateUser/:user/:guild", validateUser);

	server.listen(process.env.PORT || 3000, () => {
		consoleCheck("server", "Server running!");
	});
});

export default bot;
