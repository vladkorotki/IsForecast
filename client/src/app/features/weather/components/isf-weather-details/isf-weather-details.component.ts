import { ChangeDetectionStrategy, Component } from '@angular/core';

import { CommonModule } from '@angular/common';
import { computed, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { IsfPressurePipe } from '../../../../core/pipes/pressure/isf-pressure-pipe';
import { IWeatherDaily, IWeatherHourly } from '../../../../core/types/weather.types';
import { calculateDailyStats, filterHourlyForDay } from '../../../../core/utils/isf-weather.util';

@Component({
  imports: [CommonModule, MatCardModule, MatIconModule, IsfPressurePipe],
  selector: 'isf-weather-details',
  styleUrl: './isf-weather-details.component.scss',
  templateUrl: './isf-weather-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IsfWeatherDetailsComponent {
  readonly daily = input.required<IWeatherDaily>();
  readonly hourly = input.required<IWeatherHourly>();

  protected readonly hourlyForDay = computed(() => {
    return filterHourlyForDay(this.daily(), this.hourly());
  });

  protected readonly stats = computed(() => {
    return calculateDailyStats(this.hourlyForDay(), this.daily());
  });
}
