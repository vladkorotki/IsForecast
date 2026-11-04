export interface IFilteredHourlyData {
  temperature: number[];
  humidity: number[];
  pressure: number[];
  precipitation: number[];
  uvIndex: number[];
  windSpeed: number[];
}

export interface IDailyStats {
  maxHumidity: number;
  avgPressure: number;
  maxUv: string;
  uvText: string;
  rainHours: number;
  maxWind: number;
  sunrise: string;
  sunset: string;
}
