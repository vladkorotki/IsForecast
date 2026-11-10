import { of, throwError } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { WeatherSnapshot } from '../entities/WeatherSnapshot.js';
import { WeatherRepository } from '../repositorises/weather.repository.js';
import { IGeoLocation } from '../types/weather-api.types.js';
import { WeatherApiService } from './weather-api.service.js';
import { WeatherService } from './weather.service.js';

describe('WeatherService', () => {
  let service: WeatherService;
  let mockApi: {
    geocode: ReturnType<typeof vi.fn>;
    reverseGeocode: ReturnType<typeof vi.fn>;
    fetchWeather: ReturnType<typeof vi.fn>;
  };
  let mockRepo: {
    findLatestForecastByLocation: ReturnType<typeof vi.fn>;
    saveSnapshot: ReturnType<typeof vi.fn>;
  };

  const mockGeo: IGeoLocation = { name: 'Minsk', country: 'BY', latitude: 53.9, longitude: 27.5 };
  const mockPayload = { current: { temperature: 10 }, hourly: {}, daily: [] };

  beforeEach(() => {
    mockApi = {
      geocode: vi.fn(),
      reverseGeocode: vi.fn(),
      fetchWeather: vi.fn(),
    };
    mockRepo = {
      findLatestForecastByLocation: vi.fn(),
      saveSnapshot: vi.fn(),
    };

    service = new WeatherService(
      mockApi as unknown as WeatherApiService,
      mockRepo as unknown as WeatherRepository,
    );
  });

  describe('getWeather', () => {
    it('should throw 404 if geocode returns null', async () => {
      mockApi.geocode.mockReturnValue(of(null));

      await expect(service.getWeather('Unknown')).rejects.toMatchObject({ status: 404 });
    });

    it('should call fetchAndCacheWeather if geocode is successful', async () => {
      mockApi.geocode.mockReturnValue(of(mockGeo));
      mockRepo.findLatestForecastByLocation.mockResolvedValue(null);
      mockApi.fetchWeather.mockReturnValue(of(mockPayload));
      mockRepo.saveSnapshot.mockResolvedValue({ fetchedAt: new Date() } as WeatherSnapshot);

      const result = await service.getWeather('Minsk');

      expect(result.location).toEqual(mockGeo);
      expect(result.payload).toEqual(mockPayload);
    });
  });

  describe('getWeatherByCoords', () => {
    it('should throw 404 if reverseGeocode returns null', async () => {
      mockApi.reverseGeocode.mockReturnValue(of(null));

      await expect(service.getWeatherByCoords(0, 0)).rejects.toMatchObject({ status: 404 });
    });

    it('should call fetchAndCacheWeather if reverseGeocode is successful', async () => {
      mockApi.reverseGeocode.mockReturnValue(of(mockGeo));
      mockRepo.findLatestForecastByLocation.mockResolvedValue(null);
      mockApi.fetchWeather.mockReturnValue(of(mockPayload));
      mockRepo.saveSnapshot.mockResolvedValue({ fetchedAt: new Date() } as WeatherSnapshot);

      const result = await service.getWeatherByCoords(53.9, 27.5);

      expect(result.location).toEqual(mockGeo);
    });
  });

  describe('fetchAndCacheWeather logic', () => {
    it('should return cached data if cache is fresh', async () => {
      mockApi.geocode.mockReturnValue(of(mockGeo));
      const freshDate = new Date();
      mockRepo.findLatestForecastByLocation.mockResolvedValue({
        payload: JSON.stringify(mockPayload),
        fetchedAt: freshDate,
      } as WeatherSnapshot);

      const result = await service.getWeather('Minsk');

      expect(result.stale).toBe(false);
      expect(result.fetchedAt).toBe(freshDate.toISOString());
      expect(mockApi.fetchWeather).not.toHaveBeenCalled();
    });

    it('should fetch from API and save to cache if cache is missing', async () => {
      mockApi.geocode.mockReturnValue(of(mockGeo));
      mockRepo.findLatestForecastByLocation.mockResolvedValue(null);
      mockApi.fetchWeather.mockReturnValue(of(mockPayload));
      const now = new Date();
      mockRepo.saveSnapshot.mockResolvedValue({ fetchedAt: now } as WeatherSnapshot);

      const result = await service.getWeather('Minsk');

      expect(result.stale).toBe(false);
      expect(mockApi.fetchWeather).toHaveBeenCalledWith(53.9, 27.5);
      expect(mockRepo.saveSnapshot).toHaveBeenCalled();
    });

    it('should fetch from API and save to cache if cache is stale', async () => {
      mockApi.geocode.mockReturnValue(of(mockGeo));
      const staleDate = new Date(Date.now() - 1000 * 60 * 60);
      mockRepo.findLatestForecastByLocation.mockResolvedValue({
        payload: JSON.stringify({ current: { temperature: 5 } }),
        fetchedAt: staleDate,
      } as WeatherSnapshot);
      mockApi.fetchWeather.mockReturnValue(of(mockPayload));
      mockRepo.saveSnapshot.mockResolvedValue({ fetchedAt: new Date() } as WeatherSnapshot);

      const result = await service.getWeather('Minsk');

      expect(result.stale).toBe(false);
      expect(result.payload).toEqual(mockPayload);
      expect(mockApi.fetchWeather).toHaveBeenCalled();
    });

    it('should return stale cache if API fails', async () => {
      mockApi.geocode.mockReturnValue(of(mockGeo));
      const staleDate = new Date(Date.now() - 1000 * 60 * 60);
      mockRepo.findLatestForecastByLocation.mockResolvedValue({
        payload: JSON.stringify({ current: { temperature: 5 } }),
        fetchedAt: staleDate,
      } as WeatherSnapshot);
      mockApi.fetchWeather.mockReturnValue(throwError(() => new Error('API down')));

      const result = await service.getWeather('Minsk');

      expect(result.stale).toBe(true);
      expect(result.fetchedAt).toBe(staleDate.toISOString());
    });

    it('should throw 503 if API fails and no cache exists', async () => {
      mockApi.geocode.mockReturnValue(of(mockGeo));
      mockRepo.findLatestForecastByLocation.mockResolvedValue(null);
      mockApi.fetchWeather.mockReturnValue(throwError(() => new Error('API down')));

      await expect(service.getWeather('Minsk')).rejects.toMatchObject({
        status: 503,
        message: 'Weather service temporarily unavailable',
      });
    });
  });
});
