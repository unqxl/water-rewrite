export interface ModerationLogData {
  id?: number;

  type: ModerationLogType;
  executor: string;
  target: string;
  reason: string;
  timestamp: number;
}

export enum ModerationLogType {
  BAN = 1,
  UNBAN = 2,
  KICK = 3,
  WARN = 4,
  UNWARN = 5,
  MUTE = 6,
  TEMPMUTE = 7,
  UNMUTE = 8,
}
