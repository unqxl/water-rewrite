import Event = require("@lib/classes/Event");
import Database = require("@lib/systems/Database");
import { Guild } from "discord.js";

export = class GuildDelete extends Event {
  constructor() {
    super("guildDelete");
  }

  run(guild: Guild) {
    const database = new Database(this.client);
    database.deleteGuild(guild.id);
  }
};
