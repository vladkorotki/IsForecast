import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { catchError, EMPTY, tap } from 'rxjs';
import { IsfWeatherApiService } from '../../../../core/services/isf-weather-api.service';
import { IsfWeatherStateService } from '../../../../core/services/isf-weather-state.service';
import { IsfSearchBarComponent } from '../../../weather/components/isf-search-bar/isf-search-bar.component';

@Component({
  imports: [MatButtonModule, MatIconModule, IsfSearchBarComponent],
  selector: 'isf-not-found',
  styleUrl: './isf-not-found.component.scss',
  templateUrl: './isf-not-found.component.html',
})
export class IsfNotFoundComponent {
  private readonly router = inject(Router);
  private readonly weatherApi = inject(IsfWeatherApiService);
  private readonly weatherStateService = inject(IsfWeatherStateService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly isLoading = signal(false);

  protected onSearch(city: string): void {
    this.isLoading.set(true);

    this.weatherApi
      .getWeather(city)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .pipe(
        tap(() => {
          this.isLoading.set(false);
          this.weatherStateService.setLocation(city);
          this.router.navigate(['/']);
        }),
        catchError(() => {
          this.isLoading.set(false);
          console.error('City not found. Please try again.');
          return EMPTY;
        }),
      )
      .subscribe();
  }

  protected goHome(): void {
    this.router.navigate(['/']);
  }
}
