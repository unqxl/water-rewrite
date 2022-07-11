import { Client } from "discord.js";
import Logger = require("./Logger");

export = class Handler {
  public client: Client;
  public logger: Logger;
  public name: string;

  constructor(client: Client, name: string) {
    this.client = client;
    this.logger = new Logger();
    this.name = name;
  }

  handle(): any {
    throw this.logger.error(
      `Handler.handle() is not implemented in handler "${this.name}"!`
    );
  }
};
