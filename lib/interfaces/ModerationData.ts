export interface ModerationLogData {
  id?: number;

  type: ModerationLogType;
  executor: string;
  target: string;
  reason: string;
  timestamp: number;
}

export type ModerationLogType =
  | "ban"
  | "kick"
  | "warn"
  | "unwarn"
  | "mute"
  | "unmute";
