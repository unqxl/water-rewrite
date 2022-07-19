import Event = require("@lib/classes/Event");
import ModerationSystem = require("@lib/systems/Moderation");
import { AuditLogEvent, GuildBan } from "discord.js";

export = class GuildBanAdd extends Event {
  constructor() {
    super({ name: "guildBanAdd" });
  }

  async run(ban: GuildBan) {
    const guild = ban.guild;
    const entry = await (
      await guild.fetchAuditLogs({
        limit: 1,
        type: AuditLogEvent.MemberBanAdd,
        user: ban.user,
      })
    ).entries.first();

    const moderation = new ModerationSystem(this.client);
    moderation.createLog(ban.guild.id, {
      type: "ban",
      executor: entry.executor.id,
      target: ban.user.id,
      reason: ban.reason,
      timestamp: Date.now(),
    });
  }
};
