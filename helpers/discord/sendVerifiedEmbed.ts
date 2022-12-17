import { Guild, GuildMember, MessageEmbed } from "discord.js";
import moment from "moment";
import { User } from "../../types/user";
import { parseTime } from "../parseTime";
import { consoleError } from "../../logger";
import getEmoji from "../getEmoji";

export async function sendVerifiedEmbed(
	user: User,
	guild: Guild,
	member: GuildMember,
	guild_db: any
) {
	const usergroups = user.groups
		?.map((group) => {
			return (
				`- ${group.short_name} ` +
				group.playmodes
					.map((mode: string) => {
						return `${getEmoji(mode)} `;
					})
					.join("")
					.trim()
			);
		})
		.join("\n");

	const totalMapsets =
		Number(user.ranked_and_approved_beatmapset_count) +
		Number(user.loved_beatmapset_count) +
		Number(user.pending_beatmapset_count) +
		Number(user.graveyard_beatmapset_count);

	const embed = new MessageEmbed()
		.setTitle(`✅ You are verified, ${user.username}!`)
		.setDescription(`Welcome to **${guild.name}**!`)
		.addField(
			"osu! profile",
			`[${user.username}](https://osu.ppy.sh/users/${user.id})`,
			true
		)
		.addField(
			"Ranks",
			`${getEmoji(user.playmode.toString())} 🌎 #${
				user.statistics?.global_rank
					? user.statistics?.global_rank
					: "-"
			} (${user.statistics?.pp ? Math.round(user.statistics?.pp) : "-"}pp)
            ${getEmoji(
				user.playmode.toString()
			)} :flag_${user.country_code.toLowerCase()}: #${
				user.statistics?.country_rank
					? user.statistics?.country_rank
					: "-"
			}`,
			true
		)
		.addField("\u200b", "\u200b", true)
		.addField(
			"Beatmap statistics",
			`🗺️ ${totalMapsets} ✅ ${
				user.ranked_and_approved_beatmapset_count
			} 👥 ${user.guest_beatmapset_count}
            ❤ ${user.loved_beatmapset_count} ❓ ${
				Number(user.pending_beatmapset_count) +
				Number(user.graveyard_beatmapset_count)
			} 💭 ${user.nominated_beatmapset_count}
            `,
			true
		)
		.addField("User group(s)", usergroups ? usergroups : "-", true)
		.setThumbnail(user.avatar_url)
		.setColor("#07f472");

	const verificationChannel: any = await guild.client.channels.fetch(
		guild_db.verification.channel
	);

	verificationChannel.send({
		content: `<@${member.id}>`,
		embeds: [embed],
	});
}
