import { IsfWeatherInfoPipe } from './../../../../core/pipes/weather-info/isf-weather-info-pipe';
import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { IWeatherDaily } from '../../../../core/types/weather.types';

@Component({
  imports: [CommonModule, MatCardModule, IsfWeatherInfoPipe],
  selector: 'isf-day-card',
  styleUrl: './isf-day-card.component.scss',
  templateUrl: './isf-day-card.component.html',
})
export class IsfDayCardComponent {
  readonly day = input.required<IWeatherDaily>();
  readonly isSelected = input.required<boolean>();
  readonly select = output<IWeatherDaily>();
}
