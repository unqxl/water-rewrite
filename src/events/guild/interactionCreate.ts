import Event = require("@lib/classes/Event");
import { Interaction, InteractionType } from "discord.js";

export = class InteractionCreate extends Event {
  constructor() {
    super("interactionCreate");
  }

  run(interaction: Interaction) {
    if (!interaction.isChatInputCommand()) return;
    if (!interaction.inGuild()) return;

    const cmd = interaction.commandName;
    const command = this.client.commands.get(cmd);
    if (!command) return;

    void command.run(interaction);
  }
};
