export interface IGeoLocation {
  name: string;
  country: string | null;
  latitude: number;
  longitude: number;
}

export interface IWeatherCurrent {
  temperature: number;
  humidity: number;
  pressure: number;
  cloudCover: number;
  uvIndex: number;
  weatherCode: number;
  location: IGeoLocation;
}

export interface IWeatherHourly {
  time: string[];
  temperature: number[];
  precipitation: number[];
  humidity: number[];
  pressure: number[];
  cloudCover: number[];
  uvIndex: number[];
  weatherCode: number[];
  snowfall: number[];
  windSpeed: number[];
}

export interface IWeatherDaily {
  date: string;
  tempMax: number;
  tempMin: number;
  weatherCode: number;
  precipitationSum: number;
  uvIndexMax: number;
  sunrise: string;
  sunset: string;
}

export interface IWeatherPayload {
  current: IWeatherCurrent;
  hourly: IWeatherHourly;
  daily: IWeatherDaily[];
}

export interface IWeatherResponse {
  location: IGeoLocation;
  payload: IWeatherPayload;
  stale: boolean;
  fetchedAt: string;
}

export interface IHourlyData {
  daily: IWeatherDaily;
  hourly: IWeatherHourly;
  locationName: string;
}

export type WeatherRequestParams = { location: string } | { lat: number; lon: number };
