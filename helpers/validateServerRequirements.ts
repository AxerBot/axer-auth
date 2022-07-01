import { MessageEmbed } from "discord.js";
import { guilds } from "../database";
import bot from "..";

export default async (user: any, _guild: string, _member: string) => {
  try {
    const guild = await bot.guilds.fetch(_guild);

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
      try {
        const role = await guild.roles.fetch(_role);

        if (role) {
          await member.roles.add(role).catch((e) => {
            console.error(e);
          });
        }
      } catch (e) {
        console.error(e);
      }
    }

    // * ================= Add group roles for users not in probation
    // TODO: Typing
    const nonProbationRoles = guild_db.verification.targets.group_roles.filter(
      (role: any) => !["PBN"].includes(role.group)
    );

    for (const role of nonProbationRoles) {
      try {
        const TargetUserUserGroup = user.groups.find(
          (g: any) => g.short_name == role.group
        );
        const GroupRole = await guild.roles.fetch(role.id);
        let AllowAddRole = true; // ? If the usergroup modes array has the required mode, add the role

        // * ======= Add by modes if exists
        if (TargetUserUserGroup && role.modes.length != 0) {
          // * ===== Parse gamemodes and update AllowAddRole
          TargetUserUserGroup.modes.forEach((mode: string) => {
            if (!role.modes.includes(mode.toLowerCase())) AllowAddRole = false;
          });
        }

        // ? Finally, add the role
        if (AllowAddRole && GroupRole) {
          await member.roles.add(GroupRole);
        }
      } catch (e) {
        console.error(e);
      }
    }

    // * ================= Add group roles for users IN probation
    // TODO: Typing
    const ProbationRoles = guild_db.verification.targets.group_roles.filter(
      (role: any) => ["PBN"].includes(role.group)
    );

    for (const role of ProbationRoles) {
      try {
        const TargetUserUserGroup = user.groups.find(
          (g: any) => g.short_name == role.group
        );
        const GroupRole = await guild.roles.fetch(role.id);
        let AllowAddRole = true; // ? If the usergroup modes array has the required mode, add the role

        // * ======= Add by modes if exists
        if (TargetUserUserGroup && role.modes.length != 0) {
          // * ===== Parse gamemodes and update AllowAddRole
          TargetUserUserGroup.modes.forEach((mode: string) => {
            if (!role.modes.includes(mode.toLowerCase())) AllowAddRole = false;
          });
        }

        // ? Finally, add the role
        if (AllowAddRole && GroupRole) {
          await member.roles.add(GroupRole);
        }
      } catch (e) {
        console.log(e);
      }
    }

    // for (const target_role of guild_db.verification.targets.group_roles) {
    //   const role = await guild.roles.fetch(target_role.id);

    //   if (role) {
    //     // ? Add probationary bn role
    //     if (
    //       target_role.group == "PBN" &&
    //       user.groups.find(
    //         (g: any) => g.short_name == "BN" && g.is_probationary
    //       )
    //     ) {
    //       // ? Check the group modes
    //       if (target_role.modes) {
    //         const target_group = user.groups.find(
    //           (g: any) => g.short_name == "BN" && g.is_probationary
    //         );

    //         let allow_add = false;

    //         target_role.modes.forEach((mode: string) => {
    //           if (target_group.modes.includes(mode)) allow_add = true;
    //         });

    //         if (allow_add) await member.roles.add(role);
    //       } else {
    //         const target_group = user.groups.find(
    //           (g: any) => g.short_name == target_role.group
    //         );

    //         if (target_group) await member.roles.add(role);
    //       }
    //     } else {
    //       if (target_role.modes) {
    //         const target_group = user.groups.find(
    //           (g: any) => g.short_name == target_role.group
    //         );

    //         let allow_add = false;

    //         target_role.modes.forEach((mode: string) => {
    //           if (target_group.modes.includes(mode)) allow_add = true;
    //         });

    //         if (allow_add) await member.roles.add(role);
    //       } else {
    //         const target_group = user.groups.find(
    //           (g: any) => g.short_name == target_role.group
    //         );

    //         if (target_group) await member.roles.add(role);
    //       }
    //     }
    //   }
    // }

    // usergroups.forEach((group) => {
    //   guild_db.verification.targets.group_roles
    //     .filter((r: any) => r.group == group)
    //     .forEach((role_object: any) => {
    //       const role = guild.roles.cache.get(role_object.id);

    //       if (!role) return;

    //       if (group == "PBN") {
    //         if (
    //           user.groups.find(
    //             (g: any) => g.short_name == group && g.is_probationary
    //           )
    //         ) {
    //           member.roles.add(role).catch((e) => {
    //             console.error(e);
    //           });
    //         }
    //       } else {
    //         if (user.groups.find((g: any) => g.short_name == group)) {
    //           member.roles.add(role).catch((e) => {
    //             console.error(e);
    //           });
    //         }
    //       }
    //     });
    // });

    const embed = new MessageEmbed({
      title: `✅ You are verified, ${user.username}!`,
      description: `Welcome to **${guild.name}**!`,
      color: "#07f472",
    });

    const guild_channel: any = await guild.client.channels.fetch(
      guild_db.verification.channel
    );

    guild_channel.send({
      content: `<@${member.id}>`,
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
