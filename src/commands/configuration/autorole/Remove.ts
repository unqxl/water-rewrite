import Bot = require("@lib/classes/Bot");
import { SubCommand } from "@lib/classes/SubCommand";
import { GuildData } from "@lib/interfaces/GuildData";
import { ChatInputCommandInteraction } from "discord.js";
import { TFunction } from "i18next";

export = class AutoRoleRemoveCommand extends SubCommand {
  constructor(client: Bot) {
    super(client, {
      group: "autorole",
      commandName: "configuration",
      name: "remove",

      description: "Removes an automatically assigned role to the server.",
      descriptionLocalizations: {
        ru: "Удаляет автоматически выдаваемую роль на сервере.",
      },

      defaultMemberPermissions: ["ManageGuild"],
    });
  }

  async run(
    command: ChatInputCommandInteraction,
    config: GuildData,
    t: TFunction
  ) {
    if (config.roles.auto === null) {
      const embed = this.errorEmbed(
        command,
        t("configuration:autorole.not_setted")
      );

      return command.reply({
        embeds: [embed],
        ephemeral: true,
      });
    }

    config.roles.auto = null;
    const embed = this.embed(
      command,
      t("configuration:autorole.removed"),
      "✅"
    );

    return command.reply({
      embeds: [embed],
    });
  }
};
