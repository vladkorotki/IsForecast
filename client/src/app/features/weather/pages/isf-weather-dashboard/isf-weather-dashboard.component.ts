import {
  ChangeDetectorRef,
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  signal,
  untracked,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButton } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { catchError, finalize, of, tap } from 'rxjs';
import { IsfWeatherApiService } from '../../../../core/services/isf-weather-api.service';
import { IsfWeatherStateService } from '../../../../core/services/isf-weather-state.service';
import {
  IWeatherCurrent,
  IWeatherDaily,
  IWeatherResponse,
  WeatherRequestParams,
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
    MatProgressSpinnerModule,
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
  protected readonly isLoading = signal<boolean>(false);
  private readonly cdr = inject(ChangeDetectorRef);
  protected readonly activeDay = computed(() => {
    const data = this.weatherData();
    if (!data) return null;
    return this.selectedDay() || data.payload.daily[0];
  });

  protected readonly displayCurrentWeather = computed<IWeatherCurrent | null>(() => {
    const data = this.weatherData();
    if (!data) {
      return null;
    }

    return getDisplayWeather(
      this.activeDay(),
      data.payload.daily[0],
      data.payload.current,
      data.payload.hourly,
    );
  });

  constructor() {
    this.initLocation();
    effect(() => {
      const location = this.weatherStateService.location();
      const coords = this.weatherStateService.coords();
      const data = untracked(() => this.weatherData());

      if (location && !coords) {
        this.loadWeather({ location });
      } else if (coords && !data) {
        this.loadWeather({ lat: coords.lat, lon: coords.lon });
      }
    });
  }

  private initLocation(): void {
    if (this.weatherStateService.location() || this.weatherStateService.coords()) {
      return;
    }

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.weatherStateService.setCoords(position.coords.latitude, position.coords.longitude);
        },
        () => {
          this.weatherStateService.setLocation('Minsk');
        },
      );
    } else {
      this.weatherStateService.setLocation('Minsk');
    }
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
    this.weatherStateService.resetCoords();
    this.weatherStateService.setLocation(city);
  }

  protected onDaySelected(day: IWeatherDaily): void {
    this.selectedDay.set(day);
  }

  private loadWeather(params: WeatherRequestParams): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.weatherApi
      .getWeather(params)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap((data) => {
          this.weatherData.set(data);
          this.selectedDay.set(null);
          if ('lat' in params) {
            this.weatherStateService.setLocation(data.location.name);
          }
        }),
        catchError((err) => {
          this.weatherData.set(null);
          this.error.set(err.error?.error || 'Load data error');
          this.router.navigate(['/not-found']);
          return of(null);
        }),
        finalize(() => this.isLoading.set(false)),
      )
      .subscribe();
  }
}
