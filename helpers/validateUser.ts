import { Request, Response } from "express";
import { guilds, users } from "../database";
import fetchTokenOwner from "./fetchTokenOwner";
import validateOsuToken from "./validateOsuToken";
import validateServerRequirements from "./discord/validateServerRequirements";

export default async (req: Request, res: Response) => {
	const user = req.params.user;
	const guild = req.params.guild;
	const code = req.query.code;
	const token = req.headers.authorization;

	const user_db = await users.findById(user);
	const guild_db = await guilds.findById(guild);

	if (!code)
		return res.status(400).send({
			status: 400,
			message: "Provide a valid code!",
		});

	if (user_db == null || guild_db == null)
		return res.status(404).send({
			status: 404,
			message: "User/Guild not found!",
		});

	const verification_data = user_db.pending_verifications.find(
		(v: any) => v.token == token
	);

	if (!verification_data)
		return res.status(403).send({
			status: 403,
			message: "Invalid verification requested",
		});

	const osuTokenData = await validateOsuToken(code.toString());

	if (osuTokenData.status != 200)
		return res.status(osuTokenData.status).send({
			status: osuTokenData.status,
			message: osuTokenData.message,
		});

	const osuUser = await fetchTokenOwner(osuTokenData.data.access_token);

	if (osuUser.status != 200)
		return res.status(osuUser.status).send({
			status: osuUser.status,
			message: osuUser.message,
		});

	const requirements = await validateServerRequirements(
		osuUser.data,
		verification_data.guild,
		verification_data.user,
		code.toString()
	);

	if (requirements.status != 200)
		return res.status(requirements.status).send({
			status: requirements.status,
			message: requirements.message,
		});

	const verificationIndex = user_db.pending_verifications.findIndex(
		(v: any) => v.token == token
	);

	user_db.pending_verifications.splice(verificationIndex, 1);
	await users.findByIdAndUpdate(user_db._id, user_db);

	return res.status(200).send({
		status: 200,
		message: "Found!",
		data: verification_data,
	});
};
