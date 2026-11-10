import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { IHourlyData } from '../types/weather.types';
import { IsfWeatherStateService } from './isf-weather-state.service';

describe('IsfWeatherStateService', () => {
  let service: IsfWeatherStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IsfWeatherStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have initial null values', () => {
    expect(service.location()).toBeNull();
    expect(service.coords()).toBeNull();
    expect(service.hourlyData()).toBeNull();
  });

  describe('Location state', () => {
    it('should set location correctly', () => {
      service.setLocation('Minsk');
      expect(service.location()).toBe('Minsk');
    });

    it('should reset location to null', () => {
      service.setLocation('Minsk');
      service.setLocation(null);
      expect(service.location()).toBeNull();
    });
  });

  describe('Coords state', () => {
    it('should set coords correctly', () => {
      service.setCoords(53.9, 27.5);
      expect(service.coords()).toEqual({ lat: 53.9, lon: 27.5 });
    });

    it('should reset coords to null', () => {
      service.setCoords(53.9, 27.5);
      service.resetCoords();
      expect(service.coords()).toBeNull();
    });
  });

  describe('HourlyData state', () => {
    it('should set hourly data correctly', () => {
      const mockData: IHourlyData = {
        locationName: 'Minsk',
        daily: {
          date: '2026-11-10',
          tempMax: 10,
          tempMin: 5,
          weatherCode: 3,
          precipitationSum: 0,
          uvIndexMax: 2,
          sunrise: '2026-11-10T07:00:00',
          sunset: '2026-11-10T17:00:00',
        },
        hourly: {
          time: ['2026-11-10T00:00'],
          temperature: [5],
          precipitation: [0],
          humidity: [80],
          pressure: [1010],
          cloudCover: [50],
          uvIndex: [0],
          weatherCode: [3],
          snowfall: [0],
          windSpeed: [5],
        },
      };

      service.setHourlyData(mockData);
      expect(service.hourlyData()).toEqual(mockData);
    });
  });
});
