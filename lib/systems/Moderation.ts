import Bot = require("@lib/classes/Bot");
import {
  ModerationLogData,
  ModerationLogType,
} from "@lib/interfaces/ModerationData";
import { GuildMember } from "discord.js";

export = class ModerationSystem {
  public client: Bot;

  constructor(client: Bot) {
    this.client = client;
  }

  /**
   * Creates a new moderation entry.
   */
  createLog(guild_id: string, data: ModerationLogData) {
    const database = this.client.databases.moderation.get(guild_id);
    if (!database) return false;

    database.push({
      id: database.length + 1,
      ...data,
    });

    this.client.databases.moderation.set(guild_id, database);

    return true;
  }

  /**
   * Creates a new moderation entry (warn).
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
   * Gives mute to a user.
   */
  mute(
    guild_id: string,
    executor: GuildMember,
    target: GuildMember,
    time: number,
    reason: string = "-"
  ) {
    const database = this.client.databases.moderation.get(guild_id);
    if (!database) return false;

    const check = database.filter((x) => {
      return x.type === "mute" && x.target === target.id;
    });
    if (check) return false;

    const { mute } = this.client.databases.guilds.get(guild_id).roles;
    if (!mute) return false;

    const role = target.guild.roles.cache.get(mute);
    if (!role) return false;

    this.handleMute(executor, target, time, reason);
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

  private handleMute(
    executor: GuildMember,
    target: GuildMember,
    time: number,
    reason: string
  ) {
    const data = this.client.databases.moderation.get(target.guild.id);
    if (!data) return false;

    const mute = this.client.databases.guilds.get(target.guild.id).roles.mute;
    if (!mute) return false;

    const role = target.guild.roles.cache.get(mute);
    if (!role) return false;

    target.roles.add(mute);
    data.push({
      id: data.length + 1,
      type: "mute",
      executor: executor.id,
      target: target.id,
      reason: reason,
      timestamp: Date.now(),
    });

    this.client.databases.moderation.set(target.guild.id, data);

    setTimeout(() => {
      target.roles.remove(role);

      const new_data = this.client.databases.moderation.get(target.guild.id);
      if (!new_data) return false;

      const new_data_entry = new_data.filter(
        (x) => x.type === "mute" && x.target === target.id
      );

      new_data.splice(new_data.indexOf(new_data_entry[0]), 1);
      this.client.databases.moderation.set(target.guild.id, new_data);
    }, time);
  }
};
