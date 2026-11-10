import { NextFunction, Request, Response } from 'express';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { logger } from '../utils/logger.js';
import { errorHandler } from './error-handler.js';

vi.mock('../utils/logger', () => ({
  logger: {
    error: vi.fn(),
  },
}));

describe('errorHandler', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };
    mockNext = vi.fn();
    vi.clearAllMocks();
  });

  it('should handle error with custom status and message', () => {
    const error = { status: 404, message: 'Not Found' };

    errorHandler(error, mockRequest as Request, mockResponse as Response, mockNext);

    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Not Found' });
    expect(logger.error).toHaveBeenCalledWith('request failed', {
      message: 'Not Found',
      status: 404,
    });
  });

  it('should fallback to 500 and default message for unknown errors', () => {
    const error = {};

    errorHandler(error, mockRequest as Request, mockResponse as Response, mockNext);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Internal server error' });
    expect(logger.error).toHaveBeenCalledWith('request failed', {
      message: 'Internal server error',
      status: 500,
    });
  });

  it('should handle string status correctly', () => {
    const error = { status: '400', message: 'Bad Request' };

    errorHandler(error, mockRequest as Request, mockResponse as Response, mockNext);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Bad Request' });
  });
});
