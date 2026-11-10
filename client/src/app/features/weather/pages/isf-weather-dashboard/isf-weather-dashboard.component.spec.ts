import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { IsfWeatherApiService } from '../../../../core/services/isf-weather-api.service';
import { IsfWeatherStateService } from '../../../../core/services/isf-weather-state.service';
import {
  IWeatherDaily,
  IWeatherResponse,
  WeatherRequestParams,
} from '../../../../core/types/weather.types';
import { IsfWeatherDashboardComponent } from './isf-weather-dashboard.component';

describe('IsfWeatherDashboardComponent', () => {
  let component: IsfWeatherDashboardComponent;
  let fixture: ComponentFixture<IsfWeatherDashboardComponent>;

  let mockRouter: { navigate: ReturnType<typeof vi.fn> };
  let mockApiService: { getWeather: ReturnType<typeof vi.fn> };
  let mockStateService: {
    location: ReturnType<typeof signal<string | null>>;
    coords: ReturnType<typeof signal<{ lat: number; lon: number } | null>>;
    setLocation: ReturnType<typeof vi.fn>;
    setCoords: ReturnType<typeof vi.fn>;
    resetCoords: ReturnType<typeof vi.fn>;
    setHourlyData: ReturnType<typeof vi.fn>;
  };

  const mockWeatherResponse: IWeatherResponse = {
    location: { name: 'Minsk', country: 'BY', latitude: 53.9, longitude: 27.5 },
    payload: {
      current: {
        temperature: 10,
        humidity: 50,
        pressure: 1000,
        cloudCover: 0,
        uvIndex: 0,
        weatherCode: 0,
        location: { name: 'Minsk', country: 'BY', latitude: 53.9, longitude: 27.5 },
      },
      hourly: {
        // Добавляем один час для сегодняшнего дня (2026-11-10)
        time: ['2026-11-10T12:00'],
        temperature: [15],
        precipitation: [0],
        humidity: [60],
        pressure: [1010],
        cloudCover: [20],
        uvIndex: [1],
        weatherCode: [3],
        snowfall: [0],
        windSpeed: [5],
      },
      daily: [
        {
          date: '2026-11-10',
          tempMax: 10,
          tempMin: 5,
          weatherCode: 3,
          precipitationSum: 0,
          uvIndexMax: 2,
          sunrise: '',
          sunset: '',
        },
        {
          date: '2026-11-11',
          tempMax: 12,
          tempMin: 7,
          weatherCode: 1,
          precipitationSum: 0,
          uvIndexMax: 3,
          sunrise: '',
          sunset: '',
        },
      ],
    },
    stale: false,
    fetchedAt: '2026-11-10T10:00:00Z',
  };

  beforeEach(async () => {
    mockRouter = { navigate: vi.fn() };
    mockApiService = { getWeather: vi.fn().mockReturnValue(of(mockWeatherResponse)) };

    mockStateService = {
      location: signal<string | null>(null),
      coords: signal<{ lat: number; lon: number } | null>(null),
      setLocation: vi.fn(),
      setCoords: vi.fn(),
      resetCoords: vi.fn(),
      setHourlyData: vi.fn(),
    };

    Object.defineProperty(navigator, 'geolocation', {
      value: {
        getCurrentPosition: vi.fn(),
      },
      configurable: true,
    });

    await TestBed.configureTestingModule({
      imports: [IsfWeatherDashboardComponent],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: IsfWeatherApiService, useValue: mockApiService },
        { provide: IsfWeatherStateService, useValue: mockStateService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(IsfWeatherDashboardComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call geolocation if no location or coords set', () => {
    expect(navigator.geolocation.getCurrentPosition).toHaveBeenCalled();
  });

  it('should set Minsk if geolocation fails or not supported', () => {
    const mockGeolocation = navigator.geolocation.getCurrentPosition as ReturnType<typeof vi.fn>;
    const errorCallback = mockGeolocation.mock.calls[0][1];

    errorCallback(new Error('User denied'));

    expect(mockStateService.setLocation).toHaveBeenCalledWith('Minsk');
  });

  it('should set coords if geolocation succeeds', () => {
    const mockGeolocation = navigator.geolocation.getCurrentPosition as ReturnType<typeof vi.fn>;
    const successCallback = mockGeolocation.mock.calls[0][0];

    successCallback({ coords: { latitude: 53.9, longitude: 27.5 } } as GeolocationPosition);

    expect(mockStateService.setCoords).toHaveBeenCalledWith(53.9, 27.5);
  });

  it('should load weather on location change via effect', () => {
    mockStateService.location.set('London');
    fixture.detectChanges();

    expect(mockApiService.getWeather).toHaveBeenCalledWith({ location: 'London' });
  });

  it('should load weather on coords change via effect if no data', () => {
    mockStateService.coords.set({ lat: 10, lon: 20 });
    fixture.detectChanges();

    expect(mockApiService.getWeather).toHaveBeenCalledWith({ lat: 10, lon: 20 });
  });

  it('should handle successful data load and clear selectedDay', () => {
    const loadWeather = (
      component as unknown as { loadWeather: (p: WeatherRequestParams) => void }
    ).loadWeather.bind(component);
    const signals = component as unknown as {
      weatherData: () => IWeatherResponse | null;
      selectedDay: () => IWeatherDaily | null;
      isLoading: () => boolean;
      error: () => string | null;
    };

    loadWeather({ location: 'Minsk' });

    expect(signals.weatherData()).toEqual(mockWeatherResponse);
    expect(signals.selectedDay()).toBeNull();
    expect(signals.isLoading()).toBe(false);
    expect(signals.error()).toBeNull();
  });

  it('should set location if loaded by coords', () => {
    const loadWeather = (
      component as unknown as { loadWeather: (p: WeatherRequestParams) => void }
    ).loadWeather.bind(component);

    loadWeather({ lat: 10, lon: 20 });

    expect(mockStateService.setLocation).toHaveBeenCalledWith('Minsk');
  });

  it('should handle error and navigate to not-found', () => {
    mockApiService.getWeather.mockReturnValue(
      throwError(() => ({ error: { error: 'API Error' } })),
    );
    const loadWeather = (
      component as unknown as { loadWeather: (p: WeatherRequestParams) => void }
    ).loadWeather.bind(component);
    const signals = component as unknown as {
      weatherData: () => IWeatherResponse | null;
      error: () => string | null;
      isLoading: () => boolean;
    };

    loadWeather({ location: 'Minsk' });

    expect(signals.weatherData()).toBeNull();
    expect(signals.error()).toBe('API Error');
    expect(signals.isLoading()).toBe(false);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/not-found']);
  });

  it('should use fallback error message if error structure is unknown', () => {
    mockApiService.getWeather.mockReturnValue(throwError(() => ({})));
    const loadWeather = (
      component as unknown as { loadWeather: (p: WeatherRequestParams) => void }
    ).loadWeather.bind(component);
    const signals = component as unknown as { error: () => string | null };

    loadWeather({ location: 'Minsk' });

    expect(signals.error()).toBe('Load data error');
  });

  it('should compute activeDay from selectedDay or default to first day', () => {
    const signals = component as unknown as {
      weatherData: { set: (val: IWeatherResponse | null) => void };
      selectedDay: { set: (val: IWeatherDaily | null) => void };
      activeDay: () => IWeatherDaily | null;
    };

    expect(signals.activeDay()).toBeNull();

    signals.weatherData.set(mockWeatherResponse);
    expect(signals.activeDay()?.date).toBe('2026-11-10');

    const secondDay = mockWeatherResponse.payload.daily[1];
    signals.selectedDay.set(secondDay);
    expect(signals.activeDay()?.date).toBe('2026-11-11');
  });

  it('should compute displayCurrentWeather correctly', () => {
    const signals = component as unknown as {
      weatherData: { set: (val: IWeatherResponse | null) => void };
      displayCurrentWeather: () => unknown;
    };

    expect(signals.displayCurrentWeather()).toBeNull();

    signals.weatherData.set(mockWeatherResponse);
    expect(signals.displayCurrentWeather()).not.toBeNull();
  });

  it('should call onSearch and reset state', () => {
    const onSearch = (component as unknown as { onSearch: (city: string) => void }).onSearch.bind(
      component,
    );
    onSearch('Paris');

    expect(mockStateService.resetCoords).toHaveBeenCalled();
    expect(mockStateService.setLocation).toHaveBeenCalledWith('Paris');
  });

  it('should navigate to hourly chart if data and activeDay exist', () => {
    const signals = component as unknown as {
      weatherData: { set: (val: IWeatherResponse | null) => void };
    };
    const goToHourlyChart = (
      component as unknown as { goToHourlyChart: () => void }
    ).goToHourlyChart.bind(component);

    signals.weatherData.set(mockWeatherResponse);
    goToHourlyChart();

    expect(mockStateService.setHourlyData).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/hourly']);
  });

  it('should not navigate to hourly chart if no data', () => {
    const goToHourlyChart = (
      component as unknown as { goToHourlyChart: () => void }
    ).goToHourlyChart.bind(component);
    goToHourlyChart();
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });
});
