import { Component } from '@angular/core';

import { CommonModule } from '@angular/common';
import { computed, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { IsfPressurePipe } from '../../../../core/pipes/pressure/isf-pressure-pipe';
import { IDailyStats, IFilteredHourlyData } from '../../../../core/types/weather-stats.types';
import { IWeatherDaily, IWeatherHourly } from '../../../../core/types/weather.types';

@Component({
  imports: [CommonModule, MatCardModule, MatIconModule, IsfPressurePipe],
  selector: 'isf-weather-details',
  styleUrl: './isf-weather-details.component.scss',
  templateUrl: './isf-weather-details.component.html',
})
export class IsfWeatherDetailsComponent {
  readonly daily = input.required<IWeatherDaily>();
  readonly hourly = input.required<IWeatherHourly>();

  protected readonly hourlyForDay = computed(() => {
    return this.filterHourlyForDay(this.daily(), this.hourly());
  });

  protected readonly stats = computed(() => {
    return this.calculateStats(this.hourlyForDay(), this.daily());
  });

  private filterHourlyForDay(daily: IWeatherDaily, hourly: IWeatherHourly): IFilteredHourlyData {
    const dayIndices: number[] = [];

    hourly.time.forEach((timeStr, index) => {
      if (timeStr.startsWith(daily.date)) {
        dayIndices.push(index);
      }
    });

    return {
      temperature: dayIndices.map((i) => hourly.temperature[i]),
      humidity: dayIndices.map((i) => hourly.humidity[i]),
      pressure: dayIndices.map((i) => hourly.pressure[i]),
      precipitation: dayIndices.map((i) => hourly.precipitation[i]),
      uvIndex: dayIndices.map((i) => hourly.uvIndex[i]),
      windSpeed: dayIndices.map((i) => hourly.windSpeed[i]),
    };
  }

  private calculateStats(data: IFilteredHourlyData, daily: IWeatherDaily): IDailyStats | null {
    if (data.temperature.length === 0) {
      return null;
    }

    const maxUv = Math.max(...data.uvIndex);
    const avgPressure = Math.round(data.pressure.reduce((a, b) => a + b, 0) / data.pressure.length);
    const rainHours = data.precipitation.filter((p) => p > 0).length;
    const maxWind = Math.max(...data.windSpeed);

    return {
      maxHumidity: Math.max(...data.humidity),
      avgPressure,
      maxUv: maxUv.toFixed(1),
      uvText: this.getUvDescription(maxUv),
      rainHours,
      maxWind: Math.round(maxWind),
      sunrise: daily.sunrise,
      sunset: daily.sunset,
    };
  }

  private getUvDescription(uv: number): string {
    if (uv < 3) return 'Low';
    if (uv < 6) return 'Moderate';
    if (uv < 8) return 'High';
    return 'Very High';
  }
}
