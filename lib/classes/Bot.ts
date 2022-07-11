import CommandHandler = require("@lib/handlers/CommandHandler");
import EventHandler = require("@lib/handlers/EventHandler");
import { ClientConfig } from "@lib/interfaces/ClientConfig";
import { Client, Collection, IntentsBitField } from "discord.js";

export = class Bot extends Client {
  public config: ClientConfig;
  public CommandHandler: CommandHandler;
  public EventHandler: EventHandler;

  constructor(config: ClientConfig) {
    super({
      intents: [
        IntentsBitField.Flags.GuildBans,
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.GuildPresences,
        IntentsBitField.Flags.MessageContent,
      ],
    });

    this.config = config;

    this.commands = new Collection();
    this.events = new Collection();

    this.CommandHandler = new CommandHandler(this);
    this.EventHandler = new EventHandler(this);
  }

  async run() {
    this.EventHandler.handle();
    this.login(this.config.bot.token);
  }
};
