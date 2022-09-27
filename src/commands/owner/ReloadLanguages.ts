import Bot = require("@lib/classes/Bot");
import { SubCommand } from "@lib/classes/SubCommand";
import { GuildData } from "@lib/interfaces/GuildData";
import { ChatInputCommandInteraction } from "discord.js";
import { TFunction } from "i18next";

export = class ReloadLanguagesCommand extends SubCommand {
  constructor(client: Bot) {
    super(client, {
      commandName: "owner",
      name: "reload_languages",

      description: "Allows you to reload language packs.",
      descriptionLocalizations: {
        ru: "Позволяет перезагрузить языковые пакеты.",
      },

      ownerOnly: true,
    });
  }

  async run(
    command: ChatInputCommandInteraction,
    config: GuildData,
    t: TFunction
  ) {
    await this.client.i18n.reloadResources();

    const embed = this.embed(
      command,
      t("owner:reload_languages.success"),
      "✅"
    );

    return command.reply({
      embeds: [embed],
    });
  }
};
