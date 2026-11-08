import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { IWeatherResponse, WeatherRequestParams } from '../types/weather.types';

@Service()
export class IsfWeatherApiService {
  private readonly baseUrl = '/api/weather';

  private readonly http = inject(HttpClient);

  public getWeather(params: WeatherRequestParams): Observable<IWeatherResponse> {
    let query: string;

    if ('location' in params) {
      query = `location=${encodeURIComponent(params.location)}`;
    } else {
      query = `lat=${params.lat}&lon=${params.lon}`;
    }

    return this.http.get<IWeatherResponse>(`${this.baseUrl}?${query}`);
  }
}
