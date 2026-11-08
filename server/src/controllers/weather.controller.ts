import { NextFunction, Request, Response } from "express";
import { WeatherService } from "../services/weather.service.js";
import { logger } from "../utils/logger.js";

export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  public getWeather = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const lat = Number(req.query.lat);
      const lon = Number(req.query.lon);
      const location = String(req.query.location ?? "").trim();

      // Режим 1: Поиск по координатам
      if (!isNaN(lat) && !isNaN(lon) && req.query.lat && req.query.lon) {
        const result = await this.weatherService.getWeatherByCoords(lat, lon);
        res.json(result);
        return;
      }

      // Режим 2: Поиск по строке
      if (!location || location.length > 100) {
        logger.warn("Invalid location query param", { location });
        res
          .status(400)
          .json({ error: 'Invalid "location" or "lat/lon" query params' });
        return;
      }

      const result = await this.weatherService.getWeather(location);
      res.json(result);
    } catch (err) {
      next(err);
    }
  };
}
