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
      const location = String(req.query.location ?? "").trim();
      if (!location || location.length > 100) {
        logger.warn("Invalid location query param", { location });
        res.status(400).json({ error: 'Invalid "location" query param' });
        return;
      }
      const result = await this.weatherService.getWeather(location);
      res.json(result);
    } catch (err) {
      next(err);
    }
  };
}
