import { CommandData } from "@lib/interfaces/CommandData";
import {
  ApplicationCommandOptionData,
  CommandInteraction,
  CommandInteractionOptionResolver,
  LocalizationMap,
  PermissionsString,
} from "discord.js";
import Bot = require("./Bot");
import Logger = require("./Logger");

export = class Command implements CommandData {
  public client: Bot;
  public logger: Logger;

  public name: string;
  public description: string;
  public descriptionLocalized?: LocalizationMap;
  public options: ApplicationCommandOptionData[];
  public clientPermissions: PermissionsString[];
  public memberPermissions: PermissionsString[];

  constructor(client: Bot, data: CommandData) {
    this.client = client;
    this.logger = new Logger();

    this.name = data.name;
    this.description = data.description;
    this.descriptionLocalized = data.descriptionLocalized;
    this.options = data.options;

    this.clientPermissions = data.clientPermissions;
    this.memberPermissions = data.memberPermissions;

    void this.handle();
    this.run = this.run?.bind(this);
  }

  private handle() {
    this.client.commands.set(this.name, this);
    this.client.application.commands.create(this);

    this.logger.log(`Command "${this.name}" has been loaded!`);
  }

  public run(
    command: CommandInteraction,
    options: CommandInteractionOptionResolver
  ) {
    throw this.logger.error(
      `Run method isn't implemented in command "${this.name}"!`
    );
  }
};
