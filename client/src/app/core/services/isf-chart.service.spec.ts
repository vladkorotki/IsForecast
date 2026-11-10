import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { IHourlyData } from '../types/weather.types';
import { IsfChartService } from './isf-chart.service';

describe('IsfChartService', () => {
  let service: IsfChartService;

  const mockState: IHourlyData = {
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
      time: ['2026-11-09T23:00', '2026-11-10T00:00', '2026-11-10T01:00', '2026-11-11T00:00'],
      temperature: [0, 5, 6, 10],
      precipitation: [0, 0.5, 0, 0],
      humidity: [80, 85, 82, 70],
      pressure: [1010, 1012, 1011, 1008],
      cloudCover: [50, 60, 55, 20],
      uvIndex: [0, 0, 1, 3],
      weatherCode: [3, 3, 2, 1],
      snowfall: [0, 0, 0, 0],
      windSpeed: [5, 6, 7, 4],
    },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [IsfChartService],
    });
    service = TestBed.inject(IsfChartService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should filter indices for the specific day and return labels', () => {
    const labels = service.getLabels(mockState);

    expect(labels.length).toBe(2);

    expect(labels[0]).toMatch(/00:00|12:00\s?AM/);
    expect(labels[1]).toMatch(/01:00|1:00\s?AM/);
  });

  it('should return temperature and precipitation datasets', () => {
    const datasets = service.getTemperatureDatasets(mockState);

    expect(datasets.length).toBe(2);
    expect(datasets[0].label).toBe('Temperature (°C)');
    expect(datasets[0].data).toEqual([5, 6]);
    expect(datasets[1].label).toBe('Precipitation (mm)');
    expect(datasets[1].data).toEqual([0.5, 0]);
  });

  it('should return humidity and cloud cover datasets', () => {
    const datasets = service.getHumidityDatasets(mockState);

    expect(datasets.length).toBe(2);
    expect(datasets[0].label).toBe('Humidity (%)');
    expect(datasets[0].data).toEqual([85, 82]);
    expect(datasets[1].label).toBe('Cloud Cover (%)');
    expect(datasets[1].data).toEqual([60, 55]);
  });

  it('should create a valid chart configuration', () => {
    const labels = ['12:00', '13:00'];
    const datasets = service.getTemperatureDatasets(mockState);
    const title = 'Test Chart';

    const config = service.createChartConfig(labels, datasets, title);

    expect(config.type).toBe('line');
    expect(config.data.labels).toEqual(labels);
    expect(config.data.datasets.length).toBe(2);

    const tempDataset = config.data.datasets[0];
    expect(tempDataset.type).toBe('line');
    expect(tempDataset.backgroundColor).toBe('rgba(0, 123, 255, 0.1)');

    const precipDataset = config.data.datasets[1];
    expect(precipDataset.type).toBe('bar');
    expect(precipDataset.backgroundColor).toBe('rgba(23, 162, 184, 0.5)');

    if (typeof config.options?.plugins?.title === 'object') {
      expect(config.options.plugins.title.text).toBe(title);
    }
  });
});
