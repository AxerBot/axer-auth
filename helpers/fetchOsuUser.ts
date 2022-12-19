import axios from "axios";

export default async (token: string, mode: string, id?: string | number) => {
	try {
		const r = await axios(
			`https://osu.ppy.sh/api/v2/${id ? `users/${id}` : "me"}/`.concat(
				mode
			),
			{
				headers: {
					Accept: "application/json",
					authorization: `Bearer ${token}`,
				},
			}
		);

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
