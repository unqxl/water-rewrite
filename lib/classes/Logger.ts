import picocolors = require("picocolors");

export = class Logger {
  get time() {
    return new Date().toLocaleString();
  }

  log(message: string, enter_before?: boolean) {
    const time = this.time;

    const tag = picocolors.magenta(`[${time}]`);
    const msg = picocolors.cyan(message);

    console.log([enter_before ? `\n${tag}` : tag, msg].join(" "));
  }

  warn(message: string, enter_before?: boolean) {
    const time = this.time;

    const tag = picocolors.magenta(`[${time}]`);
    const msg = picocolors.yellow(message);

    console.log([enter_before ? `\n${tag}` : tag, msg].join(" "));
  }

  error(message: string, enter_before?: boolean) {
    const time = this.time;

    const tag = picocolors.magenta(`[${time}]`);
    const msg = picocolors.red(message);

    console.log([enter_before ? `\n${tag}` : tag, msg].join(" "));
  }
};
