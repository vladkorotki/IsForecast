import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import "reflect-metadata";
import { AppDataSource } from "./data-source.js";

const PORT = Number(process.env.PORT ?? 3000);

async function bootstrap() {
  try {
    dotenv.config();
    // Инициализация базы данных
    await AppDataSource.initialize();
    await AppDataSource.runMigrations(); 
    console.info("database connected and migrations applied");
    console.log("Database connected successfully");

    const app = express();
    app.use(cors());
    app.use(express.json());

    app.get("/health", (_req, res) => {
      res.json({ status: "ok", timestamp: new Date().toISOString() });
    });

    app.listen(PORT, () => {
      console.log(` Server listening on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

bootstrap();
