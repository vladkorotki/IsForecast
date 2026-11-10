import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/weather/pages/isf-weather-dashboard/isf-weather-dashboard.component').then(
        (m) => m.IsfWeatherDashboardComponent,
      ),
  },
  {
    path: 'hourly',
    loadComponent: () =>
      import('./features/weather/pages/isf-hourly-forecast/isf-hourly-forecast.component').then(
        (m) => m.IsfHourlyForecastComponent,
      ),
  },
  {
    path: 'not-found',
    loadComponent: () =>
      import('./features/weather/pages/isf-not-found/isf-not-found.component').then(
        (m) => m.IsfNotFoundComponent,
      ),
  },
  {
    path: '**',
    redirectTo: 'not-found',
  },
];
