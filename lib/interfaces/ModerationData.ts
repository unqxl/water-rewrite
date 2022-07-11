export interface ModerationLogData {
  id: number;

  type: ModerationLogType;
  executor: string;
  target: string;
  reason: string;
  timestamp: number;
}

export type ModerationLogType = "warn" | "unwarn" | "mute" | "unmute";
