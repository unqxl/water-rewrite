import Bot = require("@lib/classes/Bot");
import { request } from "undici";
import SteamAPI = require("./steam.api");

export = class FaceitAPI {
  public client: Bot;

  constructor(client: Bot) {
    this.client = client;
  }

  async getPlayerByID(id: string) {
    const Steam = new SteamAPI(this.client);
    const response = await Steam.resolveByID(id);
    if (response.status === false) {
      return {
        status: false,
        result: response.result,
      };
    }

    const faceit_url = "https://open.faceit.com/data/v4/players";
    const data: FaceitPlayersResponse = await (
      await request(faceit_url, {
        body: `game=csgo&game_player_id=${response.result}`,
      })
    ).body.json();

    if (data.errors && data.errors.length) {
      return {
        status: false,
        result:
          data.errors[0].message === "The resource was not found."
            ? "No user with that ID found!"
            : data.errors[0].message,
      };
    }
  }
};

interface FaceitPlayersResponse {
  errors?: [
    {
      message: string;
      code: string;
      http_status: number;
      parameters: string[];
    }
  ];

  player_id: string;
  nickname: string;
  avatar: string;
  country: string;
  cover_image: string;
  platforms: {
    steam?: string;
  };
  games: {
    csgo?: {
      region: string;
      game_player_id: string;
      skill_level: number;
      faceit_elo: number;
      game_player_name: string;
      skill_level_label: string;
      regions: object;
      game_profile_id: string;
    };
  };
  settings: {
    language: string;
  };
  friends_ids: string[];
  new_steam_id: string;
  steam_id_64: string;
  steam_nickname: string;
  memberships: string[];
  faceit_url: string;
  membership_type: string;
  cover_featured_image: string;
  infractions: object;
}
