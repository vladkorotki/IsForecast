import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  IGeoLocation,
  IWeatherCurrent,
  IWeatherDaily,
  IWeatherHourly,
} from '../types/weather.types';
import {
  calculateDailyStats,
  filterHourlyForDay,
  getDisplayWeather,
  getUvDescription,
} from './isf-weather.util';

describe('Weather Utils', () => {
  const mockLocation: IGeoLocation = {
    name: 'Minsk',
    country: 'BY',
    latitude: 53.9,
    longitude: 27.5,
  };

  const mockDaily: IWeatherDaily = {
    date: '2026-11-10',
    tempMax: 10,
    tempMin: 5,
    weatherCode: 3,
    precipitationSum: 0.5,
    uvIndexMax: 2,
    sunrise: '2026-11-10T07:00:00',
    sunset: '2026-11-10T17:00:00',
  };

  const mockCurrent: IWeatherCurrent = {
    temperature: 8,
    humidity: 80,
    pressure: 1012,
    cloudCover: 50,
    uvIndex: 1,
    weatherCode: 2,
    location: mockLocation,
  };

  const mockHourly: IWeatherHourly = {
    time: ['2026-11-10T10:00', '2026-11-10T12:00', '2026-11-10T14:00', '2026-11-11T10:00'],
    temperature: [6, 8, 9, 5],
    precipitation: [0, 0.5, 0, 0],
    humidity: [85, 80, 75, 90],
    pressure: [1010, 1012, 1011, 1015],
    cloudCover: [60, 50, 40, 80],
    uvIndex: [1, 2, 4, 0],
    weatherCode: [3, 3, 2, 3],
    snowfall: [0, 0, 0, 0],
    windSpeed: [5, 8, 10, 4],
  };

  describe('getUvDescription', () => {
    it('should return correct text based on UV index', () => {
      expect(getUvDescription(0)).toBe('Low');
      expect(getUvDescription(2.9)).toBe('Low');
      expect(getUvDescription(3)).toBe('Moderate');
      expect(getUvDescription(5.9)).toBe('Moderate');
      expect(getUvDescription(6)).toBe('High');
      expect(getUvDescription(7.9)).toBe('High');
      expect(getUvDescription(8)).toBe('Very High');
      expect(getUvDescription(12)).toBe('Very High');
    });
  });

  describe('filterHourlyForDay', () => {
    it('should filter arrays for a specific day', () => {
      const result = filterHourlyForDay(mockDaily, mockHourly);

      expect(result.temperature).toEqual([6, 8, 9]);
      expect(result.humidity).toEqual([85, 80, 75]);
      expect(result.pressure).toEqual([1010, 1012, 1011]);
      expect(result.precipitation).toEqual([0, 0.5, 0]);
      expect(result.uvIndex).toEqual([1, 2, 4]);
      expect(result.windSpeed).toEqual([5, 8, 10]);
    });

    it('should return empty arrays if day is not found', () => {
      const notFoundDay = { ...mockDaily, date: '2026-12-31' };
      const result = filterHourlyForDay(notFoundDay, mockHourly);

      expect(result.temperature).toEqual([]);
      expect(result.humidity).toEqual([]);
    });
  });

  describe('calculateDailyStats', () => {
    it('should return null if data is empty', () => {
      const emptyData = {
        temperature: [],
        humidity: [],
        pressure: [],
        precipitation: [],
        uvIndex: [],
        windSpeed: [],
      };
      expect(calculateDailyStats(emptyData, mockDaily)).toBeNull();
    });

    it('should calculate correct stats', () => {
      const filteredData = filterHourlyForDay(mockDaily, mockHourly);
      const result = calculateDailyStats(filteredData, mockDaily);

      expect(result).not.toBeNull();
      if (result) {
        expect(result.maxHumidity).toBe(85);
        expect(result.avgPressure).toBe(1011);
        expect(result.maxUv).toBe('4.0');
        expect(result.uvText).toBe('Moderate');
        expect(result.rainHours).toBe(1);
        expect(result.maxWind).toBe(10);
        expect(result.sunrise).toBe(mockDaily.sunrise);
        expect(result.sunset).toBe(mockDaily.sunset);
      }
    });
  });

  describe('getDisplayWeather', () => {
    beforeEach(() => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2026-11-10T12:30:00'));
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should return null if activeDay is null', () => {
      const result = getDisplayWeather(null, mockDaily, mockCurrent, mockHourly, mockLocation);
      expect(result).toBeNull();
    });

    it('should return null if no hourly data for the day', () => {
      const notFoundDay = { ...mockDaily, date: '2026-12-31' };
      const result = getDisplayWeather(
        notFoundDay,
        mockDaily,
        mockCurrent,
        mockHourly,
        mockLocation,
      );
      expect(result).toBeNull();
    });

    it('should return current weather for today (if it is today)', () => {
      const result = getDisplayWeather(mockDaily, mockDaily, mockCurrent, mockHourly, mockLocation);

      expect(result).not.toBeNull();
      if (result) {
        expect(result.temperature).toBe(8);
        expect(result.humidity).toBe(80);
        expect(result.weatherCode).toBe(2);
        expect(result.location).toEqual(mockLocation);
      }
    });

    it('should return forecast weather for a future day', () => {
      const futureDay: IWeatherDaily = { ...mockDaily, date: '2026-11-11', weatherCode: 3 };

      const extendedHourly = {
        ...mockHourly,
        time: [...mockHourly.time, '2026-11-11T12:00'],
        temperature: [...mockHourly.temperature, 15],
        humidity: [...mockHourly.humidity, 60],
        pressure: [...mockHourly.pressure, 1020],
        cloudCover: [...mockHourly.cloudCover, 20],
        uvIndex: [...mockHourly.uvIndex, 5],
      };

      const result = getDisplayWeather(
        futureDay,
        mockDaily,
        mockCurrent,
        extendedHourly,
        mockLocation,
      );

      expect(result).not.toBeNull();
      if (result) {
        expect(result.temperature).toBe(15);
        expect(result.humidity).toBe(60);
        expect(result.weatherCode).toBe(3);
      }
    });
  });
});
