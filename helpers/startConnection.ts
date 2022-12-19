/**
 * * ======================== startConnection
 * ? Get authorization token
 */

import axios from "axios";
const osu_client_id = process.env.OSU_CLIENT_ID;
const osu_client_secret = process.env.OSU_CLIENT_SECRET;

async function listen() {
	console.log("Refreshing server authorization token");

	let tokens: any = {};

	try {
		let _t = await axios("https://osu.ppy.sh/oauth/token", {
			method: "post",
			timeout: 999999,
			headers: {
				"Content-Type": "application/json",
			},
			data: {
				client_id: osu_client_id,
				client_secret: osu_client_secret,
				grant_type: "client_credentials",
				scope: "public",
			},
		});

		tokens = _t.data;

		// Auto-Refresh token
		setTimeout(listen, Number(tokens.expires_in) * 1000);

		process.env.OSU_API_ACCESS_TOKEN = tokens.access_token;

		console.log("Server authorization token refreshed");

		return tokens;
	} catch (e: any) {
		console.log("Error during token refresh:\n");
		console.error(e);

		setTimeout(listen, 5000);
		return tokens;
	}
}

listen();
