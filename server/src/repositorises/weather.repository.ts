import { AppDataSource } from "../data-source.js";
import { WeatherSnapshot } from "../entities/WeatherSnapshot.js";

export class WeatherRepository {
  public async findLatestForecastByLocation(
    locationKey: string,
  ): Promise<WeatherSnapshot | null> {
    return AppDataSource.getRepository(WeatherSnapshot)
      .createQueryBuilder("s")
      .where("s.locationKey = :locationKey", { locationKey })
      .orderBy("s.fetchedAt", "DESC")
      .getOne();
  }

  public async saveSnapshot(
    data: Partial<WeatherSnapshot>,
  ): Promise<WeatherSnapshot> {
    const repo = AppDataSource.getRepository(WeatherSnapshot);
    const snapshot = repo.create(data);
    return repo.save(snapshot);
  }
}
