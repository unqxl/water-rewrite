import CommandHandler = require("@lib/handlers/CommandHandler");
import EventHandler = require("@lib/handlers/EventHandler");
import { YtDlpPlugin } from "@distube/yt-dlp";
import { Manager } from "@djs-modules/giveaways";
import { ClientConfig } from "@lib/interfaces/ClientConfig";
import { ActivityType, Client, Collection, IntentsBitField } from "discord.js";
import DisTube from "distube";
import Enmap from "enmap";
import DiscordLogs = require("discord-logs");
import Functions = require("./Functions");

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
        IntentsBitField.Flags.GuildMessageReactions,
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

    this.functions = new Functions(this);

    // @ts-expect-error
    this.giveaways = new Manager(this, {
      dbPath: "./data/",
      defaultOptions: {
        botsCanWin: false,
        endColor: "Green",
        errorColor: "Red",
        startColor: "Blurple",
        reaction: "🎉",
        winnersCount: 1,
        mentionEveryone: true,
      },
    });

    this.distube = new DisTube(this, {
      leaveOnEmpty: true,
      leaveOnFinish: true,
      leaveOnStop: true,

      emitNewSongOnly: true,
      emitAddSongWhenCreatingQueue: false,
      emptyCooldown: 5,

      searchCooldown: 5,
      searchSongs: 10,

      plugins: [new YtDlpPlugin({ update: true })],
    });

    this.CommandHandler = new CommandHandler(this);
    this.EventHandler = new EventHandler(this);
  }

  async run() {
    this.distube.setMaxListeners(Infinity);
    DiscordLogs(this);

    this.EventHandler.handle();
    this.login(this.config.bot.token);
  }

  sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
};
