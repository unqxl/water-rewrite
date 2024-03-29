import "module-alias/register";
console.clear();

import { ClientConfig } from "@lib/interfaces/ClientConfig";
import Bot = require("@lib/classes/Bot");

import fs from "node:fs";
import { parse } from "yaml";

const file = fs.readFileSync("./config.yaml", "utf8");
const config = parse(file) as ClientConfig;
const bot = new Bot(config);

bot.run();
export = bot;
