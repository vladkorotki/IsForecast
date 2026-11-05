import { Injectable, signal } from '@angular/core';
import { IHourlyData } from '../types/weather.types';

@Injectable({
  providedIn: 'root',
})
export class IsfWeatherStateService {
  private readonly _location = signal<string | null>(null);
  readonly location = this._location.asReadonly();

  private readonly _hourlyData = signal<IHourlyData | null>(null);
  readonly hourlyData = this._hourlyData.asReadonly();

  public setHourlyData(data: IHourlyData): void {
    this._hourlyData.set(data);
  }
  public setLocation(location: string) {
    this._location.set(location);
  }
}
