import { ContextCommand } from "@lib/classes/ContextCommand";
import { SubCommand } from "@lib/classes/SubCommand";
import {
  AutocompleteInteraction,
  ChatInputCommandInteraction,
  Interaction,
  InteractionType,
} from "discord.js";
import Event = require("@lib/classes/Event");

export = class InteractionCreate extends Event {
  constructor() {
    super({ name: "interactionCreate" });
  }

  async run(interaction: Interaction) {
    if (!interaction.inGuild()) return;

    const guildConfig = this.client.databases.guilds.get(interaction.guild.id);
    const t = await this.client.i18n.changeLanguage(guildConfig.locale);

    if (interaction.isChatInputCommand()) {
      const cmd = this.getCommandName(interaction);
      const command = this.client.commands.get(cmd) as SubCommand;
      if (!command) return;

      if (command.options?.ownerOnly && command.options.ownerOnly === true) {
        if (!this.client.config.bot.owners.includes(interaction.user.id)) {
          const embed = command.errorEmbed(
            interaction,
            t("errors:forOwnerOnly")
          );

          return interaction.reply({
            embeds: [embed],
            ephemeral: true,
          });
        }
      }

      return command.run(interaction, guildConfig, t);
    } else if (interaction.isContextMenuCommand()) {
      const cmd = interaction.commandName;
      const command = this.client.commands.get(cmd) as ContextCommand;
      if (!command) return;

      if (command.options?.ownerOnly && command.options.ownerOnly === true) {
        if (!this.client.config.bot.owners.includes(interaction.user.id)) {
          const embed = command.errorEmbed(
            interaction,
            t("errors:forOwnerOnly")
          );

          return interaction.reply({
            embeds: [embed],
            ephemeral: true,
          });
        }
      }

      return command.run(interaction, guildConfig, t);
    } else if (
      interaction.type === InteractionType.ApplicationCommandAutocomplete
    ) {
      const cmd = this.getCommandName(interaction);
      const command = this.client.commands.get(cmd) as SubCommand;
      if (!command) return;

      const guildConfig = this.client.databases.guilds.get(
        interaction.guild.id
      );

      return command.autocomplete(interaction, guildConfig);
    }
  }

  getCommandName(
    interaction: ChatInputCommandInteraction | AutocompleteInteraction
  ) {
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
