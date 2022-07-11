import {
  ApplicationCommandOptionData,
  LocalizationMap,
  PermissionsString,
} from "discord.js";

export interface CommandData {
  group?: string;
  name: string;
  description: string;
  descriptionLocalizations?: LocalizationMap;
  options?: ApplicationCommandOptionData[];

  clientPermissions?: PermissionsString[];
  memberPermissions?: PermissionsString[];
}
