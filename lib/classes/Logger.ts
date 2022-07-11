import picocolors = require("picocolors");

export = class Logger {
  get time() {
    return new Date().toLocaleString();
  }

  log(message: string) {
    const time = this.time;

    const tag = picocolors.magenta(`[${time}]`);
    const msg = picocolors.cyan(message);

    console.log([tag, msg].join(" "));
  }

  warn(message: string) {
    const time = this.time;

    const tag = picocolors.magenta(`[${time}]`);
    const msg = picocolors.yellow(message);

    console.log([tag, msg].join(" "));
  }

  error(message: string) {
    const time = this.time;

    const tag = picocolors.magenta(`[${time}]`);
    const msg = picocolors.red(message);

    console.log([tag, msg].join(" "));
  }
};
