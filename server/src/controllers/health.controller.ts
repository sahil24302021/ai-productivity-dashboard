import { Request, Response } from "express";
import { env } from "../config/env";

export default function healthCheck(_req: Request, res: Response) {
  res.json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: Date.now(),
  environment: env.NODE_ENV,
  });
}
