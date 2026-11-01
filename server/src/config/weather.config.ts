export const WEATHER_CONFIG = {
  GEOCODING_URL: "https://geocoding-api.open-meteo.com/v1/search",
  FORECAST_URL: "https://api.open-meteo.com/v1/forecast",
  FORECAST_PARAMS: {
    current:
      "temperature_2m,relative_humidity_2m,pressure_msl,cloud_cover,uv_index,weather_code",
    hourly:
      "temperature_2m,precipitation,relative_humidity_2m,pressure_msl,cloud_cover,uv_index,weather_code,snowfall",
    daily:
      "temperature_2m_max,temperature_2m_min,weather_code,precipitation_sum,uv_index_max",
    timezone: "auto",
    forecast_days: "7",
  },
} as const;
