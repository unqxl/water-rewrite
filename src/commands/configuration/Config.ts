import Bot = require("@lib/classes/Bot");
import { SubCommand } from "@lib/classes/SubCommand";
import { GuildData } from "@lib/interfaces/GuildData";
import {
  bold,
  ChatInputCommandInteraction,
  Guild,
  inlineCode,
} from "discord.js";

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

  async run(command: ChatInputCommandInteraction, config: GuildData) {
    const data = this.fromConfig(command.guild, config);
    const embed = this.embed(command, data, null, false);
    embed.setThumbnail(command.guild.iconURL({ size: 4096 }));

    return command.reply({
      embeds: [embed],
    });
  }

  fromConfig(guild: Guild, config: GuildData): string {
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

    if (roles.auto === null) auto_role = bold("None");
    else auto_role = guild.roles.cache.get(roles.auto).toString();

    if (roles.mute === null) mute_role = bold("None");
    else guild.roles.cache.get(roles.auto).toString();

    if (systems.twitch.enabled === false) twitch = bold("Disabled");
    if (systems.twitch.enabled === true) twitch = bold("Enabled");
    if (!systems.twitch.streamers.length) streamers.push(bold("None"));
    else {
      for (const streamer of systems.twitch.streamers) {
        streamers.push(bold(streamer.name));
      }
    }

    var res = `${bold(`Configuration for "${guild.name}":`)}\n\n`;
    res += `› ${bold("Bot's Localization")}: ${languages[locale]} \n\n`;
    res += `› ${bold("Guild Roles")}: \n`;
    res += `» ${bold("Auto Role")}: ${auto_role} \n`;
    res += `» ${bold("Auto Role")}: ${mute_role} \n\n`;
    res += `› ${bold("Systems")}: \n`;
    res += `» ${bold("Twitch System")}: ${twitch} \n`;
    res += `» ${bold("Twitch Streamers")}: ${streamers.join(", ")} \n\n`;
    res += `› ${bold("Texts")}: \n`;
    res += `» ${bold("Welcome Text")}: ${inlineCode(texts.welcome)} \n`;
    res += `» ${bold("Goodbye Text")}: ${inlineCode(texts.goodbye)} \n`;
    res += `» ${bold("Boost Text")}: ${inlineCode(texts.boost)} \n`;
    res += `» ${bold("UnBoost Text")}: ${inlineCode(texts.unboost)}`;

    return res;
  }
};
