import Event = require("@lib/classes/Event");
import { Manager } from "@djs-modules/giveaways";
import { Command } from "@lib/classes/Command";
import { ContextCommand } from "@lib/classes/Command/ContextCommand";
import { Collection } from "discord.js";
import DisTube from "distube";
import Enmap from "enmap";
import Functions = require("@lib/classes/Functions");

// Interfaces
import { GuildData } from "@lib/interfaces/GuildData";
import { ModerationLogData } from "@lib/interfaces/ModerationData";

declare module "discord.js" {
  interface Client {
    commands: Collection<string, Command | ContextCommand>;
    events: Collection<string, Event>;

    databases: {
      guilds: Enmap<string, GuildData>;
      moderation: Enmap<string, ModerationLogData[]>;
    };

    functions: Functions;
    giveaways: Manager;
    distube: DisTube;
  }
}
