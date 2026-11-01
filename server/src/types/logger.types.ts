export type LogPriorityType = "info" | "warn" | "error";
export type LogMetadataType = Record<string, unknown>;

export interface ILogEntry {
  timestamp: string;
  priority: LogPriorityType;
  message: string;
  metadata?: LogMetadataType;
}
