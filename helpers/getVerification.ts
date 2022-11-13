import { Request, Response } from "express";
import { users } from "../database";

export default async (req: Request, res: Response) => {
	const user = req.params.user;
	const code = req.params.code;

	const user_db = await users.findById(user);

	if (user_db == null)
		return res.status(404).send({
			status: 404,
			message: "User not found!",
		});

	const verification_data = user_db.pending_verifications.find(
		(v: any) => v.token == code
	);

	if (!verification_data)
		return res.status(403).send({
			status: 403,
			message: "Invalid verification requested",
		});

	return res.status(200).send({
		status: 200,
		message: "Found!",
		data: verification_data,
	});
};
