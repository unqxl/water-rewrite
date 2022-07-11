import Bot = require("@lib/classes/Bot");
import { ModerationLogType } from "@lib/interfaces/ModerationData";
import { GuildMember } from "discord.js";

export = class ModerationSystem {
  public client: Bot;

  constructor(client: Bot) {
    this.client = client;
  }

  /**
   * Creates a new moderation entry.
   */
  warn(
    guild_id: string,
    executor: GuildMember,
    target: GuildMember,
    reason: string = "-"
  ) {
    const database = this.client.databases.moderation.get(guild_id);
    if (!database) return false;

    database.push({
      id: database.length + 1,
      type: "warn",
      executor: executor.id,
      target: target.id,
      reason: reason,
      timestamp: Date.now(),
    });

    this.client.databases.moderation.set(guild_id, database);
    return true;
  }

  /**
   * Removes last warn from a user.
   */
  unwarn(guild_id: string, target: GuildMember) {
    const database = this.client.databases.moderation.get(guild_id);
    if (!database) return false;

    const warns = database.filter((x) => x.target === target.id);

    const data = warns[warns.length - 1];
    const new_data = warns[warns.length - 1];

    database.splice(database.indexOf(new_data), 1);
    database.push({
      id: database.length + 1,
      type: "unwarn",
      executor: data.executor,
      target: data.target,
      reason: data.reason,
      timestamp: Date.now(),
    });

    this.client.databases.moderation.set(guild_id, database);

    return true;
  }

  /**
   * Displays all the moderation logs.
   */
  get(guild_id: string, type?: ModerationLogType, target?: GuildMember) {
    const database = this.client.databases.moderation.get(guild_id);
    if (!database) return false;

    if (type) {
      const entries = database.filter((x) => x.type === type);
      return entries;
    } else if (target) {
      const entries = database.filter((x) => x.target === target.id);
      return entries;
    } else if (type && target) {
      const entries = database.filter(
        (x) => x.type === type && x.target === target.id
      );

      return entries;
    }
  }
};
