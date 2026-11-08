import path from 'path';
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { WeatherSnapshot } from './entities/WeatherSnapshot.js';

export const AppDataSource = new DataSource({
  type: 'better-sqlite3',
  database: process.env.DATABASE_PATH ?? './data/weather.db',
  enableWAL: true,
  synchronize: false,
  logging: true,
  entities: [WeatherSnapshot],
  migrations: [path.join(import.meta.dirname, 'migrations', '*.{ts,js}')],
});
