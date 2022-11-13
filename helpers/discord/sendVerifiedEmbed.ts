import { Guild, GuildMember, MessageEmbed } from "discord.js";
import moment from "moment";
import { User } from "../../types/user";
import { parseTime } from "../parseTime";
import { consoleError } from "../../logger";

export async function sendVerifiedEmbed(
	user: User,
	guild: Guild,
	member: GuildMember,
	guild_db: any
) {
	const usergroups = user.groups
		?.map((group) => {
			return group.short_name;
		})
		.join(", ");

	const embed = new MessageEmbed()
		.setTitle(`✅ You are verified, ${user.username}!`)
		.setDescription(`Welcome to **${guild.name}**!`)
		.addField(
			"osu! profile",
			`[${user.username}](https://osu.ppy.sh/users/${user.id})`,
			true
		)
		.setThumbnail(user.avatar_url)
		.setColor("#07f472");

	usergroups && embed.addField("User group(s)", usergroups, true);

	const verificationChannel: any = await guild.client.channels.fetch(
		guild_db.verification.channel
	);

	verificationChannel.send({
		content: `<@${member.id}>`,
		embeds: [embed],
	});
}
