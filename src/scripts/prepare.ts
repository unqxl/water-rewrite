import "module-alias/register";

import Logger = require("@lib/classes/Logger");
import { exec } from "child_process";
import { diff } from "deep-object-diff";
import { readFileSync } from "node:fs";

function check_versions() {
  const logger = new Logger();
  const package_before = readFileSync("../../package.json", "utf8");
  const before_parsed = JSON.parse(package_before);

  logger.log("Checking modules for updates...");
  const spawn = exec("cd ../../ && ncu -u --stdin --packageFile package.json");

  spawn.stdout.on("end", () => {
    const package_after = readFileSync("../../package.json", "utf8");
    const after_parsed = JSON.parse(package_after);

    const diffed = diff(before_parsed, after_parsed) as any;
    if (diffed.dependencies) {
      const length = Object.keys(diffed.dependencies).length;
      logger.log(
        `${length} module${
          length > 1 ? "s" : ""
        } updated. Executing "yarn install"...`
      );

      exec("yarn install");
      return;
    }

    logger.log("No updates found.");
    return;
  });
}

(async () => {
  await check_versions();
})();
