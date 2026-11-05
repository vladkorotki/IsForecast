import { Component, computed, DestroyRef, effect, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButton } from '@angular/material/button';
import { Router } from '@angular/router';
import { catchError, of, tap } from 'rxjs';
import { IsfWeatherApiService } from '../../../../core/services/isf-weather-api.service';
import { IsfWeatherStateService } from '../../../../core/services/isf-weather-state.service';
import {
  IWeatherCurrent,
  IWeatherDaily,
  IWeatherResponse,
} from '../../../../core/types/weather.types';
import { getDisplayWeather } from '../../../../core/utils/isf-weather.util';
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
    MatButton,
  ],
  selector: 'isf-weather-dashboard',
  styleUrl: './isf-weather-dashboard.component.scss',
  templateUrl: './isf-weather-dashboard.component.html',
})
export class IsfWeatherDashboardComponent {
  private readonly weatherApi = inject(IsfWeatherApiService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly weatherStateService = inject(IsfWeatherStateService);
  private readonly router = inject(Router);

  protected readonly weatherData = signal<IWeatherResponse | null>(null);
  protected readonly error = signal<string | null>(null);
  protected readonly selectedDay = signal<IWeatherDaily | null>(null);

  protected readonly activeDay = computed(() => {
    const data = this.weatherData();
    if (!data) return null;
    return this.selectedDay() || data.payload.daily[0];
  });

  protected readonly displayCurrentWeather = computed<IWeatherCurrent | null>(() => {
    const data = this.weatherData();
    if (!data) return null;

    return getDisplayWeather(
      this.activeDay(),
      data.payload.daily[0],
      data.payload.current,
      data.payload.hourly,
    );
  });

  constructor() {
    effect(() => {
      const location = this.weatherStateService.location();
      this.loadWeather(location ?? 'Minsk');
    });
  }

  protected goToHourlyChart(): void {
    const data = this.weatherData();
    const day = this.activeDay();

    if (data && day) {
      this.weatherStateService.setHourlyData({
        daily: day,
        hourly: data.payload.hourly,
        locationName: data.location.name,
      });
      this.router.navigate(['/hourly']);
    }
  }

  protected onSearch(city: string): void {
    this.loadWeather(city);
  }

  protected onDaySelected(day: IWeatherDaily): void {
    this.selectedDay.set(day);
  }

  private loadWeather(city: string): void {
    this.error.set(null);

    this.weatherApi
      .getWeather(city)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap((data) => {
          this.weatherData.set(data);
          this.selectedDay.set(null);
        }),
        catchError((err) => {
          this.weatherData.set(null);
          this.error.set(err.error?.error || 'Load data error');
          this.router.navigate(['/not-found']);
          return of(null);
        }),
      )
      .subscribe();
  }
}
