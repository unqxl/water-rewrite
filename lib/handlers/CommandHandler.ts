import Handler = require("@lib/classes/Handler");
import Bot = require("@lib/classes/Bot");
import { BaseCommand } from "@lib/classes/Command/BaseCommand";
import { Command } from "@lib/classes/Command";
import { ContextCommand } from "@lib/classes/ContextCommand";
import { SubCommand } from "@lib/classes/SubCommand";
import {
  ApplicationCommandData,
  ApplicationCommandOptionType,
  ApplicationCommandType,
} from "discord.js";

import Glob from "glob";
import path from "path";
import { promisify } from "util";
const glob = promisify(Glob);

export = class CommandHandler extends Handler {
  constructor(client: Bot) {
    super(client, "CommandHandler");
  }

  async handle() {
    const template = "./commands/**/*{.ts, .js}";
    const files = await glob(template);
    if (!files.length) return this.logger.warn("No commands found!");

    const subCommands: Record<string, SubCommand[]> = {};
    const commandGroups: Record<string, [string, BaseCommand[]]> = {};
    for (const file of files) {
      delete require.cache[path.resolve(file)];

      const command = await this.resolveFile<
        Command | SubCommand | ContextCommand
      >(file, this.client);

      var commandName;
      if (command instanceof SubCommand) {
        const groupName = command.options.group;
        const topLevelName = command.options.commandName;

        if (groupName) {
          const prev = commandGroups[groupName]?.[1] ?? [];

          commandGroups[groupName] = [topLevelName, [...prev, command]];
          commandName = `${topLevelName}-${groupName}-${command.name}`;
        } else if (topLevelName) {
          const prev = subCommands[topLevelName] ?? [];

          subCommands[topLevelName] = [...prev, command];
          commandName = `${topLevelName}-${command.name}`;
        }
      } else if (command instanceof ContextCommand) {
        commandName = command.name;

        const data: ApplicationCommandData = {
          type: ApplicationCommandType.User,
          name: command.name,
          dmPermission: false,
        };

        await this.client.application.commands.create(data);
      } else {
        commandName = command.name;

        const data: ApplicationCommandData = {
          type: ApplicationCommandType.ChatInput,
          name: command.name,
          description: command.options.description ?? "Without description.",
          descriptionLocalizations: {
            ru: command.options.description ?? "Без описания.",
          },
          dmPermission: false,
        };

        await this.client.application.commands.create(data);
      }

      this.client.commands.set(commandName, command);
    }

    for (const topLevelName in subCommands) {
      const cmds = subCommands[topLevelName];
      const data: ApplicationCommandData = {
        type: ApplicationCommandType.ChatInput,
        name: topLevelName,
        description: `"${topLevelName}" Commands.`,
        descriptionLocalizations: {
          ru: `Команды "${topLevelName}".`,
        },
        // @ts-ignore
        options: cmds.map((v) => v.options),
        dmPermission: false,
      };

      await this.client.application.commands.create(data);
    }

    const groupCache: any[] = [];
    for (const groupName in commandGroups) {
      const [topLevelName, cmds] = commandGroups[groupName];

      const groupData = {
        type: ApplicationCommandOptionType.SubcommandGroup,
        name: groupName,
        description: `"${groupName}" Sub Commands.`,
        descriptionLocalizations: {
          ru: `Подкоманды "${groupName}".`,
        },
        options: cmds.map((v) => v.options),
        dmPermission: false,
      };

      groupCache.push(groupData);

      const data: ApplicationCommandData = {
        type: ApplicationCommandType.ChatInput,
        name: topLevelName,
        description: `"${topLevelName}" Commands.`,
        descriptionLocalizations: {
          ru: `Команды "${topLevelName}".`,
        },
        options: [
          ...groupCache,
          ...subCommands[topLevelName].map((v) => v.options),
        ],
        dmPermission: false,
      };

      await this.client.application.commands.create(data);
    }

    this.logger.log(`Loaded ${files.length} commands!`);
  }

  private async resolveFile<T>(file: string, client: Bot): Promise<T | null> {
    const resolvedPath = path.resolve(file);

    const File = await (await import(resolvedPath)).default;
    if (!File?.constructor) return null;

    return new File(client) as T;
  }
};
