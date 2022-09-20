import Bot = require("@lib/classes/Bot");
import { SubCommand } from "@lib/classes/SubCommand";
import { GuildData } from "@lib/interfaces/GuildData";
import {
  ActionRowBuilder,
  bold,
  ChatInputCommandInteraction,
  ComponentType,
  Role,
  roleMention,
  SelectMenuBuilder,
  SelectMenuOptionBuilder,
} from "discord.js";

export = class AutoRoleAddCommand extends SubCommand {
  constructor(client: Bot) {
    super(client, {
      group: "autorole",
      commandName: "configuration",
      name: "add",

      description: "Adds an automatically assigned role to the server.",
      descriptionLocalizations: {
        ru: "Добавляет автоматически выдаваемую роль на сервере.",
      },

      defaultMemberPermissions: ["ManageGuild"],
    });
  }

  async run(command: ChatInputCommandInteraction, config: GuildData) {
    var _roles = command.guild.roles.cache.filter(
      (x) => !x.tags.botId && x.id !== command.guild.roles.everyone.id
    );

    var roles: Role[] = [];
    for (const [id, role] of _roles) roles.push(role);

    const row: ActionRowBuilder<SelectMenuBuilder> = new ActionRowBuilder();
    const menu = new SelectMenuBuilder();
    menu.setMinValues(1);
    menu.setMaxValues(1);

    if (roles.length >= 25) roles = roles.slice(0, 24);
    for (const role of roles) {
      const option = new SelectMenuOptionBuilder();
      option.setLabel(role.name);
      option.setValue(role.id);

      menu.addOptions(option);
    }

    row.addComponents(menu);

    await command.reply({
      content: bold("Choose one of the possible roles:"),
      components: [row],
    });

    const msg = await command.fetchReply();
    const collector = msg.createMessageComponentCollector({
      filter: (i) => i.user.id === command.user.id,
      componentType: ComponentType.SelectMenu,
      max: 1,
      time: 60000,
    });

    collector.on("collect", (int) => {
      if (!int.isSelectMenu()) return;

      const id = int.values[0];
      if (config.roles.auto === id) {
        const embed = this.errorEmbed(
          command,
          `The ${roleMention(id)} role is already set as automatic!`
        );

        int.update({
          content: undefined,
          embeds: [embed],
        });

        return;
      }

      config.roles.auto = id;
      this.client.databases.guilds.set(command.guildId, config);

      const embed = this.embed(
        command,
        `The ${roleMention(id)} role has been successfully set as automatic.`,
        "✅"
      );

      int.update({
        content: undefined,
        embeds: [embed],
      });

      return;
    });

    collector.on("end", async (collected, reason) => {
      if (reason === "time") {
        await msg.delete();
        return;
      }
    });
  }
};
