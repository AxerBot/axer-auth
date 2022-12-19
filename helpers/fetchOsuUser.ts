import axios from "axios";

export default async (mode: string, id: string | number) => {
	try {
		const r = await axios(
			`https://osu.ppy.sh/api/v2/users/${id}/`.concat(mode),
			{
				headers: {
					Accept: "application/json",
					authorization: `Bearer ${process.env.OSU_API_ACCESS_TOKEN}`,
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
