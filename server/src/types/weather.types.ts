import { IGeoLocation, IWeatherPayload } from "./weather-api.types.js";

export interface IWeatherResult {
  location: IGeoLocation;
  payload: IWeatherPayload;
  stale: boolean;
  fetchedAt: string;
}
