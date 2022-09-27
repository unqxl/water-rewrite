import Bot = require("@lib/classes/Bot");
import { SubCommand } from "@lib/classes/SubCommand";
import { GuildData } from "@lib/interfaces/GuildData";
import {
  bold,
  ChatInputCommandInteraction,
  escapeMarkdown,
  Guild,
  inlineCode,
} from "discord.js";
import { TFunction } from "i18next";

export = class ConfigCommand extends SubCommand {
  constructor(client: Bot) {
    super(client, {
      commandName: "configuration",
      name: "config",

      description: "Allows you to get the current configuration of the server.",
      descriptionLocalizations: {
        ru: "Позволяет получить текущую конфигурацию сервера.",
      },

      defaultMemberPermissions: ["Administrator"],
    });
  }

  async run(
    command: ChatInputCommandInteraction,
    config: GuildData,
    t: TFunction
  ) {
    const data = await this.fromConfig(command.guild, config, t);
    const embed = this.embed(command, data, null, false);
    embed.setThumbnail(command.guild.iconURL({ size: 4096 }));

    return command.reply({
      embeds: [embed],
    });
  }

  async fromConfig(
    guild: Guild,
    config: GuildData,
    t: TFunction
  ): Promise<string> {
    const { locale, roles, systems, texts } = config;
    const languages = {
      "en-US": bold("English"),
      "ru-RU": bold("Русский"),
      "uk-UA": bold("Український"),
    };

    var auto_role: string = "";
    var mute_role: string = "";
    var streamers: string[] = [];
    var twitch: string;

    if (roles.auto === null) auto_role = bold(t("words:word.none"));
    else auto_role = guild.roles.cache.get(roles.auto).toString();

    if (roles.mute === null) mute_role = bold(t("words:word.none"));
    else guild.roles.cache.get(roles.auto).toString();

    if (systems.twitch.enabled === false) {
      twitch = bold(t("words:word.disabled"));
    } else if (systems.twitch.enabled === true) {
      twitch = bold(t("words:word.enabled"));
    }

    if (!systems.twitch.streamers.length) {
      streamers.push(bold(t("words:word.none")));
    } else {
      for (const streamer of systems.twitch.streamers) {
        streamers.push(bold(streamer.name));
      }
    }

    const _texts = await Promise.all([
      t("configuration:config.text", {
        name: escapeMarkdown(guild.name),
      }) as string,

      t("configuration:config.field.localization") as string,
      t("configuration:config.fields.guild_roles") as string,
      t("configuration:config.fields.systems") as string,
      t("configuration:config.fields.texts") as string,

      t("configuration:config.subfield.auto_role") as string,
      t("configuration:config.subfield.mute_role") as string,
      t("configuration:config.subfield.twitch_system") as string,
      t("configuration:config.subfield.twitch_streamers") as string,
      t("configuration:config.subfield.welcome_text") as string,
      t("configuration:config.subfield.goodbye_text") as string,
      t("configuration:config.subfield.boost_text") as string,
      t("configuration:config.subfield.unboost_text") as string,
    ]);

    var res = `${bold(_texts[0])}\n\n`;
    res += `› ${bold(_texts[1])}: ${languages[locale]} \n\n`;
    res += `› ${bold(_texts[2])}: \n`;
    res += `» ${bold(_texts[5])}: ${auto_role} \n`;
    res += `» ${bold(_texts[6])}: ${mute_role} \n\n`;
    res += `› ${bold(_texts[3])}: \n`;
    res += `» ${bold(_texts[7])}: ${twitch} \n`;
    res += `» ${bold(_texts[8])}: ${streamers.join(", ")} \n\n`;
    res += `› ${bold(_texts[4])}: \n`;
    res += `» ${bold(_texts[9])}: \n${inlineCode(texts.welcome)} \n\n`;
    res += `» ${bold(_texts[10])}: \n${inlineCode(texts.goodbye)} \n\n`;
    res += `» ${bold(_texts[11])}: \n${inlineCode(texts.boost)} \n\n`;
    res += `» ${bold(_texts[12])}: \n${inlineCode(texts.unboost)}`;

    return res;
  }
};
