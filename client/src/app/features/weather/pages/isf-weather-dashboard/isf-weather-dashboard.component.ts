import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, of, tap } from 'rxjs';
import { WeatherApiService } from '../../../../core/services/weather-api.service';
import { IWeatherDaily, IWeatherResponse } from '../../../../core/types/weather.types';
import { IsfCurrentWeatherComponent } from '../../components/isf-current-weather/isf-current-weather.component';
import { IsfDailyForecastComponent } from '../../components/isf-daily-forecast/isf-daily-forecast.component';
import { IsfSearchBarComponent } from '../../components/isf-search-bar/isf-search-bar.component';
import { IsfWeatherDetailsComponent } from '../../components/isf-weather-details/isf-weather-details.component';

@Component({
  imports: [
    IsfSearchBarComponent,
    IsfCurrentWeatherComponent,
    IsfDailyForecastComponent,
    IsfWeatherDetailsComponent,
  ],
  selector: 'isf-weather-dashboard',
  styleUrl: './isf-weather-dashboard.component.scss',
  templateUrl: './isf-weather-dashboard.component.html',
})
export class IsfWeatherDashboardComponent {
  private readonly weatherApi = inject(WeatherApiService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly weatherData = signal<IWeatherResponse | null>(null);
  protected readonly error = signal<string | null>(null);
  protected readonly selectedDay = signal<IWeatherDaily | null>(null);
  protected readonly activeDay = computed(() => {
    const data = this.weatherData();
    if (!data) return null;
    return this.selectedDay() || data.payload.daily[0];
  });

  ngOnInit(): void {
    this.loadWeather('Minsk');
  }

  protected onSearch(city: string): void {
    this.loadWeather(city);
  }

  protected onDaySelected(day: IWeatherDaily): void {
    this.selectedDay.set(day);
    console.log('Выбран день:', day.date);
  }

  private loadWeather(city: string): void {
    this.error.set(null);

    this.weatherApi
      .getWeather(city)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap((data) => {
          this.weatherData.set(data);
        }),
        catchError((err) => {
          this.weatherData.set(null);
          this.error.set(err.error?.error || 'Ошибка загрузки данных');
          return of(null);
        }),
      )
      .subscribe();
  }
}
