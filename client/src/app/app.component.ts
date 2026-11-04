import { Component } from '@angular/core';
import { IsfWeatherDashboardComponent } from './features/weather/pages/isf-weather-dashboard/isf-weather-dashboard.component';

@Component({
  imports: [IsfWeatherDashboardComponent],
  selector: 'app-root',
  styleUrl: './app.component.scss',
  templateUrl: './app.component.html',
})
export class AppComponent {}
