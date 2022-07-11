import { CommandData } from "@lib/interfaces/CommandData";
import { Collection } from "discord.js";

declare module "discord.js" {
  interface Client {
    commands: Collection<string, CommandData>;
    events: Collection<string, CommandData>;
  }
}
