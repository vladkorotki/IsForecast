import { NextFunction, Request, Response } from 'express';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { WeatherService } from '../services/weather.service.js';
import { WeatherController } from './weather.controller.js';

describe('WeatherController', () => {
  let controller: WeatherController;
  let mockWeatherService: {
    getWeather: ReturnType<typeof vi.fn>;
    getWeatherByCoords: ReturnType<typeof vi.fn>;
  };
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockWeatherService = {
      getWeather: vi.fn(),
      getWeatherByCoords: vi.fn(),
    };

    controller = new WeatherController(mockWeatherService as unknown as WeatherService);

    mockResponse = {
      json: vi.fn(),
      status: vi.fn().mockReturnThis(), // Возвращаем сам res для цепочки вызовов
    };

    mockNext = vi.fn();
  });

  it('should call getWeatherByCoords when lat and lon are provided', async () => {
    mockRequest = { query: { lat: '53.9', lon: '27.5' } };
    const mockResult = { location: { name: 'Minsk' }, payload: {} };
    mockWeatherService.getWeatherByCoords.mockResolvedValue(mockResult);

    await controller.getWeather(mockRequest as Request, mockResponse as Response, mockNext);

    expect(mockWeatherService.getWeatherByCoords).toHaveBeenCalledWith(53.9, 27.5);
    expect(mockResponse.json).toHaveBeenCalledWith(mockResult);
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should call getWeather when location string is provided', async () => {
    mockRequest = { query: { location: 'Minsk' } };
    const mockResult = { location: { name: 'Minsk' }, payload: {} };
    mockWeatherService.getWeather.mockResolvedValue(mockResult);

    await controller.getWeather(mockRequest as Request, mockResponse as Response, mockNext);

    expect(mockWeatherService.getWeather).toHaveBeenCalledWith('Minsk');
    expect(mockResponse.json).toHaveBeenCalledWith(mockResult);
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should return 400 if location is missing', async () => {
    mockRequest = { query: {} };

    await controller.getWeather(mockRequest as Request, mockResponse as Response, mockNext);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: 'Invalid "location" or "lat/lon" query params',
    });
    expect(mockWeatherService.getWeather).not.toHaveBeenCalled();
  });

  it('should return 400 if location is too long', async () => {
    mockRequest = { query: { location: 'A'.repeat(101) } }; // Строка длиннее 100 символов

    await controller.getWeather(mockRequest as Request, mockResponse as Response, mockNext);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: 'Invalid "location" or "lat/lon" query params',
    });
  });

  it('should call next(err) if service throws an error', async () => {
    mockRequest = { query: { location: 'Minsk' } };
    const error = new Error('Service Error');
    mockWeatherService.getWeather.mockRejectedValue(error);

    await controller.getWeather(mockRequest as Request, mockResponse as Response, mockNext);

    expect(mockNext).toHaveBeenCalledWith(error);
    expect(mockResponse.json).not.toHaveBeenCalled();
  });
});
