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

export = class BanCommand extends SubCommand {
  constructor(client: Bot) {
    super(client, {
      commandName: "moderation",
      name: "ban",

      description: "Bans a user from the server.",
      descriptionLocalizations: {
        ru: "Банит пользователя сервера.",
      },

      memberPermissions: ["BanMembers"],
      clientPermissions: ["BanMembers"],

      options: [
        {
          type: ApplicationCommandOptionType.User,
          name: "member",
          description: "The user to ban.",
          descriptionLocalizations: {
            ru: "Пользователь, которого нужно забанить.",
          },
          required: true,
        },
        {
          type: ApplicationCommandOptionType.String,
          name: "reason",
          description: "The reason to ban.",
          descriptionLocalizations: {
            ru: "Причина, по которой нужно забанить.",
          },
        },
      ],
    });
  }

  async run(command: ChatInputCommandInteraction, config: GuildData) {
    const moderation = new ModerationSystem(this.client);

    const member = command.options.getMember("member") as GuildMember;
    const reason = command.options.getString("reason") || "No reason given.";

    if (!member.bannable) {
      const text = bold(
        "I can't ban that user because this user has a higher role than me."
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
      await member.ban({
        reason,
        deleteMessageDays: 7,
      });
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

    const text = bold(`Successfully banned ${member.user.tag} for ${reason}!`);
    const embed = new EmbedBuilder();
    embed.setAuthor(this.getEmbedAuthor(command));
    embed.setColor("Blurple");
    embed.setDescription(`✅ | ${text}`);
    embed.setTimestamp();

    moderation.createEntry(command.guildId, {
      type: ModerationLogType.BAN,
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
