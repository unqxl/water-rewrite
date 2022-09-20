import Bot = require("@lib/classes/Bot");
import { SubCommand } from "@lib/classes/SubCommand";
import { GuildData } from "@lib/interfaces/GuildData";
import {
  ApplicationCommandOptionType,
  ChatInputCommandInteraction,
} from "discord.js";

export = class ClearCommand extends SubCommand {
  constructor(client: Bot) {
    super(client, {
      commandName: "moderation",
      name: "clear",

      description: "Clears the chat.",
      descriptionLocalizations: {
        ru: "Очищает чат.",
      },

      defaultMemberPermissions: ["ManageMessages"],
      clientPermissions: ["ManageMessages"],

      options: [
        {
          type: ApplicationCommandOptionType.Number,
          name: "amount",
          description: "Amount of messages to delete.",
          descriptionLocalizations: {
            ru: "Количество сообщений для удаления.",
          },
          required: false,
        },
      ],
    });
  }

  async run(command: ChatInputCommandInteraction, config: GuildData) {
    const amount = command.options.getNumber("amount") || 10;
    const channel = command.channel;

    try {
      const deleted = await channel.bulkDelete(amount, true);
      const embed = this.embed(
        command,
        [
          `Successfully deleted ${deleted.size} messages.`,
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
