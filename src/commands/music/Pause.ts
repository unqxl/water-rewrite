import Bot = require("@lib/classes/Bot");
import { SubCommand } from "@lib/classes/SubCommand";
import { GuildData } from "@lib/interfaces/GuildData";
import { ChatInputCommandInteraction, GuildMember } from "discord.js";

export = class PauseCommand extends SubCommand {
  constructor(client: Bot) {
    super(client, {
      commandName: "music",
      name: "pause",

      description: "Pauses music playback.",
      descriptionLocalizations: {
        ru: "Приостановливает воспроизведение музыки.",
      },
    });
  }

  async run(command: ChatInputCommandInteraction, config: GuildData) {
    const clientMember = command.guild.members.me;
    const member = command.member as GuildMember;

    await this.client.functions.checkVoiceChannel(
      clientMember,
      member,
      command
    );

    const queue = this.client.distube.getQueue(command.guild);

    if (!queue) {
      const embed = this.errorEmbed(
        command,
        "There's no music playing right now."
      );

      return command.reply({
        embeds: [embed],
        ephemeral: true,
      });
    } else if (queue.paused) {
      const embed = this.errorEmbed(command, "The music is already paused.");

      return command.reply({
        embeds: [embed],
        ephemeral: true,
      });
    }

    await queue.pause();

    const embed = this.embed(command, "The current song has been paused!");
    return command.reply({
      embeds: [embed],
    });
  }
};
