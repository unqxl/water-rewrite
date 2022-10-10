import Bot = require("@lib/classes/Bot");
import { SubCommand } from "@lib/classes/SubCommand";
import { GuildData } from "@lib/interfaces/GuildData";
import {
  ApplicationCommandOptionType,
  ChatInputCommandInteraction,
} from "discord.js";
import { TFunction } from "i18next";

export = class TwitchRemoveStreamerCommand extends SubCommand {
  constructor(client: Bot) {
    super(client, {
      group: "twitch",
      commandName: "configuration",
      name: "remove_streamer",

      description:
        "Removes a Twitch Streamer from the list of Streamers to be notified.",
      descriptionLocalizations: {
        ru: "Удаляет Twitch Стримера из списка уведомлений.",
      },

      options: [
        {
          type: ApplicationCommandOptionType.String,
          name: "streamer",

          description: "The Twitch Streamer to remove.",
          descriptionLocalizations: {
            ru: "Стример для удаления.",
          },

          required: true,
        },
      ],

      defaultMemberPermissions: ["ManageGuild"],
    });
  }

  async run(
    command: ChatInputCommandInteraction,
    config: GuildData,
    t: TFunction
  ) {
    const streamer = command.options.getString("streamer");

    if (!config.systems.twitch.streamers.find((x) => x.name === streamer)) {
      const embed = this.errorEmbed(
        command,
        t("errors:notInDatabase", {
          input: streamer,
        })
      );

      return command.reply({
        embeds: [embed],
        ephemeral: true,
      });
    }

    config.systems.twitch.streamers.push({ name: streamer, last_stream: null });
    this.client.databases.guilds.set(command.guild.id, config);

    const embed = this.embed(
      command,
      t("configuration:twitch.streamer.removed", {
        streamer: streamer,
      }),
      "✅"
    );

    return command.reply({
      embeds: [embed],
    });
  }
};
