import { Location } from '@angular/common';
import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { IsfChartService } from '../../../../core/services/isf-chart.service';
import { IsfWeatherStateService } from '../../../../core/services/isf-weather-state.service';
import { IHourlyData } from '../../../../core/types/weather.types';
import { IsfHourlyForecastComponent } from './isf-hourly-forecast.component';
import { ChartConfiguration } from 'chart.js';

describe('IsfHourlyForecastComponent', () => {
  let component: IsfHourlyForecastComponent;
  let fixture: ComponentFixture<IsfHourlyForecastComponent>;

  let mockRouter: { navigate: ReturnType<typeof vi.fn> };
  let mockLocation: { back: ReturnType<typeof vi.fn> };
  let mockStateService: { hourlyData: ReturnType<typeof signal<IHourlyData | null>> };
  let mockChartService: {
    getLabels: ReturnType<typeof vi.fn>;
    getTemperatureDatasets: ReturnType<typeof vi.fn>;
    getHumidityDatasets: ReturnType<typeof vi.fn>;
    createChartConfig: ReturnType<typeof vi.fn>;
  };

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
      time: ['2026-11-10T10:00'],
      temperature: [6],
      precipitation: [0],
      humidity: [85],
      pressure: [1010],
      cloudCover: [60],
      uvIndex: [1],
      weatherCode: [3],
      snowfall: [0],
      windSpeed: [5],
    },
  };

  beforeEach(async () => {
    mockRouter = { navigate: vi.fn() };
    mockLocation = { back: vi.fn() };
    mockStateService = { hourlyData: signal<IHourlyData | null>(null) };
    mockChartService = {
      getLabels: vi.fn().mockReturnValue(['10:00']),
      getTemperatureDatasets: vi.fn().mockReturnValue([]),
      getHumidityDatasets: vi.fn().mockReturnValue([]),
      createChartConfig: vi.fn().mockReturnValue({ type: 'line', data: {}, options: {} }),
    };

    await TestBed.configureTestingModule({
      imports: [IsfHourlyForecastComponent],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: Location, useValue: mockLocation },
        { provide: IsfWeatherStateService, useValue: mockStateService },
        { provide: IsfChartService, useValue: mockChartService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(IsfHourlyForecastComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to /not-found if no data is present on init', () => {
    fixture.detectChanges();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/not-found']);
  });

  it('should compute data when hourlyData is present', () => {
    mockStateService.hourlyData.set(mockData);
    fixture.detectChanges();

    const testableComponent = component as unknown as {
      labels: () => string[];
      chart1Config: () => ChartConfiguration | null;
      chart2Config: () => ChartConfiguration | null;
      pageTitle: () => string;
    };

    expect(mockRouter.navigate).not.toHaveBeenCalled();
    expect(testableComponent.labels()).toEqual(['10:00']);
    expect(mockChartService.getTemperatureDatasets).toHaveBeenCalledWith(mockData);
    expect(mockChartService.getHumidityDatasets).toHaveBeenCalledWith(mockData);
    expect(testableComponent.chart1Config()).not.toBeNull();
    expect(testableComponent.chart2Config()).not.toBeNull();
    expect(testableComponent.pageTitle()).toContain('Minsk');
  });

  it('should call location.back() when goBack is triggered', () => {
    const testableComponent = component as unknown as { goBack: () => void };
    testableComponent.goBack();
    expect(mockLocation.back).toHaveBeenCalled();
  });
});
