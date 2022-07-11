import Bot = require("@lib/classes/Bot");
import { SubCommand } from "@lib/classes/Command/SubCommand";
import {
  ApplicationCommandOptionType,
  ChatInputCommandInteraction,
} from "discord.js";

export = class KickCommand extends SubCommand {
  constructor(client: Bot) {
    super(client, {
      commandName: "moderation",
      name: "kick",

      description: "Kicks a user from the server.",
      descriptionLocalizations: {
        ru: "Кикнуть пользователя из сервера.",
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

  async run(command: ChatInputCommandInteraction) {}
};
