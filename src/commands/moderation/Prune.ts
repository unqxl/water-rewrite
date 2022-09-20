import Bot = require("@lib/classes/Bot");
import { SubCommand } from "@lib/classes/SubCommand";
import { GuildData } from "@lib/interfaces/GuildData";
import {
  ApplicationCommandOptionType,
  ChatInputCommandInteraction,
} from "discord.js";

export = class PruneCommand extends SubCommand {
  constructor(client: Bot) {
    super(client, {
      commandName: "moderation",
      name: "prune",

      description:
        "Kicks users from the server that have not sent a message for a specified amount of time.",
      descriptionLocalizations: {
        ru: "Кикает пользователей с сервера, которые не отправили сообщение за определенное время.",
      },

      defaultMemberPermissions: ["KickMembers"],
      clientPermissions: ["KickMembers"],

      options: [
        {
          type: ApplicationCommandOptionType.Boolean,
          name: "dry",
          description:
            "Get the number of users that will be kicked, without actually kicking them.",
          descriptionLocalizations: {
            ru: "Получить количество пользователей, которые будут кикнуты, но без кика.",
          },
          required: true,
        },
        {
          type: ApplicationCommandOptionType.Number,
          name: "days",
          description:
            "Number of days for auto-selection of users. (default: 7)",
          descriptionLocalizations: {
            ru: "Количество дней для авто-подбора пользователей. (по умолчанию: 7)",
          },
          required: false,
        },
        {
          type: ApplicationCommandOptionType.String,
          name: "reason",
          description: 'Reason for the kick. (default: "No reason given")',
          descriptionLocalizations: {
            ru: 'Причина кика. (по умолчанию: "No reason given")',
          },
          required: false,
        },
      ],
    });
  }

  async run(command: ChatInputCommandInteraction, config: GuildData) {
    const dry = command.options.getBoolean("dry");
    const days = command.options.getNumber("days") || 7;
    const reason = command.options.getString("reason") || "No reason given.";

    if (dry === true) {
      const dry_prune = await command.guild.members.prune({
        dry: true,
        days: 7,
      });

      const embed = this.embed(
        command,
        `${dry_prune} users will be kicked (by matching for 7 days).`,
        "💬"
      );

      return command.reply({
        embeds: [embed],
        ephemeral: true,
      });
    }

    try {
      const pruned = await command.guild.members.prune({
        days: days,
        reason: reason,
        count: true,
      });

      const embed = this.embed(
        command,
        [
          `Successfully kicked ${pruned} users.`,
          "This message will be deleted in 3 seconds.",
        ].join("\n"),
        "✅"
      );

      const msg = await command.reply({
        embeds: [embed],
        fetchReply: true,
      });

      await this.client.sleep(3000);
      await msg.delete();

      return true;
    } catch (err) {
      if (this.client.functions.isDiscordError(err)) {
        const embed = this.errorEmbed(command, err.message);
        return command.reply({
          embeds: [embed],
          ephemeral: true,
        });
      }
    }
  }
};
