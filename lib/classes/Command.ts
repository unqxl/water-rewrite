import { CommandData } from "@lib/interfaces/CommandData";
import {
  CommandInteraction,
  CommandInteractionOptionResolver,
  PermissionsString,
} from "discord.js";
import Bot = require("./Bot");
import Logger = require("./Logger");

export = class Command {
  public client: Bot;
  public logger: Logger;

  public data: CommandData;
  public clientPermissions: PermissionsString[];
  public memberPermissions: PermissionsString[];

  constructor(client: Bot, data: CommandData) {
    this.client = client;
    this.logger = new Logger();

    this.data = data;

    void this.handle();
    this.run = this.run?.bind(this);
  }

  private handle() {
    this.client.commands.set(this.data.data.name, this);
    this.client.application.commands.create(this.data.data);

    this.logger.log(`Command "${this.data.data.name}" has been loaded!`);
  }

  run(command: CommandInteraction) {
    throw this.logger.error(
      `Run method isn't implemented in command "${this.data.data.name}"!`
    );
  }
};
