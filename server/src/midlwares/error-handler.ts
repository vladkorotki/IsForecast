import { NextFunction, Request, Response } from "express";
import { logger } from "../utils/logger.js";

export function errorHandler(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  const status = Number(err.status) || 500;
  const message = err.message || "Internal server error";

  logger.error("request failed", { message, status });

  res.status(status).json({ error: message });
}
