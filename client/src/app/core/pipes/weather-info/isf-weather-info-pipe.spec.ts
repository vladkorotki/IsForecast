import { beforeEach, describe, expect, it } from 'vitest';
import { IsfWeatherInfoPipe } from './isf-weather-info-pipe';

describe('IsfWeatherInfoPipe', () => {
  let pipe: IsfWeatherInfoPipe;

  beforeEach(() => {
    pipe = new IsfWeatherInfoPipe();
  });

  it('should return Clear sky for code 0', () => {
    const result = pipe.transform(0);
    expect(result.icon).toBe('☀️');
    expect(result.label).toBe('Clear sky');
  });

  it('should return Overcast for code 3', () => {
    const result = pipe.transform(3);
    expect(result.icon).toBe('☁️');
    expect(result.label).toBe('Overcast');
  });

  it('should return Unknown weather for unknown code', () => {
    const result = pipe.transform(999);
    expect(result.icon).toBe('❓');
    expect(result.label).toBe('Unknown weather');
  });
});
