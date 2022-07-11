import Event = require("@lib/classes/Event");
import { codeBlock, Message } from "discord.js";

export = class MessageCreate extends Event {
  constructor() {
    super("messageCreate");
  }

  run(message: Message) {
    if (!message.inGuild() || message.author.bot) return;

    const prefix = "?";
    if (!message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).trim().split(" ");
    const command = args.shift().toLowerCase();

    switch (command) {
      case "eval": {
        message.delete();

        if (!this.client.config.bot.owners.includes(message.author.id)) return;

        const code = args.join(" ");

        try {
          const evaled = eval(code);
          console.log(evaled);

          return message.channel.send(
            "✅ | **Code executed successfully**\n**Output logged to console**"
          );
        } catch (err) {
          console.log(err);

          return message.channel.send(codeBlock("js", err.message));
        }
      }
    }
  }
};
