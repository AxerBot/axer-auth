import axios from "axios";

export default async (code: string) => {
	try {
		const r = await axios("https://osu.ppy.sh/api/v2/me", {
			headers: {
				Accept: "application/json",
				authorization: `Bearer ${code}`,
			},
		});

		return {
			status: 200,
			message: "Found!",
			data: r.data,
		};
	} catch (e: any) {
		return {
			status: 500,
			message: e.message,
			data: {},
		};
	}
};
