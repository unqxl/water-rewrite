import Event = require("@lib/classes/Event");
import { EmbedBuilder, bold, Message, hyperlink } from "discord.js";
import { Queue, Song } from "distube";

export = class PlaySong extends Event {
  constructor() {
    super({ name: "playSong", emitter: "distube" });
  }

  async run(queue: Queue, song: Song) {
    const embed = new EmbedBuilder();
    embed.setColor("Blurple");
    embed.setAuthor({
      name: song.user.tag,
      iconURL: song.user.avatarURL(),
    });
    embed.setDescription(
      [
        `🎶 | ${bold(`Now Playing: ${hyperlink(song.name, song.url)}`)}`,
        `› **Name**: ${bold(song.name)}`,
        `› **Views**: ${bold(song.views.toLocaleString("be"))}`,
        `› **Duration**: ${bold(`[0:00/${song.formattedDuration}]`)}`,
      ].join("\n")
    );
    embed.setTimestamp();

    return queue.textChannel.send({
      embeds: [embed],
    });
  }
};
