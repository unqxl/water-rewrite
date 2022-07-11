import Bot = require("@lib/classes/Bot");
import { SubCommand } from "@lib/classes/Command/SubCommand";
import {
  ApplicationCommandOptionType,
  ChatInputCommandInteraction,
} from "discord.js";

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
          description: "The reason to reason.",
          descriptionLocalizations: {
            ru: "Причина, по которой нужно забанить.",
          },
        },
      ],
    });
  }

  async run(command: ChatInputCommandInteraction) {}
};
