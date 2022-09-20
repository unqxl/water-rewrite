import Bot = require("@lib/classes/Bot");
import { SubCommand } from "@lib/classes/SubCommand";
import { GuildData } from "@lib/interfaces/GuildData";
import {
  ApplicationCommandOptionType,
  ChatInputCommandInteraction,
  GuildMember,
} from "discord.js";
import ModerationSystem = require("@lib/systems/Moderation");

export = class UnmuteCommand extends SubCommand {
  constructor(client: Bot) {
    super(client, {
      commandName: "moderation",

      name: "unmute",
      description: "Unmutes a user.",
      descriptionLocalizations: {
        ru: "Разглушает пользователя.",
      },

      defaultMemberPermissions: ["ModerateMembers"],
      clientPermissions: ["ManageRoles"],

      options: [
        {
          type: ApplicationCommandOptionType.User,
          name: "user",
          description: "The user to unmute.",
          descriptionLocalizations: {
            ru: "Пользователь, которого нужно разглушить.",
          },
          required: true,
        },
      ],
    });
  }

  async run(command: ChatInputCommandInteraction, config: GuildData) {
    const member = command.options.getMember("user") as GuildMember;
    const moderation = new ModerationSystem(this.client);

    const result = moderation.unmute(
      command.guildId,
      command.member as GuildMember
    );

    if (result.success !== true) {
      const embed = this.errorEmbed(command, result.message);
      return command.reply({
        embeds: [embed],
      });
    } else {
      const embed = this.embed(command, `${member.user.tag} has been muted.`);
      return command.reply({
        embeds: [embed],
      });
    }
  }
};
