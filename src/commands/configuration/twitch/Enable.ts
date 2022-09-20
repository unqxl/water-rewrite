import Bot = require("@lib/classes/Bot");
import { SubCommand } from "@lib/classes/SubCommand";
import { GuildData } from "@lib/interfaces/GuildData";
import { ChatInputCommandInteraction } from "discord.js";

export = class TwitchEnableCommand extends SubCommand {
  constructor(client: Bot) {
    super(client, {
      group: "twitch",
      commandName: "configuration",
      name: "enable",

      description: "Enables Twitch Notifications for this server.",
      descriptionLocalizations: {
        ru: "Включает уведомления Twitch для этого сервера.",
      },

      defaultMemberPermissions: ["ManageGuild"],
    });
  }

  async run(command: ChatInputCommandInteraction, config: GuildData) {
    if (config.systems.twitch.enabled === true) {
      const embed = this.errorEmbed(
        command,
        "Twitch Notifications are already enabled for this server!"
      );

      return command.reply({
        embeds: [embed],
        ephemeral: true,
      });
    }

    config.systems.twitch.enabled = true;
    this.client.databases.guilds.set(command.guild.id, config);

    const embed = this.embed(command, "Twitch Notifications enabled!", "✅");
    return command.reply({
      embeds: [embed],
    });
  }
};
