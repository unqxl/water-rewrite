import Bot = require("@lib/classes/Bot");
import { SubCommand } from "@lib/classes/SubCommand";
import { GuildData } from "@lib/interfaces/GuildData";
import {
  ApplicationCommandOptionType,
  ChatInputCommandInteraction,
  GuildMember,
} from "discord.js";
import ModerationSystem = require("@lib/systems/Moderation");
import ms = require("ms");

export = class MuteCommand extends SubCommand {
  constructor(client: Bot) {
    super(client, {
      commandName: "moderation",

      name: "mute",
      description: "Mutes a user.",
      descriptionLocalizations: {
        ru: "Заглушает пользователя.",
      },

      defaultMemberPermissions: ["ModerateMembers"],
      clientPermissions: ["ManageRoles"],

      options: [
        {
          type: ApplicationCommandOptionType.User,
          name: "user",
          description: "The user to mute.",
          descriptionLocalizations: {
            ru: "Пользователь, которого нужно заглушить.",
          },
          required: true,
        },
        {
          type: ApplicationCommandOptionType.String,
          name: "reason",
          description: 'The reason for the mute. (default: "No reason given")',
          descriptionLocalizations: {
            ru: 'Причина заглушения. (по умолчанию: "No reason given")',
          },
          required: false,
        },
        {
          type: ApplicationCommandOptionType.String,
          name: "time",
          description: "The time for the mute (ex: 10m, 1d).",
          descriptionLocalizations: {
            ru: "Время заглушения (примеры: 10m, 1d).",
          },
          required: false,
        },
      ],
    });
  }

  async run(command: ChatInputCommandInteraction, config: GuildData) {
    const member = command.options.getMember("user") as GuildMember;
    const reason = command.options.getString("reason") || "No reason given.";
    const time = command.options.getString("time");

    const moderation = new ModerationSystem(this.client);

    if (!time) {
      const result = moderation.mute(
        command.guildId,
        command.member as GuildMember,
        member,
        reason
      );

      if (result.success !== true) {
        const embed = this.errorEmbed(command, result.message);
        return command.reply({
          embeds: [embed],
          ephemeral: true,
        });
      } else {
        const embed = this.embed(command, `${member.user.tag} has been muted.`);
        return command.reply({
          embeds: [embed],
        });
      }
    } else {
      const result = moderation.tempmute(
        command.guildId,
        command.member as GuildMember,
        member,
        ms(time),
        reason
      );

      if (result.success !== true) {
        const embed = this.errorEmbed(command, result.message);
        return command.reply({
          embeds: [embed],
          ephemeral: true,
        });
      } else {
        const embed = this.embed(
          command,
          `${member.user.tag} has been temporary muted.`
        );

        return command.reply({
          embeds: [embed],
        });
      }
    }
  }
};
