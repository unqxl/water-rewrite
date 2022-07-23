import Bot = require("@lib/classes/Bot");

export = class Database {
  public client: Bot;

  constructor(client: Bot) {
    this.client = client;
  }

  getGuild(id: string) {
    const data = this.client.databases.guilds.get(id);
    if (!data) return this.createGuild(id);

    return data;
  }

  createGuild(id: string) {
    const data = this.client.databases.guilds.get(id);
    if (data) return data;

    this.client.databases.guilds.set(id, {
      locale: "en-US",
      roles: {
        auto: null,
        mute: null,
      },
      systems: {
        twitch: {
          enabled: false,
          streamers: [],
        },
      },
      texts: {
        welcome:
          "Welcome to the server, %s!\nThere's %s members in this server now.",
        goodbye:
          "It's time to say goodbye to %s!\nThere's %s members in this server now...",
        boost:
          "This server has been boosted by %s!\nThere's %s boosts in this server now.",
        unboost:
          "This server has been unboosted by %s!\nThere's %s boosts in this server now.",
      },
    });

    this.client.databases.moderation.set(id, []);

    return data;
  }

  deleteGuild(id: string) {
    const data = this.client.databases.guilds.get(id);
    if (!data) return false;

    this.client.databases.guilds.delete(id);
    this.client.databases.moderation.delete(id);

    return true;
  }
};
