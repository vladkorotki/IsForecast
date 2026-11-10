import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { IsfWeatherStateService } from '../../../../core/services/isf-weather-state.service';
import { IsfSearchBarComponent } from '../../components/isf-search-bar/isf-search-bar.component';

@Component({
  imports: [MatButtonModule, MatIconModule, IsfSearchBarComponent],
  selector: 'isf-not-found',
  styleUrl: './isf-not-found.component.scss',
  templateUrl: './isf-not-found.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IsfNotFoundComponent {
  private readonly router = inject(Router);
  private readonly weatherStateService = inject(IsfWeatherStateService);

  protected onSearch(city: string): void {
    this.weatherStateService.resetCoords();
    this.weatherStateService.setLocation(city);
    this.router.navigate(['/']);
  }

  protected goHome(): void {
    this.weatherStateService.setLocation(null);
    this.router.navigate(['/']);
  }
}
