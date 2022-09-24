import Bot = require("@lib/classes/Bot");
import { SubCommand } from "@lib/classes/SubCommand";
import { GuildData, GuildSupportedLocales } from "@lib/interfaces/GuildData";
import {
  ApplicationCommandOptionType,
  AutocompleteInteraction,
  ChatInputCommandInteraction,
} from "discord.js";
import { TFunction } from "i18next";

export = class TestCommand extends SubCommand {
  constructor(client: Bot) {
    super(client, {
      commandName: "configuration",
      name: "language",

      description: "Allows you to change the localization of the bot.",
      descriptionLocalizations: {
        ru: "Позволяет сменить локализацию бота.",
      },

      defaultMemberPermissions: ["ManageGuild"],
      options: [
        {
          type: ApplicationCommandOptionType.String,
          name: "language",

          description: "Bot localization.",
          descriptionLocalizations: {
            ru: "Локализация бота.",
          },

          autocomplete: true,
          required: true,
        },
      ],
    });
  }

  async autocomplete(command: AutocompleteInteraction, config: GuildData) {
    const _config = this.client.config;
    const locales = _config.locales;

    const focused = command.options.getFocused();
    const filtered = locales.filter((l) => l.name.startsWith(focused));

    await command.respond(
      filtered.map((l) => ({ name: l.name, value: l.code }))
    );
  }

  async run(
    command: ChatInputCommandInteraction,
    config: GuildData,
    t: TFunction
  ) {
    const _config = this.client.config;
    const locales = _config.locales;

    const locale = command.options.getString("language", true);
    if (!locales.find((l) => l.code === locale)) {
      const text = t("errors:localeNotFound", {
        code: locale,
      });

      const embed = this.errorEmbed(command, text);
      return command.reply({
        embeds: [embed],
        ephemeral: true,
      });
    }

    config.locale = locale as GuildSupportedLocales;
    this.client.databases.guilds.set(command.guild.id, config);

    const text = t("configuration:language.changed", {
      code: locale,
    });

    const embed = this.embed(command, text, "✅");
    return command.reply({
      embeds: [embed],
    });
  }
};
