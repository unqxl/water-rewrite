import {
  ApplicationCommandOptionType,
  ChatInputCommandInteraction,
} from "discord.js";
import { BaseCommand, BaseCommandOptions } from "../BaseCommand";

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
}
