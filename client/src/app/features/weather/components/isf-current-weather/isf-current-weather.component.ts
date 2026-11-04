import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { IsfPressurePipe } from '../../../../core/pipes/pressure/isf-pressure-pipe';
import { IsfWeatherInfoPipe } from '../../../../core/pipes/weather-info/isf-weather-info-pipe';
import { IWeatherCurrent } from '../../../../core/types/weather.types';

@Component({
  imports: [CommonModule, MatCardModule, IsfPressurePipe, MatIconModule, IsfWeatherInfoPipe],
  selector: 'isf-current-weather',
  styleUrl: './isf-current-weather.component.scss',
  templateUrl: './isf-current-weather.component.html',
})
export class IsfCurrentWeatherComponent {
  readonly current = input.required<IWeatherCurrent>();
}
