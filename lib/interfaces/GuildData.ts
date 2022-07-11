export interface GuildData {
  locale: GuildSupportedLocales;
  roles: GuildRoles;
  systems: GuildSystems;
  texts: GuildTexts;
}

type GuildSupportedLocales = "en-US" | "ru-RU" | "uk-UA";

type GuildRoles = {
  auto: string;
  mute: string;
};

type GuildSystems = {
  twitch: {
    enabled: boolean;
    streamers: TwitchStreamer[];
  };
};

type GuildTexts = {
  welcome: string;
  goodbye: string;
};

type TwitchStreamer = {
  name: string;
  last_stream: string;
};
