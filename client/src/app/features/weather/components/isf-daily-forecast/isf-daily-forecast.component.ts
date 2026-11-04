import { CommonModule } from '@angular/common';
import { Component, computed, input, output, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { IsfWeatherInfoPipe } from '../../../../core/pipes/weather-info/isf-weather-info-pipe';
import { IWeatherDaily } from '../../../../core/types/weather.types';

@Component({
  imports: [CommonModule, MatCardModule, IsfWeatherInfoPipe],
  selector: 'isf-daily-forecast',
  styleUrl: './isf-daily-forecast.component.scss',
  templateUrl: './isf-daily-forecast.component.html',
})
export class IsfDailyForecastComponent {
  public readonly daily = input.required<IWeatherDaily[]>();
  public readonly selectedDayChange = output<IWeatherDaily>();
  protected readonly selectedIndex = signal(0);
  protected readonly selectedDay = computed(() => this.daily()[this.selectedIndex()]);

  protected selectDay(index: number): void {
    this.selectedIndex.set(index);
    this.selectedDayChange.emit(this.daily()[index]);
  }
}
