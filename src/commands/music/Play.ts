import Bot = require("@lib/classes/Bot");
import { SubCommand } from "@lib/classes/SubCommand";
import { GuildData } from "@lib/interfaces/GuildData";
import {
  ActionRowBuilder,
  ApplicationCommandOptionType,
  bold,
  ChatInputCommandInteraction,
  ComponentType,
  EmbedBuilder,
  GuildMember,
  SelectMenuBuilder,
  SelectMenuOptionBuilder,
  TextChannel,
} from "discord.js";
import { SearchResultType, SearchResultVideo } from "distube";

export = class PlayCommand extends SubCommand {
  constructor(client: Bot) {
    super(client, {
      commandName: "music",
      name: "play",

      description: "Play a song from YouTube.",
      descriptionLocalizations: {
        ru: "Включить песню из YouTube.",
      },

      options: [
        {
          type: ApplicationCommandOptionType.String,
          name: "query",
          description: "The song to play.",
          descriptionLocalizations: {
            ru: "Песня для проигрывания.",
          },
          required: true,
        },
      ],
    });
  }

  async run(command: ChatInputCommandInteraction, config: GuildData) {
    const clientMember = command.guild.members.me;
    const member = command.member as GuildMember;

    await this.client.functions.checkVoiceChannel(
      clientMember,
      member,
      command
    );

    const query = command.options.getString("query");
    const results = (await this.client.distube.search(query, {
      type: SearchResultType.VIDEO,
      limit: 10,
    })) as SearchResultVideo[];

    const row = new ActionRowBuilder<SelectMenuBuilder>();
    const menu = new SelectMenuBuilder();
    menu.setCustomId("play-menu");
    menu.setPlaceholder("Select a song to play...");
    menu.setMinValues(1);
    menu.setMaxValues(1);

    const options = [];
    for (const result of results) {
      const option = new SelectMenuOptionBuilder();
      option.setLabel(result.name);
      option.setValue(result.id);

      options.push(option);
    }

    menu.setOptions(options);
    row.addComponents(menu);

    const msg = await command.reply({
      content: bold(`Results for "${query}":`),
      components: [row],
    });

    const collector = msg.createMessageComponentCollector({
      componentType: ComponentType.SelectMenu,
      filter: (select) => select.user.id === command.user.id,
      time: 60000,
      max: 1,
    });

    collector.on("collect", async (int) => {
      if (!int.isSelectMenu()) return;

      const value = int.values[0];
      if (!value) return;

      const url = `https://www.youtube.com/watch?v=${value}`;

      await command.deleteReply();

      try {
        this.client.distube.play(member.voice.channel, url, {
          member: command.member as GuildMember,
          textChannel: command.channel as TextChannel,
        });
      } catch (error) {
        int.reply({
          content: `❌ | ${bold(error.message)}`,
        });

        return;
      }
    });

    collector.on("end", async (collected, reason) => {
      if (reason === "time") {
        await command.deleteReply();
      }
    });
  }
};
