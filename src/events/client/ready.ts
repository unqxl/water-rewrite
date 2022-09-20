import Event = require("@lib/classes/Event");

export = class Ready extends Event {
  constructor() {
    super({ name: "ready" });
  }

  async run() {
    if (!this.client.application.owner) await this.client.application.fetch();
    this.client.application.commands.set([]);

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
};
