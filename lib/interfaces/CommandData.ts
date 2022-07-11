import {
  ApplicationCommandOptionData,
  LocalizationMap,
  PermissionsString,
} from "discord.js";

export interface CommandData {
  name: string;

  description: string;
  descriptionLocalized?: LocalizationMap;

  options: ApplicationCommandOptionData[];

  clientPermissions: PermissionsString[];
  memberPermissions: PermissionsString[];
}
