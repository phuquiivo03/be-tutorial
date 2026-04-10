import { NextFunction, Request, Response } from "express";
import { v4 as uuid } from "uuid";

export function requestLogger(req: Request, res: Response, next: NextFunction) {
  const start = Date.now();
  res.on("finish", () => {
    const durationMs = Date.now() - start;
    console.log({
      requestId: req.headers["x-request-id"],
      timestamp: new Date().toISOString(),
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      durationMs,
      ip: req.ip,
    });
  });

  next();
}

export function requestIdMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const requestId = uuid();
  req.headers["x-request-id"] = requestId;
  next();
}
