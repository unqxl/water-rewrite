import Bot = require("@lib/classes/Bot");
import { SubCommand } from "@lib/classes/SubCommand";
import { GuildData } from "@lib/interfaces/GuildData";
import { ChatInputCommandInteraction } from "discord.js";

export = class MuteRoleRemoveCommand extends SubCommand {
  constructor(client: Bot) {
    super(client, {
      group: "muterole",
      commandName: "configuration",
      name: "remove",

      description: "Removes an automatically assigned mute role to the server.",
      descriptionLocalizations: {
        ru: "Удаляет автоматически выдаваемую мут роль на сервере.",
      },

      defaultMemberPermissions: ["ManageGuild"],
    });
  }

  async run(command: ChatInputCommandInteraction, config: GuildData) {
    if (config.roles.auto === null) {
      const embed = this.errorEmbed(
        command,
        "The server does not have an mute role!"
      );

      return command.reply({
        embeds: [embed],
        ephemeral: true,
      });
    }

    config.roles.mute = null;
    const embed = this.embed(command, "The Mute-Role has been removed!", "✅");

    return command.reply({
      embeds: [embed],
    });
  }
};
