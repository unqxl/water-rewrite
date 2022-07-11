import Event = require("@lib/classes/Event");

export = class Ready extends Event {
  constructor() {
    super("ready");
  }

  async run() {
    if (!this.client.application.owner) await this.client.application.fetch();

    this.logger.log(`${this.client.user.tag} is online!`);
    this.client.CommandHandler.handle();
  }
};
