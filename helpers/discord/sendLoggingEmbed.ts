import { Guild, GuildMember, MessageEmbed } from "discord.js";
import moment from "moment";
import { User } from "../../types/user";
import { parseTime } from "../parseTime";
import { consoleError } from "../../logger";

export async function sendLoggingEmbed(
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


	if (guild_db.logging.enabled) {
		const logChannel: any = await guild.channels.fetch(
			guild_db.logging.channel
		);

		if (logChannel) {
			const accountHistory = user.account_history
				?.map((silence) => {
					return `- <t:${moment(silence.timestamp).unix()}:R> | ${
						silence.description
					} | ${parseTime(silence.length)}`;
				})
				.join("\n");

			const logEmbed = new MessageEmbed()
				.setColor("#07f472")
				.setAuthor({
					name: member.nickname
						? `${member.nickname} (${member.user.tag})`
						: member.user.tag,
					iconURL: member.user.displayAvatarURL(),
				})
				.setThumbnail(user.avatar_url)
				.setDescription(`✅ ${member.user} has been verified!`)
				.addField("User id", member.id, true)
				.addField("User tag", member.user.tag, true)
				.addField("\u200b", "\u200b", true)
				.addField("osu! id", user.id.toString(), true)
				.addField("osu! username", user.username, true)
				.addField(
					"osu! profile",
					`[Link](https://osu.ppy.sh/users/${user.id})`,
					true
				)
				.addField(
					"osu! join date",
					`<t:${moment(user.join_date).format("X")}:f>`,
					true
				)
				.addField(
					"Country",
					user.country ? user.country.name : "Unknown",
					true
				)
				.addField(
					"User group(s)",
					usergroups ? usergroups : "None",
					true
				)
				.setTimestamp();

			accountHistory
				? logEmbed.addField("Account history", accountHistory)
				: null;

			logChannel.send({ embeds: [logEmbed] });
		} else {
			consoleError("logging channel", "Log channel not found");
		}
	}
}
