import Command = require("@lib/classes/Command");
import { CommandInteraction, SlashCommandBuilder } from "discord.js";

export = class Help extends Command {
  constructor(client) {
    super(client, {
      data: new SlashCommandBuilder()
        .setName("help")
        .setDescription("Shows all the available commands.")
        .setDescriptionLocalizations({
          ru: "Показывает все доступные команды.",
        })
        .toJSON(),
    });
  }

  run(command: CommandInteraction) {
    return command.reply({
      content: "Hello!",
      ephemeral: true,
    });
  }
};
