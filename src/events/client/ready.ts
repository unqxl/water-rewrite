import Event = require("@lib/classes/Event");
import { Client } from "discord-rpc";

export = class Ready extends Event {
  constructor() {
    super("ready");
  }

  async run() {
    if (!this.client.application.owner) await this.client.application.fetch();

    this.setRPC();
    this.init();

    this.logger.log(`${this.client.user.tag} is online!`);
    this.client.CommandHandler.handle();
  }

  init() {
    require("../../scripts/auto-backup");

    // Every day
    setInterval(() => {
      require("../../scripts/auto-backup");
    }, 86400000);
  }

  setRPC() {
    const rpc = new Client({ transport: "ipc" });
    rpc.login({ clientId: this.client.user.id });

    rpc.on("ready", () => {
      rpc.setActivity({
        details: `Helping ${this.client.guilds.cache.size} servers...`,
        largeImageKey: "logo",
        largeImageText: "Water",
        startTimestamp: Date.now(),
        buttons: [
          {
            label: "Support Server",
            url: "https://discord.gg/wqQKaPBbrm",
          },
        ],
      });

      // Change every hour
      setInterval(() => {
        rpc.setActivity({
          details: `Helping ${this.client.guilds.cache.size} servers...`,
          largeImageKey: "logo",
          largeImageText: "Water",
          startTimestamp: Date.now(),
          buttons: [
            {
              label: "Support Server",
              url: "https://discord.gg/wqQKaPBbrm",
            },
          ],
        });
      }, 3600000);
    });
  }
};
