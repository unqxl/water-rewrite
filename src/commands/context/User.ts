// TODO: rework this file

import { ContextCommand } from "@lib/classes/ContextCommand";
import { ContextMenuCommandInteraction } from "discord.js";

export = class User extends ContextCommand {
  constructor(client) {
    super(client, {
      name: "Userinfo",
    });
  }

  run(context: ContextMenuCommandInteraction) {
    const member = context.guild.members.cache.get(context.targetId);
    context.reply({
      content: member.toString(),
      ephemeral: true,
    });
  }
};
