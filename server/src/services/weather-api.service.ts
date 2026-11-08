import { map, Observable } from 'rxjs';
import { WEATHER_CONFIG } from '../config/weather.config.js';
import {
  IGeoLocation,
  IOpenMeteoForecastResponse,
  IOpenMeteoGeocodingResponse,
  IWeatherPayload,
} from '../types/weather-api.types.js';
import { HttpClientService } from './http-client.service.js';

export class WeatherApiService {
  constructor(private readonly httpClientService: HttpClientService) {}

  public geocode(position: string): Observable<IGeoLocation | null> {
    const params = new URLSearchParams({
      name: position,
      count: '1',
      language: 'en',
      format: 'json',
    });

    const url = `${WEATHER_CONFIG.GEOCODING_URL}?${params.toString()}`;

    return this.httpClientService.get<IOpenMeteoGeocodingResponse>(url).pipe(
      map((data: IOpenMeteoGeocodingResponse): IGeoLocation | null => {
        const first = data.results?.[0];
        if (!first) {
          return null;
        }

        return {
          name: first.name,
          country: first.country ?? null,
          latitude: first.latitude,
          longitude: first.longitude,
        };
      }),
    );
  }

  public reverseGeocode(lat: number, lon: number): Observable<IGeoLocation | null> {
    const params = new URLSearchParams({
      latitude: String(lat),
      longitude: String(lon),
      count: '1',
      language: 'en',
      format: 'json',
    });

    const url = `${WEATHER_CONFIG.REVERSE_GEOCODING_URL}?${params.toString()}`;

    return this.httpClientService.get<any>(url).pipe(
      map((data): IGeoLocation | null => {
        const name = data.city || data.locality || data.principalSubdivision;

        if (!name) {
          return null;
        }

        return {
          name: name,
          country: data.countryName ?? null,
          latitude: lat,
          longitude: lon,
        };
      }),
    );
  }

  public fetchWeather(lat: number, lon: number): Observable<IWeatherPayload> {
    const params = this.buildWeatherParams(lat, lon);
    const url = `${WEATHER_CONFIG.FORECAST_URL}?${params.toString()}`;

    return this.httpClientService.get<IOpenMeteoForecastResponse>(url).pipe(
      map((raw): IWeatherPayload => {
        return {
          current: {
            temperature: raw.current.temperature_2m,
            humidity: raw.current.relative_humidity_2m,
            pressure: raw.current.pressure_msl,
            cloudCover: raw.current.cloud_cover,
            uvIndex: raw.current.uv_index,
            weatherCode: raw.current.weather_code,
          },
          hourly: {
            time: raw.hourly.time,
            temperature: raw.hourly.temperature_2m,
            precipitation: raw.hourly.precipitation,
            humidity: raw.hourly.relative_humidity_2m,
            pressure: raw.hourly.pressure_msl,
            cloudCover: raw.hourly.cloud_cover,
            uvIndex: raw.hourly.uv_index,
            weatherCode: raw.hourly.weather_code,
            snowfall: raw.hourly.snowfall,
            windSpeed: raw.hourly.wind_speed_10m,
          },
          daily: raw.daily.time.map((date, i) => ({
            date,
            tempMax: raw.daily.temperature_2m_max[i],
            tempMin: raw.daily.temperature_2m_min[i],
            weatherCode: raw.daily.weather_code[i],
            precipitationSum: raw.daily.precipitation_sum[i],
            uvIndexMax: raw.daily.uv_index_max[i],
            sunrise: raw.daily.sunrise[i],
            sunset: raw.daily.sunset[i],
          })),
        };
      }),
    );
  }

  private buildWeatherParams(lat: number, lon: number): URLSearchParams {
    return new URLSearchParams({
      latitude: String(lat),
      longitude: String(lon),
      ...WEATHER_CONFIG.FORECAST_PARAMS,
    });
  }
}
