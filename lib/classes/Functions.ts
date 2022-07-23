import Bot from "./Bot";

export = class Functions {
  public client: Bot;

  constructor(client: Bot) {
    this.client = client;
  }

  formatString(string: string, ...args: any[]) {
    return string.replace(/%s/g, () => {
      return args.shift();
    });
  }
};
