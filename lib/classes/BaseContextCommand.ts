import {
  ContextMenuCommandInteraction,
  PermissionsString,
  LocalizationMap,
} from "discord.js";
import Bot = require("./Bot");
import Logger = require("./Logger");

export interface BaseContextCommandOptions {
  name: string;
  name_localizations?: LocalizationMap;

  memberPermissions?: PermissionsString[];
  clientPermissions?: PermissionsString[];
}

export class BaseContextCommand<
  TOptions extends BaseContextCommandOptions = BaseContextCommandOptions
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

  run(context: ContextMenuCommandInteraction) {
    throw this.logger.error(
      `ContextCommand.run() is not implemented in "${this.name}" command!`
    );
  }
}
