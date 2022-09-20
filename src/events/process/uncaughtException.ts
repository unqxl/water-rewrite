import Event = require("@lib/classes/Event");
import { bold, EmbedBuilder, TextChannel } from "discord.js";
import ErrorStackParser = require("error-stack-parser");

export = class UncaughtException extends Event {
  constructor() {
    super({ name: "uncaughtException", emitter: "process" });
  }

  async run(error: Error, origin: NodeJS.UncaughtExceptionOrigin) {
    this.logger.error(error.message);

    var channel = this.client.channels.cache.get("1006553927719858196");
    if (!channel) {
      channel = await this.client.channels.fetch("1006553927719858196", {
        cache: true,
        force: true,
      });
    }

    const textChannel = channel as TextChannel;
    const parsed = ErrorStackParser.parse(error);
    const embed = new EmbedBuilder();
    embed.setColor("Red");
    embed.setTitle("Uncaught Exception");
    embed.setDescription(
      [
        `› **Message**: ${bold(error.message)}`,
        `› **Error at**: ${bold(parsed[0].fileName)} (**${
          parsed[0].lineNumber
        }**)`,
      ].join("\n")
    );
    embed.setTimestamp();

    return textChannel.send({ embeds: [embed] });
  }
};
