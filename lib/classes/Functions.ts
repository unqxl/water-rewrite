import { DiscordAPIError } from "discord.js";
import Bot from "./Bot";

export = class Functions {
  public client: Bot;

  constructor(client: Bot) {
    this.client = client;
  }

  formatString(string: string, ...args: any[]) {
    return string.replace(/%s/g, () => {
      return args.shift();
    });
  }

  isDiscordError(error: unknown): error is DiscordAPIError {
    return error instanceof DiscordAPIError;
  }
};
