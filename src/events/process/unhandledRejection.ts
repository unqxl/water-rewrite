import Event = require("@lib/classes/Event");
import { bold, EmbedBuilder, TextChannel } from "discord.js";

export = class UnhandledRejection extends Event {
  constructor() {
    super({ name: "unhandledRejection", emitter: "process" });
  }

  async run(reason: unknown, promise: Promise<unknown>) {
    this.logger.error(reason as string);

    var channel = this.client.channels.cache.get("1006553927719858196");
    if (!channel) {
      channel = await this.client.channels.fetch("1006553927719858196", {
        cache: true,
        force: true,
      });
    }

    const textChannel = channel as TextChannel;
    const embed = new EmbedBuilder();
    embed.setColor("Red");
    embed.setTitle("Unhandled Rejection");
    embed.setDescription(`› **Message**: ${bold(reason as string)}`);
    embed.setTimestamp();

    return textChannel.send({ embeds: [embed] });
  }
};
