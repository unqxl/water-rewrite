import Logger = require("@lib/classes/Logger");
import { copyFileSync, existsSync } from "node:fs";

function autoBackup() {
  const logger = new Logger();

  if (!existsSync("./data/enmap.sqlite")) {
    logger.warn("No enmap database found, canceling backup process.");
    return false;
  }

  logger.log("Creating backup...", true);
  logger.log(`› Name: backup-${Date.now()}.sqlite`);

  copyFileSync("./data/enmap.sqlite", `./backups/backup-${Date.now()}.sqlite`);

  logger.log(`Backup created!\n`);
  return true;
}

(async () => {
  await autoBackup();
})();
