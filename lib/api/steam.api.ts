import Bot = require("@lib/classes/Bot");
import Logger = require("@lib/classes/Logger");
import { request } from "undici";

export = class SteamAPI {
  public client: Bot;
  private logger: Logger;

  constructor(client: Bot) {
    this.client = client;
    this.logger = new Logger();

    if (typeof this.client.config.keys.steam === "undefined") {
      throw this.logger.error('Steam API Key is not defined in "config.yaml"!');
    }
  }

  async resolveByID(id: string): Promise<{ status: boolean; result: any }> {
    const resolve_url =
      "https://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/";

    const summaries_url =
      "http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/";

    const data: VanityURLResponse = await (
      await request(resolve_url, {
        body: `key=${this.client.config.keys.steam}&vanityurl=${id}`,
      })
    ).body.json();

    if ("message" in data.response) {
      const summary: PlayerSummaryResponse = await (
        await request(summaries_url, {
          body: `key=${this.client.config.keys.steam}&steamids=${id}`,
        })
      ).body.json();

      if (!summary.response.players.length) {
        return {
          status: false,
          result: "No user with that ID found!",
        };
      } else {
        return {
          status: true,
          result: summary.response.players[0].steamid,
        };
      }
    }

    return {
      status: true,
      result: data.response.steamid,
    };
  }
};

interface VanityURLResponse {
  response: {
    steamid: string;
    success: number;
    message?: string;
  };
}

interface PlayerSummaryResponse {
  response: {
    players: {
      steamid: string;
      communityvisibilitystate: number;
      profilestate: number;
      personaname: string;
      profileurl: string;
      avatar: string;
      avatarmedium: string;
      avatarfull: string;
      avatarhash: string;
      lastlogoff: number;
      personastate: number;
      primaryclanid: string;
      timecreated: number;
      personastateflags: number;
    }[];
  };
}
