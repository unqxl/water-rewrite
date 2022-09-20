import Bot = require("@lib/classes/Bot");
import { SubCommand } from "@lib/classes/SubCommand";
import { GuildData } from "@lib/interfaces/GuildData";
import { ChatInputCommandInteraction, GuildMember } from "discord.js";

export = class SkipCommand extends SubCommand {
  constructor(client: Bot) {
    super(client, {
      commandName: "music",
      name: "skip",

      description: "Skips the current song.",
      descriptionLocalizations: {
        ru: "Пропускает текущую песню.",
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
    }

    await queue.skip();

    const embed = this.embed(command, "The current song has been skipped!");
    return command.reply({
      embeds: [embed],
    });
  }
};
