import Logger = require("./Logger");
import Client = require("@src/index");
import Bot = require("./Bot");

export = class Event {
  public client: Bot;
  public logger: Logger;

  public name: string;

  public constructor(name: string) {
    this.client = Client;
    this.logger = new Logger();

    this.name = name;
    this.run = this.run?.bind(this);
  }

  public run(...args: any[]) {
    throw this.logger.error(
      `Run method isn't implemented in event "${this.name}"!`
    );
  }
};
