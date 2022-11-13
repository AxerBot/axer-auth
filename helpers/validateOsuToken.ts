import axios from "axios";

export default async (code: string) => {
	try {
		const r = await axios("https://osu.ppy.sh/oauth/token", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			data: JSON.stringify({
				client_id: process.env.OSU_CLIENT_ID,
				client_secret: process.env.OSU_CLIENT_SECRET,
				code: code,
				grant_type: "authorization_code",
				redirect_uri: encodeURI(process.env.OSU_REDIRECT_URI || ""),
			}),
		});

		return {
			status: 200,
			message: "Found!",
			data: r.data,
		};
	} catch (e: any) {
		console.log(e);
		return {
			status: 500,
			message: e.message,
			data: {},
		};
	}
};
