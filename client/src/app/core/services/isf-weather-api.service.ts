import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { IWeatherResponse } from '../types/weather.types';

@Service()
export class IsfWeatherApiService {
  private readonly baseUrl = '/api/weather';

  private readonly http = inject(HttpClient);
  public getWeather(location: string): Observable<IWeatherResponse> {
    const encodedLocation = encodeURIComponent(location);
    return this.http.get<IWeatherResponse>(`${this.baseUrl}?location=${encodedLocation}`);
  }
}
