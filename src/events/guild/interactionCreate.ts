import { ContextCommand } from "@lib/classes/Command/ContextCommand";
import { SubCommand } from "@lib/classes/Command/SubCommand";
import { ChatInputCommandInteraction, Interaction } from "discord.js";
import Event = require("@lib/classes/Event");

export = class InteractionCreate extends Event {
  constructor() {
    super({ name: "interactionCreate" });
  }

  run(interaction: Interaction) {
    if (!interaction.inGuild()) return;

    if (interaction.isChatInputCommand()) {
      const cmd = this.getCommandName(interaction);
      const command = this.client.commands.get(cmd) as SubCommand;
      if (!command) return;

      const guildConfig = this.client.databases.guilds.get(
        interaction.guild.id
      );

      return command.run(interaction, guildConfig);
    } else if (interaction.isContextMenuCommand()) {
      const cmd = interaction.commandName;
      const command = this.client.commands.get(cmd) as ContextCommand;
      if (!command) return;

      const guildConfig = this.client.databases.guilds.get(
        interaction.guild.id
      );

      return command.run(interaction, guildConfig);
    }
  }

  getCommandName(interaction: ChatInputCommandInteraction) {
    let command: string;

    const commandName = interaction.commandName;
    const groupName = interaction.options.getSubcommandGroup(false);
    const subCommand = interaction.options.getSubcommand(false);

    if (subCommand) {
      if (groupName) {
        command = `${commandName}-${groupName}-${subCommand}`;
      } else {
        command = `${commandName}-${subCommand}`;
      }
    } else {
      command = commandName;
    }

    return command;
  }
};
