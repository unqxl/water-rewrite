import { GuildData } from "@lib/interfaces/GuildData";
import {
  ApplicationCommandOptionData,
  AutocompleteInteraction,
  ChatInputCommandInteraction,
  LocalizationMap,
  PermissionResolvable,
  PermissionsString,
} from "discord.js";
import { TFunction } from "i18next";
import Bot = require("../Bot");
import Logger = require("../Logger");

export interface BaseCommandOptions {
  name: string;
  description: string;
  descriptionLocalizations?: LocalizationMap;

  options?: ApplicationCommandOptionData[];

  ownerOnly?: boolean;
  clientPermissions?: PermissionsString[];
  defaultMemberPermissions?: PermissionResolvable;
  dmPermission?: boolean;
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

  autocomplete(command: AutocompleteInteraction, config: GuildData) {}

  run(command: ChatInputCommandInteraction, config: GuildData, t: TFunction) {
    throw this.logger.error(
      `Command.run() is not implemented in "${this.name}" command!`
    );
  }
}
