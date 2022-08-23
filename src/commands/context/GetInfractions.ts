import { ContextCommand } from "@lib/classes/ContextCommand";
import { create } from "@lib/classes/Paginator";
import {
  bold,
  ContextMenuCommandInteraction,
  GuildMember,
  time,
} from "discord.js";
import ModerationSystem = require("@lib/systems/Moderation");

export = class GetInfractionsCommand extends ContextCommand {
  constructor(client) {
    super(client, {
      name: "Get Infractions",
      name_localizations: {
        ru: "Получить нарушения",
      },
    });
  }

  async run(context: ContextMenuCommandInteraction) {
    const member = context.guild.members.cache.get(context.targetId);
    if (!member) return;

    const moderation = new ModerationSystem(this.client);
    var entries = moderation.get(context.guildId, null, member);
    if (!entries.length) {
      const embed = this.errorEmbed(
        context,
        `${member.toString()} has no infractions!`
      );

      return context.reply({
        embeds: [embed],
        ephemeral: true,
      });
    }

    const embed = this.embed(
      context.member as GuildMember,
      `${member.user.tag}'s infractions:`,
      "💬"
    );

    const entryTypes = {
      1: "Ban",
      2: "Unban",
      3: "Kick",
      4: "Warn",
      5: "Unwarn",
      6: "Mute",
      7: "Temp Mute",
      8: "Unmute",
    };

    const data = entries.map((entry) => {
      const timestamp = Math.ceil(entry.timestamp / 1000);
      const moderator = context.guild.members.cache.get(entry.executor);

      return [
        `› ${bold(entryTypes[entry.type])}:`,
        `» ${bold("Moderator")}: ${bold(moderator.toString())}`,
        `» ${bold("Reason")}: ${bold(entry.reason)}`,
        `» ${bold("Timestamp")}: ${bold(time(timestamp))}`,
      ].join("\n");
    });

    return await create(context, data, embed);
  }
};
