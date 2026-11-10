import { of } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { WEATHER_CONFIG } from '../config/weather.config.js';
import { HttpClientService } from './http-client.service.js';
import { WeatherApiService } from './weather-api.service.js';

describe('WeatherApiService', () => {
  let service: WeatherApiService;
  let mockHttpClient: { get: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    mockHttpClient = { get: vi.fn() };
    service = new WeatherApiService(mockHttpClient as unknown as HttpClientService);
  });

  it('should geocode a position and return location', async () => {
    const mockResponse = {
      results: [{ name: 'Minsk', country: 'Belarus', latitude: 53.9, longitude: 27.5 }],
    };
    mockHttpClient.get.mockReturnValue(of(mockResponse));

    const result = await new Promise((resolve) => {
      service.geocode('Minsk').subscribe(resolve);
    });

    expect(mockHttpClient.get).toHaveBeenCalledWith(
      expect.stringContaining(`${WEATHER_CONFIG.GEOCODING_URL}?name=Minsk`),
    );
    expect(result).toEqual({
      name: 'Minsk',
      country: 'Belarus',
      latitude: 53.9,
      longitude: 27.5,
    });
  });

  it('should return null if geocode finds no results', async () => {
    mockHttpClient.get.mockReturnValue(of({ results: [] }));

    const result = await new Promise((resolve) => {
      service.geocode('Unknown').subscribe(resolve);
    });

    expect(result).toBeNull();
  });

  it('should reverse geocode coords and return location', async () => {
    const mockResponse = {
      city: 'Minsk',
      countryName: 'Belarus',
    };
    mockHttpClient.get.mockReturnValue(of(mockResponse));

    const result = await new Promise((resolve) => {
      service.reverseGeocode(53.9, 27.5).subscribe(resolve);
    });

    expect(mockHttpClient.get).toHaveBeenCalledWith(
      expect.stringContaining(
        `${WEATHER_CONFIG.REVERSE_GEOCODING_URL}?latitude=53.9&longitude=27.5`,
      ),
    );
    expect(result).toEqual({
      name: 'Minsk',
      country: 'Belarus',
      latitude: 53.9,
      longitude: 27.5,
    });
  });

  it('should return null if reverse geocode finds no city', async () => {
    mockHttpClient.get.mockReturnValue(of({})); // Нет city, locality и т.д.

    const result = await new Promise((resolve) => {
      service.reverseGeocode(0, 0).subscribe(resolve);
    });

    expect(result).toBeNull();
  });

  it('should fetch weather and map raw response to IWeatherPayload', async () => {
    const mockRawResponse = {
      current: {
        temperature_2m: 10,
        relative_humidity_2m: 80,
        pressure_msl: 1012,
        cloud_cover: 50,
        uv_index: 2,
        weather_code: 3,
      },
      hourly: {
        time: ['2026-11-10T10:00'],
        temperature_2m: [10],
        precipitation: [0],
        relative_humidity_2m: [80],
        pressure_msl: [1012],
        cloud_cover: [50],
        uv_index: [2],
        weather_code: [3],
        snowfall: [0],
        wind_speed_10m: [5],
      },
      daily: {
        time: ['2026-11-10'],
        temperature_2m_max: [12],
        temperature_2m_min: [5],
        weather_code: [3],
        precipitation_sum: [0],
        uv_index_max: [2],
        sunrise: ['2026-11-10T07:00:00'],
        sunset: ['2026-11-10T17:00:00'],
      },
    };
    mockHttpClient.get.mockReturnValue(of(mockRawResponse));

    const result = await new Promise((resolve) => {
      service.fetchWeather(53.9, 27.5).subscribe(resolve);
    });

    expect(mockHttpClient.get).toHaveBeenCalledWith(
      expect.stringContaining(`${WEATHER_CONFIG.FORECAST_URL}?latitude=53.9&longitude=27.5`),
    );

    // Проверяем, что маппинг прошел успешно
    expect(result).toEqual(
      expect.objectContaining({
        current: expect.objectContaining({ temperature: 10, humidity: 80 }),
        hourly: expect.objectContaining({ temperature: [10], windSpeed: [5] }),
        daily: [
          expect.objectContaining({ tempMax: 12, tempMin: 5, sunrise: '2026-11-10T07:00:00' }),
        ],
      }),
    );
  });
});
