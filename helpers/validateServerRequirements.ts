import { MessageEmbed } from "discord.js";
import { guilds } from "../database";
import bot from "../discordClient";

export default async (user: any, _guild: string, _member: string) => {
  try {
    const guild = bot.guilds.cache.get(_guild);

    if (!guild)
      return {
        status: 404,
        message: "Guild not found!",
      };

    const member = await guild.members.fetch({ user: _member });

    if (!member)
      return {
        status: 404,
        message: "Member not found!",
      };

    const guild_db = await guilds.findById(guild.id);

    if (guild_db == null)
      return {
        status: 404,
        message: "Guild not found in db!",
      };

    if (guild_db.verification.targets.username) {
      member
        .edit({ nick: user.username }, "AxerBot Verification System")
        .catch(console.error); // ? Sync username to osu! username
    }

    for (const _role of guild_db.verification.targets.default_roles) {
      const role = guild.roles.cache.get(_role);

      if (role) {
        member.roles.add(role).catch((e) => {
          console.error(e);
        });
      }
    }

    const usergroups = ["DEV", "SPT", "NAT", "BN", "PBN", "GMT", "LVD", "ALM"];

    usergroups.forEach((group) => {
      guild_db.verification.targets.group_roles
        .filter((r: any) => r.group == group)
        .forEach((role_object: any) => {
          const role = guild.roles.cache.get(role_object.id);

          if (!role) return;

          if (group == "PBN") {
            if (
              user.groups.find(
                (g: any) => g.short_name == group && g.is_probationary
              )
            ) {
              member.roles.add(role).catch((e) => {
                console.error(e);
              });
            }
          } else {
            if (user.groups.find((g: any) => g.short_name == group)) {
              member.roles.add(role).catch((e) => {
                console.error(e);
              });
            }
          }
        });
    });

    const dm = await member.createDM();
    const embed = new MessageEmbed({
      title: `✅ You are verified, ${member.user.username}!`,
      description: `Welcome to **${guild.name}**!`,
      color: "#07f472",
    });

    dm.send({
      embeds: [embed],
    });

    return {
      status: 200,
      message: "Done!",
    };
  } catch (e: any) {
    console.error(e);
    return {
      status: 500,
      message: e.message,
    };
  }
};
