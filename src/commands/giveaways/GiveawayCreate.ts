import Bot = require("@lib/classes/Bot");
import { SubCommand } from "@lib/classes/SubCommand";
import { GuildData } from "@lib/interfaces/GuildData";
import {
  ApplicationCommandOptionType,
  ChannelType,
  ChatInputCommandInteraction,
  NewsChannel,
  TextChannel,
} from "discord.js";
import ms = require("ms");

export = class GiveawayCreateCommand extends SubCommand {
  constructor(client: Bot) {
    super(client, {
      commandName: "giveaways",
      name: "create",

      description: "Allows you to create a new giveaway.",
      descriptionLocalizations: {
        ru: "Позволяет вам создать новый розыгрыш.",
      },

      options: [
        {
          type: ApplicationCommandOptionType.Channel,
          channelTypes: [ChannelType.GuildText, ChannelType.GuildNews],
          name: "channel",

          description: "The channel to create the giveaway in.",
          descriptionLocalizations: {
            ru: "Канал, в котором будет создан розыгрыш.",
          },

          required: true,
        },
        {
          type: ApplicationCommandOptionType.String,
          name: "time",

          description: "The giveaway time. (ex: 1d, 1h, 1m, 1s)",
          descriptionLocalizations: {
            ru: "Время  розыгрыша. (например: 1d, 1h, 1m, 1s)",
          },

          required: true,
        },
        {
          type: ApplicationCommandOptionType.String,
          name: "prize",

          description: "The giveaway prize.",
          descriptionLocalizations: {
            ru: "Приз розыгрыша.",
          },

          required: true,
        },
        {
          type: ApplicationCommandOptionType.Number,
          name: "winners",

          description: "The giveaway winners count.",
          descriptionLocalizations: {
            ru: "Количество победителей розыгрыша.",
          },

          required: true,
        },
      ],
    });
  }

  async run(command: ChatInputCommandInteraction, config: GuildData) {
    const channel = command.options.getChannel("channel") as
      | TextChannel
      | NewsChannel;

    const time = ms(command.options.getString("time"));
    const prize = command.options.getString("prize");
    const winners = command.options.getNumber("winners");

    this.client.giveaways.create(channel, time, winners, prize);

    return command.reply({
      content: "done",
      ephemeral: true,
    });
  }
};
