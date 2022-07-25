import Bot = require("@lib/classes/Bot");
import {
  ModerationLogData,
  ModerationLogType,
} from "@lib/interfaces/ModerationData";
import { GuildMember } from "discord.js";
import Database = require("./Database");

export = class ModerationSystem {
  public client: Bot;

  constructor(client: Bot) {
    this.client = client;
  }

  /**
   * Creates a new moderation entry.
   */
  createEntry(guild_id: string, data: ModerationLogData) {
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

    this.createEntry(guild_id, {
      type: ModerationLogType.WARN,
      executor: executor.id,
      target: target.id,
      reason: reason,
      timestamp: Date.now(),
    });

    const data = this.client.databases.moderation.get(guild_id);
    const warns = data.filter(
      (x) => x.target === target.id && x.type === ModerationLogType.WARN
    );

    if (warns.length >= 5) {
      target.kick("You have been kicked for 5 or more warns.");

      data.filter((x) => x.target !== target.id);
      this.client.databases.moderation.set(guild_id, data);
    }

    return true;
  }

  /**
   * Removes last warn from a user.
   */
  unwarn(guild_id: string, target: GuildMember) {
    new Database(this.client).getGuild(guild_id);

    const _data = this.client.databases.moderation.get(guild_id);
    const warns = _data.filter(
      (x) => x.target === target.id && x.type === ModerationLogType.WARN
    );

    const data = warns[warns.length - 1];
    const new_data = warns[warns.length - 1];

    _data.splice(_data.indexOf(new_data), 1);
    this.client.databases.moderation.set(guild_id, _data);

    this.createEntry(guild_id, {
      type: ModerationLogType.UNWARN,
      executor: data.executor,
      target: data.target,
      reason: data.reason,
      timestamp: Date.now(),
    });

    return true;
  }

  /**
   * Gives mute to a user.
   */
  mute(
    guild_id: string,
    executor: GuildMember,
    target: GuildMember,
    reason: string = "-"
  ) {
    new Database(this.client).getGuild(guild_id);

    const data = this.client.databases.moderation.get(guild_id);
    const check = data.filter((x) => {
      return x.type === ModerationLogType.MUTE && x.target === target.id;
    });

    if (check) {
      return {
        success: false,
        message: "User is already muted.",
      };
    }

    const { mute } = this.client.databases.guilds.get(guild_id).roles;
    if (!mute) {
      return {
        success: false,
        message: "Mute Role is not set.",
      };
    }

    const role = target.guild.roles.cache.get(mute);
    if (!role) {
      return {
        success: false,
        message: "Mute Role is not found on this server.",
      };
    }

    target.roles.add(mute);
    this.createEntry(target.guild.id, {
      type: ModerationLogType.MUTE,
      executor: executor.id,
      target: target.id,
      reason: reason,
      timestamp: Date.now(),
    });

    return {
      success: true,
    };
  }

  /**
   * Gives temporary mute to a user.
   */
  tempmute(
    guild_id: string,
    executor: GuildMember,
    target: GuildMember,
    time: number,
    reason: string = "-"
  ) {
    new Database(this.client).getGuild(guild_id);

    const data = this.client.databases.moderation.get(guild_id);
    const check = data.filter((x) => {
      return x.type === ModerationLogType.TEMPMUTE && x.target === target.id;
    });

    if (check) {
      return {
        success: false,
        message: "User is already muted.",
      };
    }

    const { mute } = this.client.databases.guilds.get(guild_id).roles;
    if (!mute) {
      return {
        success: false,
        message: "Mute Role is not set.",
      };
    }

    const role = target.guild.roles.cache.get(mute);
    if (!role) {
      return {
        success: false,
        message: "Mute Role is not found on this server.",
      };
    }

    this.handleMute(executor, target, time, reason);

    return {
      success: true,
    };
  }

  /**
   * Removes mute from a user.
   */
  unmute(guild_id: string, target: GuildMember) {
    new Database(this.client).getGuild(guild_id);

    const data = this.client.databases.moderation.get(guild_id);
    const check = data.filter(
      (x) =>
        x.type === ModerationLogType.TEMPMUTE ||
        (x.type === ModerationLogType.MUTE && x.target === target.id)
    );

    if (!check) {
      return {
        success: false,
        message: "User is not muted.",
      };
    }

    const { mute } = this.client.databases.guilds.get(guild_id).roles;
    if (!mute) {
      return {
        success: false,
        message: "Mute Role is not set.",
      };
    }

    const role = target.guild.roles.cache.get(mute);
    if (!role) {
      return {
        success: false,
        message: "Mute Role is not found on this server.",
      };
    }

    target.roles.remove(mute);
    this.createEntry(target.guild.id, {
      type: ModerationLogType.UNMUTE,
      executor: check[0].executor,
      target: check[0].target,
      reason: check[0].reason,
      timestamp: Date.now(),
    });

    return {
      success: true,
    };
  }

  /**
   * Displays all the moderation logs.
   */
  get(guild_id: string, type?: ModerationLogType, target?: GuildMember) {
    new Database(this.client).getGuild(guild_id);

    const data = this.client.databases.moderation.get(guild_id);
    if (type) {
      const entries = data.filter((x) => x.type === type);
      return entries;
    } else if (target) {
      const entries = data.filter((x) => x.target === target.id);
      return entries;
    } else if (type && target) {
      const entries = data.filter(
        (x) => x.type === type && x.target === target.id
      );

      return entries;
    } else {
      return data;
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
    this.createEntry(target.guild.id, {
      type: ModerationLogType.TEMPMUTE,
      executor: executor.id,
      target: target.id,
      reason: reason,
      timestamp: Date.now(),
    });

    setTimeout(() => {
      if (!target.roles.cache.has(mute)) return;
      target.roles.remove(role);

      const new_data = this.client.databases.moderation.get(target.guild.id);
      if (!new_data) return false;

      const new_data_entry = new_data.filter(
        (x) => x.type === ModerationLogType.TEMPMUTE && x.target === target.id
      );

      new_data.splice(new_data.indexOf(new_data_entry[0]), 1);
      this.client.databases.moderation.set(target.guild.id, new_data);
    }, time);
  }
};
