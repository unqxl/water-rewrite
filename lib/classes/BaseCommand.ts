import {
  ApplicationCommandOptionData,
  ChatInputCommandInteraction,
  LocalizationMap,
  PermissionsString,
} from "discord.js";
import Bot = require("./Bot");
import Logger = require("./Logger");

export interface BaseCommandOptions {
  name: string;
  description: string;
  descriptionLocalizations?: LocalizationMap;

  options?: ApplicationCommandOptionData[];

  ownerOnly?: boolean;
  memberPermissions?: PermissionsString[];
  clientPermissions?: PermissionsString[];
}

export class BaseCommand<
  TOptions extends BaseCommandOptions = BaseCommandOptions
> {
  protected _options: TOptions;

  public client: Bot;
  public logger: Logger;

  public name: string;

  constructor(client: Bot, options: TOptions) {
    this.client = client;
    this.logger = new Logger();

    this.name = options.name;
    this._options = options;

    this.run = this.run?.bind(this);
  }

  get options(): TOptions {
    return this._options;
  }

  run(command: ChatInputCommandInteraction) {
    throw this.logger.error(
      `Command.run() is not implemented in "${this.name}" command!`
    );
  }
}
