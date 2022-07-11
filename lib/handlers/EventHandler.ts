import Handler = require("@lib/classes/Handler");
import Bot = require("@lib/classes/Bot");
import { promisify } from "util";

import Glob from "glob";
import path from "path";
const glob = promisify(Glob);

export = class EventHandler extends Handler {
  constructor(client: Bot) {
    super(client, "EventHandler");
  }

  async handle() {
    const template = "./events/**/*{.ts, .js}";
    const files = await glob(template);
    if (!files.length) return this.logger.warn("No events found!");

    for (const file of files) {
      const EventFile = (await import(path.resolve(file))).default;
      const Event = new EventFile();

      this.client.on(Event.name, (...args) => {
        Event.run(...args);
      });
    }

    this.logger.log(`Loaded ${files.length} events!`);
  }
};
