import Event = require("@lib/classes/Event");
import { ModerationLogType } from "@lib/interfaces/ModerationData";
import { AuditLogEvent, GuildBan } from "discord.js";
import ModerationSystem = require("@lib/systems/Moderation");

export = class GuildBanRemove extends Event {
  constructor() {
    super({ name: "guildBanRemove" });
  }

  async run(ban: GuildBan) {
    const guild = ban.guild;
    const entry = await (
      await guild.fetchAuditLogs({
        limit: 1,
        type: AuditLogEvent.MemberBanRemove,
        user: ban.user,
      })
    ).entries.first();

    const moderation = new ModerationSystem(this.client);
    moderation.createEntry(ban.guild.id, {
      type: ModerationLogType.UNBAN,
      executor: entry.executor.id,
      target: ban.user.id,
      reason: ban.reason,
      timestamp: Date.now(),
    });
  }
};
