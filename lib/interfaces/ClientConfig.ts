export interface ClientConfig {
  bot: {
    token: string;
    owners?: string[];
  };

  keys?: {
    steam?: string;
    faceit?: string;
  };

  twitch?: {
    client_id?: string;
    client_secret?: string;
  };
}
