import {
  bold,
  ContextMenuCommandInteraction,
  EmbedBuilder,
  GuildMember,
} from "discord.js";
import { BaseContextCommand } from "./Command/BaseContextCommand";

export class ContextCommand extends BaseContextCommand {
  getEmbedAuthor(context: ContextMenuCommandInteraction, member?: GuildMember) {
    return {
      name: context.user.username || member?.user.username,
      iconURL:
        context.user.avatarURL({ size: 4096 }) ||
        member?.user.avatarURL({ size: 4096 }),
    };
  }

  errorEmbed(context: ContextMenuCommandInteraction, message: string) {
    const embed = new EmbedBuilder();
    embed.setColor("Blurple");
    embed.setAuthor(this.getEmbedAuthor(context));
    embed.setDescription(`❌ | ${bold(message)}`);
    embed.setTimestamp();

    return embed;
  }

  embed(member: GuildMember, message: string, emoji?: string) {
    const embed = new EmbedBuilder();
    embed.setColor("Blurple");
    embed.setAuthor(this.getEmbedAuthor(null, member));
    embed.setDescription(
      typeof emoji === "string" ? `${emoji} | ${bold(message)}` : bold(message)
    );
    embed.setTimestamp();

    return embed;
  }
}
