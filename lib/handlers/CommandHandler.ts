import Handler = require("@lib/classes/Handler");
import { Client } from "discord.js";
import { promisify } from "util";

import * as Glob from "glob";
import * as path from "path";
const glob = promisify(Glob);

export = class CommandHandler extends Handler {
  constructor(client: Client) {
    super(client, "CommandHandler");
  }

  async handle() {
    const template = "./commands/**/*{.ts, .js}";
    const files = await glob(template);
    if (!files.length) return this.logger.warn("No commands found!");

    for (const file in files) {
      const CommandFile = await import(file);
      new CommandFile();
    }

    this.logger.log(`Loaded ${files.length} commands!`);
  }
};
