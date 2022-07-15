export interface ClientConfig {
  bot: {
    token: string;
    owners?: string[];
  };

  keys?: {
    steam?: string;
    faceit?: string;
  };
}
