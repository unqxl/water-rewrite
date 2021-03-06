import Event = require("@lib/classes/Event");
import Database = require("@lib/systems/Database");
import { Guild } from "discord.js";

export = class GuildCreate extends Event {
  constructor() {
    super({ name: "guildCreate" });
  }

  run(guild: Guild) {
    const database = new Database(this.client);
    database.createGuild(guild.id);
  }
};
