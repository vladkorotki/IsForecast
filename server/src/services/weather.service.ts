import { firstValueFrom } from "rxjs";
import { WeatherSnapshot } from "../entities/WeatherSnapshot.js";
import { WeatherRepository } from "../repositorises/weather.repository.js";
import { IGeoLocation } from "../types/weather-api.types.js";
import { IWeatherResult } from "../types/weather.types.js";
import { logger } from "../utils/logger.js";
import { WeatherApiService } from "./weather-api.service.js";
const TTL_MS = 30 * 60 * 1000;

export class WeatherService {
  constructor(
    private readonly weatherApiService: WeatherApiService,
    private readonly weatherRepository: WeatherRepository,
  ) {}

  public async getWeather(locationQuery: string): Promise<IWeatherResult> {
    const geolocation = await firstValueFrom(
      this.weatherApiService.geocode(locationQuery),
    );

    if (!geolocation) {
      const err: any = new Error("Location not found");
      err.status = 404;
      throw err;
    }

    const locationKey = this.makeLocationKey(geolocation);
    const cachedForecast =
      await this.weatherRepository.findLatestForecastByLocation(locationKey);

    if (cachedForecast && this.isFreshForecast(cachedForecast)) {
      logger.info("weather forecast hit", { locationKey });
      return {
        location: geolocation,
        payload: JSON.parse(cachedForecast.payload),
        stale: false,
        fetchedAt: cachedForecast.fetchedAt.toISOString(),
      };
    }
    try {
      const payload = await firstValueFrom(
        this.weatherApiService.fetchWeather(
          geolocation.latitude,
          geolocation.longitude,
        ),
      );

      const snapshot = await this.weatherRepository.saveSnapshot({
        locationKey,
        locationName: geolocation.name,
        country: geolocation.country,
        latitude: geolocation.latitude,
        longitude: geolocation.longitude,
        payload: JSON.stringify(payload),
      });
      logger.info("weather cache miss, fetched from API", { locationKey });

      return {
        location: geolocation,
        payload,
        stale: false,
        fetchedAt: snapshot.fetchedAt.toISOString(),
      };
    } catch (apiError) {
      logger.error("weather API failed", {
        locationKey,
        error: String(apiError),
      });
      if (cachedForecast) {
        logger.warn("serving stale cache", { locationKey });
        return {
          location: geolocation,
          payload: JSON.parse(cachedForecast.payload),
          stale: true,
          fetchedAt: cachedForecast.fetchedAt.toISOString(),
        };
      }

      const err: any = new Error("Weather service temporarily unavailable");
      err.status = 503;
      throw err;
    }
  }

  private makeLocationKey(location: IGeoLocation): string {
    return `${location.name.toLowerCase()}|${(location.country ?? "").toLowerCase()}`;
  }

  private isFreshForecast(snapshot: WeatherSnapshot): boolean {
    return Date.now() - new Date(snapshot.fetchedAt).getTime() < TTL_MS;
  }
}
