import { CommonModule } from '@angular/common';
import { Component, computed, input, output, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { IWeatherDaily } from '../../../../core/types/weather.types';
import { IsfDayCardComponent } from '../isf-day-card/isf-day-card.component';

@Component({
  imports: [CommonModule, MatCardModule, IsfDayCardComponent],
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
