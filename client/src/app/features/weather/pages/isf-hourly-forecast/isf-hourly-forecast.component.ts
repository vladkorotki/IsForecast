import { CommonModule, Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { IsfChartService } from './../../../../core/services/isf-chart.service';

import { IsfWeatherStateService } from '../../../../core/services/isf-weather-state.service';
import { IsfHourlyChartComponent } from '../../components/isf-hourly-chart/isf-hourly-chart.component';

@Component({
  imports: [CommonModule, MatButtonModule, MatIconModule, IsfHourlyChartComponent],
  selector: 'isf-hourly-forecast',
  styleUrl: './isf-hourly-forecast.component.scss',
  templateUrl: './isf-hourly-forecast.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IsfHourlyForecastComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly location = inject(Location);
  private readonly weatherStateService = inject(IsfWeatherStateService);
  private readonly isfChartService = inject(IsfChartService);
  protected readonly data = this.weatherStateService.hourlyData;

  protected readonly labels = computed(() => {
    const state = this.data();
    return state ? this.isfChartService.getLabels(state) : [];
  });

  protected readonly chart1Config = computed(() => {
    const state = this.data();
    if (!state) return null;

    const datasets = this.isfChartService.getTemperatureDatasets(state);
    return this.isfChartService.createChartConfig(
      this.labels(),
      datasets,
      'Temperature & Precipitation',
    );
  });

  protected readonly chart2Config = computed(() => {
    const state = this.data();
    if (!state) return null;

    const datasets = this.isfChartService.getHumidityDatasets(state);
    return this.isfChartService.createChartConfig(
      this.labels(),
      datasets,
      'Humidity & Cloud Cover',
    );
  });

  protected readonly pageTitle = computed(() => {
    const state = this.data();
    if (!state) return '';
    return `${state.locationName} — ${new Date(state.daily.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}`;
  });

  ngOnInit(): void {
    if (!this.data()) {
      this.router.navigate(['/not-found']);
    }
  }

  protected goBack(): void {
    this.location.back();
  }
}
