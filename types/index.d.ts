import Command = require("@lib/classes/BaseCommand");
import Event = require("@lib/classes/Event");
import { GuildData } from "@lib/interfaces/GuildData";
import { Collection } from "discord.js";
import DisTube from "distube";
import Enmap from "enmap";

declare module "discord.js" {
  interface Client {
    commands: Collection<string, Command>;
    events: Collection<string, Event>;

    databases: {
      guilds: Enmap<string, GuildData>;
    };

    distube: DisTube;
  }
}
