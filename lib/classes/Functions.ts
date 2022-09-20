import {
  bold,
  ChatInputCommandInteraction,
  DiscordAPIError,
  EmbedBuilder,
  GuildMember,
} from "discord.js";
import Bot from "./Bot";

export = class Functions {
  public client: Bot;

  constructor(client: Bot) {
    this.client = client;
  }

  formatString(string: string, ...args: any[]) {
    return string.replace(/%s/g, () => {
      return args.shift();
    });
  }

  isDiscordError(error: unknown): error is DiscordAPIError {
    return error instanceof DiscordAPIError;
  }

  checkVoiceChannel(
    client: GuildMember,
    member: GuildMember,
    command: ChatInputCommandInteraction
  ) {
    const clientVoice = client.voice.channel;
    const memberVoice = member.voice.channel;

    if (memberVoice) {
      const embed = new EmbedBuilder();
      embed.setColor("Blurple");
      embed.setAuthor({
        name: command.user.tag,
        iconURL: command.user.avatarURL(),
      });
      embed.setDescription(`❌ | ${bold("You aren't in a voice channel!")}`);
      embed.setTimestamp();

      return command.reply({
        embeds: [embed],
        ephemeral: true,
      });
    } else if (clientVoice && memberVoice.id !== clientVoice.id) {
      const embed = new EmbedBuilder();
      embed.setColor("Blurple");
      embed.setAuthor({
        name: command.user.tag,
        iconURL: command.user.avatarURL(),
      });
      embed.setDescription(
        `❌ | ${bold("You aren't in the same voice channel!")}`
      );
      embed.setTimestamp();

      return command.reply({
        embeds: [embed],
        ephemeral: true,
      });
    }

    return true;
  }
};
