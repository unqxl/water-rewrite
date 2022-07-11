import Command = require("@lib/classes/Command");
import Event = require("@lib/classes/Event");
import { Collection } from "discord.js";

declare module "discord.js" {
  interface Client {
    commands: Collection<string, Command>;
    events: Collection<string, Event>;
  }
}
