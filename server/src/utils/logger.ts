import { ILogEntry, LogMetadataType, LogPriorityType } from '../types/logger.types.js';

function log(priority: LogPriorityType, message: string, metadata?: LogMetadataType): void {
  const logEntry: ILogEntry = {
    timestamp: new Date().toISOString(),
    priority,
    message,
  };

  if (metadata) {
    logEntry.metadata = metadata;
  }

  const output = JSON.stringify(logEntry);

  if (priority === 'error') {
    console.error(output);
  } else {
    console.log(output);
  }
}

export const logger = {
  info: (message: string, metadata?: LogMetadataType): void => log('info', message, metadata),
  warn: (message: string, metadata?: LogMetadataType): void => log('warn', message, metadata),
  error: (message: string, metadata?: LogMetadataType): void => log('error', message, metadata),
};
