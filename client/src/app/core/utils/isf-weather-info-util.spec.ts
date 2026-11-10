import { describe, expect, it } from 'vitest';
import { getWeatherInfo } from './isf-weather-info-util';

describe('getWeatherInfo', () => {
  it('should return correct info for known codes', () => {
    expect(getWeatherInfo(0)).toEqual({ icon: '☀️', label: 'Clear sky' });
    expect(getWeatherInfo(3)).toEqual({ icon: '☁️', label: 'Overcast' });
    expect(getWeatherInfo(61)).toEqual({ icon: '🌧️', label: 'Slight rain' });
    expect(getWeatherInfo(95)).toEqual({ icon: '⛈️', label: 'Thunderstorm' });
  });

  it('should return fallback info for unknown codes', () => {
    expect(getWeatherInfo(-1)).toEqual({ icon: '❓', label: 'Unknown weather' });
    expect(getWeatherInfo(999)).toEqual({ icon: '❓', label: 'Unknown weather' });
    expect(getWeatherInfo(42)).toEqual({ icon: '❓', label: 'Unknown weather' });
  });
});
