import Handler = require("@lib/classes/Handler");
import { Client } from "discord.js";
import { promisify } from "util";

import * as Glob from "glob";
import * as path from "path";
const glob = promisify(Glob);

export = class EventHandler extends Handler {
  constructor(client: Client) {
    super(client, "EventHandler");
  }

  async handle() {
    const template = "./events/**/*{.ts, .js}";
    const files = await glob(template);
    if (!files.length) return this.logger.warn("No events found!");

    for (const file of files) {
      const EventFile = await import(path.resolve(file));
      const Event = new EventFile();

      this.client.on(Event.name, (...args) => {
        Event.run(...args);
      });
    }

    this.logger.log(`Loaded ${files.length} events!`);
  }
};
