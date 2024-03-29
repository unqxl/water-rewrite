import Bot = require("@lib/classes/Bot");
import { SubCommand } from "@lib/classes/SubCommand";
import { GuildData } from "@lib/interfaces/GuildData";
import {
  ApplicationCommandOptionType,
  ChatInputCommandInteraction,
} from "discord.js";
import { TFunction } from "i18next";

export = class TwitchAddStreamerCommand extends SubCommand {
  constructor(client: Bot) {
    super(client, {
      group: "twitch",
      commandName: "configuration",
      name: "add_streamer",

      description:
        "Adds a Twitch Streamer to the list of Streamers to be notified.",
      descriptionLocalizations: {
        ru: "Добавляет Twitch Стримера в список уведомлений.",
      },

      options: [
        {
          type: ApplicationCommandOptionType.String,
          name: "streamer",

          description: "The Twitch Streamer to add.",
          descriptionLocalizations: {
            ru: "Стример для добавления.",
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

    if (config.systems.twitch.streamers.find((x) => x.name === streamer)) {
      const embed = this.errorEmbed(
        command,
        t("errors:alreadyInDatabase", {
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
      t("configuration:twitch.streamer.added", {
        streamer: streamer,
      }),
      "✅"
    );

    return command.reply({
      embeds: [embed],
    });
  }
};
