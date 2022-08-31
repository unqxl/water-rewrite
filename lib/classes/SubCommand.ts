import {
  ApplicationCommandOptionType,
  bold,
  ChatInputCommandInteraction,
  EmbedBuilder,
} from "discord.js";
import { BaseCommand, BaseCommandOptions } from "./Command/BaseCommand";

export interface SubCommandOptions extends BaseCommandOptions {
  commandName: string;
  group?: string;
}

export class SubCommand extends BaseCommand<SubCommandOptions> {
  get options(): SubCommandOptions & {
    type: ApplicationCommandOptionType.Subcommand;
  } {
    return {
      type: ApplicationCommandOptionType.Subcommand,
      ...this._options,
    };
  }

  getEmbedAuthor(cmd: ChatInputCommandInteraction) {
    return {
      name: cmd.user.username,
      iconURL: cmd.user.avatarURL({ size: 4096 }),
    };
  }

  errorEmbed(cmd: ChatInputCommandInteraction, message: string) {
    const embed = new EmbedBuilder();
    embed.setColor("Blurple");
    embed.setAuthor(this.getEmbedAuthor(cmd));
    embed.setDescription(`❌ | ${bold(message)}`);
    embed.setTimestamp();

    return embed;
  }

  embed(
    cmd: ChatInputCommandInteraction,
    message: string,
    emoji?: string,
    _bold?: boolean
  ) {
    var description = "";
    if (typeof emoji === "string") {
      if (_bold === true) {
        description = `${emoji} | ${bold(message)}`;
      } else {
        description = `${emoji} | ${message}`;
      }
    } else {
      if (_bold === true) {
        description = bold(message);
      } else {
        description = message;
      }
    }

    const embed = new EmbedBuilder();
    embed.setColor("Blurple");
    embed.setAuthor(this.getEmbedAuthor(cmd));
    embed.setDescription(description);
    embed.setTimestamp();

    return embed;
  }
}
