import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { IWeatherDaily, IWeatherHourly } from '../../../../core/types/weather.types';
import { IsfWeatherDetailsComponent } from './isf-weather-details.component';

describe('IsfWeatherDetailsComponent', () => {
  let component: IsfWeatherDetailsComponent;
  let fixture: ComponentFixture<IsfWeatherDetailsComponent>;

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

  const mockHourly: IWeatherHourly = {
    time: ['2026-11-10T10:00', '2026-11-10T12:00', '2026-11-10T14:00'],
    temperature: [6, 8, 9],
    precipitation: [0, 0.5, 0],
    humidity: [85, 80, 75],
    pressure: [1010, 1012, 1011],
    cloudCover: [60, 50, 40],
    uvIndex: [1, 2, 4],
    weatherCode: [3, 3, 2],
    snowfall: [0, 0, 0],
    windSpeed: [5, 8, 10],
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IsfWeatherDetailsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(IsfWeatherDetailsComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('daily', mockDaily);
    fixture.componentRef.setInput('hourly', mockHourly);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should compute stats from daily and hourly inputs', () => {
    const testableComponent = component as unknown as {
      stats: () => {
        maxHumidity: number;
        avgPressure: number;
        maxUv: string;
        maxWind: number;
      } | null;
    };

    const stats = testableComponent.stats();

    expect(stats).not.toBeNull();
    if (stats) {
      expect(stats.maxHumidity).toBe(85);
      expect(stats.avgPressure).toBe(1011);
      expect(stats.maxUv).toBe('4.0');
      expect(stats.maxWind).toBe(10);
    }
  });
});
