import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { logger } from './logger.js';

describe('logger', () => {
  let consoleLogSpy: ReturnType<typeof vi.spyOn>;
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should log info using console.log', () => {
    logger.info('Test info');

    expect(consoleLogSpy).toHaveBeenCalledTimes(1);
    expect(consoleErrorSpy).not.toHaveBeenCalled();

    const logOutput = JSON.parse(consoleLogSpy.mock.calls[0][0]);
    expect(logOutput.priority).toBe('info');
    expect(logOutput.message).toBe('Test info');
    expect(logOutput.timestamp).toBeDefined();
  });

  it('should log warn using console.log', () => {
    logger.warn('Test warn');

    expect(consoleLogSpy).toHaveBeenCalledTimes(1);

    const logOutput = JSON.parse(consoleLogSpy.mock.calls[0][0]);
    expect(logOutput.priority).toBe('warn');
  });

  it('should log error using console.error', () => {
    logger.error('Test error');

    expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
    expect(consoleLogSpy).not.toHaveBeenCalled();

    const logOutput = JSON.parse(consoleErrorSpy.mock.calls[0][0]);
    expect(logOutput.priority).toBe('error');
    expect(logOutput.message).toBe('Test error');
  });

  it('should include metadata in the log output', () => {
    const metadata = { userId: 1, action: 'login' };

    logger.info('User action', metadata);

    const logOutput = JSON.parse(consoleLogSpy.mock.calls[0][0]);
    expect(logOutput.metadata).toEqual(metadata);
  });
});
