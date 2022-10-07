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
import { TFunction } from "i18next";

export = class MuteRoleSetCommand extends SubCommand {
  constructor(client: Bot) {
    super(client, {
      group: "muterole",
      commandName: "configuration",
      name: "set",

      description: "Sets the Mute Role on the server.",
      descriptionLocalizations: {
        ru: "Устанавливает Мут-Роль на сервере.",
      },

      defaultMemberPermissions: ["ManageGuild"],
    });
  }

  async run(
    command: ChatInputCommandInteraction,
    config: GuildData,
    t: TFunction
  ) {
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
      content: bold(t("configuration:muterole.phrase")),
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
          t("configuration:muterole.already_in_list", {
            role: roleMention(id),
          })
        );

        int.update({
          content: undefined,
          embeds: [embed],
        });

        return;
      }

      config.roles.mute = id;
      this.client.databases.guilds.set(command.guildId, config);

      const embed = this.embed(
        command,
        t("configuration:muterole.added", {
          role: roleMention(id),
        }),
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
