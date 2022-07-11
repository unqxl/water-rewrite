import CommandHandler = require("@lib/handlers/CommandHandler");
import EventHandler = require("@lib/handlers/EventHandler");
import { YtDlpPlugin } from "@distube/yt-dlp";
import { ClientConfig } from "@lib/interfaces/ClientConfig";
import { ActivityType, Client, Collection, IntentsBitField } from "discord.js";
import DisTube from "distube";
import Enmap from "enmap";

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
        IntentsBitField.Flags.GuildVoiceStates,
        IntentsBitField.Flags.MessageContent,
      ],

      presence: {
        status: "dnd",
        activities: [
          {
            type: ActivityType.Competing,
            name: "fire",
          },
        ],
      },
    });

    this.config = config;

    this.commands = new Collection();
    this.events = new Collection();

    this.databases = {
      guilds: new Enmap({
        name: "guilds",
        dataDir: "./data",
        wal: false,
      }),
      moderation: new Enmap({
        name: "moderation",
        dataDir: "./data",
        wal: false,
      }),
    };

    this.distube = new DisTube(this, {
      leaveOnEmpty: true,
      leaveOnFinish: true,
      leaveOnStop: true,

      emitNewSongOnly: true,
      emitAddSongWhenCreatingQueue: false,
      emptyCooldown: 5,

      plugins: [new YtDlpPlugin()],
    });

    this.CommandHandler = new CommandHandler(this);
    this.EventHandler = new EventHandler(this);
  }

  async run() {
    this.distube.setMaxListeners(Infinity);

    this.EventHandler.handle();
    this.login(this.config.bot.token);
  }
};
