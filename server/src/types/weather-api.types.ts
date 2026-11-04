export interface IOpenMeteoGeocodingResponse {
  results?: Array<{
    name: string;
    country?: string;
    latitude: number;
    longitude: number;
  }>;
}

export interface IOpenMeteoForecastResponse {
  current: {
    temperature_2m: number;
    relative_humidity_2m: number;
    pressure_msl: number;
    cloud_cover: number;
    uv_index: number;
    weather_code: number;
  };
  hourly: {
    time: string[];
    temperature_2m: number[];
    precipitation: number[];
    relative_humidity_2m: number[];
    pressure_msl: number[];
    cloud_cover: number[];
    uv_index: number[];
    weather_code: number[];
    snowfall: number[];
    wind_speed_10m: number[];
  };
  daily: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    weather_code: number[];
    precipitation_sum: number[];
    uv_index_max: number[];
    sunrise: string[];
    sunset: string[];
  };
}

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
