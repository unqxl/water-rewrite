import Bot = require("@lib/classes/Bot");
import { SubCommand } from "@lib/classes/SubCommand";
import { GuildData } from "@lib/interfaces/GuildData";
import { ChatInputCommandInteraction } from "discord.js";

export = class ConfigCommand extends SubCommand {
  constructor(client: Bot) {
    super(client, {
      commandName: "configuration",
      name: "config",

      description: "Allows you to get the current configuration of the server.",
      descriptionLocalizations: {
        ru: "Позволяет получить текущую конфигурацию сервера.",
      },

      defaultMemberPermissions: ["Administrator"],
    });
  }

  async run(command: ChatInputCommandInteraction, config: GuildData) {
    return command.reply({
      content: "Hi",
    });
  }

  exportFromConfig<T extends GuildData>(obj: T): Array<any> {
    return [[]];
  }
};
