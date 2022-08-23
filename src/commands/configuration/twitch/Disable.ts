import Bot = require("@lib/classes/Bot");
import { SubCommand } from "@lib/classes/SubCommand";
import { GuildData } from "@lib/interfaces/GuildData";
import { ChatInputCommandInteraction } from "discord.js";

export = class TwitchDisableCommand extends SubCommand {
  constructor(client: Bot) {
    super(client, {
      group: "twitch",
      commandName: "configuration",
      name: "disable",

      description: "Disables Twitch Notifications for this server.",
      descriptionLocalizations: {
        ru: "Выключает уведомления Twitch для этого сервера.",
      },

      defaultMemberPermissions: ["ManageGuild"],
    });
  }

  async run(command: ChatInputCommandInteraction, config: GuildData) {
    if (config.systems.twitch.enabled === false) {
      const embed = this.errorEmbed(
        command,
        "Twitch Notifications are already disabvled for this server!"
      );

      return command.reply({
        embeds: [embed],
        ephemeral: true,
      });
    }

    config.systems.twitch.enabled = false;
    this.client.databases.guilds.set(command.guild.id, config);

    const embed = this.embed(command, "Twitch Notifications disabled!", "✅");
    return command.reply({
      embeds: [embed],
    });
  }
};
