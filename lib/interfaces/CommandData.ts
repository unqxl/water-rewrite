import {
  PermissionsString,
  RESTPostAPIApplicationCommandsJSONBody,
} from "discord.js";

export interface CommandData {
  data: RESTPostAPIApplicationCommandsJSONBody;

  clientPermissions?: PermissionsString[];
  memberPermissions?: PermissionsString[];
}
