import Handler = require("@lib/classes/Handler");
import Bot = require("@lib/classes/Bot");
import Event = require("@lib/classes/Event");
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
      if (file.includes("systems")) continue;

      const EventFile = (await import(path.resolve(file))).default;
      const event: Event = new EventFile();

      if (event.emitter === "client") {
        this.client.on(event.name, (...args) => {
          event.run(...args);
        });
      } else if (event.emitter === "process") {
        process.on(event.name, (...args) => {
          event.run(...args);
        });
      } else {
        this.client[event.emitter].on(event.name, (...args) => {
          event.run(...args);
        });
      }
    }

    this.logger.log(`Loaded ${files.length} events!`);
  }
};
