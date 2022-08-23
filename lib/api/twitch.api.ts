import Bot = require("@lib/classes/Bot");
import Logger = require("@lib/classes/Logger");
import { Guild } from "discord.js";
import { request } from "undici";

export = class TwitchAPI {
  public client: Bot;
  private logger: Logger;

  constructor(client: Bot) {
    this.client = client;
    this.logger = new Logger();

    if (typeof this.client.config.twitch === "undefined") {
      throw this.logger.error(
        'Twitch Credentials are not defined in "config.yaml"!'
      );
    }
  }

  async getToken(): Promise<string | null> {
    const id = this.client.config.twitch.client_id;
    const secret = this.client.config.twitch.client_secret;

    var params = "";
    params += `?client_id=${id}`;
    params += `&client_secret=${secret}`;
    params += `&grant_type=client_credentials`;

    const url = "https://id.twitch.tv/oauth2/token";
    const data = await (
      await request(url, {
        method: "POST",
        body: params,
      })
    ).body.json();

    if ("access_token" in data) {
      return data["access_token"];
    }

    return null;
  }

  async getStreamerData(streamer: string): Promise<TwitchStreamer> {
    const token = await this.getToken();
    const id = this.client.config.twitch.client_id;

    var params = "";
    params += `?login=${streamer}`;

    const url = `https://api.twitch.tv/helix/users`;
    const body: {
      data: TwitchStreamer[];
    } = await (
      await request(url, {
        method: "GET",
        body: params,
        headers: {
          "Client-ID": id,
          Authorization: `Bearer ${token}`,
        },
      })
    ).body.json();

    if (body.data.length <= 0) {
      return null;
    }

    return body.data[0];
  }

  async getStreamData(streamer: string): Promise<TwitchStream> {
    const token = await this.getToken();
    const id = this.client.config.twitch.client_id;

    var params = "";
    params += "?first=1";
    params += `&user_login=${streamer}`;

    const url = `https://api.twitch.tv/helix/streams`;
    const body: {
      data: TwitchStream[];
    } = await (
      await request(url, {
        method: "GET",
        body: params,
        headers: {
          "Client-ID": id,
          Authorization: `Bearer ${token}`,
        },
      })
    ).body.json();

    if (body.data.length <= 0) {
      return null;
    }

    return body.data[0];
  }

  async check(guild: Guild) {
    const config = this.client.databases.guilds.get(guild.id);
    const { streamers } = config.systems.twitch;

    for (const streamer of streamers) {
      const data = await this.getStreamerData(streamer.name);
      if (!data) continue;

      const stream = await this.getStreamData(streamer.name);
      if (!stream) continue;

      if (streamer.last_stream === stream.id) continue;
      streamer.last_stream = stream.id;

      this.client.emit("twitchLive", config, streamer, data);
    }
  }
};

interface TwitchStreamer {
  id: string;
  login: string;
  display_name: string;
  type: string;
  broadcaster_type: string;
  description: string;
  profile_image_url: string;
  offline_image_url: string;
  view_count: number;
  created_at: string;
}

interface TwitchStream {
  id: string;
  user_id: string;
  user_name: string;
  user_login: string;
  game_id: string;
  game_name: string;
  type: string;
  title: string;
  viewer_count: number;
  started_at: string;
  language: string;
  thumbnail_url: string;
  tag_ids: string[];
  is_mature: boolean;
}
