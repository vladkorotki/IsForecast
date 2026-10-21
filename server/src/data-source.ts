import "reflect-metadata";
import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
  type: "better-sqlite3",
  // База будет создана автоматически в папке server/data/
  database: process.env.DATABASE_PATH ?? "./data/weather.db",

  // WAL режим нужен для того, чтобы чтение не блокировалось записью
  enableWAL: true,

  // synchronize: true автоматически создает таблицы по описанию сущностей.
  // Для тестового задания это ок, но на проде лучше использовать миграции.
  synchronize: false,

  logging: true,
  entities: ["src/entities/**/*.ts"], // Позже добавим сюда сущности
  migrations: ["src/migrations/**/*.ts"],
});
