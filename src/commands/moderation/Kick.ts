import Bot = require("@lib/classes/Bot");
import { SubCommand } from "@lib/classes/SubCommand";
import { GuildData } from "@lib/interfaces/GuildData";
import { ModerationLogType } from "@lib/interfaces/ModerationData";
import {
  ApplicationCommandOptionType,
  bold,
  ChatInputCommandInteraction,
  DiscordAPIError,
  EmbedBuilder,
  GuildMember,
} from "discord.js";
import ModerationSystem = require("@lib/systems/Moderation");

export = class KickCommand extends SubCommand {
  constructor(client: Bot) {
    super(client, {
      commandName: "moderation",
      name: "kick",

      description: "Kicks a user from the server.",
      descriptionLocalizations: {
        ru: "Кикает пользователя с сервера.",
      },

      memberPermissions: ["KickMembers"],
      clientPermissions: ["KickMembers"],

      options: [
        {
          type: ApplicationCommandOptionType.User,
          name: "member",
          description: "The user to kick.",
          descriptionLocalizations: {
            ru: "Пользователь, которого нужно кикнуть.",
          },
          required: true,
        },
        {
          type: ApplicationCommandOptionType.String,
          name: "reason",
          description: "The reason to kick.",
          descriptionLocalizations: {
            ru: "Причина, по которой нужно кикнуть.",
          },
        },
      ],
    });
  }

  async run(command: ChatInputCommandInteraction, config: GuildData) {
    const moderation = new ModerationSystem(this.client);

    const member = command.options.getMember("member") as GuildMember;
    const reason = command.options.getString("reason") || "No reason given.";

    if (!member.kickable) {
      const text = bold(
        "I can't kick that user because this user has a higher role than me."
      );

      const embed = new EmbedBuilder();
      embed.setAuthor(this.getEmbedAuthor(command));
      embed.setColor("Blurple");
      embed.setDescription(`❌ | ${text}`);
      embed.setTimestamp();

      return command.reply({
        embeds: [embed],
      });
    }

    try {
      await member.kick(reason);
    } catch (error) {
      if (this.isDiscordError(error)) {
        const text = bold(error.message);
        const embed = new EmbedBuilder();
        embed.setAuthor(this.getEmbedAuthor(command));
        embed.setColor("Blurple");
        embed.setDescription(`❌ | ${text}`);
        embed.setTimestamp();

        return command.reply({
          embeds: [embed],
        });
      } else {
        const text = bold(error.message);
        const embed = new EmbedBuilder();
        embed.setAuthor(this.getEmbedAuthor(command));
        embed.setColor("Blurple");
        embed.setDescription(`❌ | ${text}`);
        embed.setTimestamp();

        return command.reply({
          embeds: [embed],
        });
      }
    }

    const text = bold(`Successfully kicked ${member.user.tag} for ${reason}!`);
    const embed = new EmbedBuilder();
    embed.setAuthor(this.getEmbedAuthor(command));
    embed.setColor("Blurple");
    embed.setDescription(`✅ | ${text}`);
    embed.setTimestamp();

    moderation.createEntry(command.guildId, {
      type: ModerationLogType.KICK,
      executor: command.user.id,
      target: member.id,
      reason,
      timestamp: Date.now(),
    });

    return command.reply({
      embeds: [embed],
    });
  }

  isDiscordError(error: unknown): error is DiscordAPIError {
    return error instanceof DiscordAPIError;
  }
};
