import { Service } from '@angular/core';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { IChartDatasetConfig } from '../types/chart.types';
import { IHourlyData } from '../types/weather.types';
Chart.register(...registerables);

@Service()
export class IsfChartService {
  public getLabels(state: IHourlyData): string[] {
    const indices = this.getDayIndices(state);
    return indices.map((i) =>
      new Date(state.hourly.time[i]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    );
  }

  public getTemperatureDatasets(state: IHourlyData): IChartDatasetConfig[] {
    const indices = this.getDayIndices(state);
    return [
      {
        label: 'Temperature (°C)',
        data: indices.map((i) => state.hourly.temperature[i]),
        type: 'line',
        color: 'rgba(0, 123, 255, 1)',
        yAxisID: 'y',
        fill: true,
      },
      {
        label: 'Precipitation (mm)',
        data: indices.map((i) => state.hourly.precipitation[i]),
        type: 'bar',
        color: 'rgba(23, 162, 184, 1)',
        yAxisID: 'y1',
      },
    ];
  }

  public getHumidityDatasets(state: IHourlyData): IChartDatasetConfig[] {
    const indices = this.getDayIndices(state);
    return [
      {
        label: 'Humidity (%)',
        data: indices.map((i) => state.hourly.humidity[i]),
        type: 'line',
        color: 'rgba(40, 167, 69, 1)',
        yAxisID: 'y',
        fill: true,
      },
      {
        label: 'Cloud Cover (%)',
        data: indices.map((i) => state.hourly.cloudCover[i]),
        type: 'line',
        color: 'rgba(108, 117, 125, 1)',
        yAxisID: 'y',
        fill: false,
      },
    ];
  }

  public createChartConfig(
    labels: string[],
    datasets: IChartDatasetConfig[],
    title: string,
  ): ChartConfiguration {
    const chartJsDatasets = datasets.map((ds) => ({
      label: ds.label,
      data: ds.data,
      type: ds.type,
      borderColor: ds.color,
      backgroundColor:
        ds.type === 'bar' ? ds.color.replace('1)', '0.5)') : ds.color.replace('1)', '0.1)'),
      fill: ds.fill ?? false,
      tension: 0.4,
      yAxisID: ds.yAxisID,
    }));

    return {
      type: 'line',
      data: {
        labels,
        datasets: chartJsDatasets,
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          title: { display: true, text: title, font: { size: 16 } },
        },
        scales: {
          y: {
            type: 'linear',
            display: true,
            position: 'left',
          },
          y1: {
            type: 'linear',
            display: true,
            position: 'right',
            grid: { drawOnChartArea: false },
          },
        },
      },
    };
  }

  private getDayIndices(state: IHourlyData): number[] {
    return state.hourly.time
      .map((time, i) => (time.startsWith(state.daily.date) ? i : -1))
      .filter((i) => i !== -1);
  }
}
