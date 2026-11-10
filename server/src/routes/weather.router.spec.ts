import { describe, expect, it, vi } from 'vitest';
import { weatherRouter } from './weather.router.js';

vi.mock('../controllers/weather.controller.js', () => {
  return {
    WeatherController: class {
      getWeather = vi.fn();
    },
  };
});

describe('Weather Router', () => {
  it('should be defined', () => {
    expect(weatherRouter).toBeDefined();
  });

  it('should have a GET /weather route', () => {
    const stack = weatherRouter.stack as unknown as Array<{
      route?: {
        path: string;
        methods: Record<string, boolean>;
      };
    }>;

    const routes = stack
      .filter((layer) => layer.route)
      .map((layer) => ({
        path: layer.route!.path,
        method: Object.keys(layer.route!.methods)[0],
      }));

    expect(routes).toContainEqual({ path: '/weather', method: 'get' });
  });
});
