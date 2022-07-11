import { Command } from "@lib/classes/Command/Command";
import { ContextCommand } from "@lib/classes/Command/ContextCommand";
import { Interaction } from "discord.js";
import Event = require("@lib/classes/Event");

export = class InteractionCreate extends Event {
  constructor() {
    super("interactionCreate");
  }

  run(interaction: Interaction) {
    if (!interaction.inGuild()) return;

    if (interaction.isChatInputCommand()) {
      const cmd = interaction.commandName;
      const command = this.client.commands.get(cmd);
      if (!command || !(command instanceof Command)) return;

      void command.run(interaction);
    } else if (interaction.isContextMenuCommand()) {
      const cmd = interaction.commandName;
      const command = this.client.commands.get(cmd);
      if (!command || !(command instanceof ContextCommand)) return;

      void command.run(interaction);
    }
  }
};
