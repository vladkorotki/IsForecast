import { Router } from "express";
import { WeatherController } from "../controllers/weather.controller.js";
import { WeatherRepository } from "../repositorises/weather.repository.js";
import { HttpClientService } from "../services/http-client.service.js";
import { WeatherApiService } from "../services/weather-api.service.js";
import { WeatherService } from "../services/weather.service.js";

const httpClientService = new HttpClientService();
const weathrApiService = new WeatherApiService(httpClientService);
const weatherRepository = new WeatherRepository();
const weatherService = new WeatherService(weathrApiService, weatherRepository);
const weatherController = new WeatherController(weatherService);

export const weatherRouter = Router();

weatherRouter.get("/weather", weatherController.getWeather);
