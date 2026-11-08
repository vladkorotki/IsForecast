import { IDailyStats, IFilteredHourlyData } from '../types/weather-stats.types';
import {
  IGeoLocation,
  IWeatherCurrent,
  IWeatherDaily,
  IWeatherHourly,
} from '../types/weather.types';

export function getDisplayWeather(
  activeDay: IWeatherDaily | null,
  currentDay: IWeatherDaily | undefined,
  current: IWeatherCurrent,
  hourly: IWeatherHourly,
  location: IGeoLocation,
): IWeatherCurrent | null {
  if (!activeDay) return null;

  const indices = hourly.time
    .map((time, i) => (time.startsWith(activeDay.date) ? i : -1))
    .filter((i) => i !== -1);

  if (indices.length === 0) return null;

  const now = new Date();
  const currentHour = now.getHours().toString().padStart(2, '0');
  const targetTimeStr = `T${currentHour}:00`;

  const localIndex = indices.findIndex((i) => hourly.time[i].includes(targetTimeStr));
  const targetIndex = localIndex !== -1 ? indices[localIndex] : indices[indices.length - 1];

  const isToday = currentDay && activeDay.date === currentDay.date;
  const weatherCode = isToday ? current.weatherCode : activeDay.weatherCode;

  return {
    temperature: hourly.temperature[targetIndex],
    humidity: hourly.humidity[targetIndex],
    pressure: hourly.pressure[targetIndex],
    cloudCover: hourly.cloudCover[targetIndex],
    uvIndex: hourly.uvIndex[targetIndex],
    weatherCode: weatherCode,
    location
  };
}

export function filterHourlyForDay(
  daily: IWeatherDaily,
  hourly: IWeatherHourly,
): IFilteredHourlyData {
  const dayIndices = hourly.time
    .map((time, i) => (time.startsWith(daily.date) ? i : -1))
    .filter((i) => i !== -1);

  return {
    temperature: dayIndices.map((i) => hourly.temperature[i]),
    humidity: dayIndices.map((i) => hourly.humidity[i]),
    pressure: dayIndices.map((i) => hourly.pressure[i]),
    precipitation: dayIndices.map((i) => hourly.precipitation[i]),
    uvIndex: dayIndices.map((i) => hourly.uvIndex[i]),
    windSpeed: dayIndices.map((i) => hourly.windSpeed[i]),
  };
}

export function calculateDailyStats(
  data: IFilteredHourlyData,
  daily: IWeatherDaily,
): IDailyStats | null {
  if (data.temperature.length === 0) {
    return null;
  }

  const maxUv = Math.max(...data.uvIndex);
  const avgPressure = Math.round(data.pressure.reduce((a, b) => a + b, 0) / data.pressure.length);
  const rainHours = data.precipitation.filter((p) => p > 0).length;
  const maxWind = Math.max(...data.windSpeed);

  return {
    maxHumidity: Math.max(...data.humidity),
    avgPressure,
    maxUv: maxUv.toFixed(1),
    uvText: getUvDescription(maxUv),
    rainHours,
    maxWind: Math.round(maxWind),
    sunrise: daily.sunrise,
    sunset: daily.sunset,
  };
}

export function getUvDescription(uv: number): string {
  if (uv < 3) return 'Low';
  if (uv < 6) return 'Moderate';
  if (uv < 8) return 'High';
  return 'Very High';
}
